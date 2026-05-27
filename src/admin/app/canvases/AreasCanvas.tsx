import { useRef, useEffect, useState } from '@wordpress/element';
import { drawAreasOnCanvas, findAreaAtPoint, findNodeAtPoint, applyRectangleConstraint } from '../../areas';
import { getCanvasCoords } from '../../canvas';
import type { DrawState, MapArea, Node, CanvasPoint } from '../../../types';

interface Props {
	drawState: DrawState;
	areas: MapArea[];
	selectedAreaId: number | null;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onNodesChange: ( areaId: number, nodes: Node[] ) => void;
}

interface AreasCanvasState {
	areas: MapArea[];
	selectedAreaId: number | null;
	onNodesChange: ( areaId: number, nodes: Node[] ) => void;
	repoNodeIdx: number | null;
	repoCursor: CanvasPoint | null;
}

function commitNodePosition(
	canvas: HTMLCanvasElement,
	area: MapArea,
	idx: number,
	x: number,
	y: number,
): Node[] {
	const W    = canvas.width;
	const H    = canvas.height;
	const st   = area.shape_type || 'POLYGON';
	const newX = x / W;
	const newY = y / H;
	let updated = area.nodes.map( ( n ) => ( { ...n } ) );

	if ( st === 'RECTANGLE' ) {
		updated = applyRectangleConstraint( updated, idx, newX, newY ) || updated;
	} else if ( st === 'CIRCLE' && idx === 0 ) {
		const dx = newX - updated[ 0 ].x;
		const dy = newY - updated[ 0 ].y;
		updated[ 0 ] = { x: newX, y: newY };
		if ( updated[ 1 ] ) updated[ 1 ] = { x: updated[ 1 ].x + dx, y: updated[ 1 ].y + dy };
	} else {
		updated[ idx ] = { x: newX, y: newY };
	}
	return updated;
}

export default function AreasCanvas( {
	drawState, areas, selectedAreaId,
	onSelect, onDeselect, onNodesChange,
}: Props ) {
	const canvasRef = useRef<HTMLCanvasElement>( null );

	const [ repoNodeIdx, setRepoNodeIdx ] = useState<number | null>( null );
	const [ repoCursor,  setRepoCursor  ] = useState<CanvasPoint | null>( null );

	const stateRef = useRef<AreasCanvasState>( {
		areas: [],
		selectedAreaId: null,
		onNodesChange,
		repoNodeIdx: null,
		repoCursor: null,
	} );
	stateRef.current = { areas, selectedAreaId, onNodesChange, repoNodeIdx, repoCursor };

	// ── Draw ────────────────────────────────────────────────────────────────────

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		drawAreasOnCanvas( canvas, drawState, areas, selectedAreaId, repoNodeIdx, repoCursor );
	} );

	// ── JSX event handlers — always read current props/state, no stale closures ──

	function handleMouseMove( e: React.MouseEvent<HTMLCanvasElement> ) {
		if ( repoNodeIdx === null ) return;
		setRepoCursor( getCanvasCoords( canvasRef.current!, e.nativeEvent ) );
	}

	function handleClick( e: React.MouseEvent<HTMLCanvasElement> ) {
		const canvas = canvasRef.current!;
		const { x, y } = getCanvasCoords( canvas, e.nativeEvent );
		const ctx = canvas.getContext( '2d' )!;
		const W   = canvas.width;
		const H   = canvas.height;

		if ( repoNodeIdx !== null ) {
			const area = areas.find( ( a ) => a.id === selectedAreaId );
			if ( area ) {
				onNodesChange?.( selectedAreaId!, commitNodePosition( canvas, area, repoNodeIdx, x, y ) );
			}
			setRepoNodeIdx( null );
			setRepoCursor( null );
			return;
		}

		const selArea = selectedAreaId ? areas.find( ( a ) => a.id === selectedAreaId ) : null;
		if ( selArea ) {
			const nIdx = findNodeAtPoint( ctx, x, y, selArea.nodes || [], W, H );
			if ( nIdx !== -1 ) {
				setRepoNodeIdx( nIdx );
				setRepoCursor( { x, y } );
				return;
			}
		}

		const hitArea = findAreaAtPoint( ctx, x, y, areas, W, H );
		if ( hitArea ) { onSelect?.( hitArea.id ); return; }

		if ( selArea ) {
			const st = selArea.shape_type || 'POLYGON';
			if ( st !== 'RECTANGLE' && st !== 'CIRCLE' ) {
				onNodesChange?.( selectedAreaId!, [ ...selArea.nodes, { x: x / W, y: y / H } ] );
			}
			return;
		}

		onDeselect?.();
	}

	// ── document keydown — bind once; reads live values via stateRef ─────────────

	useEffect( () => {
		function onKeyDown( e: KeyboardEvent ) {
			const areasActive = document.querySelector( '[data-panel="areas"].cns-tab-panel--active' );
			if ( ! areasActive ) return;
			const { areas: areaList, selectedAreaId: selId, onNodesChange: onChange,
				repoNodeIdx: nodeIdx, repoCursor: cursor } = stateRef.current;

			if ( e.key === 'Enter' && nodeIdx !== null && cursor ) {
				const area = areaList.find( ( a ) => a.id === selId );
				if ( area && selId !== null ) {
					onChange?.( selId, commitNodePosition( canvasRef.current!, area, nodeIdx, cursor.x, cursor.y ) );
				}
			}
			if ( e.key === 'Escape' || e.key === 'Enter' ) {
				setRepoNodeIdx( null );
				setRepoCursor( null );
			}
		}

		document.addEventListener( 'keydown', onKeyDown );
		return () => document.removeEventListener( 'keydown', onKeyDown );
	}, [] );

	const isRepositioning = repoNodeIdx !== null;
	return (
		<div className={ `cns-objects-canvas-wrap${ isRepositioning ? ' cns-canvas--repositioning' : '' }` }>
			<canvas
				ref={ canvasRef }
				onClick={ handleClick }
				onMouseMove={ handleMouseMove }
			/>
		</div>
	);
}
