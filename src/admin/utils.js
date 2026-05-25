/* global wp */

export function apiFetch( method, path, body ) {
	const opts = {
		method,
		headers: { 'X-WP-Nonce': window.cnsMapSuite.nonce },
	};
	if ( body ) {
		opts.headers[ 'Content-Type' ] = 'application/json';
		opts.body = JSON.stringify( body );
	}
	return fetch( window.cnsMapSuite.restUrl + path, opts );
}

export function esc( str ) {
	return String( str )
		.replace( /&/g, '&amp;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' )
		.replace( /"/g, '&quot;' );
}

// ── Image cache ───────────────────────────────────────────────────────────────

const imageCache = {};

export function loadImage( url ) {
	if ( ! url ) return Promise.resolve( null );
	if ( imageCache[ url ] ) return Promise.resolve( imageCache[ url ] );
	return new Promise( ( resolve ) => {
		const img = new Image();
		img.onload  = () => { imageCache[ url ] = img; resolve( img ); };
		img.onerror = () => { resolve( null ); };
		img.src = url;
	} );
}

export async function loadSvgWithColors( url, fill, stroke ) {
	const key = `${ url }|${ fill || '' }|${ stroke || '' }`;
	if ( imageCache[ key ] ) return imageCache[ key ];
	try {
		const resp = await fetch( url, { credentials: 'same-origin' } );
		const text = await resp.text();
		const doc  = new DOMParser().parseFromString( text, 'image/svg+xml' );
		const svg  = doc.documentElement;
		if ( fill )   svg.setAttribute( 'fill', fill );
		if ( stroke ) svg.setAttribute( 'stroke', stroke );
		const blob    = new Blob( [ new XMLSerializer().serializeToString( doc ) ], { type: 'image/svg+xml' } );
		const blobUrl = URL.createObjectURL( blob );
		return new Promise( ( resolve ) => {
			const img = new Image();
			img.onload  = () => { URL.revokeObjectURL( blobUrl ); imageCache[ key ] = img; resolve( img ); };
			img.onerror = () => { URL.revokeObjectURL( blobUrl ); resolve( null ); };
			img.src = blobUrl;
		} );
	} catch { return null; }
}

// ── Form UID counter (shared across form builders) ────────────────────────────

let _formUid = 0;
export function nextFormUid() { return ++_formUid; }

// ── Media picker ──────────────────────────────────────────────────────────────

export function setupMediaPicker( selectBtn, removeBtn, hiddenEl, previewEl, title, onChange ) {
	if ( ! selectBtn ) return;
	let frame;
	selectBtn.addEventListener( 'click', ( e ) => {
		e.preventDefault();
		if ( frame ) { frame.open(); return; }
		frame = wp.media( { title, button: { text: 'Use this image' }, multiple: false, library: { type: 'image' } } );
		frame.on( 'select', () => {
			const att = frame.state().get( 'selection' ).first().toJSON();
			if ( hiddenEl )  hiddenEl.value = att.id;
			if ( previewEl ) previewEl.innerHTML = `<img src="${ att.url }" alt="" />`;
			if ( removeBtn ) removeBtn.classList.remove( 'cns-hidden' );
			if ( onChange )  onChange( att );
		} );
		frame.open();
	} );
	if ( removeBtn ) {
		removeBtn.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			if ( hiddenEl )  hiddenEl.value = '0';
			if ( previewEl ) previewEl.innerHTML = '<span>No image selected</span>';
			removeBtn.classList.add( 'cns-hidden' );
			if ( onChange )  onChange( null );
		} );
	}
}

export function initFormMediaPicker( root, prefix ) {
	setupMediaPicker(
		root.querySelector( `[data-action="select-${ prefix }"]` ),
		root.querySelector( `[data-action="remove-${ prefix }"]` ),
		root.querySelector( `[data-field="${ prefix }-id"]` ),
		root.querySelector( `[data-field="${ prefix }-preview"]` ),
		'Select Image'
	);
}

export function initFormPostSearch( root ) {
	const searchEl  = root.querySelector( '[data-field="post-search"]' );
	const resultsEl = root.querySelector( '[data-field="post-results"]' );
	const linkedEl  = root.querySelector( '[data-field="linked-post-id"]' );
	const labelEl   = root.querySelector( '[data-field="linked-post-label"]' );
	if ( ! searchEl ) return;

	let timer;
	searchEl.addEventListener( 'input', () => {
		clearTimeout( timer );
		const query = searchEl.value.trim();
		if ( query.length < 2 ) { if ( resultsEl ) resultsEl.hidden = true; return; }
		timer = setTimeout( async () => {
			try {
				const url  = window.cnsMapSuite.wpRestUrl + '/search?search=' + encodeURIComponent( query ) + '&type=post&subtype=any&per_page=10';
				const res  = await fetch( url, { headers: { 'X-WP-Nonce': window.cnsMapSuite.nonce } } );
				const data = await res.json();
				if ( ! Array.isArray( data ) || ! resultsEl ) return;
				resultsEl.innerHTML = data.length
					? data.map( ( item ) =>
						`<button type="button" class="cns-post-result" data-id="${ item.id }" data-title="${ esc( item.title ) }">${ esc( item.title ) } <span class="cns-post-result__type">${ esc( item.subtype ) }</span></button>`
					).join( '' )
					: '<p class="cns-post-results__empty">No posts found.</p>';
				resultsEl.hidden = false;
			} catch { /* silent */ }
		}, 350 );
	} );

	if ( resultsEl ) {
		resultsEl.addEventListener( 'click', ( e ) => {
			const btn = e.target.closest( '.cns-post-result' );
			if ( ! btn ) return;
			if ( linkedEl ) linkedEl.value = btn.dataset.id;
			if ( labelEl )  { labelEl.textContent = btn.dataset.title; labelEl.classList.remove( 'cns-hidden' ); }
			searchEl.value   = '';
			resultsEl.hidden = true;
		} );
	}
}
