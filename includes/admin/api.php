<?php

defined('ABSPATH') || exit;

add_action('rest_api_init', 'cns_map_suite_register_rest_routes');

function cns_map_suite_register_rest_routes(): void {
	register_rest_route('cns-map-suite/v1', '/maps', [
		'methods'             => 'POST',
		'callback'            => 'cns_map_suite_rest_save_map',
		'permission_callback' => fn() => current_user_can('manage_maps'),
		'args'                => [
			'map_id' => [
				'type'              => 'integer',
				'default'           => 0,
				'sanitize_callback' => 'absint',
			],
			'title' => [
				'type'              => 'string',
				'default'           => '',
				'sanitize_callback' => 'sanitize_text_field',
			],
			'status' => [
				'type'    => 'string',
				'default' => 'publish',
				'enum'    => ['publish', 'draft'],
			],
			'width' => [
				'type'    => 'integer',
				'default' => 1000,
				'minimum' => 100,
			],
			'aspect_ratio' => [
				'type'    => 'number',
				'default' => 1.0,
				'minimum' => 0.1,
			],
			'time' => [
				'type'    => 'integer',
				'default' => 0,
			],
			'image_id' => [
				'type'              => 'integer',
				'default'           => 0,
				'sanitize_callback' => 'absint',
			],
			'image_x' => [
				'type'    => 'number',
				'default' => 0.0,
			],
			'image_y' => [
				'type'    => 'number',
				'default' => 0.0,
			],
			'image_width' => [
				'type'    => 'number',
				'default' => 1.0,
				'minimum' => 0.01,
			],
			'is_master' => [
				'type'    => 'boolean',
				'default' => false,
			],
			'featured' => [
				'type'    => 'boolean',
				'default' => false,
			],
		],
	]);
}

function cns_map_suite_rest_save_map(WP_REST_Request $request): WP_REST_Response|WP_Error {
	$map_id = $request->get_param('map_id');
	$title  = $request->get_param('title') ?: __('(no title)', 'cns-map-suite');

	$post_data = [
		'post_type'   => 'maps',
		'post_title'  => $title,
		'post_status' => $request->get_param('status'),
	];

	if ($map_id > 0) {
		$existing = get_post($map_id);
		if (! $existing || $existing->post_type !== 'maps') {
			return new WP_Error(
				'invalid_map',
				__('Map not found.', 'cns-map-suite'),
				['status' => 404]
			);
		}
		$post_data['ID'] = $map_id;
		$result = wp_update_post($post_data, true);
	} else {
		$result = wp_insert_post($post_data, true);
	}

	if (is_wp_error($result)) {
		return $result;
	}

	$map_id = (int) $result;

	$meta = [
		'_cns_map_width'        => (int) $request->get_param('width'),
		'_cns_map_aspect_ratio' => (float) $request->get_param('aspect_ratio'),
		'_cns_map_time'         => (int) $request->get_param('time'),
		'_cns_map_image_id'     => (int) $request->get_param('image_id'),
		'_cns_map_image_x'      => (float) $request->get_param('image_x'),
		'_cns_map_image_y'      => (float) $request->get_param('image_y'),
		'_cns_map_image_width'  => (float) $request->get_param('image_width'),
		'_cns_map_is_master'    => (bool) $request->get_param('is_master'),
		'_cns_map_featured'     => (bool) $request->get_param('featured'),
	];

	foreach ($meta as $key => $value) {
		update_post_meta($map_id, $key, $value);
	}

	return new WP_REST_Response([
		'map_id'  => $map_id,
		'created' => $request->get_param('map_id') === 0,
		'edit_url' => add_query_arg(
			['page' => 'cns-map-editor', 'map_id' => $map_id],
			admin_url('admin.php')
		),
	], 200);
}
