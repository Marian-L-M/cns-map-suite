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

- [ ] Build predefined SVG icon picker
- [ ] Click-to-place icon on canvas at x/y coordinates
- [ ] Drag-to-reposition existing icon markers
- [ ] Right-side infobox drawer for editing object properties
- [ ] Linked post selector (search any CPT)
- [ ] Manual infobox content editor (title, description, image)
- [ ] Icon image upload override (replaces SVG with WP attachment)

## Editor — Areas Tab

- [ ] Polygon drawing mode (click to add nodes, click first node to close path)
- [ ] Bezier drawing mode (same nodes, rendered with smooth curves)
- [ ] Circle drawing mode (click center, drag to set radius)
- [ ] Node drag-to-reposition editing for existing areas
- [ ] Area property drawer (type, infobox content, linked post, background image, canvas styles)

## Editor — Hierarchy Tab (MasterMap)

- [ ] Canvas region drawing tool for linking to child maps
- [ ] Child map search/select picker
- [ ] Hover preview in editor showing child map thumbnail and excerpt

## Editor — Canvas

- [ ] Render base map image on canvas with live position and scale controls
- [ ] Live canvas preview of all placed objects and drawn areas

## Frontend — Data

- [ ] Register REST API endpoint serving map objects and areas as JSON

## Frontend — Canvas Render

- [ ] Render base map image at stored position and relative width
- [ ] Draw map objects (SVG icons / image overrides) at their x/y positions
- [ ] Draw map areas using Canvas API (polygon, bezier, circle per `shape_type`)

## Frontend — Interactivity

- [ ] Hit detection on click — point-radius check for objects, path containment / arc for areas
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
