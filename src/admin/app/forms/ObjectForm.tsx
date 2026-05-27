import { useRef } from '@wordpress/element';
import MediaPicker from '../shared/MediaPicker';
import PostSearch  from '../shared/PostSearch';
import IconPicker  from '../shared/IconPicker';
import type { ObjectFormData, ObjectSavePayload, ObjectType, LibraryIcon, MapObject, InfoboxSource } from '../../../types';

const TYPES: { value: ObjectType; label: string }[] = [
	{ value: 'LOCATION', label: 'Location' },
	{ value: 'HISTORY',  label: 'History' },
	{ value: 'NATURAL',  label: 'Natural' },
	{ value: 'EVENT',    label: 'Event' },
	{ value: 'OTHER',    label: 'Other' },
];

interface Props {
	formData: ObjectFormData;
	onChange: ( formData: ObjectFormData ) => void;
	icons: LibraryIcon[];
}

export default function ObjectForm( { formData, onChange, icons }: Props ) {
	const uid = useRef( Math.random().toString( 36 ).slice( 2 ) );
	const n   = uid.current;

	function set<K extends keyof ObjectFormData>( key: K, val: ObjectFormData[ K ] ) {
		onChange( { ...formData, [ key ]: val } );
	}

	const isSvgSource = formData.icon_source !== 'image';
	const isManualIb  = formData.infobox_source !== 'post';

	return (
		<>
			{ /* ── Icon ── */ }
			<section className="cns-modal-section">
				<h3>Icon</h3>
				<div className="cns-radio-toggle">
					<label>
						<input type="radio" name={ `obj-icon-src-${ n }` } value="svg" checked={ isSvgSource }
							onChange={ () => set( 'icon_source', 'svg' ) } />
						{ ' ' }From library
					</label>
					<label>
						<input type="radio" name={ `obj-icon-src-${ n }` } value="image" checked={ ! isSvgSource }
							onChange={ () => set( 'icon_source', 'image' ) } />
						{ ' ' }Custom image
					</label>
				</div>
				{ isSvgSource && (
					<>
						<IconPicker
							icons={ icons }
							selectedIconId={ formData.icon_image_id_svg }
							onSelect={ ( id ) => set( 'icon_image_id_svg', id ) }
						/>
						<p className="description">
							<a href={ window.cnsMapSuite.iconsUrl } target="_blank" rel="noreferrer">
								Manage icon library →
							</a>
						</p>
					</>
				) }
				{ ! isSvgSource && (
					<MediaPicker
						imageId={ formData.icon_image_id_custom }
						imageUrl={ formData.icon_image_url }
						title="Select Icon Image"
						onChange={ ( att ) => onChange( {
							...formData,
							icon_image_id_custom: att ? att.id : 0,
							icon_image_url:       att ? att.url : '',
						} ) }
					/>
				) }
			</section>

			{ /* ── Details ── */ }
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
						<select value={ formData.type } onChange={ ( e ) => set( 'type', e.target.value as ObjectType ) }>
							{ TYPES.map( ( t ) => <option key={ t.value } value={ t.value }>{ t.label }</option> ) }
						</select>
					</div>
					<div className="cns-form-row">
						<label>Object Time</label>
						<input type="number" className="small-text" value={ formData.object_time }
							onChange={ ( e ) => set( 'object_time', parseInt( e.target.value, 10 ) || 0 ) } />
					</div>
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
				</div>
			</section>

			{ /* ── Infobox ── */ }
			<section className="cns-modal-section">
				<h3>Infobox</h3>
				<div className="cns-radio-toggle">
					<label>
						<input type="radio" name={ `obj-infobox-src-${ n }` } value="manual" checked={ isManualIb }
							onChange={ () => set( 'infobox_source', 'manual' ) } />
						{ ' ' }Manual
					</label>
					<label>
						<input type="radio" name={ `obj-infobox-src-${ n }` } value="post" checked={ ! isManualIb }
							onChange={ () => set( 'infobox_source', 'post' ) } />
						{ ' ' }From post
					</label>
				</div>
				{ isManualIb && (
					<div className="cns-form-grid">
						<div className="cns-form-row cns-form-row--full">
							<label>Infobox Title</label>
							<input type="text" className="large-text" value={ formData.infobox_title }
								onChange={ ( e ) => set( 'infobox_title', e.target.value ) } />
						</div>
						<div className="cns-form-row cns-form-row--full">
							<label>Description</label>
							<textarea rows={ 4 } className="large-text" value={ formData.infobox_description }
								onChange={ ( e ) => set( 'infobox_description', e.target.value ) } />
						</div>
						<div className="cns-form-row cns-form-row--full">
							<label>Infobox Image</label>
							<MediaPicker
								imageId={ formData.infobox_image_id }
								imageUrl={ formData.infobox_image_url }
								title="Select Infobox Image"
								onChange={ ( att ) => onChange( {
									...formData,
									infobox_image_id:  att ? att.id : 0,
									infobox_image_url: att ? att.url : '',
								} ) }
							/>
						</div>
					</div>
				) }
				{ ! isManualIb && (
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

			{ /* ── Design ── */ }
			<section className="cns-modal-section">
				<h3>Design</h3>
				<div className="cns-form-grid">
					<div className="cns-form-row cns-form-row--full">
						<label>Icon Size (px)</label>
						<div className="cns-range-wrap">
							<input type="range" min="8" max="128" step="1" value={ formData.style_size }
								onChange={ ( e ) => set( 'style_size', parseInt( e.target.value, 10 ) ) } />
							<output className="cns-range-value">{ formData.style_size }</output>
						</div>
					</div>
					<div className="cns-form-row">
						<label>Fill Color</label>
						<input type="color" value={ formData.style_fill }
							onChange={ ( e ) => set( 'style_fill', e.target.value ) } />
					</div>
					<div className="cns-form-row">
						<label>Stroke Color</label>
						<input type="color" value={ formData.style_stroke }
							onChange={ ( e ) => set( 'style_stroke', e.target.value ) } />
					</div>
				</div>
				<p className="description">Fill and stroke are applied to SVG icons only.</p>
			</section>
		</>
	);
}

export function defaultObjectFormData(
	obj: MapObject | null,
	x: number | null,
	y: number | null,
): ObjectFormData {
	const isSvg = ! obj || ! obj.icon_image_id || obj.icon_mime === 'image/svg+xml';
	return {
		icon_source:          isSvg ? 'svg' : 'image',
		icon_image_id_svg:    ( isSvg && obj?.icon_image_id ) ? obj.icon_image_id : null,
		icon_image_id_custom: ( ! isSvg && obj?.icon_image_id ) ? obj.icon_image_id : 0,
		icon_image_url:       ( obj?.icon_url && ! isSvg ) ? obj.icon_url : '',
		title:                obj?.title       || '',
		type:                 obj?.type        || 'LOCATION',
		object_time:          obj?.object_time ?? 0,
		x:                    obj ? obj.x : ( x ?? 0 ),
		y:                    obj ? obj.y : ( y ?? 0 ),
		infobox_source:       ( obj?.infobox_source as InfoboxSource | undefined ) || 'manual',
		infobox_title:        obj?.infobox_data?.title       || '',
		infobox_description:  obj?.infobox_data?.description || '',
		infobox_image_id:     obj?.infobox_data?.image_id    || 0,
		infobox_image_url:    '',
		linked_post_id:       obj?.linked_post_id || 0,
		linked_post_label:    obj?.linked_post_id ? `Post ID: ${ obj.linked_post_id }` : '',
		style_size:           obj?.canvas_styles?.size        || 32,
		style_fill:           obj?.canvas_styles?.fillStyle   || '#ffffff',
		style_stroke:         obj?.canvas_styles?.strokeStyle || '#2271b1',
	};
}

export function collectObjectPayload( formData: ObjectFormData ): ObjectSavePayload {
	const iconImageId = formData.icon_source === 'svg'
		? ( formData.icon_image_id_svg || 0 )
		: ( formData.icon_image_id_custom || 0 );
	return {
		icon_image_id:       iconImageId,
		title:               formData.title               || '',
		type:                formData.type                || 'LOCATION',
		x:                   formData.x                  || 0,
		y:                   formData.y                  || 0,
		object_time:         formData.object_time        || 0,
		infobox_source:      formData.infobox_source     || 'manual',
		linked_post_id:      formData.linked_post_id     || 0,
		infobox_title:       formData.infobox_title      || '',
		infobox_description: formData.infobox_description || '',
		infobox_image_id:    formData.infobox_image_id   || 0,
		style_size:          formData.style_size         || 32,
		style_fill:          formData.style_fill         || '#ffffff',
		style_stroke:        formData.style_stroke       || '#2271b1',
	};
}
