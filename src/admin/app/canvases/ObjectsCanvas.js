import { useRef, useEffect, useCallback } from '@wordpress/element';
import { drawObjectsOnCanvas, findObjectAtPoint } from '../../objects.js';
import { getCanvasCoords } from '../../canvas.js';

/**
 * Props:
 *   drawState         — { width, aspectRatio, bgType, bgColor, bgImageUrl, imgUrl, imageX, imageY, imageW }
 *   objects           — current object list
 *   selectedObjectId  — null or number
 *   repositioningObjectId — null or number (set from outside via "Reposition" btn)
 *   onSelect          — fn(id)
 *   onDeselect        — fn()
 *   onPositionUpdate  — fn(id, x, y) after a move
 *   onRepositionComplete — fn()
 */
export default function ObjectsCanvas( {
	drawState, objects, selectedObjectId,
	repositioningObjectId,
	onSelect, onDeselect, onPositionUpdate, onRepositionComplete,
} ) {
	const canvasRef     = useRef( null );
	// Keep a ref for values that canvas event handlers need (avoids stale closures).
	const stateRef = useRef( {} );
	stateRef.current = { objects, selectedObjectId, repositioningObjectId };

	// Local canvas-interaction state (not in React state — canvas redraws handle it)
	const repoLocalRef = useRef( { cursor: null } );

	// ── Draw ────────────────────────────────────────────────────────────────────

	function redraw( repoId, repoCursor ) {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		const { objects: objs } = stateRef.current;
		drawObjectsOnCanvas( canvas, drawState, objs, stateRef.current.selectedObjectId, repoId, repoCursor );
	}

	useEffect( () => {
		redraw( repositioningObjectId, repoLocalRef.current.cursor );
	} ); // run after every render — lightweight since drawMapCanvas caches images

	// ── Events ──────────────────────────────────────────────────────────────────

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;

		function onMouseMove( e ) {
			const { repositioningObjectId: repoId } = stateRef.current;
			if ( ! repoId ) return;
			repoLocalRef.current.cursor = getCanvasCoords( canvas, e );
			redraw( repoId, repoLocalRef.current.cursor );
		}

		async function onClick( e ) {
			const coords = getCanvasCoords( canvas, e );
			const ctx    = canvas.getContext( '2d' );
			const { objects: objs, selectedObjectId: selId, repositioningObjectId: repoId } = stateRef.current;

			if ( repoId ) {
				repoLocalRef.current.cursor = null;
				onRepositionComplete?.();
				await onPositionUpdate?.( repoId, coords.x, coords.y );
				return;
			}

			const hit = findObjectAtPoint( ctx, coords.x, coords.y, objs );

			if ( hit ) {
				onSelect?.( hit.id );
			} else if ( selId ) {
				await onPositionUpdate?.( selId, coords.x, coords.y );
			} else {
				onDeselect?.();
			}
		}

		function onKeyDown( e ) {
			const { repositioningObjectId: repoId, selectedObjectId: selId } = stateRef.current;
			if ( e.key === 'Escape' ) {
				if ( repoId ) {
					repoLocalRef.current.cursor = null;
					onRepositionComplete?.();
				} else if ( selId ) {
					onDeselect?.();
				}
			}
		}

		canvas.addEventListener( 'mousemove', onMouseMove );
		canvas.addEventListener( 'click', onClick );
		document.addEventListener( 'keydown', onKeyDown );
		return () => {
			canvas.removeEventListener( 'mousemove', onMouseMove );
			canvas.removeEventListener( 'click', onClick );
			document.removeEventListener( 'keydown', onKeyDown );
		};
	}, [] ); // bind once; stateRef keeps values current

	const isRepositioning = !! repositioningObjectId;
	return (
		<div className={ `cns-objects-canvas-wrap${ isRepositioning ? ' cns-canvas--repositioning' : '' }` }>
			<canvas ref={ canvasRef } />
		</div>
	);
}
