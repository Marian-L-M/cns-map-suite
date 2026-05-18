=== CNS Map Suite ===
Contributors: marianmaschke
Tags: map, canvas, interactive, custom post type
Requires at least: 6.8
Tested up to: 6.8
Requires PHP: 8.0
Stable tag: 0.1.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Interactive canvas-based maps for the Clouds and Spaceships platform.

== Description ==

CNS Map Suite lets you create interactive canvas maps and embed them into any post or page via a Gutenberg block. Maps are authored in a dedicated admin editor separate from the standard WordPress post editor.

**Features**

* Custom `maps` post type with a purpose-built admin editor
* Canvas-based map rendering with a background image, clickable icon markers, and drawn overlay areas
* MasterMap mode — link regions on a map to child maps for zoom-level navigation
* Embeds into posts and pages via the `CNS Map` block
* Integrates with the Clouds and Spaceships theme admin panel when active; runs standalone otherwise

**Map objects (icons)**

Place SVG icon markers at any position on the map canvas. Each marker can display a manually authored infobox or pull its content from any linked WordPress post.

**Map areas**

Draw polygon, bezier-smoothed, or circular areas on the canvas. Clicking an area opens an infobox and optionally links to a related post.

**MasterMap**

A special map mode where clickable regions link to child maps instead of posts. Hovering a region previews the child map's thumbnail and excerpt; clicking navigates to it.

== Installation ==

1. Upload the `cns-map-suite` folder to `/wp-content/plugins/`.
2. Run `npm install && npm run build` inside the plugin directory.
3. Activate the plugin via **Plugins → Installed Plugins**.
4. Navigate to **Maps** (or the CNS admin panel if the theme is active) to create your first map.
5. Embed a map into any post using the **CNS Map** block in the block editor.

== Frequently Asked Questions ==

= Why is the standard Gutenberg editor disabled for maps? =

Maps are canvas-based content, not document content. The plugin provides its own editor tailored to placing icons and drawing areas on a background image. Gutenberg would add no value and would confuse the authoring workflow.

= Can I give non-administrator users access to manage maps? =

Yes. The plugin adds a `manage_maps` primitive capability to the administrator role on activation. You can assign this capability to any other role using a role management plugin such as Members or User Role Editor.

= What happens to my maps if I uninstall the plugin? =

By default, map posts are kept — only the custom database tables and plugin options are removed. If you want map posts deleted on uninstall, enable the option in **Maps → Plugin Settings → Uninstall behaviour** before deleting the plugin.

= Does this plugin require the Clouds and Spaceships theme? =

No. The plugin detects whether the theme is active and integrates with its admin panel if so. Without the theme it registers its own top-level admin menu.

== Screenshots ==

1. Maps overview — list of all maps with edit and delete actions.
2. Map editor — Settings tab with canvas configuration and base image picker.
3. Map editor — tab navigation (Settings, Objects, Areas, Hierarchy, Preview).
4. Block editor — CNS Map block with map selector in the Inspector Controls panel.

== Changelog ==

= 0.1.0 =
* Initial release — maps CPT, custom DB tables, admin editor scaffold, CNS Map block, save via REST API.

== Upgrade Notice ==

= 0.1.0 =
Initial release.
