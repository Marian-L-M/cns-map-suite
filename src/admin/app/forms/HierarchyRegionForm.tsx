import { useState, useRef, useEffect } from '@wordpress/element';
import type { HierarchyFormData, HierarchyRegion, PostSearchResult } from '../../../types';

// ── Map search (filters to 'maps' CPT only) ───────────────────────────────────

interface MapSearchProps {
	childMapId: number;
	childMapLabel: string;
	onChange: ( item: { id: number; title: string } | null ) => void;
}

function MapSearch( { childMapId, childMapLabel, onChange }: MapSearchProps ) {
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
				const url = window.cnsMapSuite.wpRestUrl +
					'/search?search=' + encodeURIComponent( val ) +
					'&type=post&subtype=maps&per_page=10';
				const res  = await fetch( url, { headers: { 'X-WP-Nonce': window.cnsMapSuite.nonce } } );
				const data = await res.json() as PostSearchResult[];
				if ( Array.isArray( data ) ) { setResults( data ); setOpen( true ); }
			} catch { /* silent */ }
		}, 350 );
	}

	function selectResult( item: PostSearchResult ) {
		onChange( { id: item.id, title: item.title } );
		setQuery( '' );
		setResults( [] );
		setOpen( false );
	}

	return (
		<div className="cns-post-search-wrap">
			<label>Child Map</label>
			<input
				type="text"
				className="large-text"
				placeholder="Search maps…"
				autoComplete="off"
				value={ query }
				onChange={ handleInput }
			/>
			{ open && results.length > 0 && (
				<div className="cns-post-results">
					{ results.map( ( item ) => (
						<button key={ item.id } type="button" className="cns-post-result"
							onClick={ () => selectResult( item ) }>
							{ item.title }
						</button>
					) ) }
				</div>
			) }
			{ childMapId > 0 && (
				<p className="description">
					{ childMapLabel || `Map ID: ${ childMapId }` }
					{ ' ' }
					<button type="button" className="button button-small"
						onClick={ () => onChange( { id: 0, title: '' } ) }>Clear</button>
				</p>
			) }
		</div>
	);
}

// ── Form ──────────────────────────────────────────────────────────────────────

interface Props {
	formData: HierarchyFormData;
	onChange: ( data: HierarchyFormData ) => void;
}

export default function HierarchyRegionForm( { formData, onChange }: Props ) {
	function set<K extends keyof HierarchyFormData>( key: K, val: HierarchyFormData[ K ] ) {
		onChange( { ...formData, [ key ]: val } );
	}

	return (
		<>
			<section className="cns-modal-section">
				<h3>Child Map</h3>
				<MapSearch
					childMapId={ formData.child_map_id }
					childMapLabel={ formData.child_map_label }
					onChange={ ( item ) => onChange( {
						...formData,
						child_map_id:    item ? item.id   : 0,
						child_map_label: item ? item.title : '',
					} ) }
				/>
			</section>

			<section className="cns-modal-section">
				<h3>Region Style</h3>
				<div className="cns-form-grid">
					<div className="cns-form-row">
						<label>Fill Color</label>
						<input type="color" value={ formData.style_fill }
							onChange={ ( e ) => set( 'style_fill', e.target.value ) } />
					</div>
					<div className="cns-form-row">
						<label>Fill Opacity</label>
						<div className="cns-range-wrap">
							<input type="range" min="0" max="1" step="0.05"
								value={ formData.style_fill_opacity }
								onChange={ ( e ) => set( 'style_fill_opacity', parseFloat( e.target.value ) ) }
							/>
							<output className="cns-range-value">
								{ parseFloat( String( formData.style_fill_opacity ) ).toFixed( 2 ) }
							</output>
						</div>
					</div>
					<div className="cns-form-row">
						<label>Stroke Color</label>
						<input type="color" value={ formData.style_stroke }
							onChange={ ( e ) => set( 'style_stroke', e.target.value ) } />
					</div>
					<div className="cns-form-row">
						<label>Stroke Width (px)</label>
						<input type="number" className="small-text" min="1" max="10"
							value={ formData.style_stroke_width }
							onChange={ ( e ) => set( 'style_stroke_width', parseInt( e.target.value, 10 ) || 2 ) }
						/>
					</div>
				</div>
			</section>
		</>
	);
}

export function defaultHierarchyFormData( region?: HierarchyRegion ): HierarchyFormData {
	const styles = region?.canvas_styles || {};
	return {
		child_map_id:    region?.child_map_id    || 0,
		child_map_label: region?.child_map_title  || '',
		style_fill:          styles.fill          || '#e8a020',
		style_fill_opacity:  styles.fillOpacity   ?? 0.25,
		style_stroke:        styles.stroke        || '#e8a020',
		style_stroke_width:  styles.strokeWidth   || 2,
	};
}
