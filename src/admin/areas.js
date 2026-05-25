import { drawMapCanvas } from './canvas.js';

const NODE_HALF = 5;

// ── Path builders ─────────────────────────────────────────────────────────────

function buildPolygonPath( ctx, nodes, W, H ) {
	ctx.moveTo( nodes[ 0 ].x * W, nodes[ 0 ].y * H );
	for ( let i = 1; i < nodes.length; i++ ) {
		ctx.lineTo( nodes[ i ].x * W, nodes[ i ].y * H );
	}
	ctx.closePath();
}

function buildBezierPath( ctx, nodes, W, H ) {
	const n      = nodes.length;
	const startX = ( nodes[ n - 1 ].x + nodes[ 0 ].x ) / 2 * W;
	const startY = ( nodes[ n - 1 ].y + nodes[ 0 ].y ) / 2 * H;
	ctx.moveTo( startX, startY );
	for ( let i = 0; i < n; i++ ) {
		const cp   = nodes[ i ];
		const next = nodes[ ( i + 1 ) % n ];
		ctx.quadraticCurveTo( cp.x * W, cp.y * H, ( cp.x + next.x ) / 2 * W, ( cp.y + next.y ) / 2 * H );
	}
	ctx.closePath();
}

function buildCirclePath( ctx, nodes, W, H ) {
	const cx = nodes[ 0 ].x * W;
	const cy = nodes[ 0 ].y * H;
	const rx = Math.max( Math.abs( nodes[ 1 ].x - nodes[ 0 ].x ) * W, 1 );
	const ry = Math.max( Math.abs( nodes[ 1 ].y - nodes[ 0 ].y ) * H, 1 );
	ctx.ellipse( cx, cy, rx, ry, 0, 0, Math.PI * 2 );
}

function buildAreaPathFromNodes( ctx, nodes, shapeType, W, H ) {
	ctx.beginPath();
	if ( ! nodes.length ) return;
	switch ( shapeType ) {
		case 'BEZIER':
			if ( nodes.length >= 3 ) buildBezierPath( ctx, nodes, W, H );
			break;
		case 'CIRCLE':
			if ( nodes.length >= 2 ) buildCirclePath( ctx, nodes, W, H );
			break;
		case 'RECTANGLE':
		default:
			if ( nodes.length >= 3 ) buildPolygonPath( ctx, nodes, W, H );
			break;
	}
}

// ── Shape helpers ─────────────────────────────────────────────────────────────

// Nodes are TL(0) TR(1) BR(2) BL(3); adjacent pairs share one axis.
export function applyRectangleConstraint( nodes, movedIdx, newX, newY ) {
	if ( nodes.length !== 4 ) return null;
	const n = nodes.map( ( nd ) => ( { ...nd } ) );
	n[ movedIdx ] = { x: newX, y: newY };
	switch ( movedIdx ) {
		case 0: n[ 1 ].y = newY; n[ 3 ].x = newX; break;
		case 1: n[ 0 ].y = newY; n[ 2 ].x = newX; break;
		case 2: n[ 3 ].y = newY; n[ 1 ].x = newX; break;
		case 3: n[ 2 ].y = newY; n[ 0 ].x = newX; break;
	}
	return n;
}

export function getDefaultNodes( shapeType ) {
	if ( shapeType === 'CIRCLE' ) {
		return [ { x: 0.5, y: 0.5 }, { x: 0.7, y: 0.65 } ];
	}
	return [
		{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 },
		{ x: 0.75, y: 0.75 }, { x: 0.25, y: 0.75 },
	];
}

export function normalizeNodesForShapeType( nodes, shapeType ) {
	if ( shapeType === 'RECTANGLE' ) {
		return nodes.length === 4 ? nodes : getDefaultNodes( 'RECTANGLE' );
	}
	if ( shapeType === 'CIRCLE' ) {
		if ( nodes.length >= 2 ) return nodes.slice( 0, 2 );
		if ( nodes.length === 1 ) return [ nodes[ 0 ], { x: nodes[ 0 ].x + 0.2, y: nodes[ 0 ].y + 0.15 } ];
		return getDefaultNodes( 'CIRCLE' );
	}
	return nodes;
}

function getLiveNodes( nodes, shapeType, movingIdx, cursor, W, H ) {
	if ( movingIdx === null || ! cursor ) return nodes;
	const newX = cursor.x / W;
	const newY = cursor.y / H;
	if ( shapeType === 'RECTANGLE' ) {
		return applyRectangleConstraint( nodes, movingIdx, newX, newY ) || nodes;
	}
	const live = nodes.map( ( n ) => ( { ...n } ) );
	if ( shapeType === 'CIRCLE' && movingIdx === 0 ) {
		const dx = newX - nodes[ 0 ].x;
		const dy = newY - nodes[ 0 ].y;
		live[ 0 ] = { x: newX, y: newY };
		if ( live[ 1 ] ) live[ 1 ] = { x: nodes[ 1 ].x + dx, y: nodes[ 1 ].y + dy };
	} else {
		live[ movingIdx ] = { x: newX, y: newY };
	}
	return live;
}

// ── Canvas rendering ──────────────────────────────────────────────────────────

// repoNodeIdx / repoCursor are only meaningful when isSelected === true.
export function drawAreaShape( ctx, area, W, H, isSelected, repoNodeIdx, repoCursor ) {
	const rawNodes  = area.nodes || [];
	if ( ! rawNodes.length ) return;
	const shapeType = area.shape_type || 'POLYGON';
	const liveNodes = isSelected
		? getLiveNodes( rawNodes, shapeType, repoNodeIdx ?? null, repoCursor ?? null, W, H )
		: rawNodes;

	const minNodes = shapeType === 'CIRCLE' ? 2 : 3;

	if ( liveNodes.length >= minNodes ) {
		const styles      = area.canvas_styles || {};
		const fill        = styles.fill        || '#2271b1';
		const fillOpacity = styles.fillOpacity ?? 0.3;
		const stroke      = styles.stroke      || '#2271b1';
		const strokeWidth = styles.strokeWidth || 2;

		buildAreaPathFromNodes( ctx, liveNodes, shapeType, W, H );

		ctx.save();
		ctx.globalAlpha = fillOpacity;
		ctx.fillStyle   = fill;
		ctx.fill();
		ctx.restore();

		ctx.strokeStyle = stroke;
		ctx.lineWidth   = isSelected ? Math.max( strokeWidth, 2 ) : strokeWidth;
		ctx.stroke();
	}

	if ( ! isSelected ) return;

	liveNodes.forEach( ( node, idx ) => {
		const isRepoNode = ( repoNodeIdx === idx );
		ctx.beginPath();
		ctx.rect( node.x * W - NODE_HALF, node.y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2 );
		ctx.strokeStyle = isRepoNode ? '#e75252' : '#2271b1';
		ctx.lineWidth   = 2;
		ctx.stroke();
	} );
}

export async function drawAreasOnCanvas( canvas, drawState, areas, selectedAreaId, repoNodeIdx, repoCursor ) {
	await drawMapCanvas( canvas, drawState );
	const ctx = canvas.getContext( '2d' );
	const W   = canvas.width;
	const H   = canvas.height;
	for ( const area of areas ) {
		const isSel = area.id === selectedAreaId;
		drawAreaShape( ctx, area, W, H, isSel,
			isSel ? repoNodeIdx : null,
			isSel ? repoCursor  : null,
		);
	}
}

// ── Hit detection ─────────────────────────────────────────────────────────────

export function findNodeAtPoint( ctx, x, y, nodes, W, H ) {
	for ( let i = nodes.length - 1; i >= 0; i-- ) {
		ctx.beginPath();
		ctx.rect( nodes[ i ].x * W - NODE_HALF, nodes[ i ].y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2 );
		if ( ctx.isPointInPath( x, y ) ) return i;
	}
	return -1;
}

export function findAreaAtPoint( ctx, x, y, areas, W, H ) {
	for ( let i = areas.length - 1; i >= 0; i-- ) {
		const area      = areas[ i ];
		const nodes     = area.nodes || [];
		const shapeType = area.shape_type || 'POLYGON';
		const minNodes  = shapeType === 'CIRCLE' ? 2 : 3;
		if ( nodes.length < minNodes ) continue;
		buildAreaPathFromNodes( ctx, nodes, shapeType, W, H );
		if ( ctx.isPointInPath( x, y ) ) return area;
	}
	return null;
}
