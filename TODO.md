# To Do

## Best Practices

-   [x] Add `wp_localize_script()` to pass nonce and REST URL to admin JS
-   [x] Add custom capability `manage_maps` instead of relying on `manage_options`
-   [x] Wrap all direct DB queries in `$wpdb->prepare()` (no raw user-input queries yet; standard documented in database.php)
-   [x] Create REST endpoint with `permission_callback` for editor save operations
-   [x] Add `languages/` directory and generate `.pot` file with `wp i18n make-pot`
-   [x] Add `readme.txt` for WordPress.org / plugin documentation
-   [x] Add opt-in setting to delete map posts on uninstall

## Editor — Save

-   [x] Wire up save: persist title, meta fields, and publish status via REST with nonce
-   [x] Global "Save Map" button flushes outstanding area changes (previously areas required the separate panel Save button)

## Editor — Objects Tab

-   [x] SVG icon picker from icon library (per-object fill/stroke color overrides via DOMParser + Blob URL)
-   [x] Add Object modal (icon, details, infobox, design sections) — shared form component reused in context panel
-   [x] Context panel (25% right column, sticky) — shows selected object's fields, Save/Delete/Reposition buttons
-   [x] Canvas hit detection via `isPointInPath` on per-object rect paths (same approach planned for areas)
-   [x] Click object → select + show context panel; click empty canvas with selection → reposition to click point
-   [x] Explicit reposition mode via panel button — ghost follows cursor, click to drop; Escape to cancel
-   [x] Linked post selector (debounced REST search, any CPT)
-   [x] Manual infobox editor (title, description, image picker)
-   [x] Icon image override (WP media library, raster)
-   [x] Object list with Edit (opens modal) and Delete actions
-   [x] Icon Library page — SVG upload with DOMDocument sanitizer, library grid, add/remove

## Editor — Areas Tab

-   [x] Polygon drawing mode — click empty canvas on selected area to add node; first 4 nodes default to square arrangement on "Add Area"
-   [x] Hit detection via `isPointInPath` — polygon path tested with `ctx.isPointInPath()` for area selection; node rects tested with `ctx.isPointInPath()` for node selection — both mirror the object hit detection pattern
-   [x] Node repositioning — click node → ghost follows cursor (red border rect); click or Enter to confirm, Escape to cancel
-   [x] Area context panel — `buildAreaFormHTML()` + `createAreaFormController(root)` follow the same factory pattern as the object form; shared fields (`infobox-source`, `post-search`, etc.) reuse the same `data-field` names and helpers
-   [x] Node list in context panel — x%/y% inputs (step 0.1 = 0.1% granularity, stored as 0–1 fractions), per-node delete, Add Node button; input changes mutate `areasList` in memory and trigger live canvas redraw
-   [x] Context panel dispatcher pattern (`ctxHandler`) — Objects and Areas share `#cns-context-form`; sub-containers `#cns-ctx-obj-body` / `#cns-ctx-area-body` toggle on selection; Reposition button hidden for areas
-   [x] REST CRUD for areas — `GET/POST /maps/{id}/areas`, `POST/DELETE /areas/{id}`; nodes normalized to JS array on response
-   [ ] Bezier drawing mode (same nodes, rendered with smooth curves via `quadraticCurveTo`)
-   [ ] Circle drawing mode (click center, drag to set radius)

## Editor — Hierarchy Tab (MasterMap)

-   [ ] Canvas region drawing tool for linking to child maps
-   [ ] Child map search/select picker
-   [ ] Hover preview in editor showing child map thumbnail and excerpt

## Editor — Canvas

-   [x] Live canvas preview in Settings tab (two-column layout, sticky right column)
-   [x] Render base map image at stored position and relative width via range sliders
-   [x] Background color via WP iris color picker
-   [x] Background image via WP media picker (cover scaling — fills canvas, preserves aspect ratio)
-   [x] Preview tab renders live canvas using shared draw pipeline — includes all placed objects and areas
-   [x] Objects tab canvas — live preview of all placed objects with selection rings
-   [x] Areas tab canvas — live preview of all polygons; node handles on selected area

## Editor — Preview Tab

-   [x] Full canvas preview with all objects and areas rendered (fetches from REST if objects/areas tabs not yet visited)
-   [x] "View Map" button in editor header for published maps
-   [x] "View map page" link in preview panel for published maps

## Frontend — Block (`cns-map-suite/map`)

-   [x] `render.php` pre-loads all map data (settings, objects with icon URLs and canvas styles, areas with nodes and styles) as inline `<script type="application/json" data-cns-map>` — no REST calls needed on page load
-   [x] Infobox data resolved server-side: linked-post mode uses `post_title`, `post_excerpt`, full rendered `post_content` (via `apply_filters('the_content', ...)`), featured image URL, and permalink; manual mode uses stored title/description/image
-   [x] `view.js` draws background (solid color or cover-scaled image), base map image, area polygons, and object markers (SVG with color overrides or fallback circles) on page load
-   [x] Hit detection on click — `isPointInPath` with rect paths for objects, polygon paths for areas (mirrors editor approach)
-   [x] Side drawer infobox — slides in from the right on object/area click; shows featured image, title, full rendered post content, and "View full post" link; backdrop click or Escape closes it; class-toggle visibility (avoids `[hidden]` vs author-CSS conflict)
-   [x] Block embeds in any post or page via the standard block inserter (select map by ID)
-   [ ] Bezier and circle area rendering (matches editor when those drawing modes are implemented)
-   [ ] Responsive canvas — scale to container width, maintain aspect ratio
-   [ ] Loading state while map data is fetched (currently all pre-loaded; only relevant if lazy loading is added later)
-   [ ] Keyboard navigation and focus management for objects and areas

## Frontend — Standalone Map Page (`/maps/slug/`)

-   [x] `the_content` filter renders the map block on single map CPT pages (Gutenberg is disabled for the CPT so there is no native content)
-   [x] Re-entrancy guard (`static $rendering`) prevents recursive `the_content` calls when resolving linked-post content
-   [x] Block assets (viewScript + style) explicitly enqueued via `wp_enqueue_scripts` for single map pages so styles land in `<head>`
-   [x] "View" link in maps overview table for published maps
-   [ ] MasterMap: hover over region shows child map thumbnail and excerpt tooltip
-   [ ] MasterMap: click on region navigates to child map URL

## Code Cleanup

-   [x] `performSaveArea()` extracted, mirroring `performSaveObject()` — area saves no longer duplicate inline fetch logic
-   [x] `_setupMediaPicker()` extracted — `initImagePicker`, `initBgImagePicker`, and `initFormMediaPicker` all delegate to a single implementation
-   [x] `showContextPanel()` extracted — `showContextObject()` and `showContextForArea()` merged into a shared dispatcher
-   [ ] `buildAreaFormHTML()` → PHP template instead of hard-coded string; type labels should come from custom taxonomy or `wp_options`
-   [ ] `drawEditorCanvas()` / `drawPreviewCanvas()` — consolidate around the shared `drawFullCanvas()` pipeline

## Done

-   ✅ Plugin scaffold (CPT, DB tables, admin menu, block)
-   ✅ Activation / deactivation / uninstall lifecycle hooks
-   ✅ DB version tracking on `plugins_loaded` for automatic schema migrations
-   ✅ `load_plugin_textdomain()` for i18n
-   ✅ README.md with structure, functionality, and design decisions
-   ✅ All Best Practices items (capability, prepare() standard, .pot, readme.txt, uninstall opt-in)
-   ✅ Editor canvas — live preview, background controls, cover-scaled bg image, range sliders, shared draw pipeline
-   ✅ Objects tab — full CRUD, context panel (75/25 layout), `isPointInPath` hit detection, click-to-reposition, shared form component, icon library
-   ✅ Areas tab — polygon editor with node handles, node repositioning (click/Enter/Escape), add node by clicking canvas, node list with x%/y% inputs, context panel dispatcher pattern, REST CRUD, relative node coordinates
-   ✅ Frontend block — server-side data pre-loading, full canvas render, hit detection, side drawer infobox with full post content
-   ✅ Standalone map pages — `the_content` filter, re-entrancy guard, asset enqueue
-   ✅ Admin.js refactoring — `performSaveArea`, `_setupMediaPicker`, `showContextPanel` extracted
