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

// Remove manage_maps capability from every role that holds it.
foreach (wp_roles()->roles as $role_name => $unused) {
	$role = get_role($role_name);
	if ($role && $role->has_cap('manage_maps')) {
		$role->remove_cap('manage_maps');
	}
}
