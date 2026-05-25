/* global wp */
import { apiFetch, esc, nextFormUid, initFormMediaPicker, initFormPostSearch } from './utils.js';
import { drawMapCanvas, collectDrawState, getCanvasCoords } from './canvas.js';
import { loadImage, loadSvgWithColors } from './utils.js';
import { iconLibraryCache, loadIconLibraryIntoCache } from './icons.js';

// ── State ─────────────────────────────────────────────────────────────────────

export let objectsList        = [];
export let objectsInitialized = false;
let selectedObjectId   = null;
let repositioningId    = null;
let repositionCursor   = null;

// ── Context callbacks (injected by index.js to avoid circular deps) ───────────

let _showCtxPanel = null;
let _hideCtxPanel = null;

export function setContextCallbacks( show, hide ) {
	_showCtxPanel = show;
	_hideCtxPanel = hide;
}

// ── Canvas rendering ──────────────────────────────────────────────────────────

function drawFallbackMarker( ctx, x, y, size, fill, stroke ) {
	ctx.save();
	ctx.beginPath();
	ctx.arc( x, y, size / 2, 0, Math.PI * 2 );
	ctx.fillStyle   = fill   || '#2271b1';
	ctx.strokeStyle = stroke || '#fff';
	ctx.lineWidth   = 2;
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}

export async function drawObjectMarker( ctx, obj, isSelected ) {
	const size   = obj.canvas_styles?.size        || 32;
	const fill   = obj.canvas_styles?.fillStyle   || '#ffffff';
	const stroke = obj.canvas_styles?.strokeStyle || '#2271b1';

	if ( obj.icon_url ) {
		const img = obj.icon_mime === 'image/svg+xml'
			? await loadSvgWithColors( obj.icon_url, fill, stroke )
			: await loadImage( obj.icon_url );
		if ( img ) {
			ctx.drawImage( img, obj.x - size / 2, obj.y - size / 2, size, size );
		} else {
			drawFallbackMarker( ctx, obj.x, obj.y, size, fill, stroke );
		}
	} else {
		drawFallbackMarker( ctx, obj.x, obj.y, size, fill, stroke );
	}

	if ( isSelected ) {
		ctx.save();
		ctx.beginPath();
		ctx.arc( obj.x, obj.y, size / 2 + 4, 0, Math.PI * 2 );
		ctx.strokeStyle = '#2271b1';
		ctx.lineWidth   = 2;
		ctx.setLineDash( [ 4, 3 ] );
		ctx.stroke();
		ctx.restore();
	}
}

export async function drawObjectsCanvas() {
	const canvas = document.getElementById( 'cns-objects-canvas' );
	if ( ! canvas ) return;
	await drawMapCanvas( canvas, collectDrawState() );
	const ctx = canvas.getContext( '2d' );
	for ( const obj of objectsList ) {
		if ( repositioningId === obj.id && repositionCursor ) {
			const ghost = Object.assign( {}, obj, repositionCursor );
			await drawObjectMarker( ctx, ghost, true );
		} else {
			await drawObjectMarker( ctx, obj, selectedObjectId === obj.id );
		}
	}
}

export function findObjectAtPoint( ctx, x, y, objects ) {
	for ( let i = objects.length - 1; i >= 0; i-- ) {
		const obj  = objects[ i ];
		const size = obj.canvas_styles?.size || 32;
		const half = size / 2;
		ctx.beginPath();
		ctx.rect( obj.x - half, obj.y - half, size, size );
		if ( ctx.isPointInPath( x, y ) ) return obj;
	}
	return null;
}

// ── Object form ───────────────────────────────────────────────────────────────

export function buildObjectFormHTML() {
	const u = nextFormUid();
	const iconsUrl = esc( window.cnsMapSuite?.iconsUrl || '#' );
	return (
		'<section class="cns-modal-section">' +
		'<h3>Icon</h3>' +
		'<div class="cns-radio-toggle">' +
		`  <label><input type="radio" name="obj-icon-src-${ u }" data-field="icon-source" value="svg" checked /> From library</label>` +
		`  <label><input type="radio" name="obj-icon-src-${ u }" data-field="icon-source" value="image" /> Custom image</label>` +
		'</div>' +
		'<div data-section="icon-svg">' +
		'  <div class="cns-icon-picker-grid" data-field="icon-picker"></div>' +
		`  <p class="description"><a data-field="icon-library-link" href="${ iconsUrl }" target="_blank">Manage icon library →</a></p>` +
		'</div>' +
		'<div data-section="icon-image" class="cns-hidden">' +
		'  <input type="hidden" data-field="icon-image-id" value="0" />' +
		'  <div class="cns-image-picker">' +
		'    <div class="cns-image-picker__preview" data-field="icon-preview"><span>No image selected</span></div>' +
		'    <button type="button" class="button" data-action="select-icon-image">Select Image</button>' +
		'    <button type="button" class="button cns-hidden" data-action="remove-icon-image">Remove</button>' +
		'  </div>' +
		'</div>' +
		'</section>' +

		'<section class="cns-modal-section">' +
		'<h3>Details</h3>' +
		'<div class="cns-form-grid">' +
		'  <div class="cns-form-row cns-form-row--full"><label>Title</label><input type="text" data-field="title" class="large-text" /></div>' +
		'  <div class="cns-form-row"><label>Type</label><select data-field="type">' +
		'    <option value="LOCATION">Location</option><option value="HISTORY">History</option>' +
		'    <option value="NATURAL">Natural</option><option value="EVENT">Event</option><option value="OTHER">Other</option>' +
		'  </select></div>' +
		'  <div class="cns-form-row"><label>Object Time</label><input type="number" data-field="object-time" class="small-text" value="0" /></div>' +
		'  <div class="cns-form-row"><label>X (px)</label><input type="number" data-field="x" class="small-text" value="0" /></div>' +
		'  <div class="cns-form-row"><label>Y (px)</label><input type="number" data-field="y" class="small-text" value="0" /></div>' +
		'</div>' +
		'</section>' +

		'<section class="cns-modal-section">' +
		'<h3>Infobox</h3>' +
		'<div class="cns-radio-toggle">' +
		`  <label><input type="radio" name="obj-infobox-src-${ u }" data-field="infobox-source" value="manual" checked /> Manual</label>` +
		`  <label><input type="radio" name="obj-infobox-src-${ u }" data-field="infobox-source" value="post" /> From post</label>` +
		'</div>' +
		'<div data-section="infobox-manual">' +
		'  <div class="cns-form-grid">' +
		'    <div class="cns-form-row cns-form-row--full"><label>Infobox Title</label><input type="text" data-field="infobox-title" class="large-text" /></div>' +
		'    <div class="cns-form-row cns-form-row--full"><label>Description</label><textarea data-field="infobox-desc" rows="4" class="large-text"></textarea></div>' +
		'    <div class="cns-form-row cns-form-row--full"><label>Infobox Image</label>' +
		'      <input type="hidden" data-field="infobox-image-id" value="0" />' +
		'      <div class="cns-image-picker">' +
		'        <div class="cns-image-picker__preview" data-field="infobox-image-preview"><span>No image selected</span></div>' +
		'        <button type="button" class="button" data-action="select-infobox-image">Select Image</button>' +
		'        <button type="button" class="button cns-hidden" data-action="remove-infobox-image">Remove</button>' +
		'      </div>' +
		'    </div>' +
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
		'</div>' +
		'</section>' +

		'<section class="cns-modal-section">' +
		'<h3>Design</h3>' +
		'<div class="cns-form-grid">' +
		'  <div class="cns-form-row cns-form-row--full"><label>Icon Size (px)</label>' +
		'    <div class="cns-range-wrap">' +
		'      <input type="range" data-field="size" min="8" max="128" step="1" value="32" />' +
		'      <output class="cns-range-value">32</output>' +
		'    </div>' +
		'  </div>' +
		'  <div class="cns-form-row"><label>Fill Color</label><input type="color" data-field="fill" value="#ffffff" /></div>' +
		'  <div class="cns-form-row"><label>Stroke Color</label><input type="color" data-field="stroke" value="#2271b1" /></div>' +
		'</div>' +
		'<p class="description">Fill and stroke are applied to SVG icons only.</p>' +
		'</section>'
	);
}

export function createObjectFormController( root ) {
	let localSelectedIconId = null;

	const q  = ( field ) => root.querySelector( `[data-field="${ field }"]` );
	const qs = ( field ) => Array.from( root.querySelectorAll( `[data-field="${ field }"]` ) );

	const getRadio    = ( field )    => qs( field ).find( ( r ) => r.checked )?.value;
	const setRadioVal = ( field, v ) => qs( field ).forEach( ( r ) => { r.checked = r.value === v; } );

	function populate( obj, x, y ) {
		const isSvg = ! obj || ! obj.icon_image_id || obj.icon_mime === 'image/svg+xml';
		setRadioVal( 'icon-source', isSvg ? 'svg' : 'image' );
		root.querySelector( '[data-section="icon-svg"]' ).classList.toggle( 'cns-hidden', ! isSvg );
		root.querySelector( '[data-section="icon-image"]' ).classList.toggle( 'cns-hidden', isSvg );
		localSelectedIconId = ( isSvg && obj?.icon_image_id ) ? obj.icon_image_id : null;

		const iconImgId = q( 'icon-image-id' );
		if ( iconImgId ) iconImgId.value = ( ! isSvg && obj?.icon_image_id ) ? obj.icon_image_id : '0';
		const iconPrev = q( 'icon-preview' );
		if ( iconPrev ) iconPrev.innerHTML = ( obj?.icon_url && ! isSvg ) ? `<img src="${ esc( obj.icon_url ) }" alt="" />` : '<span>No image selected</span>';
		const rmIcon = root.querySelector( '[data-action="remove-icon-image"]' );
		if ( rmIcon ) rmIcon.classList.toggle( 'cns-hidden', ! ( obj?.icon_url && ! isSvg ) );

		if ( q( 'title' ) )       q( 'title' ).value       = obj?.title       || '';
		if ( q( 'type' ) )        q( 'type' ).value         = obj?.type        || 'LOCATION';
		if ( q( 'object-time' ) ) q( 'object-time' ).value  = obj?.object_time ?? 0;
		if ( q( 'x' ) )           q( 'x' ).value            = obj ? obj.x : ( x ?? 0 );
		if ( q( 'y' ) )           q( 'y' ).value            = obj ? obj.y : ( y ?? 0 );

		const ibSrc = obj?.infobox_source || 'manual';
		setRadioVal( 'infobox-source', ibSrc );
		root.querySelector( '[data-section="infobox-manual"]' ).classList.toggle( 'cns-hidden', ibSrc === 'post' );
		root.querySelector( '[data-section="infobox-post"]' ).classList.toggle( 'cns-hidden', ibSrc !== 'post' );

		if ( q( 'infobox-title' ) ) q( 'infobox-title' ).value = obj?.infobox_data?.title       || '';
		if ( q( 'infobox-desc' ) )  q( 'infobox-desc' ).value  = obj?.infobox_data?.description || '';
		const ibImgId = q( 'infobox-image-id' );
		if ( ibImgId ) ibImgId.value = obj?.infobox_data?.image_id || '0';
		const ibPrev = q( 'infobox-image-preview' );
		if ( ibPrev ) ibPrev.innerHTML = '<span>No image selected</span>';
		const rmIb = root.querySelector( '[data-action="remove-infobox-image"]' );
		if ( rmIb ) rmIb.classList.add( 'cns-hidden' );

		const linkedId = q( 'linked-post-id' );
		if ( linkedId ) linkedId.value = obj?.linked_post_id || '0';
		const postLabel = q( 'linked-post-label' );
		if ( postLabel ) {
			if ( obj?.linked_post_id ) {
				postLabel.textContent = 'Post ID: ' + obj.linked_post_id;
				postLabel.classList.remove( 'cns-hidden' );
			} else {
				postLabel.classList.add( 'cns-hidden' );
			}
		}
		const ps = q( 'post-search' ); if ( ps ) ps.value = '';
		const pr = q( 'post-results' ); if ( pr ) pr.hidden = true;

		const size   = obj?.canvas_styles?.size        || 32;
		const fill   = obj?.canvas_styles?.fillStyle   || '#ffffff';
		const stroke = obj?.canvas_styles?.strokeStyle || '#2271b1';
		const sizeEl = q( 'size' );
		if ( sizeEl ) {
			sizeEl.value = size;
			const out = sizeEl.parentElement?.querySelector( 'output.cns-range-value' );
			if ( out ) out.textContent = size;
		}
		if ( q( 'fill' ) )   q( 'fill' ).value   = fill;
		if ( q( 'stroke' ) ) q( 'stroke' ).value = stroke;

		renderIconPicker();
	}

	function collect() {
		const iconSource  = getRadio( 'icon-source' ) || 'svg';
		const iconImageId = iconSource === 'svg'
			? ( localSelectedIconId || 0 )
			: ( parseInt( q( 'icon-image-id' )?.value, 10 ) || 0 );

		return {
			icon_image_id:       iconImageId,
			title:               q( 'title' )?.value        || '',
			type:                q( 'type' )?.value         || 'LOCATION',
			x:                   parseInt( q( 'x' )?.value, 10 )           || 0,
			y:                   parseInt( q( 'y' )?.value, 10 )           || 0,
			object_time:         parseInt( q( 'object-time' )?.value, 10 ) || 0,
			infobox_source:      getRadio( 'infobox-source' )               || 'manual',
			linked_post_id:      parseInt( q( 'linked-post-id' )?.value, 10 ) || 0,
			infobox_title:       q( 'infobox-title' )?.value || '',
			infobox_description: q( 'infobox-desc' )?.value  || '',
			infobox_image_id:    parseInt( q( 'infobox-image-id' )?.value, 10 ) || 0,
			style_size:          parseInt( q( 'size' )?.value, 10 )   || 32,
			style_fill:          q( 'fill' )?.value                   || '#ffffff',
			style_stroke:        q( 'stroke' )?.value                 || '#2271b1',
		};
	}

	function renderIconPicker() {
		const grid  = q( 'icon-picker' );
		if ( ! grid ) return;
		const icons = iconLibraryCache || [];
		if ( ! icons.length ) {
			grid.innerHTML = `<p class="description">No icons yet. <a href="${ esc( window.cnsMapSuite?.iconsUrl || '#' ) }" target="_blank">Add icons →</a></p>`;
			return;
		}
		grid.innerHTML = icons.map( ( icon ) => {
			const active = icon.id === localSelectedIconId ? ' cns-icon-item--active' : '';
			return `<button type="button" class="cns-icon-item${ active }" data-id="${ icon.id }" title="${ esc( icon.title ) }">` +
				`<img src="${ esc( icon.url ) }" alt="${ esc( icon.title ) }" /></button>`;
		} ).join( '' );
		grid.querySelectorAll( '.cns-icon-item' ).forEach( ( btn ) => {
			btn.addEventListener( 'click', () => {
				localSelectedIconId = parseInt( btn.dataset.id, 10 );
				grid.querySelectorAll( '.cns-icon-item' ).forEach( ( b ) => b.classList.remove( 'cns-icon-item--active' ) );
				btn.classList.add( 'cns-icon-item--active' );
			} );
		} );
	}

	function initInteractivity() {
		qs( 'icon-source' ).forEach( ( radio ) => {
			radio.addEventListener( 'change', () => {
				const isSvg = radio.value === 'svg';
				root.querySelector( '[data-section="icon-svg"]' ).classList.toggle( 'cns-hidden', ! isSvg );
				root.querySelector( '[data-section="icon-image"]' ).classList.toggle( 'cns-hidden', isSvg );
			} );
		} );

		qs( 'infobox-source' ).forEach( ( radio ) => {
			radio.addEventListener( 'change', () => {
				const isPost = radio.value === 'post';
				root.querySelector( '[data-section="infobox-manual"]' ).classList.toggle( 'cns-hidden', isPost );
				root.querySelector( '[data-section="infobox-post"]' ).classList.toggle( 'cns-hidden', ! isPost );
			} );
		} );

		const libLink = q( 'icon-library-link' );
		if ( libLink && window.cnsMapSuite?.iconsUrl ) libLink.href = window.cnsMapSuite.iconsUrl;

		initFormMediaPicker( root, 'icon-image' );
		initFormMediaPicker( root, 'infobox-image' );
		initFormPostSearch( root );

		const sizeSlider = q( 'size' );
		const sizeOutput = sizeSlider?.parentElement?.querySelector( 'output.cns-range-value' );
		if ( sizeSlider && sizeOutput ) {
			sizeSlider.addEventListener( 'input', () => { sizeOutput.textContent = sizeSlider.value; } );
		}
	}

	return { populate, collect, renderIconPicker, initInteractivity };
}

// ── Object list ───────────────────────────────────────────────────────────────

function renderObjectsList( objects ) {
	const container = document.getElementById( 'cns-objects-list' );
	if ( ! container ) return;

	if ( ! objects.length ) {
		container.innerHTML = '<p class="cns-objects-empty">No objects yet. Click on the canvas to place one.</p>';
		return;
	}

	const rows = objects.map( ( obj ) => {
		const iconHtml = obj.icon_url
			? `<img src="${ esc( obj.icon_url ) }" width="28" height="28" alt="" style="display:block;object-fit:contain" />`
			: `<span class="cns-obj-dot" style="background:${ esc( obj.canvas_styles?.fillStyle || '#2271b1' ) }"></span>`;
		return `<tr data-id="${ obj.id }">` +
			`<td class="col-icon">${ iconHtml }</td>` +
			`<td>${ esc( obj.title || '(no title)' ) }</td>` +
			`<td><span class="cns-badge cns-badge--type">${ esc( obj.type ) }</span></td>` +
			`<td>${ obj.x }, ${ obj.y }</td>` +
			`<td class="cns-maps-actions">` +
				`<button class="button button-small cns-obj-edit" data-id="${ obj.id }">Edit</button> ` +
				`<button class="button button-small cns-obj-delete" data-id="${ obj.id }">Delete</button>` +
			`</td>` +
			`</tr>`;
	} ).join( '' );

	container.innerHTML =
		'<table class="widefat cns-objects-table">' +
		'<thead><tr><th style="width:36px"></th><th>Title</th><th>Type</th><th>Position</th><th>Actions</th></tr></thead>' +
		`<tbody>${ rows }</tbody></table>`;
}

async function loadObjects( mapId ) {
	if ( ! mapId ) { renderObjectsList( [] ); return; }
	try {
		const res  = await apiFetch( 'GET', `/maps/${ mapId }/objects` );
		const data = await res.json();
		if ( res.ok ) { objectsList = data; renderObjectsList( data ); drawObjectsCanvas(); }
	} catch { /* silent */ }
}

// ── Repositioning ─────────────────────────────────────────────────────────────

function enterRepositionMode( canvas, obj ) {
	repositioningId  = obj.id;
	repositionCursor = { x: obj.x, y: obj.y };
	canvas.classList.add( 'cns-canvas--repositioning' );
	drawObjectsCanvas();
}

function exitRepositionMode( canvas ) {
	repositioningId  = null;
	repositionCursor = null;
	selectedObjectId = null;
	canvas.classList.remove( 'cns-canvas--repositioning' );
}

async function commitReposition( canvas, id, x, y ) {
	exitRepositionMode( canvas );
	try {
		const res  = await apiFetch( 'PATCH', `/objects/${ id }/position`, { x, y } );
		const data = await res.json();
		if ( res.ok ) {
			const idx = objectsList.findIndex( ( o ) => o.id === id );
			if ( idx !== -1 ) objectsList[ idx ] = data;
			renderObjectsList( objectsList );
		}
	} catch { /* silent */ }
	drawObjectsCanvas();
}

// ── Select / deselect ─────────────────────────────────────────────────────────

function selectObject( obj ) {
	selectedObjectId = obj.id;
	drawObjectsCanvas();
	showContextObject( obj );
}

export function deselectObject() {
	selectedObjectId = null;
	drawObjectsCanvas();
	_hideCtxPanel?.();
}

// ── Context panel ─────────────────────────────────────────────────────────────

let panelController = null;

function ensureIconCache( callback ) {
	if ( iconLibraryCache ) { callback(); return; }
	loadIconLibraryIntoCache().then( callback );
}

function showContextObject( obj ) {
	_showCtxPanel?.( objectsCtxHandler, obj.title, true, () => {
		if ( ! panelController ) return;
		panelController.populate( obj, null, null );
		ensureIconCache( () => panelController.renderIconPicker() );
	} );
}

export function initObjectContextForm() {
	const objDiv = document.getElementById( 'cns-ctx-obj-body' );
	if ( ! objDiv || panelController ) return;
	objDiv.innerHTML = buildObjectFormHTML();
	panelController = createObjectFormController( objDiv );
	panelController.initInteractivity();
}

export const objectsCtxHandler = {
	save: async () => {
		if ( ! panelController || ! selectedObjectId ) return;
		const mapId = parseInt( document.querySelector( '.cns-map-editor' )?.dataset.mapId, 10 ) || 0;
		try {
			const data = await performSaveObject( mapId, selectedObjectId, panelController.collect(), 'cns-context-save-status', 'cns-context-save' );
			const titleEl = document.getElementById( 'cns-context-title' );
			if ( titleEl && data?.title ) titleEl.textContent = data.title || '(no title)';
		} catch { /* error shown by performSaveObject */ }
	},
	delete: () => { if ( selectedObjectId ) deleteObject( selectedObjectId ); },
	close:  () => { deselectObject(); },
	reposition: () => {
		const canvas = document.getElementById( 'cns-objects-canvas' );
		const obj    = objectsList.find( ( o ) => o.id === selectedObjectId );
		if ( canvas && obj ) enterRepositionMode( canvas, obj );
	},
};

// ── Save / delete ─────────────────────────────────────────────────────────────

export async function performSaveObject( mapId, editId, payload, statusId, saveBtnId ) {
	const statusEl = statusId ? document.getElementById( statusId ) : null;
	const saveBtn  = saveBtnId ? document.getElementById( saveBtnId ) : null;

	if ( statusEl ) { statusEl.textContent = 'Saving…'; statusEl.className = 'cns-save-status'; }
	if ( saveBtn )  saveBtn.disabled = true;

	try {
		const url  = editId ? `/objects/${ editId }` : `/maps/${ mapId }/objects`;
		const res  = await apiFetch( 'POST', url, payload );
		const data = await res.json();

		if ( ! res.ok ) throw new Error( data.message || 'Save failed.' );

		if ( editId ) {
			objectsList = objectsList.map( ( o ) => o.id === editId ? data : o );
		} else {
			objectsList.push( data );
		}

		renderObjectsList( objectsList );
		drawObjectsCanvas();

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

async function deleteObject( id ) {
	if ( ! confirm( 'Delete this object?' ) ) return;
	try {
		const res = await apiFetch( 'DELETE', `/objects/${ id }` );
		if ( ! res.ok ) throw new Error( 'Delete failed.' );
		objectsList = objectsList.filter( ( o ) => o.id !== id );
		renderObjectsList( objectsList );
		if ( selectedObjectId === id ) deselectObject();
		drawObjectsCanvas();
	} catch ( err ) { alert( err.message ); }
}

// ── Modal ─────────────────────────────────────────────────────────────────────

let editingObjectId = null;
let modalController = null;

function openObjectModal( obj, x, y ) {
	const modal = document.getElementById( 'cns-object-modal' );
	if ( ! modal ) return;

	const mapId = parseInt( document.querySelector( '.cns-map-editor' )?.dataset.mapId, 10 ) || 0;

	if ( ! modalController ) {
		const body = document.getElementById( 'cns-object-modal-body' );
		if ( body ) {
			body.innerHTML = buildObjectFormHTML();
			modalController = createObjectFormController( body );
			modalController.initInteractivity();
		}
	}

	editingObjectId = obj ? obj.id : null;
	modal.querySelector( '.cns-modal__title' ).textContent = obj ? 'Edit Object' : 'Add Object';

	if ( modalController ) {
		modalController.populate( obj, x, y );
		ensureIconCache( () => modalController.renderIconPicker() );
	}

	modal.hidden = false;
	document.body.classList.add( 'cns-modal-open' );
}

function closeObjectModal() {
	const modal = document.getElementById( 'cns-object-modal' );
	if ( ! modal ) return;
	modal.hidden = true;
	document.body.classList.remove( 'cns-modal-open' );
}

function initObjectModal( mapId ) {
	const modal = document.getElementById( 'cns-object-modal' );
	if ( ! modal ) return;

	modal.querySelector( '.cns-modal__close' )?.addEventListener( 'click', closeObjectModal );
	modal.querySelector( '.cns-modal__backdrop' )?.addEventListener( 'click', closeObjectModal );
	document.getElementById( 'cns-object-cancel' )?.addEventListener( 'click', closeObjectModal );

	document.getElementById( 'cns-object-save' )?.addEventListener( 'click', async () => {
		if ( ! modalController ) return;
		try {
			await performSaveObject( mapId, editingObjectId, modalController.collect(), 'cns-object-save-status', 'cns-object-save' );
			closeObjectModal();
		} catch { /* error displayed by performSaveObject */ }
	} );

	document.getElementById( 'cns-objects-list' )?.addEventListener( 'click', ( e ) => {
		const editBtn   = e.target.closest( '.cns-obj-edit' );
		const deleteBtn = e.target.closest( '.cns-obj-delete' );
		if ( editBtn ) {
			const id  = parseInt( editBtn.dataset.id, 10 );
			const obj = objectsList.find( ( o ) => o.id === id );
			if ( obj ) openObjectModal( obj, null, null );
		}
		if ( deleteBtn ) deleteObject( parseInt( deleteBtn.dataset.id, 10 ) );
	} );
}

// ── Canvas interaction ────────────────────────────────────────────────────────

function initObjectsCanvas( mapId ) {
	const canvas = document.getElementById( 'cns-objects-canvas' );
	if ( ! canvas ) return;

	canvas.addEventListener( 'mousemove', ( e ) => {
		if ( ! repositioningId ) return;
		repositionCursor = getCanvasCoords( canvas, e );
		drawObjectsCanvas();
	} );

	canvas.addEventListener( 'click', async ( e ) => {
		const coords = getCanvasCoords( canvas, e );
		const ctx    = canvas.getContext( '2d' );

		if ( repositioningId ) {
			commitReposition( canvas, repositioningId, coords.x, coords.y );
			return;
		}

		const hit = findObjectAtPoint( ctx, coords.x, coords.y, objectsList );

		if ( hit ) {
			selectObject( hit );
		} else if ( selectedObjectId ) {
			const id = selectedObjectId;
			try {
				const res  = await apiFetch( 'PATCH', `/objects/${ id }/position`, { x: coords.x, y: coords.y } );
				const data = await res.json();
				if ( res.ok ) {
					const idx = objectsList.findIndex( ( o ) => o.id === id );
					if ( idx !== -1 ) objectsList[ idx ] = data;
					renderObjectsList( objectsList );
					showContextObject( data );
				}
			} catch { /* silent */ }
			drawObjectsCanvas();
		} else {
			deselectObject();
		}
	} );

	document.addEventListener( 'keydown', ( e ) => {
		if ( e.key === 'Escape' ) {
			if ( repositioningId ) { exitRepositionMode( canvas ); drawObjectsCanvas(); }
			else if ( selectedObjectId ) { deselectObject(); }
		}
	} );
}

// ── Tab init ──────────────────────────────────────────────────────────────────

export function initObjectsTab() {
	const editor = document.querySelector( '.cns-map-editor' );
	if ( ! editor ) return;
	const mapId = parseInt( editor.dataset.mapId, 10 ) || 0;

	initObjectsCanvas( mapId );
	initObjectModal( mapId );
	loadObjects( mapId );

	document.getElementById( 'cns-add-object' )?.addEventListener( 'click', () => {
		deselectObject();
		const state = collectDrawState();
		const cx    = Math.round( state.width / 2 );
		const cy    = Math.round( state.width / state.aspectRatio / 2 );
		openObjectModal( null, cx, cy );
	} );

	objectsInitialized = true;
}
