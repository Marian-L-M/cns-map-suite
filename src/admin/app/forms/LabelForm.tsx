import { useRef } from '@wordpress/element';
import InfoboxSection, { infoboxFormDefaults } from './shared/InfoboxSection';
import type { LabelFormData, LabelSavePayload, LabelPlacement, MapLabel } from '../../../types';

interface Props {
	formData: LabelFormData;
	onChange: ( formData: LabelFormData ) => void;
}

export default function LabelForm( { formData, onChange }: Props ) {
	const uid = useRef( Math.random().toString( 36 ).slice( 2 ) );
	const n   = uid.current;

	function set<K extends keyof LabelFormData>( key: K, val: LabelFormData[ K ] ) {
		onChange( { ...formData, [ key ]: val } );
	}

	const isIndicator = formData.placement === 'indicator';

	return (
		<>
			{ /* ── Text ── */ }
			<section className="cns-modal-section">
				<h3>Label</h3>
				<div className="cns-form-grid">
					<div className="cns-form-row cns-form-row--full">
						<label>Text</label>
						<input type="text" className="large-text" value={ formData.text }
							onChange={ ( e ) => set( 'text', e.target.value ) } />
					</div>
					<div className="cns-form-row">
						<label>Label Time</label>
						<input type="number" className="small-text" value={ formData.object_time }
							onChange={ ( e ) => set( 'object_time', parseInt( e.target.value, 10 ) || 0 ) } />
					</div>
				</div>
			</section>

			{ /* ── Placement ── */ }
			<section className="cns-modal-section">
				<h3>Placement</h3>
				<div className="cns-radio-toggle">
					<label>
						<input type="radio" name={ `label-placement-${ n }` } value="centered"
							checked={ ! isIndicator }
							onChange={ () => set( 'placement', 'centered' as LabelPlacement ) } />
						{ ' ' }Centered on point
					</label>
					<label>
						<input type="radio" name={ `label-placement-${ n }` } value="indicator"
							checked={ isIndicator }
							onChange={ () => set( 'placement', 'indicator' as LabelPlacement ) } />
						{ ' ' }Indicator (line &amp; dot)
					</label>
				</div>
				<div className="cns-form-grid">
					<div className="cns-form-row">
						<label>X (px)</label>
						<input type="number" className="small-text" value={ formData.x }
							onChange={ ( e ) => set( 'x', parseInt( e.target.value, 10 ) || 0 ) } />
					</div>
					<div className="cns-form-row">
						<label>Y (px)</label>
						<input type="number" className="small-text" value={ formData.y }
							onChange={ ( e ) => set( 'y', parseInt( e.target.value, 10 ) || 0 ) } />
					</div>
					{ isIndicator && (
						<>
							<div className="cns-form-row">
								<label>Label Offset X (px)</label>
								<input type="number" className="small-text" value={ formData.offset_x }
									onChange={ ( e ) => set( 'offset_x', parseInt( e.target.value, 10 ) || 0 ) } />
							</div>
							<div className="cns-form-row">
								<label>Label Offset Y (px)</label>
								<input type="number" className="small-text" value={ formData.offset_y }
									onChange={ ( e ) => set( 'offset_y', parseInt( e.target.value, 10 ) || 0 ) } />
							</div>
						</>
					) }
				</div>
				{ isIndicator && (
					<p className="description">The dot marks the X/Y point; the label box sits at the offset, connected by a line.</p>
				) }
			</section>

			{ /* ── Infobox ── */ }
			<InfoboxSection formData={ formData } onChange={ onChange } />
			<p className="description">
				Labels with infobox content open the infobox drawer when clicked on the map;
				labels without stay purely decorative.
			</p>

			{ /* ── Design ── */ }
			<section className="cns-modal-section">
				<h3>Design</h3>
				<div className="cns-form-grid">
					<div className="cns-form-row cns-form-row--full">
						<label>Font Size (px)</label>
						<div className="cns-range-wrap">
							<input type="range" min="8" max="64" step="1" value={ formData.style_font_size }
								onChange={ ( e ) => set( 'style_font_size', parseInt( e.target.value, 10 ) ) } />
							<output className="cns-range-value">{ formData.style_font_size }</output>
						</div>
					</div>
					<div className="cns-form-row">
						<label>Background Color</label>
						<input type="color" value={ formData.style_bg }
							onChange={ ( e ) => set( 'style_bg', e.target.value ) } />
					</div>
					<div className="cns-form-row">
						<label>Border Color</label>
						<input type="color" value={ formData.style_border }
							onChange={ ( e ) => set( 'style_border', e.target.value ) } />
					</div>
					<div className="cns-form-row">
						<label>Text Color</label>
						<input type="color" value={ formData.style_text_color }
							onChange={ ( e ) => set( 'style_text_color', e.target.value ) } />
					</div>
				</div>
			</section>
		</>
	);
}

export function defaultLabelFormData(
	label: MapLabel | null,
	x: number | null,
	y: number | null,
): LabelFormData {
	return {
		text:                label?.text      || '',
		placement:           label?.placement || 'centered',
		x:                   label ? label.x : ( x ?? 0 ),
		y:                   label ? label.y : ( y ?? 0 ),
		offset_x:            label?.offset_x ?? 40,
		offset_y:            label?.offset_y ?? -40,
		object_time:         label?.object_time ?? 0,
		...infoboxFormDefaults( label ),
		style_bg:            label?.canvas_styles?.bgColor     || '#ffffff',
		style_border:        label?.canvas_styles?.borderColor || '#1e1e1e',
		style_text_color:    label?.canvas_styles?.textColor   || '#1e1e1e',
		style_font_size:     label?.canvas_styles?.fontSize    || 14,
	};
}

export function collectLabelPayload( formData: LabelFormData ): LabelSavePayload {
	const { infobox_image_url, linked_post_label, ...payload } = formData;
	return payload;
}
