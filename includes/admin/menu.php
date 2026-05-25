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
 * CNS theme active: overview + icons tabs via cns_admin_tabs + hidden editor sub-page.
 * Filter runs at priority 10, before the theme processes tabs at priority 99.
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
		$tabs['icons'] = [
			'menu_title' => __('Icons', 'cns-map-suite'),
			'title'      => __('Icon Library', 'cns-map-suite'),
			'capability' => 'manage_maps',
			'callback'   => 'cns_map_suite_render_icons',
			'priority'   => 31,
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
		__('Icon Library', 'cns-map-suite'),
		__('Icon Library', 'cns-map-suite'),
		'manage_maps',
		'cns-map-icons',
		'cns_map_suite_render_icons'
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

	$page         = sanitize_key($_GET['page'] ?? '');
	$is_maps_page = in_array($page, [
		'cns-maps', 'cns-map-editor', 'cns-map-icons',
		'cns-settings-maps', 'cns-settings-icons',
	], true);

	if (! $is_maps_page) {
		return;
	}

	wp_enqueue_style(
		'cns-map-admin',
		CNS_MAP_SUITE_URL . 'assets/admin/admin.css',
		[],
		CNS_MAP_SUITE_VERSION
	);

	$admin_asset_file = CNS_MAP_SUITE_DIR . 'build/admin/index.asset.php';
	$admin_asset      = file_exists( $admin_asset_file )
		? require $admin_asset_file
		: [ 'dependencies' => [], 'version' => CNS_MAP_SUITE_VERSION ];

	wp_enqueue_script(
		'cns-map-admin',
		CNS_MAP_SUITE_URL . 'build/admin/index.js',
		array_merge( [ 'wp-color-picker' ], $admin_asset['dependencies'] ),
		$admin_asset['version'],
		true
	);

	$icons_page = get_template() === 'clouds-and-spaceships' ? 'cns-settings-icons' : 'cns-map-icons';

	wp_localize_script('cns-map-admin', 'cnsMapSuite', [
		'restUrl'   => rest_url('cns-map-suite/v1'),
		'wpRestUrl' => rest_url('wp/v2'),
		'nonce'     => wp_create_nonce('wp_rest'),
		'iconsUrl'  => add_query_arg(['page' => $icons_page], admin_url('admin.php')),
	]);

	if (in_array($page, ['cns-map-editor', 'cns-map-icons', 'cns-settings-icons'], true)) {
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

function cns_map_suite_render_icons(): void {
	include CNS_MAP_SUITE_DIR . 'includes/admin/views/icons.php';
}
