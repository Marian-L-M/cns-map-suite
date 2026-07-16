import {
	RadioControl,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import MediaPicker from '../../shared/MediaPicker';
import PostSearch from '../../shared/PostSearch';
import type {
	InfoboxFormFields,
	InfoboxSource,
	InfoboxData,
} from '../../../../types';

/**
 * The Infobox form section shared by the object, area, and label forms.
 * One model everywhere: an optional connected post (adds a "Read more" link
 * to the frontend drawer regardless of source) and a radio that only picks
 * where the content comes from — written manually or pulled from that post.
 */
interface Props< T extends InfoboxFormFields > {
	formData: T;
	onChange: ( formData: T ) => void;
}

export default function InfoboxSection< T extends InfoboxFormFields >( {
	formData,
	onChange,
}: Props< T > ) {
	const isManualIb = formData.infobox_source !== 'post';

	function set< K extends keyof InfoboxFormFields >(
		key: K,
		val: InfoboxFormFields[ K ]
	) {
		onChange( { ...formData, [ key ]: val } );
	}

	return (
		<section className="cns-modal-section">
			<h3>{ __( 'Infobox', 'cns-map-suite' ) }</h3>
			<div className="cns-grid cns-grid__12">
				<div className="cns-grid__group cns-grid__span-full">
					<PostSearch
						selectedId={ formData.linked_post_id }
						selectedLabel={ formData.linked_post_label }
						help={ __(
							'Optional — a connected post adds a “Read more” link to the infobox.',
							'cns-map-suite'
						) }
						onChange={ ( item ) =>
							onChange( {
								...formData,
								linked_post_id: item ? item.id : 0,
								linked_post_label: item ? item.title : '',
							} )
						}
					/>
				</div>
				<div className="cns-grid__group cns-grid__span-full">
					<RadioControl
						label={ __( 'Content source', 'cns-map-suite' ) }
						selected={ isManualIb ? 'manual' : 'post' }
						options={ [
							{
								label: __(
									'Write content manually',
									'cns-map-suite'
								),
								value: 'manual',
							},
							{
								label: __(
									'Use the connected post’s content',
									'cns-map-suite'
								),
								value: 'post',
							},
						] }
						onChange={ ( value ) =>
							set( 'infobox_source', value as InfoboxSource )
						}
					/>
				</div>
				{ isManualIb ? (
					<>
						<div className="cns-grid__group cns-grid__span-full">
							<TextControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Infobox Title', 'cns-map-suite' ) }
								value={ formData.infobox_title }
								onChange={ ( v ) => set( 'infobox_title', v ) }
							/>
						</div>
						<div className="cns-grid__group cns-grid__span-full">
							<TextareaControl
								__nextHasNoMarginBottom
								label={ __( 'Description', 'cns-map-suite' ) }
								rows={ 4 }
								value={ formData.infobox_description }
								onChange={ ( v ) =>
									set( 'infobox_description', v )
								}
							/>
						</div>
						<div className="cns-grid__group cns-grid__span-full">
							<MediaPicker
								imageId={ formData.infobox_image_id }
								imageUrl={ formData.infobox_image_url }
								label={ __( 'Infobox Image', 'cns-map-suite' ) }
								title={ __(
									'Select Infobox Image',
									'cns-map-suite'
								) }
								onChange={ ( att ) =>
									onChange( {
										...formData,
										infobox_image_id: att ? att.id : 0,
										infobox_image_url: att ? att.url : '',
									} )
								}
							/>
						</div>
					</>
				) : (
					<p className="description">
						{ __(
							'Title, description and image are pulled from the connected post.',
							'cns-map-suite'
						) }
					</p>
				) }
			</div>
		</section>
	);
}

/** Default infobox form values for an existing item (or null for a new one). */
export function infoboxFormDefaults( item: {
	infobox_source?: InfoboxSource;
	infobox_data?: InfoboxData | null;
	linked_post_id?: number | null;
} | null ): InfoboxFormFields {
	return {
		infobox_source:      item?.infobox_source || 'manual',
		infobox_title:       item?.infobox_data?.title       || '',
		infobox_description: item?.infobox_data?.description || '',
		infobox_image_id:    item?.infobox_data?.image_id    || 0,
		infobox_image_url:   '',
		linked_post_id:      item?.linked_post_id || 0,
		linked_post_label:   item?.linked_post_id ? `Post ID: ${ item.linked_post_id }` : '',
	};
}
