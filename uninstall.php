<?php

/**
 * Runs when the plugin is deleted from the WordPress admin.
 *
 * Always removes:
 *  - Custom DB tables (map_objects, map_areas, map_hierarchy)
 *  - Plugin options
 *  - manage_maps capability from all roles
 *
 * Conditionally removes (requires opt-in via the Danger Zone setting):
 *  - All maps CPT posts and their post meta
 */

defined('WP_UNINSTALL_PLUGIN') || exit;

global $wpdb;

// Drop custom tables in reverse dependency order.
$tables = [
	$wpdb->prefix . 'cns_map_hierarchy',
	$wpdb->prefix . 'cns_map_labels',
	$wpdb->prefix . 'cns_map_areas',
	$wpdb->prefix . 'cns_map_objects',
];

foreach ($tables as $table) {
	// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	$wpdb->query("DROP TABLE IF EXISTS {$table}");
}

// Delete map posts and their meta only if the user explicitly opted in.
if (get_option('cns_map_suite_delete_on_uninstall')) {
	$map_ids = get_posts([
		'post_type'      => 'maps',
		'posts_per_page' => -1,
		'post_status'    => 'any',
		'fields'         => 'ids',
	]);

	foreach ($map_ids as $id) {
		wp_delete_post((int) $id, true);
	}
}

// Remove plugin options.
delete_option('cns_map_suite_db_version');
delete_option('cns_map_suite_delete_on_uninstall');
delete_option('cns_map_suite_show_maps_menu');
delete_option('cns_map_suite_archive_enabled');
delete_option('cns_map_suite_archive_slug');
delete_option('cns_map_suite_archive_per_page');
delete_option('cns_map_suite_archive_order');
delete_option('cns_map_suite_needs_flush');
delete_option('cns_map_suite_cache_ver');

// Remove render-cache transients (includes/cache.php). Keys carry a version
// suffix, so match by prefix; with an external object cache the rows aren't
// in wp_options, but entries there expire via TTL on their own.
// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
$wpdb->query(
	"DELETE FROM {$wpdb->options}
	 WHERE option_name LIKE '\_transient\_cns\_map\_rows\_%'
	    OR option_name LIKE '\_transient\_timeout\_cns\_map\_rows\_%'"
);

// Icon-library attachments are user media and stay, but the tag meta that
// marked them as map icons is plugin data — remove it.
delete_post_meta_by_key('_cns_map_icon');

// Remove manage_maps capability from every role that holds it.
foreach (wp_roles()->roles as $role_name => $unused) {
	$role = get_role($role_name);
	if ($role && $role->has_cap('manage_maps')) {
		$role->remove_cap('manage_maps');
	}
}
