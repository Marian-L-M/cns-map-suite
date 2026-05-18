/* CNS Map Suite — Admin JS */
/* global wp */

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
			});
		});
	}

	// ── MasterMap toggle ─────────────────────────────────────────────────────────
	// Hides Objects/Areas tabs and shows Hierarchy when MasterMap is checked.

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
			// If an active tab is now hidden, fall back to Settings.
			const activeTab = document.querySelector('.cns-tab--active');
			if (activeTab && activeTab.style.display === 'none') {
				document.querySelector('.cns-tab[data-tab="settings"]').click();
			}
		}

		// Initial state on page load.
		applyToggle();
		checkbox.addEventListener('change', applyToggle);
	}

	// ── WP Media picker ──────────────────────────────────────────────────────────

	function initImagePicker() {
		const selectBtn  = document.getElementById('cns-select-image');
		const removeBtn  = document.getElementById('cns-remove-image');
		const imageIdEl  = document.getElementById('cns-map-image-id');
		const previewEl  = document.getElementById('cns-image-preview');

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
				const attachment = mediaFrame.state().get('selection').first().toJSON();
				imageIdEl.value  = attachment.id;
				previewEl.innerHTML = '<img src="' + attachment.url + '" alt="" />';
				if (removeBtn) removeBtn.classList.remove('cns-hidden');
			});

			mediaFrame.open();
		});

		if (removeBtn) {
			removeBtn.addEventListener('click', function (e) {
				e.preventDefault();
				imageIdEl.value      = '0';
				previewEl.innerHTML  = '<span>No image selected</span>';
				removeBtn.classList.add('cns-hidden');
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
					// New map — reload into the editor with the new map_id.
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
		initImagePicker();
		initSave();
	});
}());
