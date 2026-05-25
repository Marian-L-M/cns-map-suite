import { apiFetch, esc, nextFormUid, initFormPostSearch } from './utils.js';
import { drawMapCanvas, collectDrawState, getCanvasCoords } from './canvas.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const NODE_HALF = 5;

// ── State ─────────────────────────────────────────────────────────────────────

export let areasList         = [];
export let areasInitialized  = false;
let selectedAreaId       = null;
let repositioningNodeIdx = null;
let nodeRepoCursor       = null;
let areaPanelController  = null;

// ── Context callbacks (injected by index.js to avoid circular deps) ───────────

let _showCtxPanel = null;
let _hideCtxPanel = null;

export function setContextCallbacks( show, hide ) {
	_showCtxPanel = show;
	_hideCtxPanel = hide;
}

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
function applyRectangleConstraint( nodes, movedIdx, newX, newY ) {
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

function getDefaultNodes( shapeType ) {
	if ( shapeType === 'CIRCLE' ) {
		return [ { x: 0.5, y: 0.5 }, { x: 0.7, y: 0.65 } ];
	}
	return [
		{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 },
		{ x: 0.75, y: 0.75 }, { x: 0.25, y: 0.75 },
	];
}

function normalizeNodesForShapeType( nodes, shapeType ) {
	if ( shapeType === 'RECTANGLE' ) {
		return nodes.length === 4 ? nodes : getDefaultNodes( 'RECTANGLE' );
	}
	if ( shapeType === 'CIRCLE' ) {
		if ( nodes.length >= 2 ) return nodes.slice( 0, 2 );
		if ( nodes.length === 1 ) return [ nodes[ 0 ], { x: nodes[ 0 ].x + 0.2, y: nodes[ 0 ].y + 0.15 } ];
		return getDefaultNodes( 'CIRCLE' );
	}
	return nodes; // POLYGON and BEZIER keep all nodes
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

export function drawAreaShape( ctx, area, W, H, isSelected ) {
	const rawNodes  = area.nodes || [];
	if ( ! rawNodes.length ) return;
	const shapeType = area.shape_type || 'POLYGON';
	const liveNodes = isSelected
		? getLiveNodes( rawNodes, shapeType, repositioningNodeIdx, nodeRepoCursor, W, H )
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
		const isRepoNode = ( repositioningNodeIdx === idx );
		ctx.beginPath();
		ctx.rect( node.x * W - NODE_HALF, node.y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2 );
		ctx.strokeStyle = isRepoNode ? '#e75252' : '#2271b1';
		ctx.lineWidth   = 2;
		ctx.stroke();
	} );
}

export async function drawAreasCanvas() {
	const canvas = document.getElementById( 'cns-areas-canvas' );
	if ( ! canvas ) return;
	await drawMapCanvas( canvas, collectDrawState() );
	const ctx = canvas.getContext( '2d' );
	const W   = canvas.width;
	const H   = canvas.height;
	for ( const area of areasList ) {
		drawAreaShape( ctx, area, W, H, area.id === selectedAreaId );
	}
}

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

// ── Area form ─────────────────────────────────────────────────────────────────

export function buildAreaFormHTML() {
	const u = nextFormUid();
	return (
		'<section class="cns-modal-section">' +
		'<h3>Details</h3>' +
		'<div class="cns-form-grid">' +
		'  <div class="cns-form-row cns-form-row--full"><label>Title</label><input type="text" data-field="title" class="large-text" /></div>' +
		'  <div class="cns-form-row"><label>Type</label><select data-field="type">' +
		'    <option value="GEOGRAPHY">Geography</option><option value="HISTORY">History</option>' +
		'    <option value="NATURAL">Natural</option><option value="EVENT">Event</option><option value="OTHER">Other</option>' +
		'  </select></div>' +
		'  <div class="cns-form-row"><label>Shape</label><select data-field="shape-type">' +
		'    <option value="POLYGON">Polygon (Nodes)</option>' +
		'    <option value="RECTANGLE">Rectangle</option>' +
		'    <option value="BEZIER">Bezier Curve</option>' +
		'    <option value="CIRCLE">Circle / Oval</option>' +
		'  </select></div>' +
		'  <div class="cns-form-row"><label>Object Time</label><input type="number" data-field="object-time" class="small-text" value="0" /></div>' +
		'</div></section>' +

		'<section class="cns-modal-section">' +
		'<h3>Infobox</h3>' +
		'<div class="cns-radio-toggle">' +
		`  <label><input type="radio" name="area-ib-src-${ u }" data-field="infobox-source" value="manual" checked /> Manual</label>` +
		`  <label><input type="radio" name="area-ib-src-${ u }" data-field="infobox-source" value="post" /> From post</label>` +
		'</div>' +
		'<div data-section="infobox-manual">' +
		'  <div class="cns-form-grid">' +
		'    <div class="cns-form-row cns-form-row--full"><label>Infobox Title</label><input type="text" data-field="infobox-title" class="large-text" /></div>' +
		'    <div class="cns-form-row cns-form-row--full"><label>Description</label><textarea data-field="infobox-desc" rows="3" class="large-text"></textarea></div>' +
		'  </div>' +
		'</div>' +
		'<div data-section="infobox-post" class="cns-hidden">' +
		'  <div class="cns-form-row cns-post-search-wrap">' +
		'    <label>Search for a post</label>' +
		'    <input type="text" data-field="post-search" class="large-text" placeholder="Type to search…" autocomplete="off" />' +
		'    <div data-field="post-results" class="cns-post-results" hidden></div>' +
		'    <input type="hidden" data-field="linked-post-id" value="0" />' +
		'    <p data-field="linked-post-label" class="cns-hidden description"></p>' +
		'  </div>' +
		'</div></section>' +

		'<section class="cns-modal-section">' +
		'<h3>Design</h3>' +
		'<div class="cns-form-grid">' +
		'  <div class="cns-form-row"><label>Fill Color</label><input type="color" data-field="area-fill" value="#2271b1" /></div>' +
		'  <div class="cns-form-row"><label>Fill Opacity</label>' +
		'    <div class="cns-range-wrap">' +
		'      <input type="range" data-field="area-fill-opacity" min="0" max="1" step="0.05" value="0.3" />' +
		'      <output class="cns-range-value">0.30</output>' +
		'    </div>' +
		'  </div>' +
		'  <div class="cns-form-row"><label>Stroke Color</label><input type="color" data-field="area-stroke" value="#2271b1" /></div>' +
		'  <div class="cns-form-row"><label>Stroke Width (px)</label><input type="number" data-field="area-stroke-width" class="small-text" min="1" max="10" value="2" /></div>' +
		'</div></section>'
	);
}

export function createAreaFormController( root, { onShapeTypeChange } = {} ) {
	const q  = ( field ) => root.querySelector( `[data-field="${ field }"]` );
	const qs = ( field ) => Array.from( root.querySelectorAll( `[data-field="${ field }"]` ) );
	const getRadio = ( field )      => qs( field ).find( ( r ) => r.checked )?.value;
	const setRadio = ( field, val ) => qs( field ).forEach( ( r ) => { r.checked = r.value === val; } );

	function populate( area ) {
		if ( q( 'title' ) )       q( 'title' ).value       = area?.title       || '';
		if ( q( 'type' ) )        q( 'type' ).value         = area?.type        || 'GEOGRAPHY';
		if ( q( 'shape-type' ) )  q( 'shape-type' ).value  = area?.shape_type  || 'POLYGON';
		if ( q( 'object-time' ) ) q( 'object-time' ).value  = area?.object_time ?? 0;

		const ibSrc = area?.infobox_source || 'manual';
		setRadio( 'infobox-source', ibSrc );
		root.querySelector( '[data-section="infobox-manual"]' )?.classList.toggle( 'cns-hidden', ibSrc === 'post' );
		root.querySelector( '[data-section="infobox-post"]' )?.classList.toggle( 'cns-hidden', ibSrc !== 'post' );

		if ( q( 'infobox-title' ) ) q( 'infobox-title' ).value = area?.infobox_data?.title       || '';
		if ( q( 'infobox-desc' ) )  q( 'infobox-desc' ).value  = area?.infobox_data?.description || '';

		const linkedEl = q( 'linked-post-id' );
		if ( linkedEl ) linkedEl.value = area?.linked_post_id || '0';
		const labelEl = q( 'linked-post-label' );
		if ( labelEl ) {
			if ( area?.linked_post_id ) {
				labelEl.textContent = 'Post ID: ' + area.linked_post_id;
				labelEl.classList.remove( 'cns-hidden' );
			} else {
				labelEl.classList.add( 'cns-hidden' );
			}
		}
		const ps = q( 'post-search' ); if ( ps ) ps.value = '';
		const pr = q( 'post-results' ); if ( pr ) pr.hidden = true;

		const styles = area?.canvas_styles || {};
		if ( q( 'area-fill' ) )         q( 'area-fill' ).value         = styles.fill        || '#2271b1';
		if ( q( 'area-stroke' ) )       q( 'area-stroke' ).value       = styles.stroke      || '#2271b1';
		if ( q( 'area-stroke-width' ) ) q( 'area-stroke-width' ).value = styles.strokeWidth || 2;
		const opEl = q( 'area-fill-opacity' );
		if ( opEl ) {
			opEl.value = styles.fillOpacity ?? 0.3;
			const out = opEl.parentElement?.querySelector( 'output.cns-range-value' );
			if ( out ) out.textContent = parseFloat( opEl.value ).toFixed( 2 );
		}
	}

	function collect() {
		return {
			title:               q( 'title' )?.value       || '',
			type:                q( 'type' )?.value        || 'GEOGRAPHY',
			shape_type:          q( 'shape-type' )?.value  || 'POLYGON',
			object_time:         parseInt( q( 'object-time' )?.value, 10 ) || 0,
			infobox_source:      getRadio( 'infobox-source' ) || 'manual',
			infobox_title:       q( 'infobox-title' )?.value || '',
			infobox_description: q( 'infobox-desc' )?.value  || '',
			linked_post_id:      parseInt( q( 'linked-post-id' )?.value, 10 ) || 0,
			style_fill:          q( 'area-fill' )?.value          || '#2271b1',
			style_fill_opacity:  parseFloat( q( 'area-fill-opacity' )?.value ) || 0.3,
			style_stroke:        q( 'area-stroke' )?.value        || '#2271b1',
			style_stroke_width:  parseInt( q( 'area-stroke-width' )?.value, 10 ) || 2,
		};
	}

	function initInteractivity() {
		qs( 'infobox-source' ).forEach( ( radio ) => {
			radio.addEventListener( 'change', () => {
				const isPost = radio.value === 'post';
				root.querySelector( '[data-section="infobox-manual"]' )?.classList.toggle( 'cns-hidden', isPost );
				root.querySelector( '[data-section="infobox-post"]' )?.classList.toggle( 'cns-hidden', ! isPost );
			} );
		} );
		initFormPostSearch( root );
		const opEl  = q( 'area-fill-opacity' );
		const opOut = opEl?.parentElement?.querySelector( 'output.cns-range-value' );
		if ( opEl && opOut ) {
			opEl.addEventListener( 'input', () => {
				opOut.textContent = parseFloat( opEl.value ).toFixed( 2 );
			} );
		}
		q( 'shape-type' )?.addEventListener( 'change', () => {
			onShapeTypeChange?.( q( 'shape-type' ).value );
		} );
	}

	return { populate, collect, initInteractivity };
}

// ── Node list ─────────────────────────────────────────────────────────────────

function renderNodeList( area ) {
	const container = document.getElementById( 'cns-ctx-area-nodes' );
	if ( ! container ) return;
	const nodes     = area.nodes || [];
	const shapeType = area.shape_type || 'POLYGON';
	const isFixed   = shapeType === 'RECTANGLE' || shapeType === 'CIRCLE';

	const nodeLabels =
		shapeType === 'RECTANGLE' ? [ 'TL', 'TR', 'BR', 'BL' ] :
		shapeType === 'CIRCLE'    ? [ 'Center', 'Edge' ] : null;

	const rows = nodes.map( ( node, idx ) => {
		const xPct  = ( node.x * 100 ).toFixed( 1 );
		const yPct  = ( node.y * 100 ).toFixed( 1 );
		const label = nodeLabels ? ( nodeLabels[ idx ] ?? idx + 1 ) : ( idx + 1 );
		return `<tr>` +
			`<td class="cns-node-num">${ label }</td>` +
			`<td><input type="number" class="small-text cns-node-x" data-idx="${ idx }" value="${ xPct }" min="0" max="100" step="0.1" /></td>` +
			`<td><input type="number" class="small-text cns-node-y" data-idx="${ idx }" value="${ yPct }" min="0" max="100" step="0.1" /></td>` +
			( isFixed
				? '<td></td>'
				: `<td><button type="button" class="button button-small cns-node-del" data-idx="${ idx }">&times;</button></td>`
			) +
			`</tr>`;
	} ).join( '' );

	container.innerHTML =
		'<section class="cns-modal-section cns-nodes-section">' +
		'<h3>Nodes' +
		( isFixed ? '' : '  <button type="button" class="button button-small cns-nodes-add-btn">+ Add Node</button>' ) +
		'</h3>' +
		( nodes.length
			? `<table class="cns-nodes-table"><thead><tr><th>#</th><th>X&nbsp;%</th><th>Y&nbsp;%</th><th></th></tr></thead><tbody>${ rows }</tbody></table>`
			: '<p class="description">No nodes yet. Click the canvas to add nodes.</p>'
		) +
		'</section>';

	container.querySelectorAll( '.cns-node-x, .cns-node-y' ).forEach( ( input ) => {
		input.addEventListener( 'input', () => {
			const idx = parseInt( input.dataset.idx, 10 );
			const a   = areasList.find( ( a ) => a.id === selectedAreaId );
			if ( ! a || ! a.nodes[ idx ] ) return;
			const val = Math.max( 0, Math.min( 100, parseFloat( input.value ) || 0 ) ) / 100;
			const isX = input.classList.contains( 'cns-node-x' );

			if ( shapeType === 'RECTANGLE' ) {
				const newX    = isX ? val : a.nodes[ idx ].x;
				const newY    = isX ? a.nodes[ idx ].y : val;
				const updated = applyRectangleConstraint( a.nodes, idx, newX, newY );
				if ( updated ) {
					a.nodes = updated;
					// Update sibling inputs in-place to avoid destroying the focused input.
					updated.forEach( ( node, i ) => {
						if ( i === idx ) return;
						const rowX = container.querySelector( `.cns-node-x[data-idx="${ i }"]` );
						const rowY = container.querySelector( `.cns-node-y[data-idx="${ i }"]` );
						if ( rowX ) rowX.value = ( node.x * 100 ).toFixed( 1 );
						if ( rowY ) rowY.value = ( node.y * 100 ).toFixed( 1 );
					} );
				}
			} else if ( shapeType === 'CIRCLE' && idx === 0 ) {
				const curX = a.nodes[ 0 ].x;
				const curY = a.nodes[ 0 ].y;
				const newX = isX ? val : curX;
				const newY = isX ? curY : val;
				const dx   = newX - curX;
				const dy   = newY - curY;
				a.nodes[ 0 ] = { x: newX, y: newY };
				if ( a.nodes[ 1 ] ) {
					a.nodes[ 1 ] = { x: a.nodes[ 1 ].x + dx, y: a.nodes[ 1 ].y + dy };
					const edgeX = container.querySelector( '.cns-node-x[data-idx="1"]' );
					const edgeY = container.querySelector( '.cns-node-y[data-idx="1"]' );
					if ( edgeX ) edgeX.value = ( a.nodes[ 1 ].x * 100 ).toFixed( 1 );
					if ( edgeY ) edgeY.value = ( a.nodes[ 1 ].y * 100 ).toFixed( 1 );
				}
			} else {
				if ( isX ) a.nodes[ idx ].x = val;
				else       a.nodes[ idx ].y = val;
			}
			drawAreasCanvas();
		} );
	} );

	if ( ! isFixed ) {
		container.querySelectorAll( '.cns-node-del' ).forEach( ( btn ) => {
			btn.addEventListener( 'click', () => {
				const idx = parseInt( btn.dataset.idx, 10 );
				const a   = areasList.find( ( a ) => a.id === selectedAreaId );
				if ( ! a ) return;
				a.nodes.splice( idx, 1 );
				renderNodeList( a );
				drawAreasCanvas();
			} );
		} );

		container.querySelector( '.cns-nodes-add-btn' )?.addEventListener( 'click', () => {
			const a = areasList.find( ( a ) => a.id === selectedAreaId );
			if ( ! a ) return;
			a.nodes.push( { x: 0.5, y: 0.5 } );
			renderNodeList( a );
			drawAreasCanvas();
		} );
	}
}

// ── Area list ─────────────────────────────────────────────────────────────────

function renderAreasList( areas ) {
	const container = document.getElementById( 'cns-areas-list' );
	if ( ! container ) return;

	if ( ! areas.length ) {
		container.innerHTML = '<p class="cns-objects-empty">No areas yet. Click "Add Area" to create one.</p>';
		return;
	}

	const rows = areas.map( ( area ) =>
		`<tr data-id="${ area.id }">` +
		`<td>${ esc( area.title || '(no title)' ) }</td>` +
		`<td><span class="cns-badge cns-badge--type">${ esc( area.type ) }</span></td>` +
		`<td>${ ( area.nodes || [] ).length } nodes</td>` +
		`<td class="cns-maps-actions">` +
			`<button class="button button-small cns-area-select" data-id="${ area.id }">Select</button> ` +
			`<button class="button button-small cns-area-delete" data-id="${ area.id }">Delete</button>` +
		`</td></tr>`
	).join( '' );

	container.innerHTML =
		'<table class="widefat cns-objects-table">' +
		'<thead><tr><th>Title</th><th>Type</th><th>Nodes</th><th>Actions</th></tr></thead>' +
		`<tbody>${ rows }</tbody></table>`;
}

async function loadAreas( mapId ) {
	if ( ! mapId ) { renderAreasList( [] ); return; }
	try {
		const res  = await apiFetch( 'GET', `/maps/${ mapId }/areas` );
		const data = await res.json();
		if ( res.ok ) { areasList = data; renderAreasList( data ); drawAreasCanvas(); }
	} catch { /* silent */ }
}

// ── Select / deselect ─────────────────────────────────────────────────────────

function selectArea( area ) {
	selectedAreaId = area.id;
	repositioningNodeIdx = null;
	nodeRepoCursor = null;
	drawAreasCanvas();
	showContextForArea( area );
}

export function deselectArea() {
	selectedAreaId = null;
	repositioningNodeIdx = null;
	nodeRepoCursor = null;
	document.getElementById( 'cns-areas-canvas' )?.classList.remove( 'cns-canvas--repositioning' );
	drawAreasCanvas();
	_hideCtxPanel?.();
}

// ── Context panel ─────────────────────────────────────────────────────────────

function showContextForArea( area ) {
	_showCtxPanel?.( areasCtxHandler, area.title, false, () => {
		if ( areaPanelController ) {
			areaPanelController.populate( area );
			renderNodeList( area );
		}
	} );
}

// ── Save / delete ─────────────────────────────────────────────────────────────

export async function performSaveArea( areaId, payload, statusId, saveBtnId ) {
	const statusEl = statusId ? document.getElementById( statusId ) : null;
	const saveBtn  = saveBtnId ? document.getElementById( saveBtnId ) : null;

	if ( statusEl ) { statusEl.textContent = 'Saving…'; statusEl.className = 'cns-save-status'; }
	if ( saveBtn )  saveBtn.disabled = true;

	try {
		const res  = await apiFetch( 'POST', `/areas/${ areaId }`, payload );
		const data = await res.json();

		if ( ! res.ok ) throw new Error( data.message || 'Save failed.' );

		areasList = areasList.map( ( a ) => a.id === areaId ? data : a );
		renderAreasList( areasList );
		renderNodeList( data );
		drawAreasCanvas();

		if ( statusEl ) {
			statusEl.textContent = 'Saved.';
			statusEl.className   = 'cns-save-status cns-save-status--ok';
			setTimeout( () => { statusEl.textContent = ''; statusEl.className = 'cns-save-status'; }, 2000 );
		}

		return data;
	} catch ( err ) {
		if ( statusEl ) { statusEl.textContent = err.message; statusEl.className = 'cns-save-status cns-save-status--error'; }
		throw err;
	} finally {
		if ( saveBtn ) saveBtn.disabled = false;
	}
}

export const areasCtxHandler = {
	save: async () => {
		if ( ! areaPanelController || ! selectedAreaId ) return;
		const area = areasList.find( ( a ) => a.id === selectedAreaId );
		if ( ! area ) return;
		const meta    = areaPanelController.collect();
		const payload = Object.assign( {}, meta, { nodes: JSON.stringify( area.nodes ) } );
		try {
			const data = await performSaveArea( selectedAreaId, payload, 'cns-context-save-status', 'cns-context-save' );
			const titleEl = document.getElementById( 'cns-context-title' );
			if ( titleEl && data?.title ) titleEl.textContent = data.title || '(no title)';
		} catch { /* error shown by performSaveArea */ }
	},
	delete: () => {
		if ( ! selectedAreaId || ! confirm( 'Delete this area?' ) ) return;
		const id = selectedAreaId;
		apiFetch( 'DELETE', `/areas/${ id }` ).then( ( res ) => {
			if ( ! res.ok ) { alert( 'Delete failed.' ); return; }
			areasList = areasList.filter( ( a ) => a.id !== id );
			renderAreasList( areasList );
			deselectArea();
		} ).catch( () => { alert( 'Delete failed.' ); } );
	},
	close: () => { deselectArea(); },
};

// ── Canvas interaction ────────────────────────────────────────────────────────

function commitNodePosition( area, idx, x, y, W, H ) {
	const newX      = x / W;
	const newY      = y / H;
	const shapeType = area.shape_type || 'POLYGON';

	if ( shapeType === 'RECTANGLE' ) {
		const updated = applyRectangleConstraint( area.nodes, idx, newX, newY );
		if ( updated ) area.nodes = updated;
	} else if ( shapeType === 'CIRCLE' && idx === 0 ) {
		const dx = newX - area.nodes[ 0 ].x;
		const dy = newY - area.nodes[ 0 ].y;
		area.nodes[ 0 ] = { x: newX, y: newY };
		if ( area.nodes[ 1 ] ) area.nodes[ 1 ] = { x: area.nodes[ 1 ].x + dx, y: area.nodes[ 1 ].y + dy };
	} else {
		area.nodes[ idx ] = { x: newX, y: newY };
	}
}

function initAreasCanvas( mapId ) {
	const canvas = document.getElementById( 'cns-areas-canvas' );
	if ( ! canvas ) return;

	canvas.addEventListener( 'mousemove', ( e ) => {
		if ( repositioningNodeIdx === null ) return;
		nodeRepoCursor = getCanvasCoords( canvas, e );
		drawAreasCanvas();
	} );

	canvas.addEventListener( 'click', ( e ) => {
		const { x, y } = getCanvasCoords( canvas, e );
		const ctx = canvas.getContext( '2d' );
		const W   = canvas.width;
		const H   = canvas.height;

		if ( repositioningNodeIdx !== null ) {
			const area = areasList.find( ( a ) => a.id === selectedAreaId );
			if ( area ) {
				commitNodePosition( area, repositioningNodeIdx, x, y, W, H );
				renderNodeList( area );
			}
			repositioningNodeIdx = null;
			nodeRepoCursor = null;
			canvas.classList.remove( 'cns-canvas--repositioning' );
			drawAreasCanvas();
			return;
		}

		const selArea = selectedAreaId ? areasList.find( ( a ) => a.id === selectedAreaId ) : null;
		if ( selArea ) {
			const nodeIdx = findNodeAtPoint( ctx, x, y, selArea.nodes || [], W, H );
			if ( nodeIdx !== -1 ) {
				repositioningNodeIdx = nodeIdx;
				nodeRepoCursor = { x, y };
				canvas.classList.add( 'cns-canvas--repositioning' );
				drawAreasCanvas();
				return;
			}
		}

		const hitArea = findAreaAtPoint( ctx, x, y, areasList, W, H );
		if ( hitArea ) {
			selectArea( hitArea );
			return;
		}

		if ( selArea ) {
			const shapeType = selArea.shape_type || 'POLYGON';
			if ( shapeType !== 'RECTANGLE' && shapeType !== 'CIRCLE' ) {
				selArea.nodes.push( { x: x / W, y: y / H } );
				renderNodeList( selArea );
				drawAreasCanvas();
			}
			return;
		}

		deselectArea();
	} );

	document.addEventListener( 'keydown', ( e ) => {
		const areasActive = document.querySelector( '[data-panel="areas"].cns-tab-panel--active' );
		if ( ! areasActive || repositioningNodeIdx === null ) return;

		if ( e.key === 'Enter' && nodeRepoCursor ) {
			const area = areasList.find( ( a ) => a.id === selectedAreaId );
			if ( area ) {
				commitNodePosition( area, repositioningNodeIdx, nodeRepoCursor.x, nodeRepoCursor.y, canvas.width, canvas.height );
				renderNodeList( area );
			}
		}
		if ( e.key === 'Escape' || e.key === 'Enter' ) {
			repositioningNodeIdx = null;
			nodeRepoCursor = null;
			canvas.classList.remove( 'cns-canvas--repositioning' );
			drawAreasCanvas();
		}
	} );
}

// ── Tab init ──────────────────────────────────────────────────────────────────

export function initAreasTab() {
	const editor = document.querySelector( '.cns-map-editor' );
	if ( ! editor ) return;
	const mapId = parseInt( editor.dataset.mapId, 10 ) || 0;

	const areaBody = document.getElementById( 'cns-ctx-area-body' );
	if ( areaBody && ! areaPanelController ) {
		const formDiv = document.createElement( 'div' );
		formDiv.id    = 'cns-ctx-area-form';
		formDiv.innerHTML = buildAreaFormHTML();
		areaBody.appendChild( formDiv );

		const nodesDiv = document.createElement( 'div' );
		nodesDiv.id    = 'cns-ctx-area-nodes';
		areaBody.appendChild( nodesDiv );

		areaPanelController = createAreaFormController( formDiv, {
			onShapeTypeChange: ( shapeType ) => {
				const a = areasList.find( ( a ) => a.id === selectedAreaId );
				if ( ! a ) return;
				a.shape_type = shapeType;
				a.nodes      = normalizeNodesForShapeType( a.nodes || [], shapeType );
				renderNodeList( a );
				drawAreasCanvas();
			},
		} );
		areaPanelController.initInteractivity();
	}

	initAreasCanvas( mapId );
	loadAreas( mapId );

	document.getElementById( 'cns-areas-list' )?.addEventListener( 'click', ( e ) => {
		const selBtn = e.target.closest( '.cns-area-select' );
		const delBtn = e.target.closest( '.cns-area-delete' );
		if ( selBtn ) {
			const id   = parseInt( selBtn.dataset.id, 10 );
			const area = areasList.find( ( a ) => a.id === id );
			if ( area ) selectArea( area );
		}
		if ( delBtn ) {
			const id = parseInt( delBtn.dataset.id, 10 );
			if ( ! confirm( 'Delete this area?' ) ) return;
			apiFetch( 'DELETE', `/areas/${ id }` ).then( ( res ) => {
				if ( ! res.ok ) { alert( 'Delete failed.' ); return; }
				areasList = areasList.filter( ( a ) => a.id !== id );
				renderAreasList( areasList );
				if ( selectedAreaId === id ) deselectArea();
				drawAreasCanvas();
			} ).catch( () => { alert( 'Delete failed.' ); } );
		}
	} );

	document.getElementById( 'cns-add-area' )?.addEventListener( 'click', async () => {
		if ( ! mapId ) return;
		const defaultNodes = getDefaultNodes( 'POLYGON' );
		try {
			const res  = await apiFetch( 'POST', `/maps/${ mapId }/areas`, {
				title:               'New Area',
				nodes:               JSON.stringify( defaultNodes ),
				style_fill:          '#2271b1',
				style_fill_opacity:  0.3,
				style_stroke:        '#2271b1',
				style_stroke_width:  2,
			} );
			const data = await res.json();
			if ( ! res.ok ) throw new Error( data.message || 'Failed to create area.' );
			areasList.push( data );
			renderAreasList( areasList );
			drawAreasCanvas();
			selectArea( data );
		} catch ( err ) { alert( err.message ); }
	} );

	areasInitialized = true;
}
