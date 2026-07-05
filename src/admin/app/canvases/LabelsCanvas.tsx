import { useRef, useEffect } from '@wordpress/element';
import { drawLabelsOnCanvas, findLabelAtPoint } from '../../labels';
import { getCanvasCoords } from '../../canvas';
import type { DrawState, MapLabel, CanvasPoint } from '../../../types';

interface Props {
	drawState: DrawState;
	labels: MapLabel[];
	selectedLabelId: number | null;
	repositioningLabelId: number | null;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onPositionUpdate: ( id: number, x: number, y: number ) => Promise<void>;
	onRepositionComplete: () => void;
}

interface CanvasState {
	labels: MapLabel[];
	selectedLabelId: number | null;
	repositioningLabelId: number | null;
}

export default function LabelsCanvas( {
	drawState, labels, selectedLabelId,
	repositioningLabelId,
	onSelect, onDeselect, onPositionUpdate, onRepositionComplete,
}: Props ) {
	const canvasRef  = useRef<HTMLCanvasElement>( null );
	const stateRef   = useRef<CanvasState>( { labels: [], selectedLabelId: null, repositioningLabelId: null } );
	stateRef.current = { labels, selectedLabelId, repositioningLabelId };

	const repoLocalRef = useRef<{ cursor: CanvasPoint | null }>( { cursor: null } );

	// ── Draw ────────────────────────────────────────────────────────────────────

	function redraw( repoId: number | null, repoCursor: CanvasPoint | null ) {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		drawLabelsOnCanvas( canvas, drawState, stateRef.current.labels, stateRef.current.selectedLabelId, repoId, repoCursor );
	}

	useEffect( () => {
		redraw( repositioningLabelId, repoLocalRef.current.cursor );
	} ); // run after every render

	// ── Events ──────────────────────────────────────────────────────────────────

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;

		function onMouseMove( e: MouseEvent ) {
			const { repositioningLabelId: repoId } = stateRef.current;
			if ( ! repoId ) return;
			repoLocalRef.current.cursor = getCanvasCoords( canvas!, e );
			redraw( repoId, repoLocalRef.current.cursor );
		}

		async function onClick( e: MouseEvent ) {
			const coords = getCanvasCoords( canvas!, e );
			const ctx    = canvas!.getContext( '2d' )!;
			const { labels: lbls, selectedLabelId: selId, repositioningLabelId: repoId } = stateRef.current;

			if ( repoId ) {
				repoLocalRef.current.cursor = null;
				onRepositionComplete?.();
				await onPositionUpdate?.( repoId, coords.x, coords.y );
				return;
			}

			const hit = findLabelAtPoint( ctx, coords.x, coords.y, lbls );
			if ( hit ) {
				onSelect?.( hit.id );
			} else if ( selId ) {
				await onPositionUpdate?.( selId, coords.x, coords.y );
			} else {
				onDeselect?.();
			}
		}

		function onKeyDown( e: KeyboardEvent ) {
			const { repositioningLabelId: repoId, selectedLabelId: selId } = stateRef.current;
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

	const isRepositioning = !! repositioningLabelId;
	return (
		<div className={ `cns-objects-canvas-wrap${ isRepositioning ? ' cns-canvas--repositioning' : '' }` }>
			<canvas ref={ canvasRef } />
		</div>
	);
}
