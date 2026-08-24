<?php

/**
 * Plugin Name:       CNS Map Suite
 * Description:       Interactive canvas-based maps for the Clouds and Spaceships platform.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      8.0
 * Author:            Marian Maschke
 * Author URI:        https://namatamago.dev/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       cns-map-suite
 *
 * @package CNS Map Suite
 */

if (! defined('ABSPATH')) {
	exit;
}

define('CNS_MAP_SUITE_VERSION', '0.1.0');
define('CNS_MAP_SUITE_DB_VERSION', '1.5.0');
define('CNS_MAP_SUITE_DIR', plugin_dir_path(__FILE__));
define('CNS_MAP_SUITE_URL', plugin_dir_url(__FILE__));
define('CNS_MAP_SUITE_BASENAME', plugin_basename(__FILE__));

define('CNS_MAP_PAGE_EDITOR', 'cns-map-editor');
define('CNS_MAP_PAGE_SETTINGS_MAPS', 'cns-settings-maps');
define('CNS_MAP_PAGE_SETTINGS_ICONS', 'cns-settings-icons');

require_once CNS_MAP_SUITE_DIR . 'includes/capabilities.php';
require_once CNS_MAP_SUITE_DIR . 'includes/post-type.php';
require_once CNS_MAP_SUITE_DIR . 'includes/database.php';
require_once CNS_MAP_SUITE_DIR . 'includes/cache.php';
require_once CNS_MAP_SUITE_DIR . 'includes/map-data.php';
require_once CNS_MAP_SUITE_DIR . 'includes/admin/menu.php';
require_once CNS_MAP_SUITE_DIR . 'includes/admin/api.php';
require_once CNS_MAP_SUITE_DIR . 'includes/admin/icons.php';

// ── Infobox content helper ────────────────────────────────────────────────────
// Renders the first few text-oriented blocks of a post for a clean drawer
// preview. The map infobox resolver now shows the post excerpt instead, but this
// stays as the shared preview helper story-suite's inline substory reading will
// use (see cns-story-suite/IMPROVEMENT-PLAN.md).

function cns_map_suite_infobox_content(WP_Post $post, int $max_blocks = 3): string {
	$blocks  = parse_blocks($post->post_content);
	$output  = '';
	$count   = 0;
	$allowed = ['core/paragraph', 'core/heading', 'core/list', 'core/quote'];
	foreach ($blocks as $block) {
		if ($count >= $max_blocks) break;
		$name = $block['blockName'] ?? '';
		if ($name === '' || in_array($name, $allowed, true)) {
			$rendered = render_block($block);
			if (trim(wp_strip_all_tags($rendered))) {
				$output .= $rendered;
				$count++;
			}
		}
	}
	return $output;
}

/**
 * Renders every cns-wiki-suite Infobox block found in a post's content.
 *
 * Returns an array of rendered HTML strings (one per top-level infobox), or an
 * empty array when the cns-wiki-suite plugin is inactive or the post has none.
 * Nested infoboxes (e.g. inside columns) are picked up recursively; render_block
 * renders the whole infobox subtree, so groups/rows come along for free.
 */
function cns_map_suite_extract_infoboxes(WP_Post $post): array {
	if (! WP_Block_Type_Registry::get_instance()->is_registered('cns-wiki-suite/infobox')) {
		return [];
	}

	$found = [];
	$walk  = static function (array $blocks) use (&$walk, &$found): void {
		foreach ($blocks as $block) {
			if (($block['blockName'] ?? '') === 'cns-wiki-suite/infobox') {
				$html = render_block($block);
				if (trim(wp_strip_all_tags($html)) !== '') {
					$found[] = $html;
				}
				continue; // don't descend into an infobox we've already rendered whole
			}
			if (! empty($block['innerBlocks'])) {
				$walk($block['innerBlocks']);
			}
		}
	};
	$walk(parse_blocks($post->post_content));

	return $found;
}

// ── Internationalisation ──────────────────────────────────────────────────────

function cns_map_suite_load_textdomain(): void {
	load_plugin_textdomain(
		'cns-map-suite',
		false,
		dirname(CNS_MAP_SUITE_BASENAME) . '/languages'
		);
}
add_action('init', 'cns_map_suite_load_textdomain');

// ── Block registration ────────────────────────────────────────────────────────

function cns_map_suite_register_blocks(): void {
	if (file_exists(__DIR__ . '/build/blocks-manifest.php')) {
		wp_register_block_types_from_metadata_collection(
			__DIR__ . '/build/blocks',
			__DIR__ . '/build/blocks-manifest.php'
		);
	} elseif (defined('WP_DEBUG') && WP_DEBUG) {
		trigger_error('CNS Map Suite: block manifest not found — run `npm run build` in the plugin directory.', E_USER_NOTICE);
	}
}
add_action('init', 'cns_map_suite_register_blocks');

// ── DB schema upgrades ────────────────────────────────────────────────────────
// Runs dbDelta() on every plugin update so schema changes are applied
// automatically without requiring a manual deactivate/reactivate cycle.
function cns_map_suite_maybe_upgrade_db(): void {
	if (get_option('cns_map_suite_db_version') !== CNS_MAP_SUITE_DB_VERSION) {
		cns_map_suite_create_tables();
		update_option('cns_map_suite_db_version', CNS_MAP_SUITE_DB_VERSION, false);
	}
}
add_action('plugins_loaded', 'cns_map_suite_maybe_upgrade_db');

// ── Lifecycle hooks ───────────────────────────────────────────────────────────

function cns_map_suite_activate(): void {
	cns_map_suite_add_capabilities();
	cns_map_suite_register_post_type();
	cns_map_suite_create_tables();
	update_option('cns_map_suite_db_version', CNS_MAP_SUITE_DB_VERSION, false);
	flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'cns_map_suite_activate');

function cns_map_suite_deactivate(): void {
	// Unregister the CPT so its rewrite rules are removed cleanly.
	unregister_post_type('maps');
	flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'cns_map_suite_deactivate');
	