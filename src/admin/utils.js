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
