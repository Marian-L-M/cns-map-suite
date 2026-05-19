/* CNS Map Suite — Admin JS */
/* global wp, jQuery */

(function () {
	'use strict';

	// ── Tab switching ────────────────────────────────────────────────────────────

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
				panels.forEach(function (p) {
					p.classList.remove('cns-tab-panel--active');
				});

				tab.classList.add('cns-tab--active');
				tab.setAttribute('aria-selected', 'true');

				const panel = document.querySelector('[data-panel="' + target + '"]');
				if (panel) panel.classList.add('cns-tab-panel--active');

				if (target === 'preview') {
					drawPreviewCanvas();
				}
			});
		});
	}

	// ── MasterMap toggle ─────────────────────────────────────────────────────────

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

	// ── Range sliders ────────────────────────────────────────────────────────────

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

	// ── Canvas image cache ───────────────────────────────────────────────────────

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

	// ── Draw state ───────────────────────────────────────────────────────────────

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

	// ── Core draw function ───────────────────────────────────────────────────────
	// Draws the full map state onto any canvas element.

	async function drawMapCanvas(canvasEl, state) {
		const ctx    = canvasEl.getContext('2d');
		const width  = state.width;
		const height = Math.round(width / state.aspectRatio);

		canvasEl.width  = width;
		canvasEl.height = height;
		ctx.clearRect(0, 0, width, height);

		// Background.
		if (state.bgType === 'image') {
			const bgImg = await loadImage(state.bgImageUrl);
			if (bgImg) {
				// Scale to cover: fill the canvas while preserving aspect ratio (crops edges).
				const scale  = Math.max(width / bgImg.naturalWidth, height / bgImg.naturalHeight);
				const drawW  = bgImg.naturalWidth * scale;
				const drawH  = bgImg.naturalHeight * scale;
				const drawX  = (width - drawW) / 2;
				const drawY  = (height - drawH) / 2;
				ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
			} else {
				ctx.fillStyle = '#888';
				ctx.fillRect(0, 0, width, height);
			}
		} else {
			ctx.fillStyle = state.bgColor;
			ctx.fillRect(0, 0, width, height);
		}

		// Map image.
		const mapImg = await loadImage(state.imgUrl);
		if (mapImg) {
			const drawW = width * state.imageW;
			const drawH = drawW * (mapImg.naturalHeight / mapImg.naturalWidth);
			ctx.drawImage(mapImg, width * state.imageX, height * state.imageY, drawW, drawH);
		}
	}

	// ── Per-canvas helpers ───────────────────────────────────────────────────────

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

	// ── Editor canvas — init + change listeners ──────────────────────────────────

	function initEditorCanvas() {
		const canvas = document.getElementById('cns-editor-canvas');
		if (!canvas) return;

		// Seed URL data from the PHP-rendered inline script.
		const imageIdEl   = document.getElementById('cns-map-image-id');
		const bgImageIdEl = document.getElementById('cns-map-bg-image-id');
		if (imageIdEl && window.cnsMapEditor) {
			imageIdEl.dataset.currentUrl = window.cnsMapEditor.imageUrl || '';
		}
		if (bgImageIdEl && window.cnsMapEditor) {
			bgImageIdEl.dataset.currentUrl = window.cnsMapEditor.bgImageUrl || '';
		}

		['cns-map-width', 'cns-map-aspect-ratio', 'cns-map-image-x', 'cns-map-image-y', 'cns-map-image-width'].forEach(function (id) {
			const el = document.getElementById(id);
			if (el) el.addEventListener('input', drawEditorCanvas);
		});

		document.querySelectorAll('input[name="cns-map-bg-type"]').forEach(function (radio) {
			radio.addEventListener('change', drawEditorCanvas);
		});

		drawEditorCanvas();
	}

	// ── Color picker (WP iris) ───────────────────────────────────────────────────

	function initColorPicker() {
		const colorInput = document.getElementById('cns-map-bg-color');
		if (!colorInput || typeof jQuery === 'undefined' || !jQuery.fn.wpColorPicker) return;

		jQuery(colorInput).wpColorPicker({
			change: function () {
				setTimeout(drawEditorCanvas, 20);
			},
			clear: function () {
				setTimeout(drawEditorCanvas, 20);
			},
		});
	}

	// ── Background type toggle ───────────────────────────────────────────────────

	function initBgTypeToggle() {
		document.querySelectorAll('input[name="cns-map-bg-type"]').forEach(function (radio) {
			radio.addEventListener('change', function () {
				const isImage = radio.value === 'image';
				document.querySelectorAll('.cns-bg-section--color').forEach(function (el) {
					el.classList.toggle('cns-hidden', isImage);
				});
				document.querySelectorAll('.cns-bg-section--image').forEach(function (el) {
					el.classList.toggle('cns-hidden', !isImage);
				});
			});
		});
	}

	// ── WP Media picker (map image) ──────────────────────────────────────────────

	function initImagePicker() {
		const selectBtn = document.getElementById('cns-select-image');
		const removeBtn = document.getElementById('cns-remove-image');
		const imageIdEl = document.getElementById('cns-map-image-id');
		const previewEl = document.getElementById('cns-image-preview');

		if (!selectBtn) return;

		let mediaFrame;

		selectBtn.addEventListener('click', function (e) {
			e.preventDefault();

			if (mediaFrame) {
				mediaFrame.open();
				return;
			}

			mediaFrame = wp.media({
				title:    'Select Base Map Image',
				button:   { text: 'Use this image' },
				multiple: false,
				library:  { type: 'image' },
			});

			mediaFrame.on('select', function () {
				const attachment             = mediaFrame.state().get('selection').first().toJSON();
				imageIdEl.value              = attachment.id;
				imageIdEl.dataset.currentUrl = attachment.url;
				previewEl.innerHTML          = '<img src="' + attachment.url + '" alt="" />';
				if (removeBtn) removeBtn.classList.remove('cns-hidden');
				drawEditorCanvas();
			});

			mediaFrame.open();
		});

		if (removeBtn) {
			removeBtn.addEventListener('click', function (e) {
				e.preventDefault();
				imageIdEl.value              = '0';
				imageIdEl.dataset.currentUrl = '';
				previewEl.innerHTML          = '<span>No image selected</span>';
				removeBtn.classList.add('cns-hidden');
				drawEditorCanvas();
			});
		}
	}

	// ── WP Media picker (background image) ──────────────────────────────────────

	function initBgImagePicker() {
		const selectBtn   = document.getElementById('cns-select-bg-image');
		const removeBtn   = document.getElementById('cns-remove-bg-image');
		const bgImageIdEl = document.getElementById('cns-map-bg-image-id');
		const previewEl   = document.getElementById('cns-bg-image-preview');

		if (!selectBtn) return;

		let mediaFrame;

		selectBtn.addEventListener('click', function (e) {
			e.preventDefault();

			if (mediaFrame) {
				mediaFrame.open();
				return;
			}

			mediaFrame = wp.media({
				title:    'Select Background Image',
				button:   { text: 'Use this image' },
				multiple: false,
				library:  { type: 'image' },
			});

			mediaFrame.on('select', function () {
				const attachment               = mediaFrame.state().get('selection').first().toJSON();
				bgImageIdEl.value              = attachment.id;
				bgImageIdEl.dataset.currentUrl = attachment.url;
				previewEl.innerHTML            = '<img src="' + attachment.url + '" alt="" />';
				if (removeBtn) removeBtn.classList.remove('cns-hidden');
				drawEditorCanvas();
			});

			mediaFrame.open();
		});

		if (removeBtn) {
			removeBtn.addEventListener('click', function (e) {
				e.preventDefault();
				bgImageIdEl.value              = '0';
				bgImageIdEl.dataset.currentUrl = '';
				previewEl.innerHTML            = '<span>No image selected</span>';
				removeBtn.classList.add('cns-hidden');
				drawEditorCanvas();
			});
		}
	}

	// ── Save ─────────────────────────────────────────────────────────────────────

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
			const payload = collectPayload(mapId);

			saveBtn.disabled     = true;
			statusEl.textContent = 'Saving…';
			statusEl.className   = 'cns-save-status';

			try {
				const res  = await fetch(window.cnsMapSuite.restUrl + '/maps', {
					method:  'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce':   window.cnsMapSuite.nonce,
					},
					body: JSON.stringify(payload),
				});

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.message || 'Save failed.');
				}

				if (data.created) {
					window.location.href = data.edit_url;
				} else {
					statusEl.textContent = 'Saved.';
					statusEl.className   = 'cns-save-status cns-save-status--ok';
					setTimeout(function () {
						statusEl.textContent = '';
						statusEl.className   = 'cns-save-status';
					}, 2000);
				}
			} catch (err) {
				statusEl.textContent = err.message;
				statusEl.className   = 'cns-save-status cns-save-status--error';
			} finally {
				saveBtn.disabled = false;
			}
		});
	}

	// ── Boot ─────────────────────────────────────────────────────────────────────

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
	});
}());
