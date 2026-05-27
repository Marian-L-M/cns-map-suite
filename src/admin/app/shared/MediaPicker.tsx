import { useRef } from '@wordpress/element';
import type { MediaAttachment } from '../../../types';

interface Props {
	imageId: number;
	imageUrl: string;
	title?: string;
	onChange: ( attachment: MediaAttachment | null ) => void;
}

export default function MediaPicker( { imageId, imageUrl, title = 'Select Image', onChange }: Props ) {
	const frameRef = useRef<ReturnType<typeof window.wp.media> | null>( null );

	function openPicker( e: React.MouseEvent ) {
		e.preventDefault();
		if ( frameRef.current ) { frameRef.current.open(); return; }
		frameRef.current = window.wp.media( {
			title,
			button:   { text: 'Use this image' },
			multiple: false,
			library:  { type: 'image' },
		} );
		frameRef.current.on( 'select', () => {
			const att = frameRef.current!.state().get( 'selection' ).first().toJSON();
			onChange?.( { id: att.id, url: att.url as string } );
		} );
		frameRef.current.open();
	}

	function removePicker( e: React.MouseEvent ) {
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
