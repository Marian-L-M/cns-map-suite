import { useState, useEffect } from '@wordpress/element';
import { Button, Notice } from '@wordpress/components';
import { closeSmall, plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { apiFetch } from '../utils';
import { iconLibraryCache, loadIconLibraryIntoCache } from '../icons';
import type { LibraryIcon } from '../../types';

export default function IconLibraryApp() {
	const [ icons,   setIcons   ] = useState<LibraryIcon[]>( [] );
	const [ error,   setError   ] = useState<string>( '' );

	useEffect( () => {
		loadIconLibraryIntoCache().then( () => setIcons( iconLibraryCache || [] ) );
	}, [] );

	function handleAdd() {
		const frame = window.wp.media( {
			title:    __( 'Select or Upload SVG Icon', 'cns-map-suite' ),
			button:   { text: __( 'Add to library', 'cns-map-suite' ) },
			multiple: false,
			library:  { type: 'image/svg+xml' },
		} );
		frame.on( 'select', async () => {
			const att = frame.state().get( 'selection' ).first().toJSON();
			setError( '' );
			try {
				const data = await apiFetch< LibraryIcon >( 'POST', '/icons', { attachment_id: att.id } );
				setIcons( ( prev ) => [ ...prev, data ] );
			} catch ( err ) {
				setError( ( err as Error ).message || __( 'Failed to add icon.', 'cns-map-suite' ) );
			}
		} );
		frame.open();
	}

	async function handleRemove( id: number ) {
		if ( ! confirm( __( 'Remove this icon from the library? (The attachment itself is kept.)', 'cns-map-suite' ) ) ) return;
		setError( '' );
		try {
			await apiFetch( 'DELETE', `/icons/${ id }` );
			setIcons( ( prev ) => prev.filter( ( i ) => i.id !== id ) );
		} catch ( err ) {
			setError( ( err as Error ).message || __( 'Remove failed.', 'cns-map-suite' ) );
		}
	}

	return (
		<div>
			{ error && (
				<Notice
					status="error"
					onRemove={ () => setError( '' ) }
				>
					{ error }
				</Notice>
			) }
			<div className="cns-icon-library-toolbar">
				<Button variant="primary" icon={ plus } onClick={ handleAdd }>
					{ __( 'Add Icon', 'cns-map-suite' ) }
				</Button>
			</div>
			<div id="cns-icon-library-grid" className="cns-icon-library-grid">
				{ icons.length === 0 ? (
					<p className="cns-icon-library-grid__empty">
						{ __( 'No icons yet. Click “Add Icon” to upload an SVG.', 'cns-map-suite' ) }
					</p>
				) : (
					icons.map( ( icon ) => (
						<div key={ icon.id } className="cns-icon-library-item">
							<div className="cns-icon-library-item__preview">
								<img src={ icon.url } alt={ icon.title } />
							</div>
							<span className="cns-icon-library-item__name">{ icon.title }</span>
							<Button
								className="cns-icon-library-item__remove"
								size="small"
								icon={ closeSmall }
								isDestructive
								label={ __( 'Remove from library', 'cns-map-suite' ) }
								onClick={ () => handleRemove( icon.id ) }
							/>
						</div>
					) )
				) }
			</div>
		</div>
	);
}
