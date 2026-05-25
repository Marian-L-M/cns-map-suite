# CNS Map Suite

A WordPress plugin for creating interactive canvas-based maps for the Clouds and Spaceships platform. Maps are authored in a custom admin editor and embedded into posts via a Gutenberg block. Visitors can click icons and drawn areas to open infoboxes and navigate to related content.

---

## Requirements

| Dependency | Minimum |
|---|---|
| WordPress | 6.8 |
| PHP | 8.0 |
| MySQL / MariaDB | 5.7.8 / 10.3 |
| Node.js | 20+ (dev only) |

---

## Getting started

```bash
cd wp-content/plugins/cns-map-suite
npm install
npm run build      # production build
npm run start      # development watch mode
```

Activate the plugin in **WP Admin → Plugins**. On first activation the plugin registers the `maps` custom post type, creates three database tables, and flushes rewrite rules.

---

## Project structure

```
cns-map-suite/
│
├── cns-map-suite.php               # Plugin entry point
├── uninstall.php                   # Runs only on plugin deletion (not deactivation)
├── package.json                    # wp-scripts build configuration
├── webpack.config.js               # Extends wp-scripts to add admin entry point
│
├── languages/
│   └── cns-map-suite.pot           # Translation template
│
├── includes/
│   ├── capabilities.php            # manage_maps cap — add on activation, remove on uninstall
│   ├── post-type.php               # maps CPT + post meta registration
│   ├── database.php                # Custom table creation via dbDelta() + prepare() standard
│   └── admin/
│       ├── menu.php                # Admin menu, asset enqueuing, wp_localize_script
│       ├── api.php                 # REST routes for maps, objects, areas, and icons
│       ├── icons.php               # SVG upload allowlist, filetype fix, DOMDocument sanitizer
│       └── views/
│           ├── overview.php        # Maps list table
│           ├── editor.php          # Injects window.cnsMapEditor, mounts #cns-admin-root
│           └── icons.php           # Injects #cns-icons-root for the icon library app
│
├── assets/
│   └── admin/
│       └── admin.css               # Admin UI styles
│
├── src/
│   ├── admin/                      # Admin editor (compiled → build/admin/index.js)
│   │   ├── index.js                # React entry — mounts MapEditorApp and IconLibraryApp
│   │   ├── canvas.js               # Pure canvas draw functions; settingsToDrawState
│   │   ├── areas.js                # Area path builders, hit detection, node helpers
│   │   ├── objects.js              # Object draw functions, hit detection
│   │   ├── icons.js                # Icon library cache + REST loader
│   │   ├── utils.js                # apiFetch wrapper, loadImage, loadSvgWithColors
│   │   └── app/                    # React component tree
│   │       ├── MapEditorApp.js     # Root — all state, all API calls
│   │       ├── EditorHeader.js     # Title, back link, Save button, SaveStatus
│   │       ├── TabBar.js           # Tab switcher (settings/objects/areas/hierarchy/preview)
│   │       ├── ContextPanel.js     # Right-hand sticky panel (object or area form + actions)
│   │       ├── ObjectModal.js      # Add/Edit object dialog
│   │       ├── IconLibraryApp.js   # Standalone icon library page root
│   │       ├── canvases/
│   │       │   ├── SettingsCanvas.js   # Live preview (no interaction)
│   │       │   ├── ObjectsCanvas.js    # Object placement + hit detection + reposition
│   │       │   ├── AreasCanvas.js      # Area/node drawing + node repositioning
│   │       │   └── PreviewCanvas.js    # Read-only full canvas render
│   │       ├── panels/
│   │       │   ├── SettingsPanel.js    # Map-level settings form + SettingsCanvas
│   │       │   ├── ObjectsPanel.js     # ObjectsCanvas + ObjectsList + ObjectModal
│   │       │   ├── AreasPanel.js       # AreasCanvas + AreasList + Add Area
│   │       │   ├── HierarchyPanel.js   # Placeholder (MasterMap)
│   │       │   └── PreviewPanel.js     # PreviewCanvas + view-map link
│   │       ├── forms/
│   │       │   ├── ObjectForm.js       # Controlled object form; defaultObjectFormData, collectObjectPayload
│   │       │   ├── AreaForm.js         # Controlled area form; defaultAreaFormData
│   │       │   └── NodeList.js         # Editable x%/y% node table
│   │       ├── lists/
│   │       │   ├── ObjectsList.js      # Object rows with Edit / Delete
│   │       │   └── AreasList.js        # Area rows with Select / Delete
│   │       └── shared/
│   │           ├── MediaPicker.js      # wp.media frame wrapper
│   │           ├── PostSearch.js       # Debounced WP REST /search typeahead
│   │           ├── IconPicker.js       # SVG icon grid
│   │           └── SaveStatus.js       # Transient status span
│   │
│   └── blocks/
│       └── map/
│           ├── block.json          # Block metadata and attribute schema
│           ├── index.js            # registerBlockType entry point
│           ├── edit.js             # Block editor UI (map picker)
│           ├── save.js             # Returns null — block is server-rendered
│           ├── render.php          # Server-side render for frontend output
│           ├── style.scss          # Frontend styles
│           ├── editor.scss         # Editor-only styles
│           └── view.js             # Frontend interactivity (canvas + infobox)
│
└── build/
    ├── admin/
    │   └── index.js                # Compiled admin editor bundle
    └── blocks/
        └── map/                    # Compiled block assets
```

---

## Architecture and design decisions

### Why a custom post type for maps?

Maps are first-class content: they have a title, a thumbnail, descriptive metadata, and a public URL. WordPress's post system handles all of this for free — slugs, revisions, capability checks, REST exposure. The alternative (storing everything in plugin option rows) would mean reimplementing content management that WordPress already does well.

The CPT is registered with `show_in_menu: false` because the default WP list table is replaced by a purpose-built overview page in the plugin's admin area.

### Why is Gutenberg disabled on the maps CPT?

Maps are not document-structured content. Their "body" is a canvas with positioned objects and drawn areas — not a sequence of blocks. Gutenberg would provide no value and would confuse the author workflow. The map editor is an entirely separate UI built to match the task.

Importantly, `show_in_rest: true` and Gutenberg are **independent** concerns. The CPT has REST enabled so the block picker in `edit.js` can query available maps via `@wordpress/core-data`. Gutenberg being disabled does not affect the REST endpoint.

### Why three separate database tables instead of one?

Each table represents a structurally distinct concept:

- **`wp_cns_map_objects`** — point markers. Geometry is a single `(x, y)` coordinate.
- **`wp_cns_map_areas`** — polygon/bezier/circle overlays. Geometry is a `nodes` JSON array of relative vertices.
- **`wp_cns_map_hierarchy`** — parent→child map links. Geometry is a `nodes` polygon on the parent canvas defining where the child map region sits.

Merging these into one table would require many nullable columns and make the shape of a row ambiguous from its data alone. Separate tables keep rows coherent: every column on a map object row is meaningful for a map object.

### Why LONGTEXT JSON instead of separate style/node tables?

An earlier version of this project (Prisma/PostgreSQL) used a `CanvasStyleItem` table with five nullable foreign keys — one per entity type it could belong to. This is the **polymorphic association anti-pattern**: queries are awkward, orphaned rows are easy to create, and indexing the nullable FKs is wasteful.

`canvas_styles`, `infobox_data`, and `nodes` are stored as `LONGTEXT` JSON columns on their respective rows instead. This works because:

1. We always query these fields *by their parent entity* (fetch the area, get its nodes). We never query across entities by style properties.
2. `dbDelta()` — WordPress's schema manager — handles `LONGTEXT` reliably. Native `JSON` column types are not well-supported by `dbDelta()` and can cause unexpected behaviour on schema updates.
3. WordPress core uses the same pattern for `post_content` and serialised `meta_value` fields.

### Why store image width and node positions as relative values (0–1)?

The canvas renders responsively: it scales to its container width. If image positions and node coordinates were stored in pixels they would only be correct at the exact canvas width they were authored at. Storing everything as a fraction of canvas dimensions (e.g. `0.75` = 75% of canvas width) means geometry scales correctly at any display size. Heights are derived at render time from aspect ratios or natural image dimensions — never stored.

### Why is MasterMap a mode flag on a regular map, not a separate post type?

A MasterMap is still a map: it has a background image, a canvas, and clickable regions. The only difference is what those regions link to — child maps instead of posts. The rendering pipeline, storage model, and admin editor are all shared. A separate CPT would duplicate the entire data model and admin UI for a single behavioural difference. A `_cns_map_is_master` boolean flag is sufficient.

In the editor the flag dynamically swaps the Objects and Areas tabs for a Hierarchy tab. On the frontend the same canvas renderer checks the flag and switches from infobox/post-link behaviour to thumbnail-hover/map-navigate behaviour.

### Why is the block dynamic (render.php) rather than static (save.js)?

The block needs to output a `<canvas>` element with dimensions derived from `_cns_map_width` and `_cns_map_aspect_ratio` stored in post meta. A static `save.js` runs at save time in the browser and cannot read post meta. A server-side `render.php` runs on every page load and calls `get_post_meta()` directly.

The secondary benefit is forward compatibility: changes to `render.php` apply immediately to every embedded map without authors needing to update their posts.

### Admin menu: CNS theme detection

The admin menu checks `get_template()` during `admin_menu` at priority 10 — before the CNS theme processes its own tab registry at priority 99. If the theme is active, the plugin adds a `Maps` entry via the `cns_admin_tabs` filter so the theme includes it in its unified panel. If the theme is absent, a standalone top-level `Maps` menu is registered.

The map editor (a full-page canvas UI) cannot live inside a settings tab — it needs its own page. When running under the CNS theme, the editor is registered as a sub-page of `cns-settings` and immediately removed from the visible menu with `remove_submenu_page()`. This makes it accessible by URL without appearing as a duplicate item in the sidebar.

### Activation, deactivation, and uninstall separation

WordPress distinguishes three plugin lifecycle events and they should each do different things:

| Event | Hook | What happens |
|---|---|---|
| **Activate** | `register_activation_hook` | Register CPT, create DB tables, store DB version, flush rewrite rules |
| **Deactivate** | `register_deactivation_hook` | Unregister CPT, flush rewrite rules (removes 404s on CPT URLs) |
| **Delete** | `uninstall.php` | Drop DB tables, delete plugin options |

`uninstall.php` is preferred over `register_uninstall_hook()` because it runs in isolation without loading the full plugin — no risk of undefined constants or missing dependencies in an inconsistent state.

Map posts (user content) are **intentionally not deleted on uninstall**. Silently destroying content is unexpected and difficult to recover from. Infrastructure (tables, options) is removed; content is left for the site owner to handle.

### DB version tracking on `plugins_loaded`

Running `dbDelta()` only on plugin activation means schema changes shipped in an update are never applied. Instead, a `cns_map_suite_db_version` option is stored and checked on every `plugins_loaded`. If the stored version differs from `CNS_MAP_SUITE_DB_VERSION`, `dbDelta()` runs again. `dbDelta()` is additive-only (it adds columns and tables but never removes them), so re-running it is always safe.

---

## JS admin architecture

The admin editor is a React application compiled by `wp-scripts` (webpack + Babel) and mounted via `createRoot` on `#cns-admin-root`. It uses `@wordpress/element` — WordPress's re-export of React — so all React APIs come from a shared bundle already on the page rather than being bundled a second time.

### Why React for the admin editor?

The original admin was written as imperative DOM manipulation: factory functions built HTML strings, controller objects managed event handlers, and module-level variables held mutable state. As the editor grew (five tabs, two canvas layers, a context panel, modals, and multiple form types), this pattern became hard to maintain:

- State was scattered across multiple module-level variables with no clear owner.
- Adding a feature required manually wiring up event listeners, cleaning them up on tab switch, and keeping several sets of in-memory data in sync.
- The same form sections had to be duplicated between the modal and the context panel because there was no component abstraction.

React solves these problems directly: state has a single owner (`MapEditorApp`), components re-render when relevant state changes, and the same form component (`ObjectForm`, `AreaForm`) renders in both the modal and the context panel without duplication.

### Canvas drawing stays imperative

The canvas API is inherently imperative: drawing is a sequence of commands on a 2D context, not a description of a desired state. Wrapping canvas operations in React's declarative model (e.g. via refs or custom renderers) adds complexity without benefit.

The solution is a hard boundary:

- **`src/admin/canvas.js`, `areas.js`, `objects.js`** — pure functions that take explicit arguments and draw to a canvas. No DOM reads, no module-level state, no React imports.
- **Canvas components** (`SettingsCanvas`, `ObjectsCanvas`, `AreasCanvas`, `PreviewCanvas`) — React components that own a `<canvas>` ref and call the draw functions from `useEffect`. They translate React props/state into the arguments the draw functions expect.

This means the drawing logic is trivially testable (pass a mock canvas, check the calls) and the React components stay thin — they handle interaction and lifecycle, not rendering logic.

### The `stateRef` pattern for canvas event handlers

Canvas components bind event listeners with `useEffect([], [])` to avoid re-registering listeners on every render. This creates a stale closure problem: the handlers capture props/state from the first render and never see updates.

The fix is a `stateRef` that is overwritten on every render:

```js
const stateRef = useRef( {} );
stateRef.current = { objects, selectedObjectId, repositioningObjectId };
```

Event handlers read from `stateRef.current` instead of directly referencing props. Since `stateRef` is a mutable object, handlers always see the latest values without being re-registered.

`ObjectsCanvas` uses this pattern exclusively — all interaction state (`repositioningObjectId`) lives in the parent and flows in as a prop.

### JSX handlers for canvas interaction state

`AreasCanvas` manages node repositioning state locally, because node-dragging is a canvas-internal concern that the parent doesn't need to know about until the user commits.

This state (`repoNodeIdx`, `repoCursor`) is held in `useState`. JSX event handlers (`onClick`, `onMouseMove` on `<canvas>`) are used instead of `addEventListener` in `useEffect`, because JSX handlers are recreated on every render and always close over current state — there's no stale closure risk. The `document.keydown` listener (which must be document-level) remains in `useEffect([], [])` but reads current values through `stateRef`.

### PHP → JS data handoff

`includes/admin/views/editor.php` injects a `window.cnsMapEditor` object containing the initial map settings before the React bundle loads. `MapEditorApp` reads this once at startup to build its initial state. This avoids a loading round-trip for data that is already known at page-render time.

`window.cnsMapSuite` (injected by `menu.php` via `wp_localize_script`) carries the REST base URL and WP nonce used by `apiFetch` for all subsequent API calls.

### Icon colour overrides

SVG icons in the canvas support per-object fill and stroke overrides. The SVG is fetched as text, modified via `DOMParser`, serialized back to a `Blob URL`, and drawn with `drawImage()`. The result is cached per `(url, fill, stroke)` key in a module-level `imageCache` object in `utils.js`, so each unique colour combination is only computed once per page load. `URL.revokeObjectURL()` is called after the image loads to release the blob.

---

## Database schema

### `wp_cns_map_objects` — point icon markers

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGINT UNSIGNED` | Primary key |
| `map_id` | `BIGINT UNSIGNED` | → `wp_posts.ID` (maps CPT) |
| `linked_post_id` | `BIGINT UNSIGNED` | → `wp_posts.ID` (any CPT, optional) |
| `type` | `VARCHAR(20)` | `LOCATION` \| `HISTORY` \| `NATURAL` \| `EVENT` \| `OTHER` |
| `icon_image_id` | `BIGINT UNSIGNED` | WP attachment ID; SVG or raster |
| `title` | `VARCHAR(255)` | Display label |
| `x` | `INT` | Canvas x coordinate (pixels at authored width) |
| `y` | `INT` | Canvas y coordinate |
| `object_time` | `INT` | In-world timeline value |
| `infobox_source` | `VARCHAR(10)` | `manual` — use `infobox_data`; `post` — pull from `linked_post_id` |
| `infobox_data` | `LONGTEXT` | JSON `{title, description, image_id}` |
| `canvas_styles` | `LONGTEXT` | JSON `{size, fillStyle, strokeStyle}` |

### `wp_cns_map_areas` — polygon / bezier / circle overlays

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGINT UNSIGNED` | Primary key |
| `map_id` | `BIGINT UNSIGNED` | → `wp_posts.ID` |
| `linked_post_id` | `BIGINT UNSIGNED` | → `wp_posts.ID` (optional) |
| `type` | `VARCHAR(20)` | `GEOGRAPHY` \| `HISTORY` \| `NATURAL` \| `EVENT` \| `OTHER` |
| `shape_type` | `VARCHAR(20)` | `POLYGON` \| `BEZIER` \| `CIRCLE` \| `RECTANGLE` |
| `title` | `VARCHAR(255)` | Admin label |
| `object_time` | `INT` | In-world timeline value |
| `nodes` | `LONGTEXT` | JSON array of `{x, y}` fractions (0–1) |
| `infobox_source` | `VARCHAR(10)` | `manual` or `post` |
| `infobox_data` | `LONGTEXT` | JSON manual infobox content |
| `canvas_styles` | `LONGTEXT` | JSON `{fill, fillOpacity, stroke, strokeWidth}` |

**Shape types:**
- `POLYGON` — vertices connected by `lineTo()`, closed with `closePath()`.
- `BEZIER` — same vertex data rendered with `quadraticCurveTo()` between midpoints for smooth outlines, no extra data required.
- `RECTANGLE` — exactly four nodes constrained to stay axis-aligned. Moving any corner adjusts the opposite corner to maintain the rectangle. Nodes are ordered TL → TR → BR → BL.
- `CIRCLE` — two nodes: `[0]` is the center, `[1]` is the edge point. Radius is derived as the Euclidean distance between them, scaled to canvas pixels.

### `wp_cns_map_hierarchy` — MasterMap child links

One row per parent→child relationship. A parent with multiple children has multiple rows — this is intentional normalisation. Storing children as a JSON array in a single row would prevent indexing on `child_map_id` and make the query "which parents contain this child?" require a full table scan.

| Column | Type | Notes |
|---|---|---|
| `id` | `BIGINT UNSIGNED` | Primary key |
| `parent_map_id` | `BIGINT UNSIGNED` | → `wp_posts.ID` (must be a MasterMap) |
| `child_map_id` | `BIGINT UNSIGNED` | → `wp_posts.ID` (any map) |
| `nodes` | `LONGTEXT` | JSON polygon `[{x,y}]` — clickable region on the parent canvas |
| `canvas_styles` | `LONGTEXT` | JSON — hover highlight, thumbnail size, etc. |

`UNIQUE KEY (parent_map_id, child_map_id)` prevents the same child being linked twice to the same parent.

### Maps CPT — `wp_postmeta` fields

| Key | Type | Purpose |
|---|---|---|
| `_cns_map_featured` | bool | Show in featured map displays |
| `_cns_map_width` | int | Canvas max-width in pixels (authored width) |
| `_cns_map_aspect_ratio` | float | Width ÷ height (e.g. `1.77` for 16∶9) |
| `_cns_map_time` | int | In-world timeline value |
| `_cns_map_image_id` | int | WP attachment ID — the base map image |
| `_cns_map_image_x` | float | Horizontal offset as fraction of canvas width (0–1) |
| `_cns_map_image_y` | float | Vertical offset as fraction of canvas height (0–1) |
| `_cns_map_image_width` | float | Image width as fraction of canvas width (1.0 = full width) |
| `_cns_map_is_master` | bool | MasterMap mode |
| `_cns_map_bg_type` | string | `color` or `image` |
| `_cns_map_bg_color` | string | Hex colour used when `bg_type` is `color` (default `#1a1a2e`) |
| `_cns_map_bg_image_id` | int | WP attachment ID used when `bg_type` is `image` |

---

## Admin interface

### Maps overview (`?page=cns-maps` / `cns-settings-maps`)

Lists all maps in a WP-style list table. Each row shows the title, mode badge (Map / MasterMap), featured badge, publish status, creation date, and Edit / Delete actions. The delete action uses a nonce and requires JS confirmation.

### Icon Library (`?page=cns-map-icons` / `cns-settings-icons`)

Manages the pool of SVG icons available as object markers. Icons are stored as standard WP media library attachments tagged with `_cns_map_icon` post meta. The `IconLibraryApp` React component handles the grid and upload flow.

SVG files are not allowed by WordPress by default (XSS risk). The plugin enables SVG uploads for `manage_maps` users via `upload_mimes` + `wp_check_filetype_and_ext` filters and sanitizes every uploaded file through a `DOMDocument` pass that strips `<script>`, `<foreignObject>`, `<iframe>`, `<object>`, and `<embed>` elements, removes all `on*` event attributes, and removes `javascript:` href values.

### Map editor (`?page=cns-map-editor[&map_id=N]`)

Omitting `map_id` creates a new map; including it loads existing settings from `window.cnsMapEditor` (injected by `editor.php`). The editor is a single `MapEditorApp` React component that owns all state and API calls.

**State ownership:** `MapEditorApp` holds all application state — `settings`, `objectsList`, `areasList`, `selectedObjectId`, `selectedAreaId`, `repositioningObjId`, `saveStatus`, `activeTab`. Child components receive slices of this state as props and communicate back via callback props. No global state, no context, no external store.

**API calls:** all REST calls live in `MapEditorApp`. Panels and the context panel receive async callbacks (`onAdd`, `onSave`, `onDelete`, `onPositionUpdate`, etc.). This means every component below the root is purely reactive — it renders what it receives and calls a callback when the user acts.

**Tab — Settings**

Two-column layout: form on the left, live `SettingsCanvas` on the right (sticky). The canvas is a `useEffect` watcher with individual settings fields in its dependency array — it only redraws when a relevant value changes, not on every render.

The form covers: title, canvas max-width, aspect ratio, base image (WP media picker), image X/Y offset and width (range sliders), background (color or cover-scaled image), MasterMap toggle, featured flag.

Saving POSTs to `POST /maps`. Creating a new map redirects to the editor URL with the returned `map_id`; updating shows a "Saved." confirmation that clears after two seconds.

**Tab — Objects**

`ObjectsPanel` loads the object list once on mount via `GET /maps/{id}/objects`. The panel renders an `ObjectsCanvas` (interactive), an `ObjectsList` (rows with Edit/Delete), and an `ObjectModal` (for add and list-edit flows). The right-hand `ContextPanel` renders when an object is selected.

**Canvas interaction:**

- Click an object → select it; `ObjectsCanvas` uses `isPointInPath` on a per-object bounding rect path, iterating in reverse render order so the topmost object wins.
- Click empty canvas with object selected → immediately move the object to that position (`PATCH /objects/{id}/position`).
- Click empty canvas with no selection → deselect.
- **Reposition button** in context panel → sets `repositioningObjectId` in `MapEditorApp`; the object ghost follows the cursor until a click drops it. The repositioning state lives in the parent so any component can read or clear it.
- Escape → cancels repositioning or deselects.

**Object form** (`ObjectForm`) has four sections — Icon, Details, Infobox, Design — and is rendered both in the modal and in the context panel. `defaultObjectFormData(obj)` builds the initial controlled state; `collectObjectPayload(formData)` extracts the REST payload. Radio name collisions between the two instances are avoided by a per-mount uid from `useRef(Math.random())`.

**Tab — Areas**

`AreasPanel` loads areas on mount via `GET /maps/{id}/areas`. It renders `AreasCanvas` and `AreasList`. The context panel shows `AreaForm` and `NodeList` when an area is selected.

**Canvas interaction:**

- Click an area's interior → select it (`isPointInPath` on the reconstructed polygon path).
- Click a node handle on the selected area → enters node repositioning mode: `repoNodeIdx` and `repoCursor` are held in `useState` inside `AreasCanvas` (canvas-local concern). The node ghost follows `onMouseMove`; clicking anywhere commits the new position.
- Click empty canvas on a selected POLYGON area → add a new node at that point.
- Click empty canvas with no selection → deselect.
- Enter → commit the repositioning node; Escape → cancel.

Node repositioning state (`repoNodeIdx`, `repoCursor`) lives inside `AreasCanvas` rather than the parent because it is purely a canvas-interaction concern — the parent only needs to know the final committed node positions. JSX `onClick`/`onMouseMove` handlers are used on `<canvas>` (not `addEventListener`) so they always close over current React state without stale closure issues.

**Node coordinate system:** all `{x, y}` values are stored as fractions (0–1) of canvas dimensions. The canvas multiplies by `canvas.width`/`canvas.height` at render time. The `NodeList` component displays them as percentages (0–100, step 0.1) and converts on read/write. `RECTANGLE` nodes are constrained by `applyRectangleConstraint` so moving one corner adjusts its neighbors to maintain axis-alignment. `CIRCLE` moving the center node translates the edge node by the same delta.

**Area context panel:** `AreaForm` handles metadata (title, type, shape, infobox, design). `NodeList` renders an editable table of all nodes; changes call `onNodesChange` which updates `areasList` in `MapEditorApp` and triggers a canvas redraw. Neither form talks to the API directly — the context panel's Save button calls `onAreaSave`, which POSTs the current form data merged with the latest nodes from `areasList`.

**Tab — Hierarchy** *(MasterMap only, placeholder)*

Canvas surface for drawing regions that link to child maps.

**Tab — Preview**

`PreviewPanel` renders a read-only `PreviewCanvas` using `drawFullCanvas`, which draws background + base image + all area polygons + all object markers using the same functions as the editor canvases. If the objects or areas tabs were never visited, the list arrays remain empty; the preview reflects whatever has been loaded.

---

## REST API

All routes are under the namespace `cns-map-suite/v1` (full prefix: `/wp-json/cns-map-suite/v1/…`). Every route requires `manage_maps` via `permission_callback`. Requests must include an `X-WP-Nonce` header with a nonce from `wp_create_nonce('wp_rest')`.

### Maps

| Method | Route | Description |
|---|---|---|
| `POST` | `/maps` | Create or update a map. Pass `map_id` to update; omit to create. Returns the full post object including the assigned `map_id` and `edit_url`. |

**Request fields:** `map_id`, `title`, `status`, `width`, `aspect_ratio`, `time`, `image_id`, `image_x`, `image_y`, `image_width`, `is_master`, `featured`, `bg_type`, `bg_color`, `bg_image_id`.

### Objects

| Method | Route | Description |
|---|---|---|
| `GET` | `/maps/{map_id}/objects` | List all objects for a map, ordered by `id` ascending. |
| `POST` | `/maps/{map_id}/objects` | Create a new object on a map. |
| `POST` | `/objects/{id}` | Update all fields of an existing object. |
| `PATCH` | `/objects/{id}/position` | Update only `x` and `y`. Used by both click-to-reposition and explicit reposition mode. |
| `DELETE` | `/objects/{id}` | Delete an object. Returns `{"deleted": true}`. |

**Shared object fields:** `icon_image_id`, `title`, `type`, `x`, `y`, `object_time`, `infobox_source`, `linked_post_id`, `infobox_title`, `infobox_description`, `infobox_image_id`, `style_size`, `style_fill`, `style_stroke`.

`canvas_styles` and `infobox_data` are not sent directly — the server derives them from the `style_*` and `infobox_*` fields and stores them as JSON.

**Object response shape:**

```json
{
  "id": 12,
  "map_id": 3,
  "title": "The Capital",
  "type": "LOCATION",
  "x": 420,
  "y": 310,
  "object_time": 0,
  "icon_image_id": 7,
  "icon_url": "https://…/icon.svg",
  "icon_mime": "image/svg+xml",
  "linked_post_id": null,
  "infobox_source": "manual",
  "infobox_data": { "title": "The Capital", "description": "…", "image_id": 0 },
  "canvas_styles": { "size": 32, "fillStyle": "#ffffff", "strokeStyle": "#2271b1" }
}
```

### Areas

| Method | Route | Description |
|---|---|---|
| `GET` | `/maps/{map_id}/areas` | List all areas for a map, ordered by `id` ascending. |
| `POST` | `/maps/{map_id}/areas` | Create a new area on a map. |
| `POST` | `/areas/{id}` | Update all fields including the full `nodes` array. |
| `DELETE` | `/areas/{id}` | Delete an area. Returns `{"deleted": true}`. |

**Shared area fields:** `title`, `type`, `shape_type`, `object_time`, `infobox_source`, `linked_post_id`, `infobox_title`, `infobox_description`, `infobox_image_id`, `nodes` (JSON string), `style_fill`, `style_fill_opacity`, `style_stroke`, `style_stroke_width`.

`nodes` is sent as a JSON-encoded string and returned as a decoded array. `cns_map_suite_normalize_area_row()` ensures the REST response always contains a proper JSON array, never a double-encoded string.

**Area response shape:**

```json
{
  "id": 5,
  "map_id": 3,
  "title": "The Northern Reach",
  "type": "GEOGRAPHY",
  "shape_type": "POLYGON",
  "object_time": 0,
  "linked_post_id": 0,
  "infobox_source": "manual",
  "infobox_data": { "title": "The Northern Reach", "description": "…", "image_id": 0 },
  "nodes": [
    { "x": 0.25, "y": 0.25 },
    { "x": 0.75, "y": 0.25 },
    { "x": 0.75, "y": 0.75 },
    { "x": 0.25, "y": 0.75 }
  ],
  "canvas_styles": { "fill": "#2271b1", "fillOpacity": 0.3, "stroke": "#2271b1", "strokeWidth": 2 }
}
```

### Icons

| Method | Route | Description |
|---|---|---|
| `GET` | `/icons` | List all icon library entries. |
| `POST` | `/icons` | Add an existing WP attachment to the icon library. Pass `attachment_id`. |
| `DELETE` | `/icons/{id}` | Remove from the icon library (deletes `_cns_map_icon` meta; does not delete the attachment). |

**Icon response shape:**

```json
{ "id": 7, "title": "Sword", "url": "https://…/sword.svg", "mime": "image/svg+xml" }
```

---

## Block — `cns-map-suite/map`

Embedded into posts and pages via the block editor. Stores a single `mapId` integer attribute.

**In the block editor (`edit.js`):** renders a map picker using `@wordpress/core-data`'s `getEntityRecords()` in the Inspector Controls panel. An unset block shows a `<Placeholder>`.

**On the frontend (`render.php`):** reads map settings from post meta and outputs a `<canvas>` element with correct `width`/`height` attributes and a `data-map-id` attribute. All map data (objects, areas, icon URLs, canvas styles) is pre-loaded as an inline `<script type="application/json">` — no REST calls are needed on page load.

**Frontend interactivity (`view.js`):** draws background (solid color or cover-scaled image), base map image, area polygons, and object markers. Hit detection uses `isPointInPath` for both objects (bounding rect paths) and areas (polygon paths), mirroring the editor approach. Clicking an object or area opens a side drawer infobox that slides in from the right. Infobox data is resolved server-side: linked-post mode uses `post_title`, `post_excerpt`, full `post_content` (via `apply_filters('the_content', ...)`), featured image, and permalink; manual mode uses stored title/description/image.

The block is fully server-rendered (`save.js` returns `null`). This means canvas dimensions and pre-loaded map data always reflect the current map state without authors needing to update their posts.

---

## Development

```bash
npm run start       # watch mode
npm run build       # production build with blocks-manifest
npm run lint:js     # ESLint
npm run lint:css    # Stylelint
npm run format      # Prettier
```

The build uses `wp-scripts` extended by `webpack.config.js` to add a second entry point for the admin editor (`src/admin/index.js → build/admin/index.js`). The `--blocks-manifest` flag generates `build/blocks-manifest.php`, and the main plugin file uses `wp_register_block_types_from_metadata_collection()` (WP 6.7+) to register all blocks from that manifest in a single call.

JSX is compiled by Babel via `wp-scripts`. File extension is `.js` (not `.jsx`) to match the wp-scripts convention — the Babel config handles JSX in `.js` files automatically.

---

## Roadmap

1. ~~**Best practices**~~ — `manage_maps` capability, REST `permission_callback`, nonce, `$wpdb->prepare()`, `.pot`, `readme.txt`, uninstall opt-in.
2. ~~**Editor — save**~~ — Settings tab saves via REST; global Save button.
3. ~~**Editor — canvas preview**~~ — Live canvas in Settings and Preview tabs; background color/image; cover-scaled bg; range sliders.
4. ~~**Editor — objects**~~ — Full CRUD, context panel, `isPointInPath` hit detection, click-to-reposition, explicit reposition mode, icon library with SVG sanitization, per-object fill/stroke.
5. ~~**Editor — areas (polygon + rectangle + circle)**~~ — Node-based polygon editor, node repositioning (click/Enter/Escape), click-to-add-node, RECTANGLE constraint, CIRCLE two-node model, relative coordinates, node list with x%/y% inputs, REST CRUD.
6. ~~**Admin editor rewrite to React**~~ — `MapEditorApp` root with centralized state and API calls; pure-function canvas utilities; `stateRef` pattern for event handlers; JSX handlers for local canvas state; `settingsToDrawState` shared utility.
7. ~~**Frontend block**~~ — Server-side pre-loaded data, full canvas render (background + objects + areas), `isPointInPath` hit detection, side drawer infobox with full post content, standalone map pages.
8. **Editor — areas (bezier)** — Same node data, rendered with `quadraticCurveTo()`.
9. **Editor — hierarchy** — MasterMap region drawing, child map picker, hover preview.
10. **Frontend — responsive canvas** — Scale to container width, maintain aspect ratio.
11. **Frontend — keyboard navigation** — Focus management for objects and areas, accessible infobox.
12. **Frontend — MasterMap** — Hover preview tooltip, click-to-navigate to child map.
