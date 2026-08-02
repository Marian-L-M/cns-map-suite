import {
	RangeControl,
	SelectControl,
	TextControl,
	TextareaControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ColorField from '../shared/ColorField';
import PostSearch from '../shared/PostSearch';
import type { HierarchyFormData, HierarchyRegion, ShapeType } from '../../../types';

const SHAPES: { value: ShapeType; label: string }[] = [
	{ value: 'POLYGON',   label: 'Polygon (Nodes)' },
	{ value: 'RECTANGLE', label: 'Rectangle' },
	{ value: 'BEZIER',    label: 'Bezier Curve' },
	{ value: 'CIRCLE',    label: 'Circle / Oval' },
];

interface Props {
	formData: HierarchyFormData;
	onChange: ( data: HierarchyFormData ) => void;
	onShapeTypeChange: ( shapeType: ShapeType ) => void;
}

export default function HierarchyRegionForm( { formData, onChange, onShapeTypeChange }: Props ) {
	function set<K extends keyof HierarchyFormData>( key: K, val: HierarchyFormData[ K ] ) {
		onChange( { ...formData, [ key ]: val } );
	}

	function handleShapeChange( value: string ) {
		const st = value as ShapeType;
		set( 'shape_type', st );
		onShapeTypeChange?.( st );
	}

	return (
		<>
			<section className="cns-modal-section">
				<h3>{ __( 'Child Map', 'cns-map-suite' ) }</h3>
				<PostSearch
					label={ __( 'Child Map', 'cns-map-suite' ) }
					subtype="maps"
					selectedId={ formData.child_map_id }
					selectedLabel={ formData.child_map_label }
					onChange={ ( item ) => onChange( {
						...formData,
						child_map_id:    item ? item.id   : 0,
						child_map_label: item ? item.title : '',
					} ) }
				/>
				<SelectControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Shape', 'cns-map-suite' ) }
					value={ formData.shape_type }
					options={ SHAPES }
					onChange={ handleShapeChange }
				/>
			</section>

			<section className="cns-modal-section">
				<h3>{ __( 'Infobox Override', 'cns-map-suite' ) }</h3>
				<p className="description">
					{ __(
						"Leave blank to use the child map's title and excerpt.",
						'cns-map-suite'
					) }
				</p>
				<div className="cns-grid cns-grid__12">
					<div className="cns-grid__group cns-grid__span-full">
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Title', 'cns-map-suite' ) }
							value={ formData.title_override }
							placeholder={
								formData.child_map_label ||
								__( 'Child map title', 'cns-map-suite' )
							}
							onChange={ ( v ) => set( 'title_override', v ) }
						/>
					</div>
					<div className="cns-grid__group cns-grid__span-full">
						<TextareaControl
							__nextHasNoMarginBottom
							label={ __( 'Description', 'cns-map-suite' ) }
							rows={ 3 }
							value={ formData.description_override }
							placeholder={ __( 'Child map excerpt', 'cns-map-suite' ) }
							onChange={ ( v ) => set( 'description_override', v ) }
						/>
					</div>
				</div>
			</section>

			<section className="cns-modal-section">
				<h3>{ __( 'Region Style', 'cns-map-suite' ) }</h3>
				<div className="cns-grid cns-grid__12">
					<div className="cns-grid__group">
						<ColorField
							label={ __( 'Fill Color', 'cns-map-suite' ) }
							value={ formData.style_fill }
							onChange={ ( v ) => set( 'style_fill', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<ColorField
							label={ __( 'Stroke Color', 'cns-map-suite' ) }
							value={ formData.style_stroke }
							onChange={ ( v ) => set( 'style_stroke', v ) }
						/>
					</div>
					<div className="cns-grid__group cns-grid__span-full">
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Fill Opacity', 'cns-map-suite' ) }
							min={ 0 } max={ 1 } step={ 0.05 }
							value={ parseFloat( String( formData.style_fill_opacity ) ) }
							onChange={ ( v ) => set( 'style_fill_opacity', v ?? 0.25 ) }
						/>
					</div>
					<div className="cns-grid__group">
						<NumberControl
							__next40pxDefaultSize
							label={ __( 'Stroke Width (px)', 'cns-map-suite' ) }
							min={ 1 }
							max={ 10 }
							step={ 1 }
							value={ formData.style_stroke_width }
							onChange={ ( v ) =>
								set( 'style_stroke_width', parseInt( v ?? '', 10 ) || 2 )
							}
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
		child_map_id:         region?.child_map_id         || 0,
		child_map_label:      region?.child_map_title       || '',
		shape_type:           region?.shape_type            || 'POLYGON',
		title_override:       region?.title_override        || '',
		description_override: region?.description_override  || '',
		style_fill:           styles.fill                  || '#e8a020',
		style_fill_opacity:   styles.fillOpacity           ?? 0.25,
		style_stroke:         styles.stroke                || '#e8a020',
		style_stroke_width:   styles.strokeWidth           || 2,
	};
}
