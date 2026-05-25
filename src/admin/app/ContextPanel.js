import { useState, useEffect } from '@wordpress/element';
import ObjectForm, { defaultObjectFormData, collectObjectPayload } from './forms/ObjectForm.js';
import AreaForm,   { defaultAreaFormData }   from './forms/AreaForm.js';
import NodeList    from './forms/NodeList.js';
import SaveStatus  from './shared/SaveStatus.js';
import { iconLibraryCache, loadIconLibraryIntoCache } from '../icons.js';
import { normalizeNodesForShapeType } from '../areas.js';

export default function ContextPanel( {
	activeTab,
	selectedObject, selectedArea,
	onObjectSave, onObjectDelete, onObjectClose, onObjectReposition,
	onAreaSave,   onAreaDelete,   onAreaClose,
	onAreaNodesUpdate, onAreaShapeTypeChange,
} ) {
	const [ objFormData,  setObjFormData  ] = useState( null );
	const [ areaFormData, setAreaFormData ] = useState( null );
	const [ icons, setIcons ]               = useState( iconLibraryCache || [] );
	const [ status, setStatus ]             = useState( { text: '', type: '' } );
	const [ saving, setSaving ]             = useState( false );

	// Sync form when selected item changes
	useEffect( () => {
		if ( selectedObject ) {
			setObjFormData( defaultObjectFormData( selectedObject, null, null ) );
			setStatus( { text: '', type: '' } );
			if ( ! iconLibraryCache ) {
				loadIconLibraryIntoCache().then( () => setIcons( iconLibraryCache || [] ) );
			}
		}
	}, [ selectedObject?.id ] );

	useEffect( () => {
		if ( selectedArea ) {
			setAreaFormData( defaultAreaFormData( selectedArea ) );
			setStatus( { text: '', type: '' } );
		}
	}, [ selectedArea?.id ] );

	// Empty state
	if ( ! selectedObject && ! selectedArea ) {
		return (
			<aside className="cns-editor-context" aria-label="Context panel">
				<div className="cns-editor-context__empty">
					<p>{ activeTab === 'areas'
						? 'Select an area on the canvas to edit it here.'
						: 'Select an object on the canvas to edit it here.'
					}</p>
				</div>
			</aside>
		);
	}

	const isObject = !! selectedObject;
	const title    = isObject
		? ( selectedObject.title || '(no title)' )
		: ( selectedArea.title   || '(no title)' );

	async function handleSave() {
		setSaving( true );
		setStatus( { text: 'Saving…', type: '' } );
		try {
			if ( isObject ) {
				const data = await onObjectSave( collectObjectPayload( objFormData ) );
				if ( data?.title ) setObjFormData( ( prev ) => ( { ...prev, title: data.title } ) );
			} else {
				await onAreaSave( areaFormData );
			}
			setStatus( { text: 'Saved.', type: 'ok' } );
			setTimeout( () => setStatus( { text: '', type: '' } ), 2000 );
		} catch ( err ) {
			setStatus( { text: err.message, type: 'error' } );
		} finally {
			setSaving( false );
		}
	}

	async function handleDelete() {
		if ( isObject ) {
			if ( ! confirm( 'Delete this object?' ) ) return;
			await onObjectDelete();
		} else {
			if ( ! confirm( 'Delete this area?' ) ) return;
			await onAreaDelete();
		}
	}

	return (
		<aside className="cns-editor-context" aria-label="Context panel">
			<div id="cns-context-form">
				<div className="cns-editor-context__header">
					<span className="cns-editor-context__title">{ title }</span>
					{ isObject && (
						<button type="button" className="button button-small" onClick={ onObjectReposition }>
							Reposition
						</button>
					) }
					<button
						type="button"
						className="cns-editor-context__close"
						aria-label="Close"
						onClick={ isObject ? onObjectClose : onAreaClose }
					>&times;</button>
				</div>

				<div className="cns-editor-context__body">
					{ isObject && objFormData && (
						<ObjectForm
							formData={ objFormData }
							onChange={ setObjFormData }
							icons={ icons }
						/>
					) }
					{ ! isObject && areaFormData && (
						<>
							<AreaForm
								formData={ areaFormData }
								onChange={ setAreaFormData }
								onShapeTypeChange={ ( st ) => {
									onAreaShapeTypeChange?.( selectedArea.id, st );
									// Keep local form in sync
									setAreaFormData( ( prev ) => ( { ...prev, shape_type: st } ) );
								} }
							/>
							<NodeList
								area={ selectedArea }
								onNodesChange={ ( nodes ) => onAreaNodesUpdate?.( selectedArea.id, nodes ) }
							/>
						</>
					) }
				</div>

				<div className="cns-editor-context__footer">
					<SaveStatus text={ status.text } type={ status.type } />
					<button type="button" className="button button-small button-primary" disabled={ saving } onClick={ handleSave }>
						Save
					</button>
					<button type="button" className="button button-small" onClick={ handleDelete }>
						Delete
					</button>
				</div>
			</div>
		</aside>
	);
}
