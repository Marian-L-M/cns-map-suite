import { useState, useEffect } from '@wordpress/element';
import ObjectForm, { defaultObjectFormData, collectObjectPayload } from './forms/ObjectForm';
import SaveStatus from './shared/SaveStatus';
import { iconLibraryCache, loadIconLibraryIntoCache } from '../icons';
import type { MapObject, ObjectFormData, ObjectSavePayload, LibraryIcon, SaveStatus as SaveStatusType } from '../../types';

interface Props {
	obj: MapObject | null;
	defaultX: number | null;
	defaultY: number | null;
	onSave: ( payload: ObjectSavePayload ) => Promise<void>;
	onClose: () => void;
}

export default function ObjectModal( { obj, defaultX, defaultY, onSave, onClose }: Props ) {
	const [ formData, setFormData ] = useState<ObjectFormData>( () => defaultObjectFormData( obj, defaultX, defaultY ) );
	const [ icons, setIcons ]       = useState<LibraryIcon[]>( iconLibraryCache || [] );
	const [ status, setStatus ]     = useState<SaveStatusType>( { text: '', type: '' } );
	const [ saving, setSaving ]     = useState( false );

	useEffect( () => {
		setFormData( defaultObjectFormData( obj, defaultX, defaultY ) );
		setStatus( { text: '', type: '' } );
	}, [ obj?.id ] );

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
			setStatus( { text: ( err as Error ).message, type: 'error' } );
		} finally {
			setSaving( false );
		}
	}

	return (
		<div className="cns-modal" role="dialog" aria-modal={ true } aria-labelledby="cns-object-modal-title">
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
