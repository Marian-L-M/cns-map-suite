/* global wp */
import { useRef } from '@wordpress/element';

/**
 * Wraps the WordPress media frame.
 *
 * Props:
 *   imageId    {number}   current attachment ID (0 = none)
 *   imageUrl   {string}   current preview URL
 *   title      {string}   media-frame title
 *   onChange   {fn}       called with { id, url } or null on remove
 */
export default function MediaPicker( { imageId, imageUrl, title = 'Select Image', onChange } ) {
	const frameRef = useRef( null );

	function openPicker( e ) {
		e.preventDefault();
		if ( frameRef.current ) { frameRef.current.open(); return; }
		frameRef.current = wp.media( {
			title,
			button:   { text: 'Use this image' },
			multiple: false,
			library:  { type: 'image' },
		} );
		frameRef.current.on( 'select', () => {
			const att = frameRef.current.state().get( 'selection' ).first().toJSON();
			onChange?.( { id: att.id, url: att.url } );
		} );
		frameRef.current.open();
	}

	function removePicker( e ) {
		e.preventDefault();
		onChange?.( null );
	}

	return (
		<div className="cns-image-picker">
			<div className="cns-image-picker__preview">
				{ imageUrl
					? <img src={ imageUrl } alt="" />
					: <span>No image selected</span>
				}
			</div>
			<button type="button" className="button" onClick={ openPicker }>Select Image</button>
			{ imageId > 0 && (
				<button type="button" className="button" onClick={ removePicker }>Remove</button>
			) }
		</div>
	);
}
