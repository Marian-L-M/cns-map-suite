import { useRef } from '@wordpress/element';
import PostSearch from '../shared/PostSearch';
import type { AreaFormData, AreaType, ShapeType, MapArea, InfoboxSource } from '../../../types';

const TYPES: { value: AreaType; label: string }[] = [
	{ value: 'GEOGRAPHY', label: 'Geography' },
	{ value: 'HISTORY',   label: 'History' },
	{ value: 'NATURAL',   label: 'Natural' },
	{ value: 'EVENT',     label: 'Event' },
	{ value: 'OTHER',     label: 'Other' },
];

const SHAPES: { value: ShapeType; label: string }[] = [
	{ value: 'POLYGON',   label: 'Polygon (Nodes)' },
	{ value: 'RECTANGLE', label: 'Rectangle' },
	{ value: 'BEZIER',    label: 'Bezier Curve' },
	{ value: 'CIRCLE',    label: 'Circle / Oval' },
];

interface Props {
	formData: AreaFormData;
	onChange: ( formData: AreaFormData ) => void;
	onShapeTypeChange: ( shapeType: ShapeType ) => void;
}

export default function AreaForm( { formData, onChange, onShapeTypeChange }: Props ) {
	const uid = useRef( Math.random().toString( 36 ).slice( 2 ) );
	const n   = uid.current;

	function set<K extends keyof AreaFormData>( key: K, val: AreaFormData[ K ] ) {
		onChange( { ...formData, [ key ]: val } );
	}

	function handleShapeChange( e: React.ChangeEvent<HTMLSelectElement> ) {
		const st = e.target.value as ShapeType;
		set( 'shape_type', st );
		onShapeTypeChange?.( st );
	}

	const isPost = formData.infobox_source === 'post';

	return (
		<>
			<section className="cns-modal-section">
				<h3>Details</h3>
				<div className="cns-form-grid">
					<div className="cns-form-row cns-form-row--full">
						<label>Title</label>
						<input type="text" className="large-text" value={ formData.title }
							onChange={ ( e ) => set( 'title', e.target.value ) } />
					</div>
					<div className="cns-form-row">
						<label>Type</label>
						<select value={ formData.type } onChange={ ( e ) => set( 'type', e.target.value as AreaType ) }>
							{ TYPES.map( ( t ) => <option key={ t.value } value={ t.value }>{ t.label }</option> ) }
						</select>
					</div>
					<div className="cns-form-row">
						<label>Shape</label>
						<select value={ formData.shape_type } onChange={ handleShapeChange }>
							{ SHAPES.map( ( s ) => <option key={ s.value } value={ s.value }>{ s.label }</option> ) }
						</select>
					</div>
					<div className="cns-form-row">
						<label>Object Time</label>
						<input type="number" className="small-text" value={ formData.object_time }
							onChange={ ( e ) => set( 'object_time', parseInt( e.target.value, 10 ) || 0 ) } />
					</div>
				</div>
			</section>

			<section className="cns-modal-section">
				<h3>Infobox</h3>
				<div className="cns-radio-toggle">
					<label>
						<input type="radio" name={ `area-ib-src-${ n }` } value="manual" checked={ ! isPost }
							onChange={ () => set( 'infobox_source', 'manual' ) } />
						{ ' ' }Manual
					</label>
					<label>
						<input type="radio" name={ `area-ib-src-${ n }` } value="post" checked={ isPost }
							onChange={ () => set( 'infobox_source', 'post' ) } />
						{ ' ' }From post
					</label>
				</div>
				{ ! isPost && (
					<div className="cns-form-grid">
						<div className="cns-form-row cns-form-row--full">
							<label>Infobox Title</label>
							<input type="text" className="large-text" value={ formData.infobox_title }
								onChange={ ( e ) => set( 'infobox_title', e.target.value ) } />
						</div>
						<div className="cns-form-row cns-form-row--full">
							<label>Description</label>
							<textarea rows={ 3 } className="large-text" value={ formData.infobox_description }
								onChange={ ( e ) => set( 'infobox_description', e.target.value ) } />
						</div>
					</div>
				) }
				{ isPost && (
					<PostSearch
						linkedPostId={ formData.linked_post_id }
						linkedPostLabel={ formData.linked_post_label }
						onChange={ ( item ) => onChange( {
							...formData,
							linked_post_id:    item ? item.id : 0,
							linked_post_label: item ? item.title : '',
						} ) }
					/>
				) }
			</section>

			<section className="cns-modal-section">
				<h3>Design</h3>
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
							<output className="cns-range-value">{ parseFloat( String( formData.style_fill_opacity ) ).toFixed( 2 ) }</output>
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

export function defaultAreaFormData( area?: MapArea ): AreaFormData {
	const styles = area?.canvas_styles || {};
	return {
		title:               area?.title               || '',
		type:                ( area?.type as AreaType | undefined ) || 'GEOGRAPHY',
		shape_type:          area?.shape_type          || 'POLYGON',
		object_time:         area?.object_time         ?? 0,
		infobox_source:      ( area?.infobox_source as InfoboxSource | undefined ) || 'manual',
		infobox_title:       area?.infobox_data?.title       || '',
		infobox_description: area?.infobox_data?.description || '',
		linked_post_id:      area?.linked_post_id      || 0,
		linked_post_label:   area?.linked_post_id ? `Post ID: ${ area.linked_post_id }` : '',
		style_fill:          styles.fill               || '#2271b1',
		style_fill_opacity:  styles.fillOpacity        ?? 0.3,
		style_stroke:        styles.stroke             || '#2271b1',
		style_stroke_width:  styles.strokeWidth        || 2,
	};
}
