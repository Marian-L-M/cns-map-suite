import { useRef, useEffect } from '@wordpress/element';
import ObjectsCanvas from '../canvases/ObjectsCanvas';
import ObjectsList   from '../lists/ObjectsList';
import { settingsToDrawState } from '../../canvas';
import { defaultObjectFormData, collectObjectPayload } from '../forms/ObjectForm';
import { useCanvasKeyboard, createDebouncedNudge } from '../useCanvasKeyboard';
import { useMapResource } from '../useMapResource';
import type { MapSettings, MapObject, ObjectSavePayload } from '../../../types';

// Internal clipboard for ⌘/Ctrl+C/V. Module scope so it survives tab
// switches within the editor page (not across page loads / other maps).
let objectClipboard: ObjectSavePayload | null = null;

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
	onLocalUpdate: ( id: number, patch: Partial<MapObject> ) => void;
	onDuplicate: ( id: number ) => Promise<void>;
	onRepositionStart: ( id: number ) => void;
	onRepositionComplete: () => void;
	onDelete: ( id: number ) => Promise<void>;
}

export default function ObjectsPanel( {
	mapId, settings, objects, selectedObjectId,
	repositioningObjectId,
	onObjectsLoaded, onSelect, onDeselect,
	onAdd, onPositionUpdate, onLocalUpdate, onDuplicate,
	onRepositionStart, onRepositionComplete,
	onDelete,
}: Props ) {
	useMapResource<MapObject>( mapId, 'objects', onObjectsLoaded );

	// The nudge factory is created once; these refs feed it live values.
	const stateRef   = useRef( { objects, selectedObjectId } );
	stateRef.current = { objects, selectedObjectId };
	const propsRef   = useRef( { onPositionUpdate, onLocalUpdate } );
	propsRef.current = { onPositionUpdate, onLocalUpdate };

	// ── Keyboard shortcuts (active while the Objects tab is mounted) ───────────

	const selectedObject = objects.find( ( o ) => o.id === selectedObjectId ) || null;

	const nudger = useRef( createDebouncedNudge(
		() => {
			const s = stateRef.current;
			return s.objects.find( ( o ) => o.id === s.selectedObjectId ) || null;
		},
		( id, x, y ) => propsRef.current.onLocalUpdate( id, { x, y } ),
		( id, x, y ) => void propsRef.current.onPositionUpdate( id, x, y ),
	) );
	useEffect( () => () => nudger.current.flush(), [] ); // persist pending nudge on tab leave

	async function pasteObject() {
		if ( ! objectClipboard ) return;
		// Cascade repeated pastes instead of stacking copies exactly on top
		// of each other.
		const payload = {
			...objectClipboard,
			x: objectClipboard.x + 24,
			y: objectClipboard.y + 24,
		};
		objectClipboard = payload;
		const created = await onAdd( payload );
		onSelect( created.id );
	}

	useCanvasKeyboard( {
		copy: () => {
			if ( ! selectedObject ) return false;
			objectClipboard = collectObjectPayload( defaultObjectFormData( selectedObject, null, null ) );
			return true;
		},
		paste: () => {
			if ( ! objectClipboard ) return false;
			void pasteObject();
			return true;
		},
		duplicate: () => {
			if ( ! selectedObject ) return false;
			void onDuplicate( selectedObject.id );
			return true;
		},
		remove: () => {
			if ( ! selectedObject ) return false;
			if ( confirm( 'Delete this object?' ) ) void onDelete( selectedObject.id );
			return true;
		},
		nudge: ( dx, dy ) => nudger.current.nudge( dx, dy ),
	} );

	// New objects are created immediately and edited in the context panel —
	// same flow as areas and labels (the modal is gone).
	async function handleCreateAt( x: number, y: number ) {
		const payload = collectObjectPayload( {
			...defaultObjectFormData( null, x, y ),
			title: 'New Object',
		} );
		const created = await onAdd( payload );
		onSelect( created.id );
	}

	function handleAdd() {
		const cx = Math.round( settings.width / 2 );
		const cy = Math.round( settings.width / settings.aspectRatio / 2 );
		void handleCreateAt( cx, cy );
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
					<button type="button" className="button button-primary" onClick={ handleAdd }>
						Add Object
					</button>
					<p className="description">
						Click an object to pick it up — it follows the cursor; click or press Enter to drop (Esc cancels).
						Click empty canvas to place a new object at that position, then edit it in the side panel.
						With an object selected: Enter picks it up, arrow keys nudge (Shift&nbsp;=&nbsp;10&nbsp;px),
						Ctrl/⌘+C&nbsp;&amp;&nbsp;V copy &amp; paste, Ctrl/⌘+D duplicates, Delete removes.
					</p>
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
					onPlace={ ( x, y ) => void handleCreateAt( x, y ) }
				/>

				<ObjectsList
					objects={ objects }
					onEdit={ ( obj ) => onSelect( obj.id ) }
					onDuplicate={ ( id ) => void onDuplicate( id ) }
					onDelete={ handleDelete }
				/>
			</div>
		</div>
	);
}
