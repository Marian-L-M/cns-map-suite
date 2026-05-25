import { useState, useEffect } from '@wordpress/element';
import ObjectForm, { defaultObjectFormData, collectObjectPayload } from './forms/ObjectForm.js';
import SaveStatus from './shared/SaveStatus.js';
import { iconLibraryCache, loadIconLibraryIntoCache } from '../icons.js';

export default function ObjectModal( { obj, defaultX, defaultY, onSave, onClose } ) {
	const [ formData, setFormData ] = useState( () => defaultObjectFormData( obj, defaultX, defaultY ) );
	const [ icons, setIcons ]       = useState( iconLibraryCache || [] );
	const [ status, setStatus ]     = useState( { text: '', type: '' } );
	const [ saving, setSaving ]     = useState( false );

	// Reset form when the target object changes
	useEffect( () => {
		setFormData( defaultObjectFormData( obj, defaultX, defaultY ) );
		setStatus( { text: '', type: '' } );
	}, [ obj?.id ] );

	// Ensure icon cache is loaded
	useEffect( () => {
		if ( ! iconLibraryCache ) {
			loadIconLibraryIntoCache().then( () => setIcons( iconLibraryCache || [] ) );
		}
	}, [] );

	async function handleSave() {
		setSaving( true );
		setStatus( { text: 'Saving…', type: '' } );
		try {
			await onSave( collectObjectPayload( formData ) );
			setStatus( { text: 'Saved.', type: 'ok' } );
		} catch ( err ) {
			setStatus( { text: err.message, type: 'error' } );
		} finally {
			setSaving( false );
		}
	}

	return (
		<div className="cns-modal" role="dialog" aria-modal="true" aria-labelledby="cns-object-modal-title">
			<div className="cns-modal__backdrop" onClick={ onClose } />
			<div className="cns-modal__dialog">
				<div className="cns-modal__header">
					<h2 className="cns-modal__title" id="cns-object-modal-title">
						{ obj ? 'Edit Object' : 'Add Object' }
					</h2>
					<button type="button" className="cns-modal__close" aria-label="Close" onClick={ onClose }>&times;</button>
				</div>
				<div className="cns-modal__body">
					<ObjectForm formData={ formData } onChange={ setFormData } icons={ icons } />
				</div>
				<div className="cns-modal__footer">
					<SaveStatus text={ status.text } type={ status.type } />
					<button type="button" className="button button-primary" disabled={ saving } onClick={ handleSave }>
						{ obj ? 'Save Object' : 'Add Object' }
					</button>
					<button type="button" className="button" onClick={ onClose }>Cancel</button>
				</div>
			</div>
		</div>
	);
}
