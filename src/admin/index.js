import { createRoot } from '@wordpress/element';
import MapEditorApp   from './app/MapEditorApp.js';
import IconLibraryApp from './app/IconLibraryApp.js';

document.addEventListener( 'DOMContentLoaded', () => {
	const editorEl = document.getElementById( 'cns-admin-root' );
	if ( editorEl ) createRoot( editorEl ).render( <MapEditorApp /> );

	const iconsEl = document.getElementById( 'cns-icons-root' );
	if ( iconsEl ) createRoot( iconsEl ).render( <IconLibraryApp /> );
} );
