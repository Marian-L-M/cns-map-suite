import { useState, useEffect } from '@wordpress/element';
import ObjectForm,         { defaultObjectFormData, collectObjectPayload } from './forms/ObjectForm';
import AreaForm,           { defaultAreaFormData }   from './forms/AreaForm';
import HierarchyRegionForm, { defaultHierarchyFormData } from './forms/HierarchyRegionForm';
import NodeList            from './forms/NodeList';
import SaveStatus          from './shared/SaveStatus';
import { iconLibraryCache, loadIconLibraryIntoCache } from '../icons';
import { normalizeNodesForShapeType } from '../areas';
import type {
	Tab, MapObject, MapArea, HierarchyRegion, HierarchyFormData,
	ObjectFormData, AreaFormData,
	ObjectSavePayload, ShapeType, Node, LibraryIcon,
	SaveStatus as SaveStatusType,
} from '../../types';

interface Props {
	activeTab: Tab;
	selectedObject: MapObject | null;
	selectedArea: MapArea | null;
	selectedRegion: HierarchyRegion | null;
	onObjectSave: ( payload: ObjectSavePayload ) => Promise<MapObject | undefined>;
	onObjectDelete: () => Promise<void>;
	onObjectClose: () => void;
	onObjectReposition: () => void;
	onAreaSave: ( formData: AreaFormData ) => Promise<MapArea | undefined>;
	onAreaDelete: () => Promise<void>;
	onAreaClose: () => void;
	onAreaNodesUpdate: ( areaId: number, nodes: Node[] ) => void;
	onAreaShapeTypeChange: ( areaId: number, shapeType: ShapeType ) => void;
	onRegionSave: ( formData: HierarchyFormData ) => Promise<HierarchyRegion | undefined>;
	onRegionDelete: () => Promise<void>;
	onRegionClose: () => void;
}

export default function ContextPanel( {
	activeTab,
	selectedObject, selectedArea, selectedRegion,
	onObjectSave, onObjectDelete, onObjectClose, onObjectReposition,
	onAreaSave,   onAreaDelete,   onAreaClose,
	onAreaNodesUpdate, onAreaShapeTypeChange,
	onRegionSave, onRegionDelete, onRegionClose,
}: Props ) {
	const [ objFormData,    setObjFormData    ] = useState<ObjectFormData | null>( null );
	const [ areaFormData,   setAreaFormData   ] = useState<AreaFormData | null>( null );
	const [ regionFormData, setRegionFormData ] = useState<HierarchyFormData | null>( null );
	const [ icons,          setIcons          ] = useState<LibraryIcon[]>( iconLibraryCache || [] );
	const [ status,         setStatus         ] = useState<SaveStatusType>( { text: '', type: '' } );
	const [ saving,         setSaving         ] = useState( false );

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

	useEffect( () => {
		if ( selectedRegion ) {
			setRegionFormData( defaultHierarchyFormData( selectedRegion ) );
			setStatus( { text: '', type: '' } );
		}
	}, [ selectedRegion?.id ] );

	const hasSelection = !! selectedObject || !! selectedArea || !! selectedRegion;

	if ( ! hasSelection ) {
		return (
			<aside className="cns-editor-context" aria-label="Context panel">
				<div className="cns-editor-context__empty">
					<p>{ activeTab === 'areas'
						? 'Select an area on the canvas to edit it here.'
						: activeTab === 'hierarchy'
						? 'Select a region on the canvas to edit it here.'
						: 'Select an object on the canvas to edit it here.'
					}</p>
				</div>
			</aside>
		);
	}

	const isObject = !! selectedObject;
	const isRegion = ! isObject && !! selectedRegion;
	const title    = isObject
		? ( selectedObject!.title || '(no title)' )
		: isRegion
		? ( selectedRegion!.child_map_title || 'New Region' )
		: ( selectedArea!.title || '(no title)' );

	async function handleSave() {
		setSaving( true );
		setStatus( { text: 'Saving…', type: '' } );
		try {
			if ( isObject && objFormData ) {
				const data = await onObjectSave( collectObjectPayload( objFormData ) );
				if ( data?.title ) setObjFormData( ( prev ) => prev ? { ...prev, title: data.title } : prev );
			} else if ( isRegion && regionFormData ) {
				const data = await onRegionSave( regionFormData );
				if ( data ) setRegionFormData( defaultHierarchyFormData( data ) );
			} else if ( areaFormData ) {
				await onAreaSave( areaFormData );
			}
			setStatus( { text: 'Saved.', type: 'ok' } );
			setTimeout( () => setStatus( { text: '', type: '' } ), 2000 );
		} catch ( err ) {
			setStatus( { text: ( err as Error ).message, type: 'error' } );
		} finally {
			setSaving( false );
		}
	}

	async function handleDelete() {
		if ( isObject ) {
			if ( ! confirm( 'Delete this object?' ) ) return;
			await onObjectDelete();
		} else if ( isRegion ) {
			if ( ! confirm( 'Delete this hierarchy region?' ) ) return;
			await onRegionDelete();
		} else {
			if ( ! confirm( 'Delete this area?' ) ) return;
			await onAreaDelete();
		}
	}

	function handleClose() {
		if ( isObject ) onObjectClose();
		else if ( isRegion ) onRegionClose();
		else onAreaClose();
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
						onClick={ handleClose }
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
					{ ! isObject && ! isRegion && areaFormData && (
						<>
							<AreaForm
								formData={ areaFormData }
								onChange={ setAreaFormData }
								onShapeTypeChange={ ( st ) => {
									if ( selectedArea ) onAreaShapeTypeChange?.( selectedArea.id, st );
									setAreaFormData( ( prev ) => prev ? { ...prev, shape_type: st } : prev );
								} }
							/>
							{ selectedArea && (
								<NodeList
									area={ selectedArea }
									onNodesChange={ ( nodes ) => onAreaNodesUpdate?.( selectedArea.id, nodes ) }
								/>
							) }
						</>
					) }
					{ isRegion && regionFormData && (
						<HierarchyRegionForm
							formData={ regionFormData }
							onChange={ setRegionFormData }
						/>
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
