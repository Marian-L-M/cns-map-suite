import { useRef, useEffect } from '@wordpress/element';
import { drawObjectsOnCanvas, findObjectAtPoint } from '../../objects';
import { usePickupDrag } from './usePickupDrag';
import CanvasZoomWrap from './CanvasZoomWrap';
import type { DrawState, MapObject } from '../../../types';

/**
 * Pick-up/drop interaction comes from usePickupDrag; here a drag payload is
 * simply the object id, and the preview draws the marker at the cursor.
 * Clicking empty canvas with nothing selected places a new object there.
 */
interface ObjectDrag {
	id: number;
}

interface Props {
	drawState: DrawState;
	objects: MapObject[];
	selectedObjectId: number | null;
	repositioningObjectId: number | null;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onPositionUpdate: ( id: number, x: number, y: number ) => Promise<void>;
	onRepositionComplete: () => void;
	onPlace: ( x: number, y: number ) => void;
}

interface CanvasState {
	objects: MapObject[];
	selectedObjectId: number | null;
}

export default function ObjectsCanvas( {
	drawState, objects, selectedObjectId,
	repositioningObjectId,
	onSelect, onDeselect, onPositionUpdate, onRepositionComplete, onPlace,
}: Props ) {
	const stateRef   = useRef<CanvasState>( { objects: [], selectedObjectId: null } );
	stateRef.current = { objects, selectedObjectId };

	function redraw() {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		const { objects: objs, selectedObjectId: selId } = stateRef.current;
		const drag = dragRef.current;
		drawObjectsOnCanvas( canvas, drawState, objs, selId, drag?.payload.id ?? null, drag?.cursor ?? null );
	}

	const { canvasRef, dragRef, startDrag } = usePickupDrag<ObjectDrag>( {
		hitTest: ( ctx, x, y ) => {
			const hit = findObjectAtPoint( ctx, x, y, stateRef.current.objects );
			return hit ? { id: hit.id } : null;
		},
		onPickup: ( drag ) => onSelect?.( drag.id ),
		onDrop: ( drag, cursor ) => {
			if ( cursor ) {
				void onPositionUpdate?.( drag.id, Math.round( cursor.x ), Math.round( cursor.y ) );
			}
		},
		dragFromSelection: () =>
			stateRef.current.selectedObjectId ? { id: stateRef.current.selectedObjectId } : null,
		onEmptyClick: ( coords ) => {
			if ( stateRef.current.selectedObjectId ) {
				onDeselect?.();
			} else {
				onPlace?.( Math.round( coords.x ), Math.round( coords.y ) );
			}
		},
		onEscapeIdle: () => {
			if ( stateRef.current.selectedObjectId ) onDeselect?.();
		},
		onDragEnd: () => onRepositionComplete?.(),
		redraw,
	} );

	useEffect( () => {
		redraw();
	} ); // run after every render

	// The context panel's "Reposition" button starts a drag.
	useEffect( () => {
		if ( repositioningObjectId ) startDrag( { id: repositioningObjectId } );
	}, [ repositioningObjectId ] );

	return (
		<div className="cns-objects-canvas-wrap">
			<CanvasZoomWrap>
				<canvas ref={ canvasRef } />
			</CanvasZoomWrap>
		</div>
	);
}
