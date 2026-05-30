<?php

defined('ABSPATH') || exit;

// Handle individual map delete.
if (
	isset($_GET['action'], $_GET['map_id']) &&
	$_GET['action'] === 'delete' &&
	check_admin_referer('cns_delete_map_' . (int) $_GET['map_id'])
) {
	wp_delete_post((int) $_GET['map_id'], true);
	wp_safe_redirect(add_query_arg(
		['page' => sanitize_key($_GET['page'] ?? CNS_MAP_PAGE_MAPS), 'deleted' => '1'],
		admin_url('admin.php')
	));
	exit;
}

// Handle plugin settings save (Danger Zone checkbox).
if (
	isset($_POST['cns_map_action']) &&
	$_POST['cns_map_action'] === 'save_settings' &&
	check_admin_referer('cns_map_save_settings')
) {
	update_option('cns_map_suite_delete_on_uninstall', isset($_POST['delete_on_uninstall']) ? 1 : 0, false);
	wp_safe_redirect(add_query_arg(
		['page' => sanitize_key($_GET['page'] ?? CNS_MAP_PAGE_MAPS), 'settings-saved' => '1'],
		admin_url('admin.php')
	));
	exit;
}
