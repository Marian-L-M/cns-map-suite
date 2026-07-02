# CNS Map Suite — Improvement Plan

## Status (updated 2026-07-02, second pass)

**Done & verified:** #1 (`hasClickable` content field), #2 (dead RECTANGLE case), #3 (actions.php capability + post-type checks), #4 (`thumbnail_id` arg + 201 on create), #5 (color sanitization on all style args via `cns_map_suite_sanitize_color`), #7 (public data API), #10 (parallel marker-image loading via `Promise.all`), #11 (N+1 priming via `_prime_post_caches` in map-data.php), #13 (icons capped at 500). Plus: `beforeunload` unsaved-settings guard in MapEditorApp.

**Deliberately deferred:** #6 api.php split (pure restructuring — do as its own reviewed change); #12 DPR/resize-aware canvas (touches every draw + hit-test path in both plugins and needs visual browser verification); #9 tooling/CI; all P3 features.

---

Reviewed: 2026-07-02. Overall this is the most mature of the three plugins: prepared statements everywhere, REST arg schemas with enums, an SVG sanitizer on upload, a dedicated `manage_maps` capability, opt-in data deletion on uninstall, and a versioned dbDelta upgrade path. The plan below is ordered by priority.

---

## P0 — Bugs / correctness

### 1. Frontend "clickable" check tests a field that never exists
`src/blocks/map/view.js` (`hasClickable`, ~line 410) checks `ib.title || ib.description || ib.image_url`, but the server resolves infoboxes into `{title, excerpt, content, image_url, post_url}` (`render.php` → `$resolve_infobox`). An object/area whose infobox has only `content` (no title, no image — e.g. a linked post with an empty title fallback) is treated as non-clickable, so no click handler is attached at all when nothing else on the map is clickable. Change the check to `ib.title || ib.content || ib.image_url`.

### 2. Dead/misleading `RECTANGLE` case in the path builder
`buildAreaPathFromNodes()` in `view.js` switches on `'RECTANGLE'`, but the shape enum everywhere else (REST args, DB, editor) is `POLYGON | BEZIER | CIRCLE`. Remove the label or rename it `POLYGON` so the switch reads truthfully.

### 3. Admin actions rely on nonce alone for authorization
`includes/admin/actions.php` runs on `admin_init` and performs `wp_delete_post()` / `update_option()` after only `check_admin_referer()`. A nonce is CSRF protection, not authorization. Add explicit checks, mirroring what cns-story-suite already does in its `menu.php`:
- `current_user_can('manage_maps')` before both actions;
- verify `get_post_type($map_id) === 'maps'` before deleting, so the endpoint can never delete an arbitrary post ID.

### 4. `thumbnail_id` bypasses the REST schema
`cns_map_suite_rest_save_map()` reads `$request->get_param('thumbnail_id')` but the param is not declared in the `/maps` route `args`. It therefore gets no type coercion/sanitization and is invisible in the route schema. Declare it alongside the other args (`integer`, `absint`). While there: return **201** when a map is created (currently always 200).

### 5. Unvalidated color strings in object styles
`style_fill` / `style_stroke` for objects (and areas/hierarchy) have no `sanitize_callback`; the values are stored raw in `canvas_styles` JSON and later assigned to canvas `fillStyle` and (for SVG icons) injected as `fill`/`stroke` attributes in `loadSvgWithColors()`. Canvas assignment is inert, but the SVG attribute path deserves hygiene. Sanitize with `sanitize_hex_color()` or a small validator that also accepts `rgb()/hsl()` if you need those.

---

## P1 — Structure & code quality

### 6. Split `includes/admin/api.php` (1,094 lines)
One procedural file holds routes + handlers for maps, icons, objects, areas, and hierarchy. Split by resource:

```
includes/rest/
  class-objects-controller.php   (or plain files: objects.php)
  areas.php
  hierarchy.php
  icons.php
  maps.php
```

Full `WP_REST_Controller` classes are optional; even plain per-resource files with a shared `cns_map_suite_permission_check()` would halve the cognitive load. The object/area/hierarchy CRUD handlers are near-identical (exists-check → build row → insert/update → re-select → normalize); a tiny shared helper (`cns_map_suite_rest_crud($table, $normalizer, ...)`) would remove ~200 duplicated lines.

### 7. Expose a public PHP API for other plugins — ✅ DONE 2026-07-02
cns-story-suite re-implements map data assembly (`cns_story_suite_get_map_render_data()`) by querying this plugin's tables and meta directly. That couples the story plugin to your schema. Provide and document:

```php
cns_map_suite_get_map_data( int $map_id, array $opts = [] ): ?array
```

covering settings, objects, areas (already effectively written inside `render.php` — extract it), and treat the DB schema as private. Same for the infobox resolver, which `render.php` defines as a local closure: promote it next to `cns_map_suite_infobox_content()` so story-suite stops carrying its own copy.

> **Status:** Done — `includes/map-data.php` now provides `cns_map_suite_get_map_data($map_id, $opts)` (objects/areas/hierarchy/parents/resolve_infoboxes/image_size options) and `cns_map_suite_resolve_infobox($item)`. The map block's `render.php` consumes it (single source of truth), and story-suite's `cns_story_suite_get_map_render_data()` is now a thin adapter over it. Verified: block output for all maps + the story block is byte-identical before/after the refactor. Remaining direct access from story-suite: only the three admin-side title lookups in `cns_story_suite_resolve_link_title()` — candidates for a future lookup helper.

### 8. Unify data handoff to the frontend
The map block passes data via `<script type="application/json" data-cns-map>` (good); the story block uses a giant `data-story-data` attribute. Standardize on the JSON script tag pattern across the suite and document it as the convention.

### 9. Consistency & hygiene
- Normalization helpers decode `canvas_styles` to `(object)[]` when empty but `array` when set — pick one shape (always object/assoc array) so JS doesn't need `?? {}` defensiveness.
- `load_plugin_textdomain()` is unnecessary since WP 4.6 for plugins hosted with translations; harmless, but you have no `languages/` dir — either add one or drop the call.
- Add `.phpcs.xml` (WPCS), `composer.json` for dev tooling, and run PHPCS + `tsc --noEmit` in CI. There are currently no tests anywhere in the suite; the REST layer is the highest-value target for integration tests (`WP_UnitTestCase` + `rest_do_request`).
- `README.md` documenting the REST namespace, capability, DB tables, and the extension hooks (`cns_map_editor_extensions`, `cns_map_suite_editor_enqueue_assets`) that story-suite already consumes.

---

## P2 — Performance

### 10. Parallelize marker image loading
`initMap()` does `for (const obj of objects) await drawObjectMarker(ctx, obj)` — icons load strictly serially, so 20 markers = 20 sequential round-trips on first paint. Load first, draw after:

```js
const imgs = await Promise.all(objects.map(loadMarkerImage));
objects.forEach((obj, i) => drawMarker(ctx, obj, imgs[i]));
```

This also fixes potential z-order surprises when some icons 404.

### 11. Batch the N+1 lookups in render.php
Each hierarchy row triggers `get_post()`, `get_post_meta()`, `get_the_excerpt()`, `get_permalink()`; each linked-post infobox triggers more. Collect all referenced post IDs first and call `_prime_post_caches($ids, true, true)` once — the subsequent `get_post()` calls then hit the object cache. Same applies to `cns_map_suite_rest_list_hierarchy`.

### 12. Sharpness / responsiveness of the canvas
The canvas is rendered at map-native resolution and scaled by CSS — on retina screens and small containers it's soft. Scale the backing store by `devicePixelRatio` (cap at 2) and redraw on a debounced `ResizeObserver`. This becomes required anyway once you add hover-highlighting (see features).

### 13. Icon list endpoint
`cns_map_suite_rest_list_icons()` uses `posts_per_page => -1` with a `meta_query`. Fine for dozens of icons; add pagination params before the library grows, or at least a hard cap.

---

## P3 — Features

- **Hover feedback on the frontend map**: areas and objects give no hover indication (only hierarchy regions get a tooltip). A highlight redraw on `mousemove` (you already have `isPointInPath` hit detection, per your own convention) plus `cursor` switching would make clickability discoverable.
- **Keyboard accessibility**: the canvas is mouse-only. Provide a visually-hidden list of objects/areas/regions as focusable buttons that open the same drawer / navigate to child maps; add focus trap + focus-restore to the drawer (it sets `aria-modal` but doesn't trap).
- **Time slider**: `object_time` exists on objects, areas, and maps but the frontend never uses it. A range slider filtering objects/areas by time would light up the existing data model — a distinctive worldbuilding feature.
- **Zoom & pan** on the frontend map (wheel/pinch + drag), especially valuable for MasterMaps.
- **Map duplication** ("Duplicate" action in the overview) — cheap to build (copy post, meta, and the three table row-sets) and very useful for versioned maps of the same region at different times.
- **Import/export** (JSON) of a map incl. objects/areas/hierarchy, for backup and moving between sites.
- **Editor unsaved-changes guard**: `MapEditorApp.tsx` has no `beforeunload` warning; settings changes are silently lost on navigation.

---

## Suggested order of work

1. P0 items 1–5 (an afternoon; all small, all real).
2. Extract the public map-data API (#7) — unblocks story-suite cleanup.
3. Parallel icon loading + DPR redraw (#10, #12) — biggest visible win.
4. api.php split + CI/PHPCS (#6, #9).
5. Features, starting with hover feedback + time slider.
