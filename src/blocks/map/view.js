(function () {
	'use strict';

	// ── Image / SVG cache ─────────────────────────────────────────────────────

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

	// ── Draw pipeline ─────────────────────────────────────────────────────────

	async function drawBackground(canvas, data) {
		const ctx    = canvas.getContext('2d');
		const width  = canvas.width;
		const height = canvas.height;
		ctx.clearRect(0, 0, width, height);

		if (data.bgType === 'image' && data.bgImageUrl) {
			const bgImg = await loadImage(data.bgImageUrl);
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
			ctx.fillStyle = data.bgColor || '#1a1a2e';
			ctx.fillRect(0, 0, width, height);
		}

		if (data.imgUrl) {
			const mapImg = await loadImage(data.imgUrl);
			if (mapImg) {
				const drawW = width * (data.imageW || 1);
				const drawH = drawW * (mapImg.naturalHeight / mapImg.naturalWidth);
				ctx.drawImage(mapImg, width * (data.imageX || 0), height * (data.imageY || 0), drawW, drawH);
			}
		}
	}

	function buildPolygonPath(ctx, nodes, W, H) {
		ctx.moveTo(nodes[0].x * W, nodes[0].y * H);
		for (let i = 1; i < nodes.length; i++) {
			ctx.lineTo(nodes[i].x * W, nodes[i].y * H);
		}
		ctx.closePath();
	}

	function buildBezierPath(ctx, nodes, W, H) {
		const n      = nodes.length;
		const startX = (nodes[n - 1].x + nodes[0].x) / 2 * W;
		const startY = (nodes[n - 1].y + nodes[0].y) / 2 * H;
		ctx.moveTo(startX, startY);
		for (let i = 0; i < n; i++) {
			const cp   = nodes[i];
			const next = nodes[(i + 1) % n];
			ctx.quadraticCurveTo(cp.x * W, cp.y * H, (cp.x + next.x) / 2 * W, (cp.y + next.y) / 2 * H);
		}
		ctx.closePath();
	}

	function buildCirclePath(ctx, nodes, W, H) {
		const cx = nodes[0].x * W;
		const cy = nodes[0].y * H;
		const rx = Math.max(Math.abs(nodes[1].x - nodes[0].x) * W, 1);
		const ry = Math.max(Math.abs(nodes[1].y - nodes[0].y) * H, 1);
		ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
	}

	function buildAreaPathFromNodes(ctx, nodes, shapeType, W, H) {
		ctx.beginPath();
		switch (shapeType) {
			case 'BEZIER':
				if (nodes.length >= 3) buildBezierPath(ctx, nodes, W, H);
				break;
			case 'CIRCLE':
				if (nodes.length >= 2) buildCirclePath(ctx, nodes, W, H);
				break;
			case 'RECTANGLE':
			default:
				if (nodes.length >= 3) buildPolygonPath(ctx, nodes, W, H);
				break;
		}
	}

	function drawHierarchyRegion(ctx, region, W, H) {
		const nodes = region.nodes || [];
		if (nodes.length < 3) return;

		const styles      = region.canvas_styles || {};
		const fill        = styles.fill        || '#e8a020';
		const fillOpacity = styles.fillOpacity ?? 0.25;
		const stroke      = styles.stroke      || '#e8a020';
		const strokeWidth = styles.strokeWidth || 2;

		ctx.beginPath();
		buildPolygonPath(ctx, nodes, W, H);

		ctx.save();
		ctx.globalAlpha = fillOpacity;
		ctx.fillStyle   = fill;
		ctx.fill();
		ctx.restore();

		ctx.strokeStyle = stroke;
		ctx.lineWidth   = strokeWidth;
		ctx.stroke();

		if (region.child_map_title) {
			const cx = nodes.reduce(function (s, n) { return s + n.x; }, 0) / nodes.length * W;
			const cy = nodes.reduce(function (s, n) { return s + n.y; }, 0) / nodes.length * H;
			ctx.save();
			ctx.font         = 'bold 12px sans-serif';
			ctx.textAlign    = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle    = '#fff';
			ctx.strokeStyle  = 'rgba(0,0,0,0.6)';
			ctx.lineWidth    = 3;
			ctx.strokeText(region.child_map_title, cx, cy);
			ctx.fillText(region.child_map_title, cx, cy);
			ctx.restore();
		}
	}

	function findHierarchyRegionAtPoint(ctx, x, y, regions, W, H) {
		for (var i = regions.length - 1; i >= 0; i--) {
			var region = regions[i];
			var nodes  = region.nodes || [];
			if (nodes.length < 3) continue;
			ctx.beginPath();
			buildPolygonPath(ctx, nodes, W, H);
			if (ctx.isPointInPath(x, y)) return region;
		}
		return null;
	}

	function drawAreaShape(ctx, area, W, H) {
		const nodes = area.nodes || [];
		if (!nodes.length) return;

		const shapeType = area.shape_type || 'POLYGON';
		const minNodes  = shapeType === 'CIRCLE' ? 2 : 3;
		if (nodes.length < minNodes) return;

		const styles      = area.canvas_styles || {};
		const fill        = styles.fill        || '#2271b1';
		const fillOpacity = styles.fillOpacity ?? 0.3;
		const stroke      = styles.stroke      || '#2271b1';
		const strokeWidth = styles.strokeWidth || 2;

		buildAreaPathFromNodes(ctx, nodes, shapeType, W, H);

		ctx.save();
		ctx.globalAlpha = fillOpacity;
		ctx.fillStyle   = fill;
		ctx.fill();
		ctx.restore();

		ctx.strokeStyle = stroke;
		ctx.lineWidth   = strokeWidth;
		ctx.stroke();
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

	async function drawObjectMarker(ctx, obj) {
		const size   = obj.canvas_styles?.size        || 32;
		const fill   = obj.canvas_styles?.fillStyle   || '#ffffff';
		const stroke = obj.canvas_styles?.strokeStyle || '#2271b1';

		if (obj.icon_url) {
			const img = obj.icon_mime === 'image/svg+xml'
				? await loadSvgWithColors(obj.icon_url, fill, stroke)
				: await loadImage(obj.icon_url);
			if (img) {
				ctx.drawImage(img, obj.x - size / 2, obj.y - size / 2, size, size);
				return;
			}
		}
		drawFallbackMarker(ctx, obj.x, obj.y, size, fill, stroke);
	}

	// ── Hit detection ─────────────────────────────────────────────────────────

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

	function findAreaAtPoint(ctx, x, y, areas, W, H) {
		for (let i = areas.length - 1; i >= 0; i--) {
			const area      = areas[i];
			const nodes     = area.nodes || [];
			const shapeType = area.shape_type || 'POLYGON';
			const minNodes  = shapeType === 'CIRCLE' ? 2 : 3;
			if (nodes.length < minNodes) continue;
			buildAreaPathFromNodes(ctx, nodes, shapeType, W, H);
			if (ctx.isPointInPath(x, y)) return area;
		}
		return null;
	}

	// ── Infobox drawer ────────────────────────────────────────────────────────
	// A single side drawer shared across all map instances on the page.
	// Lives on document.body; class toggle (not hidden attr) controls visibility
	// so author display:flex/block never fights the UA [hidden] rule.

	function escHtml(str) {
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	function closeDrawer(drawer) {
		drawer.classList.remove('is-open');
		document.body.classList.remove('cns-map-drawer-open');
	}

	function getOrCreateDrawer() {
		let drawer = document.getElementById('cns-map-drawer');
		if (!drawer) {
			drawer = document.createElement('div');
			drawer.id        = 'cns-map-drawer';
			drawer.className = 'cns-map-drawer';
			drawer.setAttribute('role', 'dialog');
			drawer.setAttribute('aria-modal', 'true');
			drawer.innerHTML =
				'<div class="cns-map-drawer__backdrop"></div>' +
				'<div class="cns-map-drawer__panel">' +
					'<div class="cns-map-drawer__header">' +
						'<button class="cns-map-drawer__close" aria-label="Close">&times;</button>' +
					'</div>' +
					'<div class="cns-map-drawer__body"></div>' +
				'</div>';
			document.body.appendChild(drawer);

			drawer.querySelector('.cns-map-drawer__backdrop').addEventListener('click', function () {
				closeDrawer(drawer);
			});
			drawer.querySelector('.cns-map-drawer__close').addEventListener('click', function () {
				closeDrawer(drawer);
			});
			document.addEventListener('keydown', function (e) {
				if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer(drawer);
			});
		}
		return drawer;
	}

	function showInfobox(wrap, item) {
		const drawer   = getOrCreateDrawer();
		const body     = drawer.querySelector('.cns-map-drawer__body');
		const resolved = item.infobox_resolved || {};
		const title    = resolved.title    || item.title || '';
		const content  = resolved.content  || '';
		const imgUrl   = resolved.image_url || '';
		const postUrl  = resolved.post_url  || '';

		let html = '';
		if (imgUrl)  html += '<img class="cns-map-drawer__image" src="' + encodeURI(imgUrl) + '" alt="" />';
		if (title)   html += '<h2 class="cns-map-drawer__title">' + escHtml(title) + '</h2>';
		if (content) html += '<div class="cns-map-drawer__content">' + content + '</div>';
		if (postUrl) html += '<a class="cns-map-drawer__link" href="' + encodeURI(postUrl) + '">View full post &rarr;</a>';

		body.innerHTML = html;
		drawer.classList.add('is-open');
		document.body.classList.add('cns-map-drawer-open');
		drawer.querySelector('.cns-map-drawer__close').focus();
	}

	function hideInfobox() {
		const drawer = document.getElementById('cns-map-drawer');
		if (drawer) closeDrawer(drawer);
	}

	// ── Hierarchy tooltip ─────────────────────────────────────────────────────
	// A small tooltip that follows the cursor (or appears near the region) on
	// hover, showing the child map's thumbnail, title and excerpt.
	// All thumbnail images are pre-loaded during initMap for a smooth experience.

	function getOrCreateHierarchyTooltip() {
		var tip = document.getElementById('cns-map-hierarchy-tip');
		if (!tip) {
			tip = document.createElement('div');
			tip.id        = 'cns-map-hierarchy-tip';
			tip.className = 'cns-map-hierarchy-tip';
			tip.setAttribute('aria-hidden', 'true');
			document.body.appendChild(tip);
		}
		return tip;
	}

	function showHierarchyTooltip(region, canvasRect, canvasX, canvasY, scaleX, scaleY) {
		var tip     = getOrCreateHierarchyTooltip();
		var imgHtml = region.child_map_thumbnail
			? '<img class="cns-map-hierarchy-tip__thumb" src="' + encodeURI(region.child_map_thumbnail) + '" alt="" />'
			: '';
		var titleHtml   = region.child_map_title   ? '<strong class="cns-map-hierarchy-tip__title">'   + escHtml(region.child_map_title)   + '</strong>' : '';
		var excerptHtml = region.child_map_excerpt  ? '<p class="cns-map-hierarchy-tip__excerpt">' + escHtml(region.child_map_excerpt) + '</p>'       : '';
		tip.innerHTML = imgHtml + titleHtml + excerptHtml;

		// Position near cursor, offset so it doesn't obscure the pointer.
		var clientX = canvasRect.left + canvasX * scaleX;
		var clientY = canvasRect.top  + canvasY * scaleY;
		tip.style.left = (clientX + 14 + window.scrollX) + 'px';
		tip.style.top  = (clientY - 10 + window.scrollY) + 'px';
		tip.classList.add('is-visible');
	}

	function hideHierarchyTooltip() {
		var tip = document.getElementById('cns-map-hierarchy-tip');
		if (tip) tip.classList.remove('is-visible');
	}

	// ── Map initialiser ───────────────────────────────────────────────────────

	async function initMap(wrapper) {
		const scriptEl = wrapper.querySelector('script[data-cns-map]');
		if (!scriptEl) return;

		let data;
		try { data = JSON.parse(scriptEl.textContent); } catch { return; }

		const canvas = wrapper.querySelector('.cns-map-canvas');
		if (!canvas) return;

		canvas.width  = data.width;
		canvas.height = data.height;

		await drawBackground(canvas, data);

		const ctx = canvas.getContext('2d');
		const W   = canvas.width;
		const H   = canvas.height;

		for (const area of (data.areas || [])) {
			drawAreaShape(ctx, area, W, H);
		}
		for (const region of (data.hierarchyRegions || [])) {
			drawHierarchyRegion(ctx, region, W, H);
		}
		for (const obj of (data.objects || [])) {
			await drawObjectMarker(ctx, obj);
		}

		// Pre-load all hierarchy region thumbnails for smooth hover.
		for (const region of (data.hierarchyRegions || [])) {
			if (region.child_map_thumbnail) loadImage(region.child_map_thumbnail);
		}

		const hierarchyRegions = data.hierarchyRegions || [];
		const hasHierarchy     = hierarchyRegions.length > 0;

		// Infobox click check.
		const hasClickable =
			(data.objects || []).some(function (o) {
				const ib = o.infobox_resolved || {};
				return ib.title || ib.description || ib.image_url;
			}) ||
			(data.areas || []).some(function (a) {
				const ib = a.infobox_resolved || {};
				return ib.title || ib.description || ib.image_url;
			});

		if (!hasClickable && !hasHierarchy) return;

		canvas.style.cursor = 'pointer';

		// ── Hover: hierarchy tooltip ──────────────────────────────────────────
		if (hasHierarchy) {
			canvas.addEventListener('mousemove', function (e) {
				const rect   = canvas.getBoundingClientRect();
				const scaleX = rect.width  / W;
				const scaleY = rect.height / H;
				const x = (e.clientX - rect.left) / scaleX;
				const y = (e.clientY - rect.top)  / scaleY;

				const hitRegion = findHierarchyRegionAtPoint(ctx, x, y, hierarchyRegions, W, H);
				if (hitRegion) {
					canvas.style.cursor = 'pointer';
					showHierarchyTooltip(hitRegion, rect, x, y, scaleX, scaleY);
				} else {
					hideHierarchyTooltip();
				}
			});

			canvas.addEventListener('mouseleave', function () {
				hideHierarchyTooltip();
			});
		}

		// ── Click: hierarchy navigation or infobox ────────────────────────────
		canvas.addEventListener('click', function (e) {
			const rect   = canvas.getBoundingClientRect();
			const scaleX = rect.width  / W;
			const scaleY = rect.height / H;
			const x = (e.clientX - rect.left) / scaleX;
			const y = (e.clientY - rect.top)  / scaleY;

			// Hierarchy regions take top priority — click navigates to child map.
			if (hasHierarchy) {
				const hitRegion = findHierarchyRegionAtPoint(ctx, x, y, hierarchyRegions, W, H);
				if (hitRegion && hitRegion.child_map_url) {
					hideHierarchyTooltip();
					window.location.href = hitRegion.child_map_url;
					return;
				}
			}

			if (!hasClickable) return;

			const hitObj = findObjectAtPoint(ctx, x, y, data.objects || []);
			if (hitObj) { showInfobox(wrapper, hitObj); return; }

			const hitArea = findAreaAtPoint(ctx, x, y, data.areas || [], W, H);
			if (hitArea) { showInfobox(wrapper, hitArea); return; }

			hideInfobox();
		});
	}

	// ── Boot ──────────────────────────────────────────────────────────────────

	function init() {
		document.querySelectorAll('.wp-block-cns-map-suite-map').forEach(initMap);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
}());
