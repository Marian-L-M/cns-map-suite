<?php

defined('ABSPATH') || exit;

add_action('admin_menu', 'cns_map_suite_register_menus', 10);

function cns_map_suite_register_menus(): void {
	if (get_template() === 'clouds-and-spaceships') {
		cns_map_suite_register_under_cns_theme();
	} else {
		cns_map_suite_register_standalone();
	}
}

/**
 * CNS theme active: overview tab via cns_admin_tabs + hidden editor sub-page.
 * The filter is added here (priority 10 admin_menu) before the theme processes
 * cns_admin_tabs at priority 99, so it's included in the tab list.
 */
function cns_map_suite_register_under_cns_theme(): void {
	add_filter('cns_admin_tabs', function (array $tabs): array {
		$tabs['maps'] = [
			'menu_title' => __('Maps', 'cns-map-suite'),
			'title'      => __('CNS Map Suite', 'cns-map-suite'),
			'capability' => 'manage_maps',
			'callback'   => 'cns_map_suite_render_overview',
			'priority'   => 30,
		];
		return $tabs;
	});

	// Register editor as a hidden sub-page (accessible by URL, not shown in menu).
	add_submenu_page(
		'cns-settings',
		__('Map Editor', 'cns-map-suite'),
		__('Map Editor', 'cns-map-suite'),
		'manage_maps',
		'cns-map-editor',
		'cns_map_suite_render_editor'
	);
	remove_submenu_page('cns-settings', 'cns-map-editor');
}

/**
 * CNS theme not active: standalone top-level Maps menu.
 */
function cns_map_suite_register_standalone(): void {
	add_menu_page(
		__('Maps', 'cns-map-suite'),
		__('Maps', 'cns-map-suite'),
		'manage_maps',
		'cns-maps',
		'cns_map_suite_render_overview',
		'dashicons-location-alt',
		58
	);

	add_submenu_page(
		'cns-maps',
		__('All Maps', 'cns-map-suite'),
		__('All Maps', 'cns-map-suite'),
		'manage_maps',
		'cns-maps',
		'cns_map_suite_render_overview'
	);

	add_submenu_page(
		'cns-maps',
		__('New Map', 'cns-map-suite'),
		__('New Map', 'cns-map-suite'),
		'manage_maps',
		'cns-map-editor',
		'cns_map_suite_render_editor'
	);
}

add_action('admin_enqueue_scripts', 'cns_map_suite_enqueue_admin_assets');

function cns_map_suite_enqueue_admin_assets(): void {
	$screen = get_current_screen();
	if (! $screen) {
		return;
	}

	$page = sanitize_key($_GET['page'] ?? '');
	$is_maps_page = in_array($page, ['cns-maps', 'cns-map-editor', 'cns-settings-maps'], true);

	if (! $is_maps_page) {
		return;
	}

	wp_enqueue_style(
		'cns-map-admin',
		CNS_MAP_SUITE_URL . 'assets/admin/admin.css',
		[],
		CNS_MAP_SUITE_VERSION
	);

	wp_enqueue_script(
		'cns-map-admin',
		CNS_MAP_SUITE_URL . 'assets/admin/admin.js',
		['wp-color-picker'],
		CNS_MAP_SUITE_VERSION,
		true
	);

	wp_localize_script('cns-map-admin', 'cnsMapSuite', [
		'restUrl' => rest_url('cns-map-suite/v1'),
		'nonce'   => wp_create_nonce('wp_rest'),
	]);

	// Make WP media library and color picker available on the editor page.
	if ($page === 'cns-map-editor') {
		wp_enqueue_media();
		wp_enqueue_style('wp-color-picker');
	}
}

function cns_map_suite_render_overview(): void {
	include CNS_MAP_SUITE_DIR . 'includes/admin/views/overview.php';
}

function cns_map_suite_render_editor(): void {
	include CNS_MAP_SUITE_DIR . 'includes/admin/views/editor.php';
}
