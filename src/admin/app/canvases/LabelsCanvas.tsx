import { useRef, useEffect } from '@wordpress/element';
import { drawLabelsOnCanvas, findLabelPartAtPoint, isTypingTarget } from '../../labels';
import { getCanvasCoords } from '../../canvas';
import type { DrawState, MapLabel, CanvasPoint } from '../../../types';

/**
 * Interaction model: click a label part to pick it up, it follows the
 * cursor, click again to drop (Escape cancels).
 *
 *  - 'box'    — the text box. Centered labels move their anchor; indicator
 *               labels move only the box (offset), the dot stays put.
 *  - 'anchor' — the indicator dot; moves only the dot, the box stays put.
 *  - 'whole'  — anchor + box together (offset kept). Used by the
 *               "Reposition" button in the context panel.
 */
type DragPart = 'box' | 'anchor' | 'whole';

interface DragState {
	id: number;
	part: DragPart;
	preview: MapLabel;
}

export interface LabelGeometry {
	x: number;
	y: number;
	offset_x: number;
	offset_y: number;
}

interface Props {
	drawState: DrawState;
	labels: MapLabel[];
	selectedLabelId: number | null;
	repositioningLabelId: number | null;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onGeometryUpdate: ( id: number, geometry: Partial<LabelGeometry> ) => Promise<void>;
	onRepositionComplete: () => void;
}

interface CanvasState {
	labels: MapLabel[];
	selectedLabelId: number | null;
}

function applyDragCursor( label: MapLabel, part: DragPart, cursor: CanvasPoint ): MapLabel {
	if ( label.placement !== 'indicator' || part === 'whole' ) {
		// Centered labels and whole-label moves: the anchor follows the
		// cursor; in indicator mode the box tags along via the offset.
		return { ...label, x: Math.round( cursor.x ), y: Math.round( cursor.y ) };
	}
	if ( part === 'box' ) {
		// Box follows the cursor, dot stays: cursor becomes anchor + offset.
		return {
			...label,
			offset_x: Math.round( cursor.x - label.x ),
			offset_y: Math.round( cursor.y - label.y ),
		};
	}
	// part === 'anchor': dot follows the cursor, box stays at its absolute
	// position, so the offset compensates.
	const boxX = label.x + label.offset_x;
	const boxY = label.y + label.offset_y;
	return {
		...label,
		x:        Math.round( cursor.x ),
		y:        Math.round( cursor.y ),
		offset_x: Math.round( boxX - cursor.x ),
		offset_y: Math.round( boxY - cursor.y ),
	};
}

export default function LabelsCanvas( {
	drawState, labels, selectedLabelId,
	repositioningLabelId,
	onSelect, onDeselect, onGeometryUpdate, onRepositionComplete,
}: Props ) {
	const canvasRef  = useRef<HTMLCanvasElement>( null );
	const stateRef   = useRef<CanvasState>( { labels: [], selectedLabelId: null } );
	stateRef.current = { labels, selectedLabelId };

	const dragRef = useRef<DragState | null>( null );

	// ── Draw ────────────────────────────────────────────────────────────────────

	function redraw() {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		const { labels: lbls, selectedLabelId: selId } = stateRef.current;
		const drag = dragRef.current;
		const list = drag
			? lbls.map( ( l ) => ( l.id === drag.id ? drag.preview : l ) )
			: lbls;
		drawLabelsOnCanvas( canvas, drawState, list, selId );
	}

	useEffect( () => {
		redraw();
	} ); // run after every render

	// The context panel's "Reposition" button starts a whole-label drag.
	useEffect( () => {
		if ( ! repositioningLabelId ) return;
		const label = stateRef.current.labels.find( ( l ) => l.id === repositioningLabelId );
		if ( label ) {
			dragRef.current = { id: label.id, part: 'whole', preview: label };
			redraw();
		}
	}, [ repositioningLabelId ] );

	// ── Events ──────────────────────────────────────────────────────────────────

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;

		function endDrag() {
			dragRef.current = null;
			canvas!.style.cursor = '';
			onRepositionComplete?.();
		}

		function onMouseMove( e: MouseEvent ) {
			const drag = dragRef.current;
			if ( ! drag ) {
				// Hover feedback: show a grab cursor over draggable parts.
				const ctx = canvas!.getContext( '2d' )!;
				const c   = getCanvasCoords( canvas!, e );
				canvas!.style.cursor = findLabelPartAtPoint( ctx, c.x, c.y, stateRef.current.labels )
					? 'grab'
					: '';
				return;
			}
			const label = stateRef.current.labels.find( ( l ) => l.id === drag.id );
			if ( ! label ) { endDrag(); return; }
			drag.preview = applyDragCursor( label, drag.part, getCanvasCoords( canvas!, e ) );
			redraw();
		}

		async function onClick( e: MouseEvent ) {
			const coords = getCanvasCoords( canvas!, e );
			const ctx    = canvas!.getContext( '2d' )!;
			const drag   = dragRef.current;

			// Drop: commit the previewed geometry.
			if ( drag ) {
				const label = stateRef.current.labels.find( ( l ) => l.id === drag.id );
				if ( label ) {
					const p = applyDragCursor( label, drag.part, coords );
					endDrag();
					await onGeometryUpdate?.( drag.id, {
						x: p.x, y: p.y, offset_x: p.offset_x, offset_y: p.offset_y,
					} );
				} else {
					endDrag();
				}
				return;
			}

			// Pick up: clicking a label part selects it and starts the drag.
			const hit = findLabelPartAtPoint( ctx, coords.x, coords.y, stateRef.current.labels );
			if ( hit ) {
				onSelect?.( hit.label.id );
				dragRef.current = { id: hit.label.id, part: hit.part, preview: hit.label };
				canvas!.style.cursor = 'grabbing';
				redraw();
			} else {
				onDeselect?.();
			}
		}

		function onKeyDown( e: KeyboardEvent ) {
			if ( e.key === 'Escape' ) {
				if ( dragRef.current ) {
					endDrag();
					redraw();
				} else if ( stateRef.current.selectedLabelId ) {
					onDeselect?.();
				}
				return;
			}

			// Enter = place. Skip form fields and focused buttons/links, where
			// Enter already has a job (typing, activating the control).
			if ( e.key !== 'Enter' || isTypingTarget( e ) ) return;
			if ( ( e.target as HTMLElement | null )?.closest?.( 'button, a' ) ) return;

			const drag = dragRef.current;
			if ( drag ) {
				// Drop at the current preview position (last cursor position).
				e.preventDefault();
				const p = drag.preview;
				endDrag();
				redraw();
				void onGeometryUpdate?.( drag.id, {
					x: p.x, y: p.y, offset_x: p.offset_x, offset_y: p.offset_y,
				} );
			} else if ( stateRef.current.selectedLabelId ) {
				// Pick up the selected label (whole-label move); Enter again drops.
				e.preventDefault();
				const label = stateRef.current.labels.find(
					( l ) => l.id === stateRef.current.selectedLabelId
				);
				if ( label ) {
					dragRef.current = { id: label.id, part: 'whole', preview: label };
					canvas!.style.cursor = 'grabbing';
					redraw();
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

	return (
		<div className="cns-objects-canvas-wrap">
			<canvas ref={ canvasRef } />
		</div>
	);
}
