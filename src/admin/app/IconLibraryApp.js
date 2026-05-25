/* global wp */
import { useState, useEffect } from '@wordpress/element';
import { apiFetch } from '../utils.js';
import { iconLibraryCache, loadIconLibraryIntoCache } from '../icons.js';

export default function IconLibraryApp() {
	const [ icons, setIcons ] = useState( [] );

	useEffect( () => {
		loadIconLibraryIntoCache().then( () => setIcons( iconLibraryCache || [] ) );
	}, [] );

	function handleAdd() {
		const frame = wp.media( {
			title:   'Select or Upload SVG Icon',
			button:  { text: 'Add to library' },
			multiple: false,
			library: { type: 'image/svg+xml' },
		} );
		frame.on( 'select', async () => {
			const att = frame.state().get( 'selection' ).first().toJSON();
			try {
				const res  = await apiFetch( 'POST', '/icons', { attachment_id: att.id } );
				const data = await res.json();
				if ( ! res.ok ) throw new Error( data.message || 'Failed to add icon.' );
				setIcons( ( prev ) => [ ...prev, data ] );
			} catch ( err ) { alert( err.message ); }
		} );
		frame.open();
	}

	async function handleRemove( id ) {
		if ( ! confirm( 'Remove this icon from the library? (The attachment itself is kept.)' ) ) return;
		try {
			const res = await apiFetch( 'DELETE', `/icons/${ id }` );
			if ( ! res.ok ) throw new Error( 'Remove failed.' );
			setIcons( ( prev ) => prev.filter( ( i ) => i.id !== id ) );
		} catch ( err ) { alert( err.message ); }
	}

	return (
		<div>
			<div className="cns-icon-library-toolbar">
				<button type="button" id="cns-add-icon-btn" className="button button-primary" onClick={ handleAdd }>
					Add Icon
				</button>
			</div>
			<div id="cns-icon-library-grid" className="cns-icon-library-grid">
				{ icons.length === 0 ? (
					<p className="cns-icon-library-grid__empty">
						No icons yet. Click "Add Icon" to upload an SVG.
					</p>
				) : (
					icons.map( ( icon ) => (
						<div key={ icon.id } className="cns-icon-library-item">
							<div className="cns-icon-library-item__preview">
								<img src={ icon.url } alt={ icon.title } />
							</div>
							<span className="cns-icon-library-item__name">{ icon.title }</span>
							<button
								type="button"
								className="cns-icon-library-item__remove"
								aria-label="Remove"
								onClick={ () => handleRemove( icon.id ) }
							>&times;</button>
						</div>
					) )
				) }
			</div>
		</div>
	);
}
