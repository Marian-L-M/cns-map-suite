import { useRef, useEffect } from '@wordpress/element';
import { drawObjectsOnCanvas, findObjectAtPoint } from '../../objects';
import { getCanvasCoords } from '../../canvas';
import type { DrawState, MapObject, CanvasPoint } from '../../../types';

interface Props {
	drawState: DrawState;
	objects: MapObject[];
	selectedObjectId: number | null;
	repositioningObjectId: number | null;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onPositionUpdate: ( id: number, x: number, y: number ) => Promise<void>;
	onRepositionComplete: () => void;
}

interface CanvasState {
	objects: MapObject[];
	selectedObjectId: number | null;
	repositioningObjectId: number | null;
}

export default function ObjectsCanvas( {
	drawState, objects, selectedObjectId,
	repositioningObjectId,
	onSelect, onDeselect, onPositionUpdate, onRepositionComplete,
}: Props ) {
	const canvasRef  = useRef<HTMLCanvasElement>( null );
	const stateRef   = useRef<CanvasState>( { objects: [], selectedObjectId: null, repositioningObjectId: null } );
	stateRef.current = { objects, selectedObjectId, repositioningObjectId };

	const repoLocalRef = useRef<{ cursor: CanvasPoint | null }>( { cursor: null } );

	// ── Draw ────────────────────────────────────────────────────────────────────

	function redraw( repoId: number | null, repoCursor: CanvasPoint | null ) {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		const { objects: objs } = stateRef.current;
		drawObjectsOnCanvas( canvas, drawState, objs, stateRef.current.selectedObjectId, repoId, repoCursor );
	}

	useEffect( () => {
		redraw( repositioningObjectId, repoLocalRef.current.cursor );
	} ); // run after every render

	// ── Events ──────────────────────────────────────────────────────────────────

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;

		function onMouseMove( e: MouseEvent ) {
			const { repositioningObjectId: repoId } = stateRef.current;
			if ( ! repoId ) return;
			repoLocalRef.current.cursor = getCanvasCoords( canvas!, e );
			redraw( repoId, repoLocalRef.current.cursor );
		}

		async function onClick( e: MouseEvent ) {
			const coords = getCanvasCoords( canvas!, e );
			const ctx    = canvas!.getContext( '2d' )!;
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

		function onKeyDown( e: KeyboardEvent ) {
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
