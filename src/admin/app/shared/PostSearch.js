import { useState, useRef } from '@wordpress/element';

/**
 * Async post-search typeahead backed by the WP REST /search endpoint.
 *
 * Props:
 *   linkedPostId    {number}
 *   linkedPostLabel {string}   display label for the currently linked post
 *   onChange        {fn}       called with { id, title } or { id: 0, title: '' } on clear
 */
export default function PostSearch( { linkedPostId, linkedPostLabel, onChange } ) {
	const [ query, setQuery ]     = useState( '' );
	const [ results, setResults ] = useState( [] );
	const [ open, setOpen ]       = useState( false );
	const timer = useRef( null );

	function handleInput( e ) {
		const val = e.target.value;
		setQuery( val );
		clearTimeout( timer.current );
		if ( val.length < 2 ) { setOpen( false ); return; }
		timer.current = setTimeout( async () => {
			try {
				const url = window.cnsMapSuite.wpRestUrl + '/search?search=' +
					encodeURIComponent( val ) + '&type=post&subtype=any&per_page=10';
				const res  = await fetch( url, { headers: { 'X-WP-Nonce': window.cnsMapSuite.nonce } } );
				const data = await res.json();
				if ( Array.isArray( data ) ) { setResults( data ); setOpen( true ); }
			} catch { /* silent */ }
		}, 350 );
	}

	function selectResult( item ) {
		onChange?.( { id: item.id, title: item.title } );
		setQuery( '' );
		setResults( [] );
		setOpen( false );
	}

	return (
		<div className="cns-post-search-wrap">
			<label>Search for a post</label>
			<input
				type="text"
				className="large-text"
				placeholder="Type to search…"
				autoComplete="off"
				value={ query }
				onChange={ handleInput }
			/>
			{ open && results.length > 0 && (
				<div className="cns-post-results">
					{ results.map( ( item ) => (
						<button
							key={ item.id }
							type="button"
							className="cns-post-result"
							onClick={ () => selectResult( item ) }
						>
							{ item.title }{ ' ' }
							<span className="cns-post-result__type">{ item.subtype }</span>
						</button>
					) ) }
				</div>
			) }
			{ linkedPostId > 0 && (
				<p className="description">
					{ linkedPostLabel || `Post ID: ${ linkedPostId }` }
					{ ' ' }
					<button
						type="button"
						className="button button-small"
						onClick={ () => onChange?.( { id: 0, title: '' } ) }
					>Clear</button>
				</p>
			) }
		</div>
	);
}
