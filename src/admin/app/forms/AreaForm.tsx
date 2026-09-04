import {
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ColorField from '../shared/ColorField';
import { LABEL_FONTS } from '../shared/labelFonts';
import InfoboxSection, { infoboxFormDefaults } from './shared/InfoboxSection';
import type { AreaFormData, AreaType, ShapeType, MapArea } from '../../../types';

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
	function set<K extends keyof AreaFormData>( key: K, val: AreaFormData[ K ] ) {
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
				<h3>{ __( 'Details', 'cns-map-suite' ) }</h3>
				<div className="cns-grid cns-grid__12">
					<div className="cns-grid__group cns-grid__span-full">
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Title', 'cns-map-suite' ) }
							value={ formData.title }
							onChange={ ( v ) => set( 'title', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Type', 'cns-map-suite' ) }
							value={ formData.type }
							options={ TYPES }
							onChange={ ( v ) => set( 'type', v as AreaType ) }
						/>
					</div>
					<div className="cns-grid__group">
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Shape', 'cns-map-suite' ) }
							value={ formData.shape_type }
							options={ SHAPES }
							onChange={ handleShapeChange }
						/>
					</div>
					<div className="cns-grid__group">
						<NumberControl
							__next40pxDefaultSize
							label={ __( 'Object Time', 'cns-map-suite' ) }
							value={ formData.object_time }
							step={ 1 }
							onChange={ ( v ) =>
								set( 'object_time', parseInt( v ?? '', 10 ) || 0 )
							}
						/>
					</div>
				</div>
			</section>

			<InfoboxSection formData={ formData } onChange={ onChange } />

			<section className="cns-modal-section">
				<h3>{ __( 'Design', 'cns-map-suite' ) }</h3>
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

				<h4>{ __( 'Label', 'cns-map-suite' ) }</h4>
				<p className="description">
					{ __(
						'The canvas label uses the Infobox title, falling back to the area’s own title.',
						'cns-map-suite'
					) }
				</p>
				<div className="cns-grid cns-grid__12">
					<div className="cns-grid__group cns-grid__span-full">
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Hide label on canvas', 'cns-map-suite' ) }
							checked={ formData.style_label_hidden }
							onChange={ ( v ) => set( 'style_label_hidden', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Font Family', 'cns-map-suite' ) }
							value={ formData.style_label_font_family }
							options={ LABEL_FONTS }
							onChange={ ( v ) => set( 'style_label_font_family', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<NumberControl
							__next40pxDefaultSize
							label={ __( 'Font Size (px)', 'cns-map-suite' ) }
							min={ 6 }
							max={ 96 }
							step={ 1 }
							value={ formData.style_label_font_size }
							onChange={ ( v ) =>
								set( 'style_label_font_size', parseInt( v ?? '', 10 ) || 12 )
							}
						/>
					</div>
					<div className="cns-grid__group">
						<ColorField
							label={ __( 'Font Color', 'cns-map-suite' ) }
							value={ formData.style_label_color }
							onChange={ ( v ) => set( 'style_label_color', v ) }
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
		...infoboxFormDefaults( area ?? null ),
		style_fill:              styles.fill            || '#2271b14d',
		style_stroke:            styles.stroke          || '#2271b1',
		style_stroke_width:      styles.strokeWidth     || 2,
		style_label_hidden:      styles.labelHidden     ?? false,
		style_label_font_family: styles.labelFontFamily || 'sans-serif',
		style_label_font_size:   styles.labelFontSize   || 12,
		style_label_color:       styles.labelColor      || '#ffffff',
	};
}
