/* CNS Map Suite — Admin JS */
/* global wp, jQuery */

(function () {
	'use strict';

	// ── Image cache ───────────────────────────────────────────────────────────────

	const imageCache = {};

	function loadImage(url) {
		if (!url) return Promise.resolve(null);
		if (imageCache[url]) return Promise.resolve(imageCache[url]);
		return new Promise(function (resolve) {
			const img = new Image();
			img.onload  = function () { imageCache[url] = img; resolve(img); };
			img.onerror = function () { resolve(null); };
			img.src = url;
		});
	}

	async function loadSvgWithColors(url, fill, stroke) {
		const key = url + '|' + (fill || '') + '|' + (stroke || '');
		if (imageCache[key]) return imageCache[key];
		try {
			const resp = await fetch(url, { credentials: 'same-origin' });
			const text = await resp.text();
			const doc  = new DOMParser().parseFromString(text, 'image/svg+xml');
			const svg  = doc.documentElement;
			if (fill)   svg.setAttribute('fill',   fill);
			if (stroke) svg.setAttribute('stroke', stroke);
			const blob    = new Blob([new XMLSerializer().serializeToString(doc)], { type: 'image/svg+xml' });
			const blobUrl = URL.createObjectURL(blob);
			return new Promise(function (resolve) {
				const img = new Image();
				img.onload  = function () { URL.revokeObjectURL(blobUrl); imageCache[key] = img; resolve(img); };
				img.onerror = function () { URL.revokeObjectURL(blobUrl); resolve(null); };
				img.src = blobUrl;
			});
		} catch { return null; }
	}

	// ── Draw state ────────────────────────────────────────────────────────────────

	function collectDrawState() {
		return {
			width:       parseInt(document.getElementById('cns-map-width')?.value, 10) || 1000,
			aspectRatio: parseFloat(document.getElementById('cns-map-aspect-ratio')?.value) || 1.0,
			bgType:      document.querySelector('input[name="cns-map-bg-type"]:checked')?.value || 'color',
			bgColor:     document.getElementById('cns-map-bg-color')?.value || '#1a1a2e',
			bgImageUrl:  document.getElementById('cns-map-bg-image-id')?.dataset.currentUrl || '',
			imgUrl:      document.getElementById('cns-map-image-id')?.dataset.currentUrl || '',
			imageX:      parseFloat(document.getElementById('cns-map-image-x')?.value) || 0,
			imageY:      parseFloat(document.getElementById('cns-map-image-y')?.value) || 0,
			imageW:      parseFloat(document.getElementById('cns-map-image-width')?.value) || 1.0,
		};
	}

	// ── Core draw ─────────────────────────────────────────────────────────────────

	async function drawMapCanvas(canvasEl, state) {
		const ctx    = canvasEl.getContext('2d');
		const width  = state.width;
		const height = Math.round(width / state.aspectRatio);

		canvasEl.width  = width;
		canvasEl.height = height;
		ctx.clearRect(0, 0, width, height);

		if (state.bgType === 'image') {
			const bgImg = await loadImage(state.bgImageUrl);
			if (bgImg) {
				const scale = Math.max(width / bgImg.naturalWidth, height / bgImg.naturalHeight);
				const drawW = bgImg.naturalWidth  * scale;
				const drawH = bgImg.naturalHeight * scale;
				ctx.drawImage(bgImg, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
			} else {
				ctx.fillStyle = '#888';
				ctx.fillRect(0, 0, width, height);
			}
		} else {
			ctx.fillStyle = state.bgColor;
			ctx.fillRect(0, 0, width, height);
		}

		const mapImg = await loadImage(state.imgUrl);
		if (mapImg) {
			const drawW = width * state.imageW;
			const drawH = drawW * (mapImg.naturalHeight / mapImg.naturalWidth);
			ctx.drawImage(mapImg, width * state.imageX, height * state.imageY, drawW, drawH);
		}
	}

	// ── Object canvas rendering ───────────────────────────────────────────────────

	function getCanvasCoords(canvas, event) {
		const rect = canvas.getBoundingClientRect();
		return {
			x: Math.round((event.clientX - rect.left) * (canvas.width  / rect.width)),
			y: Math.round((event.clientY - rect.top)  * (canvas.height / rect.height)),
		};
	}

	// Hit detection using the Canvas isPointInPath API.
	// For each object a rectangular path is constructed (top-left to bottom-right
	// of the icon bounding box) and tested with ctx.isPointInPath — the same
	// primitive that will be reused for area hit detection later.
	function findObjectAtPoint(ctx, x, y, objects) {
		for (let i = objects.length - 1; i >= 0; i--) {
			const obj  = objects[i];
			const size = obj.canvas_styles?.size || 32;
			const half = size / 2;
			ctx.beginPath();
			ctx.rect(obj.x - half, obj.y - half, size, size);
			if (ctx.isPointInPath(x, y)) return obj;
		}
		return null;
	}

	function drawFallbackMarker(ctx, x, y, size, fill, stroke) {
		ctx.save();
		ctx.beginPath();
		ctx.arc(x, y, size / 2, 0, Math.PI * 2);
		ctx.fillStyle   = fill   || '#2271b1';
		ctx.strokeStyle = stroke || '#fff';
		ctx.lineWidth   = 2;
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}

	async function drawObjectMarker(ctx, obj, isSelected) {
		const size   = obj.canvas_styles?.size   || 32;
		const fill   = obj.canvas_styles?.fillStyle   || '#ffffff';
		const stroke = obj.canvas_styles?.strokeStyle || '#2271b1';

		if (obj.icon_url) {
			const img = obj.icon_mime === 'image/svg+xml'
				? await loadSvgWithColors(obj.icon_url, fill, stroke)
				: await loadImage(obj.icon_url);
			if (img) {
				ctx.drawImage(img, obj.x - size / 2, obj.y - size / 2, size, size);
			} else {
				drawFallbackMarker(ctx, obj.x, obj.y, size, fill, stroke);
			}
		} else {
			drawFallbackMarker(ctx, obj.x, obj.y, size, fill, stroke);
		}

		if (isSelected) {
			ctx.save();
			ctx.beginPath();
			ctx.arc(obj.x, obj.y, size / 2 + 4, 0, Math.PI * 2);
			ctx.strokeStyle = '#2271b1';
			ctx.lineWidth   = 2;
			ctx.setLineDash([4, 3]);
			ctx.stroke();
			ctx.restore();
		}
	}

	async function drawObjectsCanvas() {
		const canvas = document.getElementById('cns-objects-canvas');
		if (!canvas) return;
		await drawMapCanvas(canvas, collectDrawState());
		const ctx = canvas.getContext('2d');
		for (const obj of objectsList) {
			if (repositioningId === obj.id && repositionCursor) {
				const ghost = Object.assign({}, obj, repositionCursor);
				await drawObjectMarker(ctx, ghost, true);
			} else {
				await drawObjectMarker(ctx, obj, selectedObjectId === obj.id);
			}
		}
	}

	// ── Areas canvas rendering ────────────────────────────────────────────────────

	async function drawAreasCanvas() {
		const canvas = document.getElementById('cns-areas-canvas');
		if (!canvas) return;
		await drawMapCanvas(canvas, collectDrawState());
		const ctx = canvas.getContext('2d');
		const W   = canvas.width;
		const H   = canvas.height;
		for (const area of areasList) {
			drawAreaShape(ctx, area, W, H, area.id === selectedAreaId);
		}
	}

	function drawAreaShape(ctx, area, W, H, isSelected) {
		const nodes = area.nodes || [];
		if (!nodes.length) return;

		const styles      = area.canvas_styles || {};
		const fill        = styles.fill        || '#2271b1';
		const fillOpacity = styles.fillOpacity ?? 0.3;
		const stroke      = styles.stroke      || '#2271b1';
		const strokeWidth = styles.strokeWidth || 2;

		// Build polygon path
		ctx.beginPath();
		ctx.moveTo(nodes[0].x * W, nodes[0].y * H);
		for (let i = 1; i < nodes.length; i++) {
			ctx.lineTo(nodes[i].x * W, nodes[i].y * H);
		}
		if (nodes.length >= 3) ctx.closePath();

		// Fill interior (3+ nodes only)
		if (nodes.length >= 3) {
			ctx.save();
			ctx.globalAlpha = fillOpacity;
			ctx.fillStyle   = fill;
			ctx.fill();
			ctx.restore();
		}

		// Stroke edges
		ctx.strokeStyle = stroke;
		ctx.lineWidth   = isSelected ? Math.max(strokeWidth, 2) : strokeWidth;
		ctx.stroke();

		// Node handles (only when selected)
		if (!isSelected) return;
		nodes.forEach(function (node, idx) {
			const isRepoNode = (repositioningNodeIdx === idx);
			const nx = isRepoNode && nodeRepoCursor ? nodeRepoCursor.x : node.x * W;
			const ny = isRepoNode && nodeRepoCursor ? nodeRepoCursor.y : node.y * H;

			ctx.beginPath();
			ctx.rect(nx - NODE_HALF, ny - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2);
			ctx.strokeStyle = isRepoNode ? '#e75252' : '#2271b1';
			ctx.lineWidth   = 2;
			ctx.stroke();
			// No fill — spec: rectangle with border only
		});
	}

	// Returns node index or -1. Uses isPointInPath on each node rect.
	function findNodeAtPoint(ctx, x, y, nodes, W, H) {
		for (let i = nodes.length - 1; i >= 0; i--) {
			ctx.beginPath();
			ctx.rect(nodes[i].x * W - NODE_HALF, nodes[i].y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2);
			if (ctx.isPointInPath(x, y)) return i;
		}
		return -1;
	}

	// Returns area object or null. Uses isPointInPath on the polygon path.
	function findAreaAtPoint(ctx, x, y, areas, W, H) {
		for (let i = areas.length - 1; i >= 0; i--) {
			const nodes = areas[i].nodes || [];
			if (nodes.length < 3) continue;
			ctx.beginPath();
			ctx.moveTo(nodes[0].x * W, nodes[0].y * H);
			for (let j = 1; j < nodes.length; j++) {
				ctx.lineTo(nodes[j].x * W, nodes[j].y * H);
			}
			ctx.closePath();
			if (ctx.isPointInPath(x, y)) return areas[i];
		}
		return null;
	}

	function drawEditorCanvas() {
		const canvas = document.getElementById('cns-editor-canvas');
		if (!canvas) return;
		return drawMapCanvas(canvas, collectDrawState());
	}

	function drawPreviewCanvas() {
		const canvas = document.getElementById('cns-preview-canvas');
		if (!canvas) return;
		return drawMapCanvas(canvas, collectDrawState());
	}

	// ── Tab switching ─────────────────────────────────────────────────────────────

	function initTabs() {
		const tabNav = document.querySelector('.cns-map-editor__tabs');
		if (!tabNav) return;

		const tabs   = tabNav.querySelectorAll('.cns-tab');
		const panels = document.querySelectorAll('.cns-tab-panel');

		tabs.forEach(function (tab) {
			tab.addEventListener('click', function () {
				const target = tab.dataset.tab;

				tabs.forEach(function (t) {
					t.classList.remove('cns-tab--active');
					t.setAttribute('aria-selected', 'false');
				});
				panels.forEach(function (p) { p.classList.remove('cns-tab-panel--active'); });

				tab.classList.add('cns-tab--active');
				tab.setAttribute('aria-selected', 'true');

				const panel = document.querySelector('[data-panel="' + target + '"]');
				if (panel) panel.classList.add('cns-tab-panel--active');

				if (target === 'preview') drawPreviewCanvas();

				if (target === 'objects') {
					if (selectedAreaId) deselectArea();
					if (!objectsInitialized) {
						initObjectsTab();
						objectsInitialized = true;
					} else {
						drawObjectsCanvas();
					}
					const emptyP = document.querySelector('#cns-context-empty p');
					if (emptyP) emptyP.textContent = 'Select an object on the canvas to edit it here.';
				}

				if (target === 'areas') {
					if (selectedObjectId) deselectObject();
					if (!areasInitialized) {
						initAreasTab();
						areasInitialized = true;
					} else {
						drawAreasCanvas();
					}
					const emptyP = document.querySelector('#cns-context-empty p');
					if (emptyP) emptyP.textContent = 'Select an area on the canvas to edit it here.';
				}
			});
		});
	}

	// ── MasterMap toggle ──────────────────────────────────────────────────────────

	function initMasterMapToggle() {
		const checkbox = document.getElementById('cns-map-is-master');
		if (!checkbox) return;

		function applyToggle() {
			const isMaster = checkbox.checked;
			document.querySelectorAll('[data-master-hide]').forEach(function (el) {
				el.style.display = isMaster ? 'none' : '';
			});
			document.querySelectorAll('[data-master-show]').forEach(function (el) {
				el.style.display = isMaster ? '' : 'none';
			});
			const activeTab = document.querySelector('.cns-tab--active');
			if (activeTab && activeTab.style.display === 'none') {
				document.querySelector('.cns-tab[data-tab="settings"]').click();
			}
		}

		applyToggle();
		checkbox.addEventListener('change', applyToggle);
	}

	// ── Range sliders ─────────────────────────────────────────────────────────────

	function initRangeSliders() {
		document.querySelectorAll('input[type="range"]').forEach(function (slider) {
			const output = document.querySelector('output[for="' + slider.id + '"]');
			if (!output) return;
			output.textContent = parseFloat(slider.value).toFixed(2);
			slider.addEventListener('input', function () {
				output.textContent = parseFloat(slider.value).toFixed(2);
			});
		});
	}

	// ── Settings canvas ───────────────────────────────────────────────────────────

	function initEditorCanvas() {
		const canvas = document.getElementById('cns-editor-canvas');
		if (!canvas) return;

		const imageIdEl   = document.getElementById('cns-map-image-id');
		const bgImageIdEl = document.getElementById('cns-map-bg-image-id');
		if (imageIdEl   && window.cnsMapEditor) imageIdEl.dataset.currentUrl   = window.cnsMapEditor.imageUrl   || '';
		if (bgImageIdEl && window.cnsMapEditor) bgImageIdEl.dataset.currentUrl = window.cnsMapEditor.bgImageUrl || '';

		['cns-map-width', 'cns-map-aspect-ratio', 'cns-map-image-x', 'cns-map-image-y', 'cns-map-image-width'].forEach(function (id) {
			const el = document.getElementById(id);
			if (el) el.addEventListener('input', drawEditorCanvas);
		});
		document.querySelectorAll('input[name="cns-map-bg-type"]').forEach(function (r) {
			r.addEventListener('change', drawEditorCanvas);
		});

		drawEditorCanvas();
	}

	function initColorPicker() {
		const colorInput = document.getElementById('cns-map-bg-color');
		if (!colorInput || typeof jQuery === 'undefined' || !jQuery.fn.wpColorPicker) return;
		jQuery(colorInput).wpColorPicker({
			change: function () { setTimeout(drawEditorCanvas, 20); },
			clear:  function () { setTimeout(drawEditorCanvas, 20); },
		});
	}

	function initBgTypeToggle() {
		document.querySelectorAll('input[name="cns-map-bg-type"]').forEach(function (radio) {
			radio.addEventListener('change', function () {
				const isImage = radio.value === 'image';
				document.querySelectorAll('.cns-bg-section--color').forEach(function (el) { el.classList.toggle('cns-hidden', isImage); });
				document.querySelectorAll('.cns-bg-section--image').forEach(function (el) { el.classList.toggle('cns-hidden', !isImage); });
			});
		});
	}

	// ── Media pickers (settings tab) ─────────────────────────────────────────────

	function initImagePicker() {
		const selectBtn = document.getElementById('cns-select-image');
		const removeBtn = document.getElementById('cns-remove-image');
		const imageIdEl = document.getElementById('cns-map-image-id');
		const previewEl = document.getElementById('cns-image-preview');
		if (!selectBtn) return;

		let frame;
		selectBtn.addEventListener('click', function (e) {
			e.preventDefault();
			if (frame) { frame.open(); return; }
			frame = wp.media({ title: 'Select Base Map Image', button: { text: 'Use this image' }, multiple: false, library: { type: 'image' } });
			frame.on('select', function () {
				const att = frame.state().get('selection').first().toJSON();
				imageIdEl.value = att.id; imageIdEl.dataset.currentUrl = att.url;
				previewEl.innerHTML = '<img src="' + att.url + '" alt="" />';
				if (removeBtn) removeBtn.classList.remove('cns-hidden');
				drawEditorCanvas();
			});
			frame.open();
		});
		if (removeBtn) {
			removeBtn.addEventListener('click', function (e) {
				e.preventDefault();
				imageIdEl.value = '0'; imageIdEl.dataset.currentUrl = '';
				previewEl.innerHTML = '<span>No image selected</span>';
				removeBtn.classList.add('cns-hidden');
				drawEditorCanvas();
			});
		}
	}

	function initBgImagePicker() {
		const selectBtn   = document.getElementById('cns-select-bg-image');
		const removeBtn   = document.getElementById('cns-remove-bg-image');
		const bgImageIdEl = document.getElementById('cns-map-bg-image-id');
		const previewEl   = document.getElementById('cns-bg-image-preview');
		if (!selectBtn) return;

		let frame;
		selectBtn.addEventListener('click', function (e) {
			e.preventDefault();
			if (frame) { frame.open(); return; }
			frame = wp.media({ title: 'Select Background Image', button: { text: 'Use this image' }, multiple: false, library: { type: 'image' } });
			frame.on('select', function () {
				const att = frame.state().get('selection').first().toJSON();
				bgImageIdEl.value = att.id; bgImageIdEl.dataset.currentUrl = att.url;
				previewEl.innerHTML = '<img src="' + att.url + '" alt="" />';
				if (removeBtn) removeBtn.classList.remove('cns-hidden');
				drawEditorCanvas();
			});
			frame.open();
		});
		if (removeBtn) {
			removeBtn.addEventListener('click', function (e) {
				e.preventDefault();
				bgImageIdEl.value = '0'; bgImageIdEl.dataset.currentUrl = '';
				previewEl.innerHTML = '<span>No image selected</span>';
				removeBtn.classList.add('cns-hidden');
				drawEditorCanvas();
			});
		}
	}

	// ── Objects module — state ────────────────────────────────────────────────────

	let objectsList        = [];
	let selectedObjectId   = null;
	let objectsInitialized = false;
	let repositioningId    = null;
	let repositionCursor   = null;

	// ── Areas module — state ──────────────────────────────────────────────────────

	let areasList            = [];
	let selectedAreaId       = null;
	let areasInitialized     = false;
	let repositioningNodeIdx = null;
	let nodeRepoCursor       = null;
	let areaPanelController  = null;

	const NODE_HALF = 5; // node rect half-size in pixels

	// ── Context panel — dispatcher ────────────────────────────────────────────────
	// ctxHandler is set by the active tab; context panel buttons delegate through it.

	let ctxHandler = null;

	const objectsCtxHandler = {
		save: async function () {
			if (!panelController || !selectedObjectId) return;
			const mapId = parseInt(document.querySelector('.cns-map-editor')?.dataset.mapId, 10) || 0;
			try {
				const data = await performSaveObject(mapId, selectedObjectId, panelController.collect(), 'cns-context-save-status', 'cns-context-save');
				const titleEl = document.getElementById('cns-context-title');
				if (titleEl && data?.title) titleEl.textContent = data.title || '(no title)';
			} catch { /* error shown by performSaveObject */ }
		},
		delete: function () { if (selectedObjectId) deleteObject(selectedObjectId); },
		close:  function () { deselectObject(); },
		reposition: function () {
			const canvas = document.getElementById('cns-objects-canvas');
			const obj    = objectsList.find(function (o) { return o.id === selectedObjectId; });
			if (canvas && obj) enterRepositionMode(canvas, obj);
		},
	};

	// ── Objects — load + render list ──────────────────────────────────────────────

	async function loadObjects(mapId) {
		if (!mapId) { renderObjectsList([]); return; }
		try {
			const res  = await apiFetch('GET', '/maps/' + mapId + '/objects');
			const data = await res.json();
			if (res.ok) { objectsList = data; renderObjectsList(data); drawObjectsCanvas(); }
		} catch { /* silent */ }
	}

	function renderObjectsList(objects) {
		const container = document.getElementById('cns-objects-list');
		if (!container) return;

		if (!objects.length) {
			container.innerHTML = '<p class="cns-objects-empty">No objects yet. Click on the canvas to place one.</p>';
			return;
		}

		const rows = objects.map(function (obj) {
			const iconHtml = obj.icon_url
				? '<img src="' + esc(obj.icon_url) + '" width="28" height="28" alt="" style="display:block;object-fit:contain" />'
				: '<span class="cns-obj-dot" style="background:' + esc(obj.canvas_styles?.fillStyle || '#2271b1') + '"></span>';
			return '<tr data-id="' + obj.id + '">' +
				'<td class="col-icon">' + iconHtml + '</td>' +
				'<td>' + esc(obj.title || '(no title)') + '</td>' +
				'<td><span class="cns-badge cns-badge--type">' + esc(obj.type) + '</span></td>' +
				'<td>' + obj.x + ', ' + obj.y + '</td>' +
				'<td class="cns-maps-actions">' +
					'<button class="button button-small cns-obj-edit" data-id="' + obj.id + '">Edit</button> ' +
					'<button class="button button-small cns-obj-delete" data-id="' + obj.id + '">Delete</button>' +
				'</td>' +
				'</tr>';
		}).join('');

		container.innerHTML =
			'<table class="widefat cns-objects-table">' +
			'<thead><tr><th style="width:36px"></th><th>Title</th><th>Type</th><th>Position</th><th>Actions</th></tr></thead>' +
			'<tbody>' + rows + '</tbody></table>';
	}

	// ── Object form — shared component ────────────────────────────────────────────
	// Both the Add-Object modal and the context panel use this factory.
	// Each call generates a fresh HTML string with a unique radio-group suffix so
	// native radio grouping doesn't bleed between two simultaneously live forms.

	let _formUid = 0;

	function buildObjectFormHTML() {
		const u = ++_formUid;
		const iconsUrl = esc(window.cnsMapSuite?.iconsUrl || '#');
		return (
			'<section class="cns-modal-section">' +
			'<h3>Icon</h3>' +
			'<div class="cns-radio-toggle">' +
			'  <label><input type="radio" name="obj-icon-src-' + u + '" data-field="icon-source" value="svg" checked /> From library</label>' +
			'  <label><input type="radio" name="obj-icon-src-' + u + '" data-field="icon-source" value="image" /> Custom image</label>' +
			'</div>' +
			'<div data-section="icon-svg">' +
			'  <div class="cns-icon-picker-grid" data-field="icon-picker"></div>' +
			'  <p class="description"><a data-field="icon-library-link" href="' + iconsUrl + '" target="_blank">Manage icon library →</a></p>' +
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
			'  <label><input type="radio" name="obj-infobox-src-' + u + '" data-field="infobox-source" value="manual" checked /> Manual</label>' +
			'  <label><input type="radio" name="obj-infobox-src-' + u + '" data-field="infobox-source" value="post" /> From post</label>' +
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

	// Factory: returns { populate, collect, renderIconPicker, initInteractivity }.
	// All DOM queries are scoped to `root` so two instances can coexist without
	// ID conflicts. Radios use data-field for read/write; native name groups
	// them within their own form root.
	function createObjectFormController(root) {
		let localSelectedIconId = null;

		function q(field)  { return root.querySelector('[data-field="' + field + '"]'); }
		function qs(field) { return Array.from(root.querySelectorAll('[data-field="' + field + '"]')); }

		function getRadio(field)       { return qs(field).find(function (r) { return r.checked; })?.value; }
		function setRadioVal(field, v) { qs(field).forEach(function (r) { r.checked = r.value === v; }); }

		function populate(obj, x, y) {
			// Icon source
			const isSvg = !obj || !obj.icon_image_id || obj.icon_mime === 'image/svg+xml';
			setRadioVal('icon-source', isSvg ? 'svg' : 'image');
			root.querySelector('[data-section="icon-svg"]').classList.toggle('cns-hidden', !isSvg);
			root.querySelector('[data-section="icon-image"]').classList.toggle('cns-hidden', isSvg);
			localSelectedIconId = (isSvg && obj?.icon_image_id) ? obj.icon_image_id : null;

			// Custom icon image
			const iconImgId = q('icon-image-id');
			if (iconImgId) iconImgId.value = (!isSvg && obj?.icon_image_id) ? obj.icon_image_id : '0';
			const iconPrev = q('icon-preview');
			if (iconPrev) iconPrev.innerHTML = (obj?.icon_url && !isSvg) ? '<img src="' + esc(obj.icon_url) + '" alt="" />' : '<span>No image selected</span>';
			const rmIcon = root.querySelector('[data-action="remove-icon-image"]');
			if (rmIcon) rmIcon.classList.toggle('cns-hidden', !(obj?.icon_url && !isSvg));

			// Details
			if (q('title'))       q('title').value       = obj?.title       || '';
			if (q('type'))        q('type').value         = obj?.type        || 'LOCATION';
			if (q('object-time')) q('object-time').value  = obj?.object_time ?? 0;
			if (q('x'))           q('x').value            = obj ? obj.x : (x ?? 0);
			if (q('y'))           q('y').value            = obj ? obj.y : (y ?? 0);

			// Infobox source
			const ibSrc = obj?.infobox_source || 'manual';
			setRadioVal('infobox-source', ibSrc);
			root.querySelector('[data-section="infobox-manual"]').classList.toggle('cns-hidden', ibSrc === 'post');
			root.querySelector('[data-section="infobox-post"]').classList.toggle('cns-hidden', ibSrc !== 'post');

			// Manual infobox
			if (q('infobox-title')) q('infobox-title').value = obj?.infobox_data?.title       || '';
			if (q('infobox-desc'))  q('infobox-desc').value  = obj?.infobox_data?.description || '';
			const ibImgId = q('infobox-image-id');
			if (ibImgId) ibImgId.value = obj?.infobox_data?.image_id || '0';
			const ibPrev = q('infobox-image-preview');
			if (ibPrev) ibPrev.innerHTML = '<span>No image selected</span>';
			const rmIb = root.querySelector('[data-action="remove-infobox-image"]');
			if (rmIb) rmIb.classList.add('cns-hidden');

			// Linked post
			const linkedId = q('linked-post-id');
			if (linkedId) linkedId.value = obj?.linked_post_id || '0';
			const postLabel = q('linked-post-label');
			if (postLabel) {
				if (obj?.linked_post_id) {
					postLabel.textContent = 'Post ID: ' + obj.linked_post_id;
					postLabel.classList.remove('cns-hidden');
				} else {
					postLabel.classList.add('cns-hidden');
				}
			}
			const ps = q('post-search');
			if (ps) ps.value = '';
			const pr = q('post-results');
			if (pr) pr.hidden = true;

			// Design
			const size   = obj?.canvas_styles?.size        || 32;
			const fill   = obj?.canvas_styles?.fillStyle   || '#ffffff';
			const stroke = obj?.canvas_styles?.strokeStyle || '#2271b1';
			const sizeEl = q('size');
			if (sizeEl) {
				sizeEl.value = size;
				const out = sizeEl.parentElement?.querySelector('output.cns-range-value');
				if (out) out.textContent = size;
			}
			if (q('fill'))   q('fill').value   = fill;
			if (q('stroke')) q('stroke').value = stroke;

			renderIconPicker();
		}

		function collect() {
			const iconSource = getRadio('icon-source') || 'svg';
			const iconImageId = iconSource === 'svg'
				? (localSelectedIconId || 0)
				: (parseInt(q('icon-image-id')?.value, 10) || 0);

			return {
				icon_image_id:       iconImageId,
				title:               q('title')?.value        || '',
				type:                q('type')?.value         || 'LOCATION',
				x:                   parseInt(q('x')?.value, 10)           || 0,
				y:                   parseInt(q('y')?.value, 10)           || 0,
				object_time:         parseInt(q('object-time')?.value, 10) || 0,
				infobox_source:      getRadio('infobox-source')             || 'manual',
				linked_post_id:      parseInt(q('linked-post-id')?.value, 10) || 0,
				infobox_title:       q('infobox-title')?.value || '',
				infobox_description: q('infobox-desc')?.value  || '',
				infobox_image_id:    parseInt(q('infobox-image-id')?.value, 10) || 0,
				style_size:          parseInt(q('size')?.value, 10)   || 32,
				style_fill:          q('fill')?.value                 || '#ffffff',
				style_stroke:        q('stroke')?.value               || '#2271b1',
			};
		}

		function renderIconPicker() {
			const grid = q('icon-picker');
			if (!grid) return;
			const icons = iconLibraryCache || [];
			if (!icons.length) {
				grid.innerHTML = '<p class="description">No icons yet. <a href="' + esc(window.cnsMapSuite?.iconsUrl || '#') + '" target="_blank">Add icons →</a></p>';
				return;
			}
			grid.innerHTML = icons.map(function (icon) {
				const active = icon.id === localSelectedIconId ? ' cns-icon-item--active' : '';
				return '<button type="button" class="cns-icon-item' + active + '" data-id="' + icon.id + '" title="' + esc(icon.title) + '">' +
					'<img src="' + esc(icon.url) + '" alt="' + esc(icon.title) + '" /></button>';
			}).join('');
			grid.querySelectorAll('.cns-icon-item').forEach(function (btn) {
				btn.addEventListener('click', function () {
					localSelectedIconId = parseInt(btn.dataset.id, 10);
					grid.querySelectorAll('.cns-icon-item').forEach(function (b) { b.classList.remove('cns-icon-item--active'); });
					btn.classList.add('cns-icon-item--active');
				});
			});
		}

		function initInteractivity() {
			// Icon source toggle
			qs('icon-source').forEach(function (radio) {
				radio.addEventListener('change', function () {
					const isSvg = radio.value === 'svg';
					root.querySelector('[data-section="icon-svg"]').classList.toggle('cns-hidden', !isSvg);
					root.querySelector('[data-section="icon-image"]').classList.toggle('cns-hidden', isSvg);
				});
			});

			// Infobox source toggle
			qs('infobox-source').forEach(function (radio) {
				radio.addEventListener('change', function () {
					const isPost = radio.value === 'post';
					root.querySelector('[data-section="infobox-manual"]').classList.toggle('cns-hidden', isPost);
					root.querySelector('[data-section="infobox-post"]').classList.toggle('cns-hidden', !isPost);
				});
			});

			// Icon library link
			const libLink = q('icon-library-link');
			if (libLink && window.cnsMapSuite?.iconsUrl) libLink.href = window.cnsMapSuite.iconsUrl;

			// Media pickers
			initFormMediaPicker(root, 'icon-image');
			initFormMediaPicker(root, 'infobox-image');

			// Post search
			initFormPostSearch(root);

			// Range slider
			const sizeSlider = q('size');
			const sizeOutput = sizeSlider?.parentElement?.querySelector('output.cns-range-value');
			if (sizeSlider && sizeOutput) {
				sizeSlider.addEventListener('input', function () { sizeOutput.textContent = sizeSlider.value; });
			}
		}

		return { populate, collect, renderIconPicker, initInteractivity };
	}

	// Reusable media picker wired to data-action and data-field attributes within root.
	function initFormMediaPicker(root, prefix) {
		const selectBtn = root.querySelector('[data-action="select-' + prefix + '"]');
		const removeBtn = root.querySelector('[data-action="remove-' + prefix + '"]');
		const hiddenEl  = root.querySelector('[data-field="' + prefix + '-id"]');
		const previewEl = root.querySelector('[data-field="' + prefix + '-preview"]');
		if (!selectBtn) return;

		let frame;
		selectBtn.addEventListener('click', function (e) {
			e.preventDefault();
			if (frame) { frame.open(); return; }
			frame = wp.media({ title: 'Select Image', button: { text: 'Use this image' }, multiple: false, library: { type: 'image' } });
			frame.on('select', function () {
				const att = frame.state().get('selection').first().toJSON();
				if (hiddenEl)  hiddenEl.value = att.id;
				if (previewEl) previewEl.innerHTML = '<img src="' + att.url + '" alt="" />';
				if (removeBtn) removeBtn.classList.remove('cns-hidden');
			});
			frame.open();
		});

		if (removeBtn) {
			removeBtn.addEventListener('click', function (e) {
				e.preventDefault();
				if (hiddenEl)  hiddenEl.value = '0';
				if (previewEl) previewEl.innerHTML = '<span>No image selected</span>';
				removeBtn.classList.add('cns-hidden');
			});
		}
	}

	// Reusable post-search dropdown wired to data-field attributes within root.
	function initFormPostSearch(root) {
		const searchEl  = root.querySelector('[data-field="post-search"]');
		const resultsEl = root.querySelector('[data-field="post-results"]');
		const linkedEl  = root.querySelector('[data-field="linked-post-id"]');
		const labelEl   = root.querySelector('[data-field="linked-post-label"]');
		if (!searchEl) return;

		let timer;
		searchEl.addEventListener('input', function () {
			clearTimeout(timer);
			const query = searchEl.value.trim();
			if (query.length < 2) { if (resultsEl) resultsEl.hidden = true; return; }
			timer = setTimeout(async function () {
				try {
					const url  = window.cnsMapSuite.wpRestUrl + '/search?search=' + encodeURIComponent(query) + '&type=post&subtype=any&per_page=10';
					const res  = await fetch(url, { headers: { 'X-WP-Nonce': window.cnsMapSuite.nonce } });
					const data = await res.json();
					if (!Array.isArray(data) || !resultsEl) return;
					resultsEl.innerHTML = data.length
						? data.map(function (item) {
							return '<button type="button" class="cns-post-result" data-id="' + item.id + '" data-title="' + esc(item.title) + '">' +
								esc(item.title) + ' <span class="cns-post-result__type">' + esc(item.subtype) + '</span></button>';
						}).join('')
						: '<p class="cns-post-results__empty">No posts found.</p>';
					resultsEl.hidden = false;
				} catch { /* silent */ }
			}, 350);
		});

		if (resultsEl) {
			resultsEl.addEventListener('click', function (e) {
				const btn = e.target.closest('.cns-post-result');
				if (!btn) return;
				if (linkedEl) linkedEl.value = btn.dataset.id;
				if (labelEl)  { labelEl.textContent = btn.dataset.title; labelEl.classList.remove('cns-hidden'); }
				searchEl.value  = '';
				resultsEl.hidden = true;
			});
		}
	}

	// ── Objects — repositioning ───────────────────────────────────────────────────

	function enterRepositionMode(canvas, obj) {
		repositioningId  = obj.id;
		repositionCursor = { x: obj.x, y: obj.y };
		canvas.classList.add('cns-canvas--repositioning');
		drawObjectsCanvas();
	}

	function exitRepositionMode(canvas) {
		repositioningId  = null;
		repositionCursor = null;
		selectedObjectId = null;
		canvas.classList.remove('cns-canvas--repositioning');
	}

	async function commitReposition(canvas, id, x, y) {
		exitRepositionMode(canvas);
		try {
			const res  = await apiFetch('PATCH', '/objects/' + id + '/position', { x, y });
			const data = await res.json();
			if (res.ok) {
				const idx = objectsList.findIndex(function (o) { return o.id === id; });
				if (idx !== -1) objectsList[idx] = data;
				renderObjectsList(objectsList);
			}
		} catch { /* silent */ }
		drawObjectsCanvas();
	}

	// ── Objects — canvas interaction ──────────────────────────────────────────────
	// Click model:
	//   hit, not yet selected → select object (show context panel)
	//   hit, already selected → enter repositioning mode
	//   no hit, repositioning  → drop at new position
	//   no hit, not repos.     → open Add Object modal

	function selectObject(obj) {
		selectedObjectId = obj.id;
		drawObjectsCanvas();
		showContextObject(obj);
	}

	function deselectObject() {
		selectedObjectId = null;
		drawObjectsCanvas();
		hideContextPanel();
	}

	function initObjectsCanvas(mapId) {
		const canvas = document.getElementById('cns-objects-canvas');
		if (!canvas) return;

		canvas.addEventListener('mousemove', function (e) {
			if (!repositioningId) return;
			repositionCursor = getCanvasCoords(canvas, e);
			drawObjectsCanvas();
		});

		canvas.addEventListener('click', async function (e) {
			const coords = getCanvasCoords(canvas, e);
			const ctx    = canvas.getContext('2d');

			// Explicit reposition mode (started via Reposition button) — drop on any click.
			if (repositioningId) {
				commitReposition(canvas, repositioningId, coords.x, coords.y);
				return;
			}

			const hit = findObjectAtPoint(ctx, coords.x, coords.y, objectsList);

			if (hit) {
				// Clicked inside an object's bounding rect → select it.
				selectObject(hit);
			} else if (selectedObjectId) {
				// Clicked on empty canvas with an object selected → move it here.
				const id = selectedObjectId;
				try {
					const res  = await apiFetch('PATCH', '/objects/' + id + '/position', { x: coords.x, y: coords.y });
					const data = await res.json();
					if (res.ok) {
						const idx = objectsList.findIndex(function (o) { return o.id === id; });
						if (idx !== -1) objectsList[idx] = data;
						renderObjectsList(objectsList);
						showContextObject(data);
					}
				} catch { /* silent */ }
				drawObjectsCanvas();
			} else {
				deselectObject();
			}
		});

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') {
				if (repositioningId) { exitRepositionMode(canvas); drawObjectsCanvas(); }
				else if (selectedObjectId) { deselectObject(); }
			}
		});
	}

	// ── Objects tab — init ────────────────────────────────────────────────────────

	function initObjectsTab() {
		const editor = document.querySelector('.cns-map-editor');
		if (!editor) return;
		const mapId = parseInt(editor.dataset.mapId, 10) || 0;

		initObjectsCanvas(mapId);
		initObjectModal(mapId);
		loadObjects(mapId);

		document.getElementById('cns-add-object')?.addEventListener('click', function () {
			deselectObject();
			const state = collectDrawState();
			const cx    = Math.round(state.width / 2);
			const cy    = Math.round(state.width / state.aspectRatio / 2);
			openObjectModal(null, cx, cy);
		});
	}

	// ── Object modal ──────────────────────────────────────────────────────────────

	let editingObjectId  = null;
	let iconLibraryCache = null;
	let modalController  = null;
	let panelController  = null;

	function _ensureIconCache(callback) {
		if (iconLibraryCache) { callback(); return; }
		loadIconLibraryIntoCache().then(callback);
	}

	function openObjectModal(obj, x, y) {
		const modal = document.getElementById('cns-object-modal');
		if (!modal) return;

		const editor = document.querySelector('.cns-map-editor');
		const mapId  = parseInt(editor?.dataset.mapId, 10) || 0;

		// Build the form body the first time the modal is opened.
		if (!modalController) {
			const body = document.getElementById('cns-object-modal-body');
			if (body) {
				body.innerHTML = buildObjectFormHTML();
				modalController = createObjectFormController(body);
				modalController.initInteractivity();
			}
		}

		editingObjectId = obj ? obj.id : null;
		modal.querySelector('.cns-modal__title').textContent = obj ? 'Edit Object' : 'Add Object';

		if (modalController) {
			modalController.populate(obj, x, y);
			_ensureIconCache(function () { modalController.renderIconPicker(); });
		}

		modal.hidden = false;
		document.body.classList.add('cns-modal-open');
	}

	function closeObjectModal() {
		const modal = document.getElementById('cns-object-modal');
		if (!modal) return;
		modal.hidden = true;
		document.body.classList.remove('cns-modal-open');
	}

	async function performSaveObject(mapId, editId, payload, statusId, saveBtnId) {
		const statusEl = statusId ? document.getElementById(statusId) : null;
		const saveBtn  = saveBtnId ? document.getElementById(saveBtnId) : null;

		if (statusEl) { statusEl.textContent = 'Saving…'; statusEl.className = 'cns-save-status'; }
		if (saveBtn)  saveBtn.disabled = true;

		try {
			const url  = editId ? '/objects/' + editId : '/maps/' + mapId + '/objects';
			const res  = await apiFetch('POST', url, payload);
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || 'Save failed.');

			if (editId) {
				objectsList = objectsList.map(function (o) { return o.id === editId ? data : o; });
			} else {
				objectsList.push(data);
			}

			renderObjectsList(objectsList);
			drawObjectsCanvas();

			if (statusEl) {
				statusEl.textContent = 'Saved.';
				statusEl.className   = 'cns-save-status cns-save-status--ok';
				setTimeout(function () { statusEl.textContent = ''; statusEl.className = 'cns-save-status'; }, 2000);
			}

			return data;
		} catch (err) {
			if (statusEl) { statusEl.textContent = err.message; statusEl.className = 'cns-save-status cns-save-status--error'; }
			throw err;
		} finally {
			if (saveBtn) saveBtn.disabled = false;
		}
	}

	async function deleteObject(id) {
		if (!confirm('Delete this object?')) return;
		try {
			const res = await apiFetch('DELETE', '/objects/' + id);
			if (!res.ok) throw new Error('Delete failed.');
			objectsList = objectsList.filter(function (o) { return o.id !== id; });
			renderObjectsList(objectsList);
			if (selectedObjectId === id) deselectObject();
			drawObjectsCanvas();
		} catch (err) {
			alert(err.message);
		}
	}

	function initObjectModal(mapId) {
		const modal = document.getElementById('cns-object-modal');
		if (!modal) return;

		modal.querySelector('.cns-modal__close')?.addEventListener('click', closeObjectModal);
		modal.querySelector('.cns-modal__backdrop')?.addEventListener('click', closeObjectModal);
		document.getElementById('cns-object-cancel')?.addEventListener('click', closeObjectModal);

		document.getElementById('cns-object-save')?.addEventListener('click', async function () {
			if (!modalController) return;
			try {
				await performSaveObject(mapId, editingObjectId, modalController.collect(), 'cns-object-save-status', 'cns-object-save');
				closeObjectModal();
			} catch { /* error displayed by performSaveObject */ }
		});

		// Event delegation for list edit/delete.
		document.getElementById('cns-objects-list')?.addEventListener('click', function (e) {
			const editBtn   = e.target.closest('.cns-obj-edit');
			const deleteBtn = e.target.closest('.cns-obj-delete');
			if (editBtn) {
				const id  = parseInt(editBtn.dataset.id, 10);
				const obj = objectsList.find(function (o) { return o.id === id; });
				if (obj) openObjectModal(obj, null, null);
			}
			if (deleteBtn) {
				deleteObject(parseInt(deleteBtn.dataset.id, 10));
			}
		});
	}

	// ── Context panel ─────────────────────────────────────────────────────────────
	// Creates two sub-containers inside #cns-context-body — one for objects, one for
	// areas — and wires all footer buttons through the ctxHandler dispatcher.

	function initContextPanel() {
		const body = document.getElementById('cns-context-body');
		if (!body) return;

		// Object form sub-container
		const objDiv  = document.createElement('div');
		objDiv.id     = 'cns-ctx-obj-body';
		objDiv.innerHTML = buildObjectFormHTML();
		body.appendChild(objDiv);
		panelController = createObjectFormController(objDiv);
		panelController.initInteractivity();

		// Area form sub-container (populated when initAreasTab() runs)
		const areaDiv  = document.createElement('div');
		areaDiv.id     = 'cns-ctx-area-body';
		areaDiv.hidden = true;
		body.appendChild(areaDiv);

		// Wire buttons through dispatcher
		document.getElementById('cns-context-save')?.addEventListener('click', function () {
			ctxHandler?.save();
		});
		document.getElementById('cns-context-delete')?.addEventListener('click', function () {
			ctxHandler?.delete();
		});
		document.getElementById('cns-context-close')?.addEventListener('click', function () {
			ctxHandler?.close();
		});
		document.getElementById('cns-context-reposition')?.addEventListener('click', function () {
			ctxHandler?.reposition();
		});
	}

	function showContextObject(obj) {
		const emptyEl   = document.getElementById('cns-context-empty');
		const formEl    = document.getElementById('cns-context-form');
		const titleEl   = document.getElementById('cns-context-title');
		const statEl    = document.getElementById('cns-context-save-status');
		const reposBtn  = document.getElementById('cns-context-reposition');
		const objBody   = document.getElementById('cns-ctx-obj-body');
		const areaBody  = document.getElementById('cns-ctx-area-body');

		if (objBody)   objBody.hidden   = false;
		if (areaBody)  areaBody.hidden  = true;
		if (reposBtn)  reposBtn.hidden  = false;
		if (emptyEl)   emptyEl.hidden   = true;
		if (formEl)    formEl.hidden    = false;
		if (titleEl)   titleEl.textContent = obj.title || '(no title)';
		if (statEl)    { statEl.textContent = ''; statEl.className = 'cns-save-status'; }

		ctxHandler = objectsCtxHandler;

		if (panelController) {
			panelController.populate(obj, null, null);
			_ensureIconCache(function () { panelController.renderIconPicker(); });
		}
	}

	function showContextForArea(area) {
		const emptyEl   = document.getElementById('cns-context-empty');
		const formEl    = document.getElementById('cns-context-form');
		const titleEl   = document.getElementById('cns-context-title');
		const statEl    = document.getElementById('cns-context-save-status');
		const reposBtn  = document.getElementById('cns-context-reposition');
		const objBody   = document.getElementById('cns-ctx-obj-body');
		const areaBody  = document.getElementById('cns-ctx-area-body');

		if (objBody)   objBody.hidden   = true;
		if (areaBody)  areaBody.hidden  = false;
		if (reposBtn)  reposBtn.hidden  = true;
		if (emptyEl)   emptyEl.hidden   = true;
		if (formEl)    formEl.hidden    = false;
		if (titleEl)   titleEl.textContent = area.title || '(no title)';
		if (statEl)    { statEl.textContent = ''; statEl.className = 'cns-save-status'; }

		ctxHandler = areasCtxHandler;

		if (areaPanelController) {
			areaPanelController.populate(area);
			renderNodeList(area);
		}
	}

	function hideContextPanel() {
		const emptyEl = document.getElementById('cns-context-empty');
		const formEl  = document.getElementById('cns-context-form');
		if (emptyEl) emptyEl.hidden = false;
		if (formEl)  formEl.hidden  = true;
	}

	// ── Areas module ──────────────────────────────────────────────────────────────

	function buildAreaFormHTML() {
		const u = ++_formUid;
		return (
			'<section class="cns-modal-section">' +
			'<h3>Details</h3>' +
			'<div class="cns-form-grid">' +
			'  <div class="cns-form-row cns-form-row--full"><label>Title</label><input type="text" data-field="title" class="large-text" /></div>' +
			'  <div class="cns-form-row"><label>Type</label><select data-field="type">' +
			'    <option value="GEOGRAPHY">Geography</option><option value="HISTORY">History</option>' +
			'    <option value="NATURAL">Natural</option><option value="EVENT">Event</option><option value="OTHER">Other</option>' +
			'  </select></div>' +
			'  <div class="cns-form-row"><label>Object Time</label><input type="number" data-field="object-time" class="small-text" value="0" /></div>' +
			'</div></section>' +

			'<section class="cns-modal-section">' +
			'<h3>Infobox</h3>' +
			'<div class="cns-radio-toggle">' +
			'  <label><input type="radio" name="area-ib-src-' + u + '" data-field="infobox-source" value="manual" checked /> Manual</label>' +
			'  <label><input type="radio" name="area-ib-src-' + u + '" data-field="infobox-source" value="post" /> From post</label>' +
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

	function createAreaFormController(root) {
		function q(field)  { return root.querySelector('[data-field="' + field + '"]'); }
		function qs(field) { return Array.from(root.querySelectorAll('[data-field="' + field + '"]')); }
		function getRadio(field)      { return qs(field).find(function (r) { return r.checked; })?.value; }
		function setRadio(field, val) { qs(field).forEach(function (r) { r.checked = r.value === val; }); }

		function populate(area) {
			if (q('title'))       q('title').value       = area?.title        || '';
			if (q('type'))        q('type').value         = area?.type         || 'GEOGRAPHY';
			if (q('object-time')) q('object-time').value  = area?.object_time  ?? 0;

			const ibSrc = area?.infobox_source || 'manual';
			setRadio('infobox-source', ibSrc);
			root.querySelector('[data-section="infobox-manual"]')?.classList.toggle('cns-hidden', ibSrc === 'post');
			root.querySelector('[data-section="infobox-post"]')?.classList.toggle('cns-hidden',   ibSrc !== 'post');

			if (q('infobox-title')) q('infobox-title').value = area?.infobox_data?.title       || '';
			if (q('infobox-desc'))  q('infobox-desc').value  = area?.infobox_data?.description || '';

			const linkedEl = q('linked-post-id');
			if (linkedEl) linkedEl.value = area?.linked_post_id || '0';
			const labelEl = q('linked-post-label');
			if (labelEl) {
				if (area?.linked_post_id) {
					labelEl.textContent = 'Post ID: ' + area.linked_post_id;
					labelEl.classList.remove('cns-hidden');
				} else {
					labelEl.classList.add('cns-hidden');
				}
			}
			const ps = q('post-search'); if (ps) ps.value = '';
			const pr = q('post-results'); if (pr) pr.hidden = true;

			const styles = area?.canvas_styles || {};
			if (q('area-fill'))         q('area-fill').value         = styles.fill        || '#2271b1';
			if (q('area-stroke'))       q('area-stroke').value       = styles.stroke      || '#2271b1';
			if (q('area-stroke-width')) q('area-stroke-width').value = styles.strokeWidth || 2;
			const opEl = q('area-fill-opacity');
			if (opEl) {
				opEl.value = styles.fillOpacity ?? 0.3;
				const out = opEl.parentElement?.querySelector('output.cns-range-value');
				if (out) out.textContent = parseFloat(opEl.value).toFixed(2);
			}
		}

		function collect() {
			return {
				title:               q('title')?.value       || '',
				type:                q('type')?.value        || 'GEOGRAPHY',
				shape_type:          'POLYGON',
				object_time:         parseInt(q('object-time')?.value, 10) || 0,
				infobox_source:      getRadio('infobox-source') || 'manual',
				infobox_title:       q('infobox-title')?.value || '',
				infobox_description: q('infobox-desc')?.value  || '',
				linked_post_id:      parseInt(q('linked-post-id')?.value, 10) || 0,
				style_fill:          q('area-fill')?.value          || '#2271b1',
				style_fill_opacity:  parseFloat(q('area-fill-opacity')?.value) || 0.3,
				style_stroke:        q('area-stroke')?.value        || '#2271b1',
				style_stroke_width:  parseInt(q('area-stroke-width')?.value, 10) || 2,
			};
		}

		function initInteractivity() {
			qs('infobox-source').forEach(function (radio) {
				radio.addEventListener('change', function () {
					const isPost = radio.value === 'post';
					root.querySelector('[data-section="infobox-manual"]')?.classList.toggle('cns-hidden', isPost);
					root.querySelector('[data-section="infobox-post"]')?.classList.toggle('cns-hidden', !isPost);
				});
			});
			initFormPostSearch(root);
			const opEl  = q('area-fill-opacity');
			const opOut = opEl?.parentElement?.querySelector('output.cns-range-value');
			if (opEl && opOut) {
				opEl.addEventListener('input', function () {
					opOut.textContent = parseFloat(opEl.value).toFixed(2);
				});
			}
		}

		return { populate, collect, initInteractivity };
	}

	// ── Areas — context panel node list ──────────────────────────────────────────

	function renderNodeList(area) {
		const container = document.getElementById('cns-ctx-area-nodes');
		if (!container) return;
		const nodes = area.nodes || [];

		const rows = nodes.map(function (node, idx) {
			const xPct = (node.x * 100).toFixed(1);
			const yPct = (node.y * 100).toFixed(1);
			return '<tr>' +
				'<td class="cns-node-num">' + (idx + 1) + '</td>' +
				'<td><input type="number" class="small-text cns-node-x" data-idx="' + idx + '" value="' + xPct + '" min="0" max="100" step="0.1" /></td>' +
				'<td><input type="number" class="small-text cns-node-y" data-idx="' + idx + '" value="' + yPct + '" min="0" max="100" step="0.1" /></td>' +
				'<td><button type="button" class="button button-small cns-node-del" data-idx="' + idx + '">&times;</button></td>' +
				'</tr>';
		}).join('');

		container.innerHTML =
			'<section class="cns-modal-section cns-nodes-section">' +
			'<h3>Nodes' +
			'  <button type="button" class="button button-small cns-nodes-add-btn">+ Add Node</button>' +
			'</h3>' +
			(nodes.length
				? '<table class="cns-nodes-table">' +
				  '<thead><tr><th>#</th><th>X&nbsp;%</th><th>Y&nbsp;%</th><th></th></tr></thead>' +
				  '<tbody>' + rows + '</tbody></table>'
				: '<p class="description">No nodes yet. Click the canvas to add nodes.</p>'
			) +
			'</section>';

		container.querySelectorAll('.cns-node-x, .cns-node-y').forEach(function (input) {
			input.addEventListener('input', function () {
				const idx  = parseInt(input.dataset.idx, 10);
				const a    = areasList.find(function (a) { return a.id === selectedAreaId; });
				if (!a || !a.nodes[idx]) return;
				const val  = Math.max(0, Math.min(100, parseFloat(input.value) || 0)) / 100;
				if (input.classList.contains('cns-node-x')) { a.nodes[idx].x = val; }
				else                                         { a.nodes[idx].y = val; }
				drawAreasCanvas();
			});
		});

		container.querySelectorAll('.cns-node-del').forEach(function (btn) {
			btn.addEventListener('click', function () {
				const idx = parseInt(btn.dataset.idx, 10);
				const a   = areasList.find(function (a) { return a.id === selectedAreaId; });
				if (!a) return;
				a.nodes.splice(idx, 1);
				renderNodeList(a);
				drawAreasCanvas();
			});
		});

		container.querySelector('.cns-nodes-add-btn')?.addEventListener('click', function () {
			const a = areasList.find(function (a) { return a.id === selectedAreaId; });
			if (!a) return;
			a.nodes.push({ x: 0.5, y: 0.5 });
			renderNodeList(a);
			drawAreasCanvas();
		});
	}

	// ── Areas — load + render list ────────────────────────────────────────────────

	async function loadAreas(mapId) {
		if (!mapId) { renderAreasList([]); return; }
		try {
			const res  = await apiFetch('GET', '/maps/' + mapId + '/areas');
			const data = await res.json();
			if (res.ok) { areasList = data; renderAreasList(data); drawAreasCanvas(); }
		} catch { /* silent */ }
	}

	function renderAreasList(areas) {
		const container = document.getElementById('cns-areas-list');
		if (!container) return;

		if (!areas.length) {
			container.innerHTML = '<p class="cns-objects-empty">No areas yet. Click "Add Area" to create one.</p>';
			return;
		}

		const rows = areas.map(function (area) {
			return '<tr data-id="' + area.id + '">' +
				'<td>' + esc(area.title || '(no title)') + '</td>' +
				'<td><span class="cns-badge cns-badge--type">' + esc(area.type) + '</span></td>' +
				'<td>' + (area.nodes || []).length + ' nodes</td>' +
				'<td class="cns-maps-actions">' +
					'<button class="button button-small cns-area-select" data-id="' + area.id + '">Select</button> ' +
					'<button class="button button-small cns-area-delete" data-id="' + area.id + '">Delete</button>' +
				'</td></tr>';
		}).join('');

		container.innerHTML =
			'<table class="widefat cns-objects-table">' +
			'<thead><tr><th>Title</th><th>Type</th><th>Nodes</th><th>Actions</th></tr></thead>' +
			'<tbody>' + rows + '</tbody></table>';
	}

	// ── Areas — select / deselect ─────────────────────────────────────────────────

	function selectArea(area) {
		selectedAreaId = area.id;
		repositioningNodeIdx = null;
		nodeRepoCursor = null;
		drawAreasCanvas();
		showContextForArea(area);
	}

	function deselectArea() {
		selectedAreaId = null;
		repositioningNodeIdx = null;
		nodeRepoCursor = null;
		document.getElementById('cns-areas-canvas')?.classList.remove('cns-canvas--repositioning');
		drawAreasCanvas();
		hideContextPanel();
	}

	// ── Areas — save / delete ─────────────────────────────────────────────────────

	const areasCtxHandler = {
		save: async function () {
			if (!areaPanelController || !selectedAreaId) return;
			const mapId   = parseInt(document.querySelector('.cns-map-editor')?.dataset.mapId, 10) || 0;
			const statusEl = document.getElementById('cns-context-save-status');
			const saveBtn  = document.getElementById('cns-context-save');
			if (statusEl) { statusEl.textContent = 'Saving…'; statusEl.className = 'cns-save-status'; }
			if (saveBtn)  saveBtn.disabled = true;
			try {
				const meta  = areaPanelController.collect();
				const area  = areasList.find(function (a) { return a.id === selectedAreaId; });
				const payload = Object.assign({}, meta, { nodes: JSON.stringify(area ? area.nodes : []) });
				const res  = await apiFetch('POST', '/areas/' + selectedAreaId, payload);
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || 'Save failed.');
				areasList = areasList.map(function (a) { return a.id === selectedAreaId ? data : a; });
				renderAreasList(areasList);
				renderNodeList(data);
				const titleEl = document.getElementById('cns-context-title');
				if (titleEl) titleEl.textContent = data.title || '(no title)';
				if (statusEl) {
					statusEl.textContent = 'Saved.';
					statusEl.className   = 'cns-save-status cns-save-status--ok';
					setTimeout(function () { statusEl.textContent = ''; statusEl.className = 'cns-save-status'; }, 2000);
				}
				drawAreasCanvas();
			} catch (err) {
				if (statusEl) { statusEl.textContent = err.message; statusEl.className = 'cns-save-status cns-save-status--error'; }
			} finally {
				if (saveBtn) saveBtn.disabled = false;
			}
		},
		delete: function () {
			if (!selectedAreaId || !confirm('Delete this area?')) return;
			const id = selectedAreaId;
			apiFetch('DELETE', '/areas/' + id).then(function (res) {
				if (!res.ok) { alert('Delete failed.'); return; }
				areasList = areasList.filter(function (a) { return a.id !== id; });
				renderAreasList(areasList);
				deselectArea();
			}).catch(function () { alert('Delete failed.'); });
		},
		close: function () { deselectArea(); },
	};

	// ── Areas — canvas init ───────────────────────────────────────────────────────

	function initAreasCanvas(mapId) {
		const canvas = document.getElementById('cns-areas-canvas');
		if (!canvas) return;

		canvas.addEventListener('mousemove', function (e) {
			if (repositioningNodeIdx === null) return;
			nodeRepoCursor = getCanvasCoords(canvas, e);
			drawAreasCanvas();
		});

		canvas.addEventListener('click', function (e) {
			const { x, y } = getCanvasCoords(canvas, e);
			const ctx = canvas.getContext('2d');
			const W   = canvas.width;
			const H   = canvas.height;

			// Commit node reposition on any click while in reposition mode.
			if (repositioningNodeIdx !== null) {
				const area = areasList.find(function (a) { return a.id === selectedAreaId; });
				if (area && area.nodes[repositioningNodeIdx]) {
					area.nodes[repositioningNodeIdx] = { x: x / W, y: y / H };
					renderNodeList(area);
				}
				repositioningNodeIdx = null;
				nodeRepoCursor = null;
				canvas.classList.remove('cns-canvas--repositioning');
				drawAreasCanvas();
				return;
			}

			// Hit test: node on the currently selected area.
			const selArea = selectedAreaId ? areasList.find(function (a) { return a.id === selectedAreaId; }) : null;
			if (selArea) {
				const nodeIdx = findNodeAtPoint(ctx, x, y, selArea.nodes || [], W, H);
				if (nodeIdx !== -1) {
					repositioningNodeIdx = nodeIdx;
					nodeRepoCursor = { x, y };
					canvas.classList.add('cns-canvas--repositioning');
					drawAreasCanvas();
					return;
				}
			}

			// Hit test: area polygon.
			const hitArea = findAreaAtPoint(ctx, x, y, areasList, W, H);
			if (hitArea) {
				selectArea(hitArea);
				return;
			}

			// Selected area + click on empty canvas → add new node.
			if (selArea) {
				selArea.nodes.push({ x: x / W, y: y / H });
				renderNodeList(selArea);
				drawAreasCanvas();
				return;
			}

			deselectArea();
		});

		document.addEventListener('keydown', function (e) {
			const areasActive = document.querySelector('[data-panel="areas"].cns-tab-panel--active');
			if (!areasActive || repositioningNodeIdx === null) return;

			if (e.key === 'Enter' && nodeRepoCursor) {
				const area = areasList.find(function (a) { return a.id === selectedAreaId; });
				if (area && area.nodes[repositioningNodeIdx]) {
					area.nodes[repositioningNodeIdx] = {
						x: nodeRepoCursor.x / canvas.width,
						y: nodeRepoCursor.y / canvas.height,
					};
					renderNodeList(area);
				}
			}
			if (e.key === 'Escape' || e.key === 'Enter') {
				repositioningNodeIdx = null;
				nodeRepoCursor = null;
				canvas.classList.remove('cns-canvas--repositioning');
				drawAreasCanvas();
			}
		});
	}

	// ── Areas — tab init ──────────────────────────────────────────────────────────

	function initAreasTab() {
		const editor = document.querySelector('.cns-map-editor');
		if (!editor) return;
		const mapId = parseInt(editor.dataset.mapId, 10) || 0;

		// Build area form + node list inside the shared panel sub-container.
		const areaBody = document.getElementById('cns-ctx-area-body');
		if (areaBody && !areaPanelController) {
			const formDiv = document.createElement('div');
			formDiv.id    = 'cns-ctx-area-form';
			formDiv.innerHTML = buildAreaFormHTML();
			areaBody.appendChild(formDiv);

			const nodesDiv = document.createElement('div');
			nodesDiv.id    = 'cns-ctx-area-nodes';
			areaBody.appendChild(nodesDiv);

			areaPanelController = createAreaFormController(formDiv);
			areaPanelController.initInteractivity();
		}

		initAreasCanvas(mapId);
		loadAreas(mapId);

		// List delegation (wired once).
		document.getElementById('cns-areas-list')?.addEventListener('click', function (e) {
			const selBtn = e.target.closest('.cns-area-select');
			const delBtn = e.target.closest('.cns-area-delete');
			if (selBtn) {
				const id   = parseInt(selBtn.dataset.id, 10);
				const area = areasList.find(function (a) { return a.id === id; });
				if (area) selectArea(area);
			}
			if (delBtn) {
				const id = parseInt(delBtn.dataset.id, 10);
				if (!confirm('Delete this area?')) return;
				apiFetch('DELETE', '/areas/' + id).then(function (res) {
					if (!res.ok) { alert('Delete failed.'); return; }
					areasList = areasList.filter(function (a) { return a.id !== id; });
					renderAreasList(areasList);
					if (selectedAreaId === id) deselectArea();
					drawAreasCanvas();
				}).catch(function () { alert('Delete failed.'); });
			}
		});

		document.getElementById('cns-add-area')?.addEventListener('click', async function () {
			if (!mapId) return;
			const defaultNodes = [
				{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 },
				{ x: 0.75, y: 0.75 }, { x: 0.25, y: 0.75 },
			];
			try {
				const res  = await apiFetch('POST', '/maps/' + mapId + '/areas', {
					title:               'New Area',
					nodes:               JSON.stringify(defaultNodes),
					style_fill:          '#2271b1',
					style_fill_opacity:  0.3,
					style_stroke:        '#2271b1',
					style_stroke_width:  2,
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || 'Failed to create area.');
				areasList.push(data);
				renderAreasList(areasList);
				drawAreasCanvas();
				selectArea(data);
			} catch (err) { alert(err.message); }
		});
	}

	// ── Icon library — shared cache ───────────────────────────────────────────────

	async function loadIconLibraryIntoCache() {
		try {
			const res  = await apiFetch('GET', '/icons');
			const data = await res.json();
			if (res.ok) iconLibraryCache = data;
		} catch { iconLibraryCache = []; }
	}

	// ── Icon library page ─────────────────────────────────────────────────────────

	async function initIconLibraryPage() {
		const grid = document.getElementById('cns-icon-library-grid');
		if (!grid) return;

		await loadIconLibraryIntoCache();
		renderIconLibraryGrid();

		document.getElementById('cns-add-icon-btn')?.addEventListener('click', function () {
			const frame = wp.media({
				title:    'Select or Upload SVG Icon',
				button:   { text: 'Add to library' },
				multiple: false,
				library:  { type: 'image/svg+xml' },
			});
			frame.on('select', async function () {
				const att = frame.state().get('selection').first().toJSON();
				try {
					const res  = await apiFetch('POST', '/icons', { attachment_id: att.id });
					const data = await res.json();
					if (!res.ok) throw new Error(data.message || 'Failed to add icon.');
					if (!iconLibraryCache) iconLibraryCache = [];
					iconLibraryCache.push(data);
					renderIconLibraryGrid();
				} catch (err) { alert(err.message); }
			});
			frame.open();
		});
	}

	function renderIconLibraryGrid() {
		const grid  = document.getElementById('cns-icon-library-grid');
		if (!grid) return;
		const icons = iconLibraryCache || [];

		if (!icons.length) {
			grid.innerHTML = '<p class="cns-icon-library-grid__empty">No icons yet. Click “Add Icon” to upload an SVG.</p>';
			return;
		}

		grid.innerHTML = icons.map(function (icon) {
			return '<div class="cns-icon-library-item">' +
				'<div class="cns-icon-library-item__preview"><img src="' + esc(icon.url) + '" alt="' + esc(icon.title) + '" /></div>' +
				'<span class="cns-icon-library-item__name">' + esc(icon.title) + '</span>' +
				'<button type="button" class="cns-icon-library-item__remove" data-id="' + icon.id + '" aria-label="Remove">&times;</button>' +
				'</div>';
		}).join('');

		grid.querySelectorAll('.cns-icon-library-item__remove').forEach(function (btn) {
			btn.addEventListener('click', async function () {
				const id = parseInt(btn.dataset.id, 10);
				if (!confirm('Remove this icon from the library? (The attachment itself is kept.)')) return;
				try {
					const res = await apiFetch('DELETE', '/icons/' + id);
					if (!res.ok) throw new Error('Remove failed.');
					iconLibraryCache = (iconLibraryCache || []).filter(function (i) { return i.id !== id; });
					renderIconLibraryGrid();
				} catch (err) { alert(err.message); }
			});
		});
	}

	// ── Map settings — save ───────────────────────────────────────────────────────

	function collectPayload(mapId) {
		return {
			map_id:       mapId,
			title:        document.getElementById('cns-map-title')?.value ?? '',
			status:       'publish',
			width:        parseInt(document.getElementById('cns-map-width')?.value, 10) || 1000,
			aspect_ratio: parseFloat(document.getElementById('cns-map-aspect-ratio')?.value) || 1.0,
			time:         parseInt(document.getElementById('cns-map-time')?.value, 10) || 0,
			image_id:     parseInt(document.getElementById('cns-map-image-id')?.value, 10) || 0,
			image_x:      parseFloat(document.getElementById('cns-map-image-x')?.value) || 0,
			image_y:      parseFloat(document.getElementById('cns-map-image-y')?.value) || 0,
			image_width:  parseFloat(document.getElementById('cns-map-image-width')?.value) || 1.0,
			is_master:    document.getElementById('cns-map-is-master')?.checked ?? false,
			featured:     document.getElementById('cns-map-featured')?.checked ?? false,
			bg_type:      document.querySelector('input[name="cns-map-bg-type"]:checked')?.value ?? 'color',
			bg_color:     document.getElementById('cns-map-bg-color')?.value ?? '#1a1a2e',
			bg_image_id:  parseInt(document.getElementById('cns-map-bg-image-id')?.value, 10) || 0,
		};
	}

	function initSave() {
		const saveBtn  = document.getElementById('cns-map-save');
		const statusEl = document.getElementById('cns-save-status');
		const editor   = document.querySelector('.cns-map-editor');
		if (!saveBtn || !editor) return;

		saveBtn.addEventListener('click', async function () {
			const mapId  = parseInt(editor.dataset.mapId, 10) || 0;
			saveBtn.disabled = true;
			statusEl.textContent = 'Saving…';
			statusEl.className   = 'cns-save-status';

			try {
				const res  = await apiFetch('POST', '/maps', collectPayload(mapId));
				const data = await res.json();
				if (!res.ok) throw new Error(data.message || 'Save failed.');
				if (data.created) {
					window.location.href = data.edit_url;
				} else {
					statusEl.textContent = 'Saved.';
					statusEl.className   = 'cns-save-status cns-save-status--ok';
					setTimeout(function () { statusEl.textContent = ''; statusEl.className = 'cns-save-status'; }, 2000);
				}
			} catch (err) {
				statusEl.textContent = err.message;
				statusEl.className   = 'cns-save-status cns-save-status--error';
			} finally {
				saveBtn.disabled = false;
			}
		});
	}

	// ── Utilities ─────────────────────────────────────────────────────────────────

	function apiFetch(method, path, body) {
		const opts = {
			method:  method,
			headers: { 'X-WP-Nonce': window.cnsMapSuite.nonce },
		};
		if (body) {
			opts.headers['Content-Type'] = 'application/json';
			opts.body = JSON.stringify(body);
		}
		return fetch(window.cnsMapSuite.restUrl + path, opts);
	}

	function esc(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	// ── Boot ──────────────────────────────────────────────────────────────────────

	document.addEventListener('DOMContentLoaded', function () {
		initTabs();
		initMasterMapToggle();
		initRangeSliders();
		initEditorCanvas();
		initColorPicker();
		initBgTypeToggle();
		initImagePicker();
		initBgImagePicker();
		initSave();
		initContextPanel();
		initIconLibraryPage();
	});
}());
