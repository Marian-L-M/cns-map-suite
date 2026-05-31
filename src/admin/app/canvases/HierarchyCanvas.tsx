import { useRef, useEffect, useState } from '@wordpress/element';
import { drawAreasOnCanvas, findAreaAtPoint, findNodeAtPoint, applyRectangleConstraint } from '../../areas';
import { drawMapCanvas, getCanvasCoords } from '../../canvas';
import type { DrawState, HierarchyRegion, Node, CanvasPoint, HierarchyCanvasStyles } from '../../../types';

interface Props {
	drawState: DrawState;
	regions: HierarchyRegion[];
	selectedRegionId: number | null;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onNodesChange: ( regionId: number, nodes: Node[] ) => void;
}

interface CanvasState {
	regions: HierarchyRegion[];
	selectedRegionId: number | null;
	onNodesChange: ( regionId: number, nodes: Node[] ) => void;
	repoNodeIdx: number | null;
	repoCursor: CanvasPoint | null;
}

const NODE_HALF = 5;

function buildPolygonPath( ctx: CanvasRenderingContext2D, nodes: Node[], W: number, H: number ) {
	ctx.moveTo( nodes[ 0 ].x * W, nodes[ 0 ].y * H );
	for ( let i = 1; i < nodes.length; i++ ) {
		ctx.lineTo( nodes[ i ].x * W, nodes[ i ].y * H );
	}
	ctx.closePath();
}

function drawRegion(
	ctx: CanvasRenderingContext2D,
	region: HierarchyRegion,
	W: number,
	H: number,
	isSelected: boolean,
	repoNodeIdx: number | null,
	repoCursor: CanvasPoint | null,
): void {
	const nodes = region.nodes || [];
	if ( nodes.length < 3 ) return;

	// Apply live cursor position for the node being dragged.
	let liveNodes = nodes;
	if ( isSelected && repoNodeIdx !== null && repoCursor ) {
		liveNodes = nodes.map( ( n ) => ( { ...n } ) );
		liveNodes[ repoNodeIdx ] = { x: repoCursor.x / W, y: repoCursor.y / H };
	}

	const styles: HierarchyCanvasStyles = region.canvas_styles || {};
	const fill        = styles.fill        || '#e8a020';
	const fillOpacity = styles.fillOpacity ?? 0.25;
	const stroke      = styles.stroke      || '#e8a020';
	const strokeWidth = styles.strokeWidth || 2;

	ctx.beginPath();
	buildPolygonPath( ctx, liveNodes, W, H );

	ctx.save();
	ctx.globalAlpha = fillOpacity;
	ctx.fillStyle   = fill;
	ctx.fill();
	ctx.restore();

	ctx.strokeStyle = stroke;
	ctx.lineWidth   = isSelected ? Math.max( strokeWidth, 2 ) : strokeWidth;
	ctx.stroke();

	// Label: child map title centred inside region.
	if ( region.child_map_title ) {
		const cx = liveNodes.reduce( ( s, n ) => s + n.x, 0 ) / liveNodes.length * W;
		const cy = liveNodes.reduce( ( s, n ) => s + n.y, 0 ) / liveNodes.length * H;
		ctx.save();
		ctx.font         = 'bold 12px sans-serif';
		ctx.textAlign    = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle    = '#fff';
		ctx.strokeStyle  = 'rgba(0,0,0,0.6)';
		ctx.lineWidth    = 3;
		ctx.strokeText( region.child_map_title, cx, cy );
		ctx.fillText( region.child_map_title, cx, cy );
		ctx.restore();
	}

	if ( ! isSelected ) return;

	// Node handles.
	liveNodes.forEach( ( node, idx ) => {
		ctx.beginPath();
		ctx.rect( node.x * W - NODE_HALF, node.y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2 );
		ctx.strokeStyle = repoNodeIdx === idx ? '#e75252' : '#e8a020';
		ctx.lineWidth   = 2;
		ctx.stroke();
	} );
}

async function drawHierarchyCanvas(
	canvas: HTMLCanvasElement,
	drawState: DrawState,
	regions: HierarchyRegion[],
	selectedRegionId: number | null,
	repoNodeIdx: number | null,
	repoCursor: CanvasPoint | null,
): Promise<void> {
	await drawMapCanvas( canvas, drawState );
	const ctx = canvas.getContext( '2d' )!;
	const W   = canvas.width;
	const H   = canvas.height;
	for ( const region of regions ) {
		const isSel = region.id === selectedRegionId;
		drawRegion( ctx, region, W, H, isSel,
			isSel ? repoNodeIdx : null,
			isSel ? repoCursor  : null,
		);
	}
}

function findRegionAtPoint(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	regions: HierarchyRegion[],
	W: number,
	H: number,
): HierarchyRegion | null {
	for ( let i = regions.length - 1; i >= 0; i-- ) {
		const r     = regions[ i ];
		const nodes = r.nodes || [];
		if ( nodes.length < 3 ) continue;
		ctx.beginPath();
		buildPolygonPath( ctx, nodes, W, H );
		if ( ctx.isPointInPath( x, y ) ) return r;
	}
	return null;
}

function findNodeAtPointLocal(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	nodes: Node[],
	W: number,
	H: number,
): number {
	for ( let i = nodes.length - 1; i >= 0; i-- ) {
		ctx.beginPath();
		ctx.rect( nodes[ i ].x * W - NODE_HALF, nodes[ i ].y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2 );
		if ( ctx.isPointInPath( x, y ) ) return i;
	}
	return -1;
}

export default function HierarchyCanvas( {
	drawState, regions, selectedRegionId,
	onSelect, onDeselect, onNodesChange,
}: Props ) {
	const canvasRef = useRef<HTMLCanvasElement>( null );

	const [ repoNodeIdx, setRepoNodeIdx ] = useState<number | null>( null );
	const [ repoCursor,  setRepoCursor  ] = useState<CanvasPoint | null>( null );

	const stateRef = useRef<CanvasState>( {
		regions: [], selectedRegionId: null, onNodesChange,
		repoNodeIdx: null, repoCursor: null,
	} );
	stateRef.current = { regions, selectedRegionId, onNodesChange, repoNodeIdx, repoCursor };

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		drawHierarchyCanvas( canvas, drawState, regions, selectedRegionId, repoNodeIdx, repoCursor );
	} );

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
			const region = regions.find( ( r ) => r.id === selectedRegionId );
			if ( region && selectedRegionId !== null ) {
				const updated = region.nodes.map( ( n ) => ( { ...n } ) );
				updated[ repoNodeIdx ] = { x: x / W, y: y / H };
				onNodesChange( selectedRegionId, updated );
			}
			setRepoNodeIdx( null );
			setRepoCursor( null );
			return;
		}

		const selRegion = selectedRegionId ? regions.find( ( r ) => r.id === selectedRegionId ) : null;
		if ( selRegion ) {
			const nIdx = findNodeAtPointLocal( ctx, x, y, selRegion.nodes || [], W, H );
			if ( nIdx !== -1 ) {
				setRepoNodeIdx( nIdx );
				setRepoCursor( { x, y } );
				return;
			}
		}

		const hitRegion = findRegionAtPoint( ctx, x, y, regions, W, H );
		if ( hitRegion ) { onSelect( hitRegion.id ); return; }

		// Click empty space on selected region: add node.
		if ( selRegion ) {
			onNodesChange( selectedRegionId!, [ ...selRegion.nodes, { x: x / W, y: y / H } ] );
			return;
		}

		onDeselect();
	}

	useEffect( () => {
		function onKeyDown( e: KeyboardEvent ) {
			const hierarchyActive = document.querySelector( '[data-panel="hierarchy"].cns-tab-panel--active' );
			if ( ! hierarchyActive ) return;
			const { regions: regionList, selectedRegionId: selId, onNodesChange: onChange,
				repoNodeIdx: nodeIdx, repoCursor: cursor } = stateRef.current;

			if ( e.key === 'Enter' && nodeIdx !== null && cursor ) {
				const region = regionList.find( ( r ) => r.id === selId );
				if ( region && selId !== null ) {
					const updated = region.nodes.map( ( n ) => ( { ...n } ) );
					updated[ nodeIdx ] = { x: cursor.x / canvasRef.current!.width, y: cursor.y / canvasRef.current!.height };
					onChange( selId, updated );
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
