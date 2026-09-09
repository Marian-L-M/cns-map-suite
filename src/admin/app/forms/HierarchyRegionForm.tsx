import {
	SelectControl,
	TextControl,
	ToggleControl,
	TextareaControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ColorField from '../shared/ColorField';
import PostSearch from '../shared/PostSearch';
import { LABEL_FONTS } from '../shared/labelFonts';
import { SHAPE_TYPES, SHAPE_TYPE_DEFAULT } from '../../../choices';
import type { HierarchyFormData, HierarchyRegion, ShapeType } from '../../../types';

interface Props {
	formData: HierarchyFormData;
	onChange: ( data: HierarchyFormData ) => void;
	onShapeTypeChange: ( shapeType: ShapeType ) => void;
	/** Selected region — supplies the child map's thumbnail and excerpt, which
	 *  are read-only preview data and so live outside the form state. */
	region?: HierarchyRegion | null;
}

/**
 * Shown at true size (240px, the width the published card uses), because the
 * point is to judge the real thing — colors, crop and clamped excerpt — not a
 * scaled impression of it. Mirrors .cns-map-hierarchy-tip in
 * src/blocks/map/style.scss; keep the two in step.
 */
function HoverCardPreview( {
	formData,
	region,
}: {
	formData: HierarchyFormData;
	region?: HierarchyRegion | null;
} ) {
	// Same precedence the published card and the canvas label use.
	const title = formData.title_override || formData.child_map_label;
	const excerpt =
		formData.description_override || region?.child_map_excerpt || '';
	const thumb = region?.child_map_thumbnail || '';

	if ( ! title && ! excerpt && ! thumb ) {
		return (
			<p className="description">
				{ __(
					'Choose a child map to preview its hover card.',
					'cns-map-suite'
				) }
			</p>
		);
	}

	return (
		<div
			className="cns-hovercard-preview"
			style={
				{
					'--cns-tip-bg': formData.style_tip_bg,
					'--cns-tip-border': formData.style_tip_border,
					'--cns-tip-text': formData.style_tip_text,
				} as React.CSSProperties
			}
		>
			{ thumb && (
				<img
					className="cns-hovercard-preview__thumb"
					src={ thumb }
					alt=""
				/>
			) }
			{ title && (
				<strong className="cns-hovercard-preview__title">
					{ title }
				</strong>
			) }
			{ excerpt && (
				<p className="cns-hovercard-preview__excerpt">{ excerpt }</p>
			) }
		</div>
	);
}

export default function HierarchyRegionForm( { formData, onChange, onShapeTypeChange, region }: Props ) {
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
					options={ SHAPE_TYPES }
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
						'The region label uses the Infobox Override title, falling back to the child map’s own title.',
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

				<h4>{ __( 'Hover Card', 'cns-map-suite' ) }</h4>
				<p className="description">
					{ __(
						'Shown on the published map when a visitor hovers this region.',
						'cns-map-suite'
					) }
				</p>
				<div className="cns-grid cns-grid__12">
					<div className="cns-grid__group">
						<ColorField
							label={ __( 'Background Color', 'cns-map-suite' ) }
							value={ formData.style_tip_bg }
							onChange={ ( v ) => set( 'style_tip_bg', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<ColorField
							label={ __( 'Border Color', 'cns-map-suite' ) }
							value={ formData.style_tip_border }
							onChange={ ( v ) => set( 'style_tip_border', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<ColorField
							label={ __( 'Text Color', 'cns-map-suite' ) }
							value={ formData.style_tip_text }
							onChange={ ( v ) => set( 'style_tip_text', v ) }
						/>
					</div>
				</div>
				<HoverCardPreview formData={ formData } region={ region } />
			</section>
		</>
	);
}

export function defaultHierarchyFormData( region?: HierarchyRegion ): HierarchyFormData {
	const styles = region?.canvas_styles || {};
	return {
		child_map_id:         region?.child_map_id         || 0,
		child_map_label:      region?.child_map_title       || '',
		shape_type:           region?.shape_type            || SHAPE_TYPE_DEFAULT,
		title_override:       region?.title_override        || '',
		description_override: region?.description_override  || '',
		style_fill:              styles.fill            || '#e8a02040',
		style_stroke:            styles.stroke          || '#e8a020',
		style_stroke_width:      styles.strokeWidth     || 2,
		style_label_hidden:      styles.labelHidden     ?? false,
		style_label_font_family: styles.labelFontFamily || 'sans-serif',
		style_label_font_size:   styles.labelFontSize   || 12,
		style_label_color:       styles.labelColor      || '#ffffff',
		style_tip_bg:            styles.tipBgColor      || '#000000d1',
		style_tip_border:        styles.tipBorderColor  || '#ffffff26',
		style_tip_text:          styles.tipTextColor    || '#ffffff',
	};
}
