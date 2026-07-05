import { useRef } from '@wordpress/element';
import MediaPicker from '../../shared/MediaPicker';
import PostSearch  from '../../shared/PostSearch';
import type { InfoboxFormFields, InfoboxSource, InfoboxData } from '../../../../types';

/**
 * The Infobox form section shared by the object, area, and label forms.
 * One model everywhere: an optional connected post (adds a "Read more" link
 * to the frontend drawer regardless of source) and a radio that only picks
 * where the content comes from — written manually or pulled from that post.
 */
interface Props<T extends InfoboxFormFields> {
	formData: T;
	onChange: ( formData: T ) => void;
}

export default function InfoboxSection<T extends InfoboxFormFields>( { formData, onChange }: Props<T> ) {
	const uid = useRef( Math.random().toString( 36 ).slice( 2 ) );
	const n   = uid.current;

	const isManualIb = formData.infobox_source !== 'post';

	function set<K extends keyof InfoboxFormFields>( key: K, val: InfoboxFormFields[ K ] ) {
		onChange( { ...formData, [ key ]: val } );
	}

	return (
		<section className="cns-modal-section">
			<h3>Infobox</h3>
			<PostSearch
				linkedPostId={ formData.linked_post_id }
				linkedPostLabel={ formData.linked_post_label }
				onChange={ ( item ) => onChange( {
					...formData,
					linked_post_id:    item ? item.id : 0,
					linked_post_label: item ? item.title : '',
				} ) }
			/>
			<p className="description">
				Optional — a connected post adds a &ldquo;Read more&rdquo; link to the infobox.
			</p>
			<div className="cns-radio-toggle">
				<label>
					<input type="radio" name={ `ib-src-${ n }` } value="manual" checked={ isManualIb }
						onChange={ () => set( 'infobox_source', 'manual' as InfoboxSource ) } />
					{ ' ' }Write content manually
				</label>
				<label>
					<input type="radio" name={ `ib-src-${ n }` } value="post" checked={ ! isManualIb }
						onChange={ () => set( 'infobox_source', 'post' as InfoboxSource ) } />
					{ ' ' }Use the connected post&rsquo;s content
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
				<p className="description">
					Title, description and image are pulled from the connected post.
				</p>
			) }
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
