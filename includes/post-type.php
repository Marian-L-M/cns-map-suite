<?php

defined('ABSPATH') || exit;

add_action('init', 'cns_map_suite_register_post_type');

function cns_map_suite_register_post_type(): void {
	if (post_type_exists('maps')) {
		return;
	}

	register_post_type('maps', [
		'labels' => [
			'name'               => __('Maps', 'cns-map-suite'),
			'singular_name'      => __('Map', 'cns-map-suite'),
			'add_new'            => __('Add New Map', 'cns-map-suite'),
			'add_new_item'       => __('Add New Map', 'cns-map-suite'),
			'edit_item'          => __('Edit Map', 'cns-map-suite'),
			'new_item'           => __('New Map', 'cns-map-suite'),
			'view_item'          => __('View Map', 'cns-map-suite'),
			'search_items'       => __('Search Maps', 'cns-map-suite'),
			'not_found'          => __('No maps found', 'cns-map-suite'),
			'not_found_in_trash' => __('No maps found in trash', 'cns-map-suite'),
		],
		'public'              => true,
		'publicly_queryable'  => true,
		'show_in_rest'        => true,   // Required for block editor REST queries.
		'show_ui'             => true,
		'show_in_menu'        => false,  // Managed via our custom admin menu.
		'show_in_nav_menus'   => false,
		'exclude_from_search' => true,
		'has_archive'         => false,
		'rewrite'             => ['slug' => 'maps'],
		'supports'            => ['title', 'thumbnail', 'custom-fields', 'excerpt'],
		'capability_type'     => 'post',
	]);
}

// Disable Gutenberg for the maps CPT; we provide a custom editor.
add_filter('use_block_editor_for_post_type', 'cns_map_suite_disable_gutenberg', 10, 2);

function cns_map_suite_disable_gutenberg(bool $use_editor, string $post_type): bool {
	if ($post_type === 'maps') {
		return false;
	}
	return $use_editor;
}

add_action('init', 'cns_map_suite_register_post_meta');

function cns_map_suite_register_post_meta(): void {
	$fields = [
		'_cns_map_featured'     => 'boolean',
		'_cns_map_width'        => 'integer',
		'_cns_map_aspect_ratio' => 'number',
		'_cns_map_time'         => 'integer',
		'_cns_map_image_id'     => 'integer',
		'_cns_map_image_x'      => 'number',
		'_cns_map_image_y'      => 'number',
		'_cns_map_image_width'  => 'number',
		'_cns_map_is_master'    => 'boolean',
	];

	foreach ($fields as $key => $type) {
		register_post_meta('maps', $key, [
			'type'          => $type,
			'single'        => true,
			'show_in_rest'  => false,
			'auth_callback' => fn() => current_user_can('edit_posts'),
		]);
	}
}
