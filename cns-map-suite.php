<?php

/**
 * Plugin Name:       CNS Map Suite
 * Description:       Interactive canvas-based maps for the Clouds and Spaceships platform.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      8.0
 * Author:            Marian Maschke
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
define('CNS_MAP_SUITE_DB_VERSION', '1.0.0');
define('CNS_MAP_SUITE_DIR', plugin_dir_path(__FILE__));
define('CNS_MAP_SUITE_URL', plugin_dir_url(__FILE__));

require_once CNS_MAP_SUITE_DIR . 'includes/capabilities.php';
require_once CNS_MAP_SUITE_DIR . 'includes/post-type.php';
require_once CNS_MAP_SUITE_DIR . 'includes/database.php';
require_once CNS_MAP_SUITE_DIR . 'includes/admin/menu.php';
require_once CNS_MAP_SUITE_DIR . 'includes/admin/api.php';

// ── Internationalisation ──────────────────────────────────────────────────────

add_action('init', 'cns_map_suite_load_textdomain');
function cns_map_suite_load_textdomain(): void {
	load_plugin_textdomain(
		'cns-map-suite',
		false,
		dirname(plugin_basename(__FILE__)) . '/languages'
	);
}

// ── Block registration ────────────────────────────────────────────────────────

add_action('init', 'cns_map_suite_register_blocks');
function cns_map_suite_register_blocks(): void {
	if (file_exists(__DIR__ . '/build/blocks-manifest.php')) {
		wp_register_block_types_from_metadata_collection(
			__DIR__ . '/build/blocks',
			__DIR__ . '/build/blocks-manifest.php'
		);
	}
}

// ── DB schema upgrades ────────────────────────────────────────────────────────
// Runs dbDelta() on every plugin update so schema changes are applied
// automatically without requiring a manual deactivate/reactivate cycle.

add_action('plugins_loaded', 'cns_map_suite_maybe_upgrade_db');
function cns_map_suite_maybe_upgrade_db(): void {
	if (get_option('cns_map_suite_db_version') !== CNS_MAP_SUITE_DB_VERSION) {
		cns_map_suite_create_tables();
		update_option('cns_map_suite_db_version', CNS_MAP_SUITE_DB_VERSION, false);
	}
}

// ── Lifecycle hooks ───────────────────────────────────────────────────────────

register_activation_hook(__FILE__, 'cns_map_suite_activate');
function cns_map_suite_activate(): void {
	cns_map_suite_add_capabilities();
	cns_map_suite_register_post_type();
	cns_map_suite_create_tables();
	update_option('cns_map_suite_db_version', CNS_MAP_SUITE_DB_VERSION, false);
	flush_rewrite_rules();
}

register_deactivation_hook(__FILE__, 'cns_map_suite_deactivate');
function cns_map_suite_deactivate(): void {
	// Unregister the CPT so its rewrite rules are removed cleanly.
	unregister_post_type('maps');
	flush_rewrite_rules();
}
