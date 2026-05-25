import { useState, useEffect, useCallback } from '@wordpress/element';
import ObjectsCanvas from '../canvases/ObjectsCanvas.js';
import ObjectsList   from '../lists/ObjectsList.js';
import ObjectModal   from '../ObjectModal.js';
import { apiFetch }  from '../../utils.js';
import { defaultObjectFormData } from '../forms/ObjectForm.js';

function settingsToDrawState( s ) {
	return {
		width: s.width, aspectRatio: s.aspectRatio,
		bgType: s.bgType, bgColor: s.bgColor, bgImageUrl: s.bgImageUrl,
		imgUrl: s.imageUrl, imageX: s.imageX, imageY: s.imageY, imageW: s.imageW,
	};
}

export default function ObjectsPanel( {
	mapId, settings, objects, selectedObjectId,
	repositioningObjectId,
	onObjectsLoaded, onSelect, onDeselect,
	onAdd, onPositionUpdate,
	onRepositionStart, onRepositionComplete,
	onDelete,
} ) {
	const [ initialized, setInitialized ] = useState( false );
	const [ modal, setModal ]             = useState( null ); // null | { obj, x, y }

	// Load objects once when the tab mounts
	useEffect( () => {
		if ( initialized || ! mapId ) return;
		apiFetch( 'GET', `/maps/${ mapId }/objects` )
			.then( ( r ) => r.json() )
			.then( ( data ) => { if ( Array.isArray( data ) ) onObjectsLoaded( data ); } )
			.catch( () => {} )
			.finally( () => setInitialized( true ) );
	}, [ mapId ] );

	function openAddModal() {
		const cx = Math.round( settings.width / 2 );
		const cy = Math.round( settings.width / settings.aspectRatio / 2 );
		setModal( { obj: null, x: cx, y: cy } );
	}

	async function handleModalSave( formPayload ) {
		if ( modal.obj ) {
			// edit from list
			const res  = await apiFetch( 'POST', `/objects/${ modal.obj.id }`, formPayload );
			const data = await res.json();
			if ( ! res.ok ) throw new Error( data.message || 'Save failed.' );
			onObjectsLoaded( objects.map( ( o ) => o.id === modal.obj.id ? data : o ) );
		} else {
			const newObj = await onAdd( formPayload );
			onSelect( newObj.id );
		}
		setModal( null );
	}

	async function handleDelete( id ) {
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
