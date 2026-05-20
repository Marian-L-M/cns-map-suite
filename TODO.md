# To Do

## Best Practices

- [x] Add `wp_localize_script()` to pass nonce and REST URL to admin JS
- [x] Add custom capability `manage_maps` instead of relying on `manage_options`
- [x] Wrap all direct DB queries in `$wpdb->prepare()` (no raw user-input queries yet; standard documented in database.php)
- [x] Create REST endpoint with `permission_callback` for editor save operations
- [x] Add `languages/` directory and generate `.pot` file with `wp i18n make-pot`
- [x] Add `readme.txt` for WordPress.org / plugin documentation
- [x] Add opt-in setting to delete map posts on uninstall

## Editor — Save

- [x] Wire up save: persist title, meta fields, and publish status via REST with nonce

## Editor — Objects Tab

- [x] SVG icon picker from icon library (per-object fill/stroke color overrides via DOMParser + Blob URL)
- [x] Add Object modal (icon, details, infobox, design sections) — shared form component reused in context panel
- [x] Context panel (25% right column, sticky) — shows selected object's fields, Save/Delete/Reposition buttons
- [x] Canvas hit detection via `isPointInPath` on per-object rect paths (same approach planned for areas)
- [x] Click object → select + show context panel; click empty canvas with selection → reposition to click point
- [x] Explicit reposition mode via panel button — ghost follows cursor, click to drop; Escape to cancel
- [x] Linked post selector (debounced REST search, any CPT)
- [x] Manual infobox editor (title, description, image picker)
- [x] Icon image override (WP media library, raster)
- [x] Object list with Edit (opens modal) and Delete actions
- [x] Icon Library page — SVG upload with DOMDocument sanitizer, library grid, add/remove

## Editor — Areas Tab

- [ ] Polygon drawing mode (click to add nodes, click first node to close path)
- [ ] Bezier drawing mode (same nodes, rendered with smooth curves)
- [ ] Circle drawing mode (click center, drag to set radius)
- [ ] Hit detection via `isPointInPath` — reconstruct area path (`lineTo` / `quadraticCurveTo` / `arc`) and call `ctx.isPointInPath()`, matching the object detection pattern
- [ ] Node drag-to-reposition editing for existing areas
- [ ] Area context panel (reuse `createObjectFormController` pattern — shared form factory for area fields)

## Editor — Hierarchy Tab (MasterMap)

- [ ] Canvas region drawing tool for linking to child maps
- [ ] Child map search/select picker
- [ ] Hover preview in editor showing child map thumbnail and excerpt

## Editor — Canvas

- [x] Live canvas preview in Settings tab (two-column layout, sticky right column)
- [x] Render base map image at stored position and relative width via range sliders
- [x] Background color via WP iris color picker
- [x] Background image via WP media picker (cover scaling — fills canvas, preserves aspect ratio)
- [x] Preview tab renders live canvas using shared draw pipeline
- [ ] Live canvas preview of all placed objects and drawn areas

## Frontend — Data

- [ ] Register REST API endpoint serving map objects and areas as JSON

## Frontend — Canvas Render

- [ ] Render base map image at stored position and relative width
- [ ] Draw map objects (SVG icons / image overrides) at their x/y positions
- [ ] Draw map areas using Canvas API (polygon, bezier, circle per `shape_type`)

## Frontend — Interactivity

- [ ] Hit detection on click — `isPointInPath` with rect paths for objects, reconstructed polygon/arc paths for areas (mirrors editor approach)
- [ ] Infobox component on object or area click (manual content or pulled from linked post via REST)
- [ ] Link to related post inside infobox
- [ ] MasterMap: hover over region shows child map thumbnail and excerpt tooltip
- [ ] MasterMap: click on region navigates to child map URL
- [ ] Responsive canvas — scale to container width, maintain aspect ratio
- [ ] Loading state while map data is fetched
- [ ] Keyboard navigation and focus management for objects and areas

## Done

- ✅ Plugin scaffold (CPT, DB tables, admin menu, block)
- ✅ Activation / deactivation / uninstall lifecycle hooks
- ✅ DB version tracking on `plugins_loaded` for automatic schema migrations
- ✅ `load_plugin_textdomain()` for i18n
- ✅ README.md with structure, functionality, and design decisions
- ✅ All Best Practices items (capability, prepare() standard, .pot, readme.txt, uninstall opt-in)
- ✅ Editor canvas — live preview, background controls, cover-scaled bg image, range sliders, shared draw pipeline
- ✅ Objects tab — full CRUD, context panel (75/25 layout), `isPointInPath` hit detection, click-to-reposition, shared form component, icon library
