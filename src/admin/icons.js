/* global wp */
import { apiFetch, esc } from './utils.js';

export let iconLibraryCache = null;

export async function loadIconLibraryIntoCache() {
	try {
		const res  = await apiFetch( 'GET', '/icons' );
		const data = await res.json();
		if ( res.ok ) iconLibraryCache = data;
	} catch { iconLibraryCache = []; }
}

export function renderIconLibraryGrid() {
	const grid  = document.getElementById( 'cns-icon-library-grid' );
	if ( ! grid ) return;
	const icons = iconLibraryCache || [];

	if ( ! icons.length ) {
		grid.innerHTML = '<p class="cns-icon-library-grid__empty">No icons yet. Click "Add Icon" to upload an SVG.</p>';
		return;
	}

	grid.innerHTML = icons.map( ( icon ) =>
		`<div class="cns-icon-library-item">` +
		`<div class="cns-icon-library-item__preview"><img src="${ esc( icon.url ) }" alt="${ esc( icon.title ) }" /></div>` +
		`<span class="cns-icon-library-item__name">${ esc( icon.title ) }</span>` +
		`<button type="button" class="cns-icon-library-item__remove" data-id="${ icon.id }" aria-label="Remove">&times;</button>` +
		`</div>`
	).join( '' );

	grid.querySelectorAll( '.cns-icon-library-item__remove' ).forEach( ( btn ) => {
		btn.addEventListener( 'click', async () => {
			const id = parseInt( btn.dataset.id, 10 );
			if ( ! confirm( 'Remove this icon from the library? (The attachment itself is kept.)' ) ) return;
			try {
				const res = await apiFetch( 'DELETE', `/icons/${ id }` );
				if ( ! res.ok ) throw new Error( 'Remove failed.' );
				iconLibraryCache = ( iconLibraryCache || [] ).filter( ( i ) => i.id !== id );
				renderIconLibraryGrid();
			} catch ( err ) { alert( err.message ); }
		} );
	} );
}

export async function initIconLibraryPage() {
	const grid = document.getElementById( 'cns-icon-library-grid' );
	if ( ! grid ) return;

	await loadIconLibraryIntoCache();
	renderIconLibraryGrid();

	document.getElementById( 'cns-add-icon-btn' )?.addEventListener( 'click', () => {
		const frame = wp.media( {
			title:    'Select or Upload SVG Icon',
			button:   { text: 'Add to library' },
			multiple: false,
			library:  { type: 'image/svg+xml' },
		} );
		frame.on( 'select', async () => {
			const att = frame.state().get( 'selection' ).first().toJSON();
			try {
				const res  = await apiFetch( 'POST', '/icons', { attachment_id: att.id } );
				const data = await res.json();
				if ( ! res.ok ) throw new Error( data.message || 'Failed to add icon.' );
				if ( ! iconLibraryCache ) iconLibraryCache = [];
				iconLibraryCache.push( data );
				renderIconLibraryGrid();
			} catch ( err ) { alert( err.message ); }
		} );
		frame.open();
	} );
}
