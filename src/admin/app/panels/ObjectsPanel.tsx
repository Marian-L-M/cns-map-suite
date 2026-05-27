import { useState, useEffect } from '@wordpress/element';
import ObjectsCanvas from '../canvases/ObjectsCanvas';
import ObjectsList   from '../lists/ObjectsList';
import ObjectModal   from '../ObjectModal';
import { apiFetch }  from '../../utils';
import { settingsToDrawState } from '../../canvas';
import { defaultObjectFormData } from '../forms/ObjectForm';
import type { MapSettings, MapObject, ObjectSavePayload } from '../../../types';

interface ModalState {
	obj: MapObject | null;
	x: number | null;
	y: number | null;
}

interface Props {
	mapId: number;
	settings: MapSettings;
	objects: MapObject[];
	selectedObjectId: number | null;
	repositioningObjectId: number | null;
	onObjectsLoaded: ( objects: MapObject[] ) => void;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onAdd: ( payload: ObjectSavePayload ) => Promise<MapObject>;
	onPositionUpdate: ( id: number, x: number, y: number ) => Promise<void>;
	onRepositionStart: ( id: number ) => void;
	onRepositionComplete: () => void;
	onDelete: ( id: number ) => Promise<void>;
}

export default function ObjectsPanel( {
	mapId, settings, objects, selectedObjectId,
	repositioningObjectId,
	onObjectsLoaded, onSelect, onDeselect,
	onAdd, onPositionUpdate,
	onRepositionStart, onRepositionComplete,
	onDelete,
}: Props ) {
	const [ initialized, setInitialized ] = useState( false );
	const [ modal, setModal ]             = useState<ModalState | null>( null );

	useEffect( () => {
		if ( initialized || ! mapId ) return;
		apiFetch( 'GET', `/maps/${ mapId }/objects` )
			.then( ( r ) => r.json() as Promise<MapObject[]> )
			.then( ( data ) => { if ( Array.isArray( data ) ) onObjectsLoaded( data ); } )
			.catch( () => {} )
			.finally( () => setInitialized( true ) );
	}, [ mapId ] );

	function openAddModal() {
		const cx = Math.round( settings.width / 2 );
		const cy = Math.round( settings.width / settings.aspectRatio / 2 );
		setModal( { obj: null, x: cx, y: cy } );
	}

	async function handleModalSave( formPayload: ObjectSavePayload ) {
		if ( modal?.obj ) {
			const res  = await apiFetch( 'POST', `/objects/${ modal.obj.id }`, formPayload );
			const data = await res.json() as MapObject;
			if ( ! res.ok ) throw new Error( ( data as unknown as { message?: string } ).message || 'Save failed.' );
			onObjectsLoaded( objects.map( ( o ) => o.id === modal.obj!.id ? data : o ) );
		} else {
			const newObj = await onAdd( formPayload );
			onSelect( newObj.id );
		}
		setModal( null );
	}

	async function handleDelete( id: number ) {
		if ( ! confirm( 'Delete this object?' ) ) return;
		await onDelete( id );
	}

	const drawState = settingsToDrawState( settings );

	return (
		<div className="cns-tab-panel cns-tab-panel--active" data-panel="objects" role="tabpanel">
			<div className="cns-objects-layout">
				<div className="cns-objects-toolbar">
					<button type="button" className="button button-primary" onClick={ openAddModal }>
						Add Object
					</button>
					<p className="description">Or click directly on the canvas to place an object at that position.</p>
				</div>

				<ObjectsCanvas
					drawState={ drawState }
					objects={ objects }
					selectedObjectId={ selectedObjectId }
					repositioningObjectId={ repositioningObjectId }
					onSelect={ onSelect }
					onDeselect={ onDeselect }
					onPositionUpdate={ onPositionUpdate }
					onRepositionComplete={ onRepositionComplete }
				/>

				<ObjectsList
					objects={ objects }
					onEdit={ ( obj ) => setModal( { obj, x: null, y: null } ) }
					onDelete={ handleDelete }
				/>
			</div>

			{ modal && (
				<ObjectModal
					obj={ modal.obj }
					defaultX={ modal.x }
					defaultY={ modal.y }
					onSave={ handleModalSave }
					onClose={ () => setModal( null ) }
				/>
			) }
		</div>
	);
}
