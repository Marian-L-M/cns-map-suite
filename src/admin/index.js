/* CNS Map Suite — Admin entry point */

import {
	collectDrawState,
	drawFullCanvas,
	initSettingsCanvas,
	initColorPicker,
	initBgTypeToggle,
	initImagePicker,
	initBgImagePicker,
	initRangeSliders,
} from './canvas.js';

import { apiFetch } from './utils.js';

import { initIconLibraryPage } from './icons.js';

import {
	objectsList,
	objectsInitialized,
	objectsCtxHandler,
	setContextCallbacks as setObjectsContextCallbacks,
	initObjectsTab,
	initObjectContextForm,
	deselectObject,
	drawObjectsCanvas,
	drawObjectMarker,
	performSaveObject,
} from './objects.js';

import {
	areasList,
	areasInitialized,
	areasCtxHandler,
	setContextCallbacks as setAreasContextCallbacks,
	initAreasTab,
	deselectArea,
	drawAreasCanvas,
	drawAreaShape,
	performSaveArea,
} from './areas.js';

// ── Context panel ─────────────────────────────────────────────────────────────
// Lives here to avoid circular imports between objects/areas and a context module.

let ctxHandler = null;

function showContextPanel( handler, title, showObj, populate ) {
	const objBody  = document.getElementById( 'cns-ctx-obj-body' );
	const areaBody = document.getElementById( 'cns-ctx-area-body' );
	const reposBtn = document.getElementById( 'cns-context-reposition' );
	const emptyEl  = document.getElementById( 'cns-context-empty' );
	const formEl   = document.getElementById( 'cns-context-form' );
	const titleEl  = document.getElementById( 'cns-context-title' );
	const statEl   = document.getElementById( 'cns-context-save-status' );

	if ( objBody )  objBody.hidden  = ! showObj;
	if ( areaBody ) areaBody.hidden =   showObj;
	if ( reposBtn ) reposBtn.hidden = ! showObj;
	if ( emptyEl )  emptyEl.hidden  = true;
	if ( formEl )   formEl.hidden   = false;
	if ( titleEl )  titleEl.textContent = title || '(no title)';
	if ( statEl )   { statEl.textContent = ''; statEl.className = 'cns-save-status'; }

	ctxHandler = handler;
	populate();
}

function hideContextPanel() {
	const emptyEl = document.getElementById( 'cns-context-empty' );
	const formEl  = document.getElementById( 'cns-context-form' );
	if ( emptyEl ) emptyEl.hidden = false;
	if ( formEl )  formEl.hidden  = true;
}

function initContextPanel() {
	const body = document.getElementById( 'cns-context-body' );
	if ( ! body ) return;

	// Create empty sub-containers; objects fills #cns-ctx-obj-body eagerly,
	// areas fills #cns-ctx-area-body lazily on first tab visit.
	const objDiv = document.createElement( 'div' );
	objDiv.id    = 'cns-ctx-obj-body';
	body.appendChild( objDiv );

	const areaDiv  = document.createElement( 'div' );
	areaDiv.id     = 'cns-ctx-area-body';
	areaDiv.hidden = true;
	body.appendChild( areaDiv );

	document.getElementById( 'cns-context-save' )?.addEventListener( 'click', () => { ctxHandler?.save(); } );
	document.getElementById( 'cns-context-delete' )?.addEventListener( 'click', () => { ctxHandler?.delete(); } );
	document.getElementById( 'cns-context-close' )?.addEventListener( 'click', () => { ctxHandler?.close(); } );
	document.getElementById( 'cns-context-reposition' )?.addEventListener( 'click', () => { ctxHandler?.reposition(); } );
}

// ── Preview ───────────────────────────────────────────────────────────────────

async function loadAndDrawPreview() {
	const canvas = document.getElementById( 'cns-preview-canvas' );
	if ( ! canvas ) return;
	const mapId = parseInt( document.querySelector( '.cns-map-editor' )?.dataset.mapId, 10 ) || 0;

	let objs  = objectsList.slice();
	let areas = areasList.slice();

	if ( ! objectsInitialized && mapId ) {
		try {
			const res  = await apiFetch( 'GET', `/maps/${ mapId }/objects` );
			const data = await res.json();
			if ( res.ok ) objs = data;
		} catch { /* silent */ }
	}
	if ( ! areasInitialized && mapId ) {
		try {
			const res  = await apiFetch( 'GET', `/maps/${ mapId }/areas` );
			const data = await res.json();
			if ( res.ok ) areas = data;
		} catch { /* silent */ }
	}

	await drawFullCanvas( canvas, objs, areas, drawAreaShape, drawObjectMarker );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

function initTabs() {
	const tabNav = document.querySelector( '.cns-map-editor__tabs' );
	if ( ! tabNav ) return;

	const tabs   = tabNav.querySelectorAll( '.cns-tab' );
	const panels = document.querySelectorAll( '.cns-tab-panel' );

	tabs.forEach( ( tab ) => {
		tab.addEventListener( 'click', () => {
			const target = tab.dataset.tab;

			tabs.forEach( ( t ) => { t.classList.remove( 'cns-tab--active' ); t.setAttribute( 'aria-selected', 'false' ); } );
			panels.forEach( ( p ) => { p.classList.remove( 'cns-tab-panel--active' ); } );

			tab.classList.add( 'cns-tab--active' );
			tab.setAttribute( 'aria-selected', 'true' );

			const panel = document.querySelector( `[data-panel="${ target }"]` );
			if ( panel ) panel.classList.add( 'cns-tab-panel--active' );

			if ( target === 'preview' ) loadAndDrawPreview();

			if ( target === 'objects' ) {
				if ( ! objectsInitialized ) {
					initObjectsTab();
				} else {
					drawObjectsCanvas();
				}
				deselectArea();
				const emptyP = document.querySelector( '#cns-context-empty p' );
				if ( emptyP ) emptyP.textContent = 'Select an object on the canvas to edit it here.';
			}

			if ( target === 'areas' ) {
				if ( ! areasInitialized ) {
					initAreasTab();
				} else {
					drawAreasCanvas();
				}
				deselectObject();
				const emptyP = document.querySelector( '#cns-context-empty p' );
				if ( emptyP ) emptyP.textContent = 'Select an area on the canvas to edit it here.';
			}
		} );
	} );
}

// ── MasterMap toggle ──────────────────────────────────────────────────────────

function initMasterMapToggle() {
	const checkbox = document.getElementById( 'cns-map-is-master' );
	if ( ! checkbox ) return;

	function applyToggle() {
		const isMaster = checkbox.checked;
		document.querySelectorAll( '[data-master-hide]' ).forEach( ( el ) => { el.style.display = isMaster ? 'none' : ''; } );
		document.querySelectorAll( '[data-master-show]' ).forEach( ( el ) => { el.style.display = isMaster ? '' : 'none'; } );
		const activeTab = document.querySelector( '.cns-tab--active' );
		if ( activeTab && activeTab.style.display === 'none' ) {
			document.querySelector( '.cns-tab[data-tab="settings"]' ).click();
		}
	}

	applyToggle();
	checkbox.addEventListener( 'change', applyToggle );
}

// ── Map settings save ─────────────────────────────────────────────────────────

function collectPayload( mapId ) {
	return {
		map_id:       mapId,
		title:        document.getElementById( 'cns-map-title' )?.value ?? '',
		status:       'publish',
		width:        parseInt( document.getElementById( 'cns-map-width' )?.value, 10 ) || 1000,
		aspect_ratio: parseFloat( document.getElementById( 'cns-map-aspect-ratio' )?.value ) || 1.0,
		time:         parseInt( document.getElementById( 'cns-map-time' )?.value, 10 ) || 0,
		image_id:     parseInt( document.getElementById( 'cns-map-image-id' )?.value, 10 ) || 0,
		image_x:      parseFloat( document.getElementById( 'cns-map-image-x' )?.value ) || 0,
		image_y:      parseFloat( document.getElementById( 'cns-map-image-y' )?.value ) || 0,
		image_width:  parseFloat( document.getElementById( 'cns-map-image-width' )?.value ) || 1.0,
		is_master:    document.getElementById( 'cns-map-is-master' )?.checked ?? false,
		featured:     document.getElementById( 'cns-map-featured' )?.checked ?? false,
		bg_type:      document.querySelector( 'input[name="cns-map-bg-type"]:checked' )?.value ?? 'color',
		bg_color:     document.getElementById( 'cns-map-bg-color' )?.value ?? '#1a1a2e',
		bg_image_id:  parseInt( document.getElementById( 'cns-map-bg-image-id' )?.value, 10 ) || 0,
	};
}

function initSave() {
	const saveBtn  = document.getElementById( 'cns-map-save' );
	const statusEl = document.getElementById( 'cns-save-status' );
	const editor   = document.querySelector( '.cns-map-editor' );
	if ( ! saveBtn || ! editor ) return;

	saveBtn.addEventListener( 'click', async () => {
		const mapId = parseInt( editor.dataset.mapId, 10 ) || 0;
		saveBtn.disabled = true;
		statusEl.textContent = 'Saving…';
		statusEl.className   = 'cns-save-status';

		try {
			const res  = await apiFetch( 'POST', '/maps', collectPayload( mapId ) );
			const data = await res.json();
			if ( ! res.ok ) throw new Error( data.message || 'Save failed.' );

			if ( data.created ) {
				window.location.href = data.edit_url;
			} else {
				// Flush any pending area edits in the context panel.
				const selArea = areasList.find( ( a ) => a.id !== undefined && document.getElementById( 'cns-ctx-area-body' )?.hidden === false );
				if ( selArea && areasCtxHandler ) {
					try { await areasCtxHandler.save(); } catch { /* silent */ }
				}
				statusEl.textContent = 'Saved.';
				statusEl.className   = 'cns-save-status cns-save-status--ok';
				setTimeout( () => { statusEl.textContent = ''; statusEl.className = 'cns-save-status'; }, 2000 );
			}
		} catch ( err ) {
			statusEl.textContent = err.message;
			statusEl.className   = 'cns-save-status cns-save-status--error';
		} finally {
			saveBtn.disabled = false;
		}
	} );
}

// ── Boot ──────────────────────────────────────────────────────────────────────

document.addEventListener( 'DOMContentLoaded', () => {
	// Inject context callbacks before any tab initialises.
	setObjectsContextCallbacks( showContextPanel, hideContextPanel );
	setAreasContextCallbacks( showContextPanel, hideContextPanel );

	initContextPanel();
	initObjectContextForm(); // populates #cns-ctx-obj-body eagerly

	initTabs();
	initMasterMapToggle();
	initRangeSliders();
	initSettingsCanvas();
	initColorPicker();
	initBgTypeToggle();
	initImagePicker();
	initBgImagePicker();
	initSave();
	initIconLibraryPage();
} );
