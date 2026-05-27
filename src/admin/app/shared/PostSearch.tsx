import { useState, useRef, useEffect } from '@wordpress/element';
import type { PostSearchResult } from '../../../types';

interface Props {
	linkedPostId: number;
	linkedPostLabel: string;
	onChange: ( item: { id: number; title: string } | null ) => void;
}

export default function PostSearch( { linkedPostId, linkedPostLabel, onChange }: Props ) {
	const [ query,   setQuery   ] = useState( '' );
	const [ results, setResults ] = useState<PostSearchResult[]>( [] );
	const [ open,    setOpen    ] = useState( false );
	const timer = useRef<ReturnType<typeof setTimeout> | null>( null );

	useEffect( () => () => { if ( timer.current ) clearTimeout( timer.current ); }, [] );

	function handleInput( e: React.ChangeEvent<HTMLInputElement> ) {
		const val = e.target.value;
		setQuery( val );
		if ( timer.current ) clearTimeout( timer.current );
		if ( val.length < 2 ) { setOpen( false ); return; }
		timer.current = setTimeout( async () => {
			try {
				const url = window.cnsMapSuite.wpRestUrl + '/search?search=' +
					encodeURIComponent( val ) + '&type=post&subtype=any&per_page=10';
				const res  = await fetch( url, { headers: { 'X-WP-Nonce': window.cnsMapSuite.nonce } } );
				const data = await res.json() as PostSearchResult[];
				if ( Array.isArray( data ) ) { setResults( data ); setOpen( true ); }
			} catch { /* silent */ }
		}, 350 );
	}

	function selectResult( item: PostSearchResult ) {
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
