<?php

defined('ABSPATH') || exit;

add_action('rest_api_init', 'cns_map_suite_register_rest_routes');

function cns_map_suite_register_rest_routes(): void {

	// ── Map settings save ─────────────────────────────────────────────────────

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
			'bg_type' => [
				'type'    => 'string',
				'default' => 'color',
				'enum'    => ['color', 'image'],
			],
			'bg_color' => [
				'type'              => 'string',
				'default'           => '#1a1a2e',
				'sanitize_callback' => 'sanitize_hex_color',
			],
			'bg_image_id' => [
				'type'              => 'integer',
				'default'           => 0,
				'sanitize_callback' => 'absint',
			],
		],
	]);

	// ── Icon library ──────────────────────────────────────────────────────────

	register_rest_route('cns-map-suite/v1', '/icons', [
		[
			'methods'             => 'GET',
			'callback'            => 'cns_map_suite_rest_list_icons',
			'permission_callback' => fn() => current_user_can('manage_maps'),
		],
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_add_icon',
			'permission_callback' => fn() => current_user_can('manage_maps'),
			'args'                => [
				'attachment_id' => [
					'type'              => 'integer',
					'required'          => true,
					'sanitize_callback' => 'absint',
				],
			],
		],
	]);

	register_rest_route('cns-map-suite/v1', '/icons/(?P<id>\d+)', [
		'methods'             => 'DELETE',
		'callback'            => 'cns_map_suite_rest_remove_icon',
		'permission_callback' => fn() => current_user_can('manage_maps'),
	]);

	// ── Map objects ───────────────────────────────────────────────────────────

	register_rest_route('cns-map-suite/v1', '/maps/(?P<map_id>\d+)/objects', [
		[
			'methods'             => 'GET',
			'callback'            => 'cns_map_suite_rest_list_objects',
			'permission_callback' => fn() => current_user_can('manage_maps'),
		],
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_create_object',
			'permission_callback' => fn() => current_user_can('manage_maps'),
			'args'                => cns_map_suite_object_rest_args(),
		],
	]);

	register_rest_route('cns-map-suite/v1', '/objects/(?P<id>\d+)', [
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_update_object',
			'permission_callback' => fn() => current_user_can('manage_maps'),
			'args'                => cns_map_suite_object_rest_args(),
		],
		[
			'methods'             => 'DELETE',
			'callback'            => 'cns_map_suite_rest_delete_object',
			'permission_callback' => fn() => current_user_can('manage_maps'),
		],
	]);

	register_rest_route('cns-map-suite/v1', '/objects/(?P<id>\d+)/position', [
		'methods'             => 'PATCH',
		'callback'            => 'cns_map_suite_rest_move_object',
		'permission_callback' => fn() => current_user_can('manage_maps'),
		'args'                => [
			'x' => ['required' => true, 'type' => 'integer', 'minimum' => 0],
			'y' => ['required' => true, 'type' => 'integer', 'minimum' => 0],
		],
	]);

	// ── Map areas ─────────────────────────────────────────────────────────────────

	register_rest_route('cns-map-suite/v1', '/maps/(?P<map_id>\d+)/areas', [
		[
			'methods'             => 'GET',
			'callback'            => 'cns_map_suite_rest_list_areas',
			'permission_callback' => fn() => current_user_can('manage_maps'),
		],
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_create_area',
			'permission_callback' => fn() => current_user_can('manage_maps'),
			'args'                => cns_map_suite_area_rest_args(),
		],
	]);

	register_rest_route('cns-map-suite/v1', '/areas/(?P<id>\d+)', [
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_update_area',
			'permission_callback' => fn() => current_user_can('manage_maps'),
			'args'                => cns_map_suite_area_rest_args(),
		],
		[
			'methods'             => 'DELETE',
			'callback'            => 'cns_map_suite_rest_delete_area',
			'permission_callback' => fn() => current_user_can('manage_maps'),
		],
	]);
}

// ── Map settings ──────────────────────────────────────────────────────────────

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
			return new WP_Error('invalid_map', __('Map not found.', 'cns-map-suite'), ['status' => 404]);
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
		'_cns_map_bg_type'      => (string) $request->get_param('bg_type'),
		'_cns_map_bg_color'     => sanitize_hex_color($request->get_param('bg_color')) ?: '#1a1a2e',
		'_cns_map_bg_image_id'  => (int) $request->get_param('bg_image_id'),
	];

	foreach ($meta as $key => $value) {
		update_post_meta($map_id, $key, $value);
	}

	return new WP_REST_Response([
		'map_id'   => $map_id,
		'created'  => $request->get_param('map_id') === 0,
		'edit_url' => add_query_arg(
			['page' => 'cns-map-editor', 'map_id' => $map_id],
			admin_url('admin.php')
		),
	], 200);
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function cns_map_suite_rest_list_icons(): WP_REST_Response {
	$attachments = get_posts([
		'post_type'      => 'attachment',
		'post_mime_type' => 'image/svg+xml',
		'post_status'    => 'inherit',
		'posts_per_page' => -1,
		'meta_query'     => [['key' => '_cns_map_icon', 'value' => '1']],
		'orderby'        => 'title',
		'order'          => 'ASC',
	]);

	$icons = array_map(fn($att) => [
		'id'    => $att->ID,
		'title' => $att->post_title ?: basename(get_attached_file($att->ID) ?: ''),
		'url'   => wp_get_attachment_url($att->ID),
	], $attachments);

	return new WP_REST_Response(array_values($icons), 200);
}

function cns_map_suite_rest_add_icon(WP_REST_Request $request): WP_REST_Response|WP_Error {
	$id         = $request->get_param('attachment_id');
	$attachment = get_post($id);

	if (!$attachment || $attachment->post_type !== 'attachment') {
		return new WP_Error('not_found', __('Attachment not found.', 'cns-map-suite'), ['status' => 404]);
	}
	if (get_post_mime_type($id) !== 'image/svg+xml') {
		return new WP_Error('not_svg', __('Only SVG files can be added to the icon library.', 'cns-map-suite'), ['status' => 400]);
	}

	update_post_meta($id, '_cns_map_icon', '1');

	return new WP_REST_Response([
		'id'    => $id,
		'title' => $attachment->post_title ?: basename(get_attached_file($id) ?: ''),
		'url'   => wp_get_attachment_url($id),
	], 200);
}

function cns_map_suite_rest_remove_icon(WP_REST_Request $request): WP_REST_Response|WP_Error {
	$id = (int) $request->get_param('id');
	if (!get_post($id)) {
		return new WP_Error('not_found', __('Icon not found.', 'cns-map-suite'), ['status' => 404]);
	}
	delete_post_meta($id, '_cns_map_icon');
	return new WP_REST_Response(['deleted' => true], 200);
}

// ── Objects — shared args ─────────────────────────────────────────────────────

function cns_map_suite_object_rest_args(): array {
	return [
		'icon_image_id' => [
			'type'              => 'integer',
			'default'           => 0,
			'sanitize_callback' => 'absint',
		],
		'title' => [
			'type'              => 'string',
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		],
		'type' => [
			'type'    => 'string',
			'default' => 'LOCATION',
			'enum'    => ['LOCATION', 'HISTORY', 'NATURAL', 'EVENT', 'OTHER'],
		],
		'x' => [
			'type'    => 'integer',
			'default' => 0,
		],
		'y' => [
			'type'    => 'integer',
			'default' => 0,
		],
		'object_time' => [
			'type'    => 'integer',
			'default' => 0,
		],
		'infobox_source' => [
			'type'    => 'string',
			'default' => 'manual',
			'enum'    => ['manual', 'post'],
		],
		'linked_post_id' => [
			'type'              => 'integer',
			'default'           => 0,
			'sanitize_callback' => 'absint',
		],
		'infobox_title' => [
			'type'              => 'string',
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		],
		'infobox_description' => [
			'type'    => 'string',
			'default' => '',
		],
		'infobox_image_id' => [
			'type'              => 'integer',
			'default'           => 0,
			'sanitize_callback' => 'absint',
		],
		'style_size' => [
			'type'    => 'integer',
			'default' => 32,
			'minimum' => 8,
			'maximum' => 128,
		],
		'style_fill' => [
			'type'    => 'string',
			'default' => '#ffffff',
		],
		'style_stroke' => [
			'type'    => 'string',
			'default' => '#2271b1',
		],
	];
}

// ── Objects — helpers ─────────────────────────────────────────────────────────

function cns_map_suite_object_from_args(WP_REST_Request $request): array {
	return [
		'canvas_styles' => wp_json_encode([
			'size'        => (int) $request->get_param('style_size'),
			'fillStyle'   => (string) $request->get_param('style_fill'),
			'strokeStyle' => (string) $request->get_param('style_stroke'),
		]),
		'infobox_data' => wp_json_encode([
			'title'       => (string) $request->get_param('infobox_title'),
			'description' => wp_kses_post($request->get_param('infobox_description')),
			'image_id'    => (int) $request->get_param('infobox_image_id'),
		]),
	];
}

function cns_map_suite_normalize_object_row(array $row): array {
	$row['canvas_styles'] = $row['canvas_styles'] ? json_decode($row['canvas_styles'], true) : (object) [];
	$row['infobox_data']  = $row['infobox_data']  ? json_decode($row['infobox_data'], true)  : (object) [];
	$row['icon_url']      = $row['icon_image_id'] ? (wp_get_attachment_url((int) $row['icon_image_id']) ?: '') : '';
	$row['icon_mime']     = $row['icon_image_id'] ? (get_post_mime_type((int) $row['icon_image_id']) ?: '') : '';
	foreach (['id', 'map_id', 'linked_post_id', 'icon_image_id', 'x', 'y', 'object_time'] as $k) {
		$row[$k] = (int) ($row[$k] ?? 0);
	}
	return $row;
}

// ── Objects — CRUD ────────────────────────────────────────────────────────────

function cns_map_suite_rest_list_objects(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id = (int) $request->get_param('map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'cns-map-suite'), ['status' => 404]);
	}

	$rows = $wpdb->get_results(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_objects WHERE map_id = %d ORDER BY id ASC", $map_id),
		ARRAY_A
	);

	return new WP_REST_Response(array_map('cns_map_suite_normalize_object_row', $rows ?: []), 200);
}

function cns_map_suite_rest_create_object(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id = (int) $request->get_param('map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'cns-map-suite'), ['status' => 404]);
	}

	$derived = cns_map_suite_object_from_args($request);

	$wpdb->insert(
		$wpdb->prefix . 'cns_map_objects',
		[
			'map_id'         => $map_id,
			'linked_post_id' => $request->get_param('linked_post_id') ?: null,
			'type'           => $request->get_param('type'),
			'svg_slug'       => '',
			'icon_image_id'  => $request->get_param('icon_image_id') ?: null,
			'title'          => $request->get_param('title'),
			'x'              => $request->get_param('x'),
			'y'              => $request->get_param('y'),
			'object_time'    => $request->get_param('object_time'),
			'infobox_source' => $request->get_param('infobox_source'),
			'infobox_data'   => $derived['infobox_data'],
			'canvas_styles'  => $derived['canvas_styles'],
		],
		['%d', '%d', '%s', '%s', '%d', '%s', '%d', '%d', '%d', '%s', '%s', '%s']
	);

	if (!$wpdb->insert_id) {
		return new WP_Error('db_error', __('Failed to save object.', 'cns-map-suite'), ['status' => 500]);
	}

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_objects WHERE id = %d", $wpdb->insert_id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_object_row($row), 201);
}

function cns_map_suite_rest_update_object(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_objects WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Object not found.', 'cns-map-suite'), ['status' => 404]);
	}

	$derived = cns_map_suite_object_from_args($request);

	$wpdb->update(
		$wpdb->prefix . 'cns_map_objects',
		[
			'linked_post_id' => $request->get_param('linked_post_id') ?: null,
			'type'           => $request->get_param('type'),
			'icon_image_id'  => $request->get_param('icon_image_id') ?: null,
			'title'          => $request->get_param('title'),
			'x'              => $request->get_param('x'),
			'y'              => $request->get_param('y'),
			'object_time'    => $request->get_param('object_time'),
			'infobox_source' => $request->get_param('infobox_source'),
			'infobox_data'   => $derived['infobox_data'],
			'canvas_styles'  => $derived['canvas_styles'],
		],
		['id' => $id],
		['%d', '%s', '%d', '%s', '%d', '%d', '%d', '%s', '%s', '%s'],
		['%d']
	);

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_objects WHERE id = %d", $id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_object_row($row), 200);
}

function cns_map_suite_rest_delete_object(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_objects WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Object not found.', 'cns-map-suite'), ['status' => 404]);
	}

	$wpdb->delete($wpdb->prefix . 'cns_map_objects', ['id' => $id], ['%d']);
	return new WP_REST_Response(['deleted' => true], 200);
}

// ── Areas — shared args ───────────────────────────────────────────────────────

function cns_map_suite_area_rest_args(): array {
	return [
		'title' => [
			'type'              => 'string',
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		],
		'type' => [
			'type'    => 'string',
			'default' => 'GEOGRAPHY',
			'enum'    => ['GEOGRAPHY', 'HISTORY', 'NATURAL', 'EVENT', 'OTHER'],
		],
		'shape_type' => [
			'type'    => 'string',
			'default' => 'POLYGON',
			'enum'    => ['POLYGON', 'BEZIER', 'CIRCLE'],
		],
		'object_time' => [
			'type'    => 'integer',
			'default' => 0,
		],
		'linked_post_id' => [
			'type'              => 'integer',
			'default'           => 0,
			'sanitize_callback' => 'absint',
		],
		'infobox_source' => [
			'type'    => 'string',
			'default' => 'manual',
			'enum'    => ['manual', 'post'],
		],
		'infobox_title' => [
			'type'              => 'string',
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		],
		'infobox_description' => [
			'type'    => 'string',
			'default' => '',
		],
		'infobox_image_id' => [
			'type'              => 'integer',
			'default'           => 0,
			'sanitize_callback' => 'absint',
		],
		'nodes' => [
			'type'    => 'string',
			'default' => '[]',
		],
		'style_fill' => [
			'type'    => 'string',
			'default' => '#2271b1',
		],
		'style_fill_opacity' => [
			'type'    => 'number',
			'default' => 0.3,
			'minimum' => 0.0,
			'maximum' => 1.0,
		],
		'style_stroke' => [
			'type'    => 'string',
			'default' => '#2271b1',
		],
		'style_stroke_width' => [
			'type'    => 'integer',
			'default' => 2,
			'minimum' => 1,
			'maximum' => 10,
		],
	];
}

// ── Areas — helpers ───────────────────────────────────────────────────────────

function cns_map_suite_area_styles_from_args(WP_REST_Request $request): string {
	return wp_json_encode([
		'fill'        => (string) $request->get_param('style_fill'),
		'fillOpacity' => (float)  $request->get_param('style_fill_opacity'),
		'stroke'      => (string) $request->get_param('style_stroke'),
		'strokeWidth' => (int)    $request->get_param('style_stroke_width'),
	]);
}

function cns_map_suite_normalize_area_row(array $row): array {
	$row['canvas_styles'] = $row['canvas_styles'] ? json_decode($row['canvas_styles'], true) : (object) [];
	$row['infobox_data']  = $row['infobox_data']  ? json_decode($row['infobox_data'],  true) : (object) [];
	$row['nodes']         = $row['nodes']         ? json_decode($row['nodes'],          true) : [];
	foreach (['id', 'map_id', 'linked_post_id', 'background_image_id', 'object_time'] as $k) {
		$row[$k] = (int) ($row[$k] ?? 0);
	}
	return $row;
}

// ── Areas — CRUD ──────────────────────────────────────────────────────────────

function cns_map_suite_rest_list_areas(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id = (int) $request->get_param('map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'cns-map-suite'), ['status' => 404]);
	}

	$rows = $wpdb->get_results(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_areas WHERE map_id = %d ORDER BY id ASC", $map_id),
		ARRAY_A
	);

	return new WP_REST_Response(array_map('cns_map_suite_normalize_area_row', $rows ?: []), 200);
}

function cns_map_suite_rest_create_area(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id = (int) $request->get_param('map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'cns-map-suite'), ['status' => 404]);
	}

	$nodes_raw     = $request->get_param('nodes');
	$nodes_decoded = json_decode($nodes_raw, true);
	if (!is_array($nodes_decoded)) $nodes_decoded = [];

	$infobox_data = wp_json_encode([
		'title'       => (string) $request->get_param('infobox_title'),
		'description' => wp_kses_post($request->get_param('infobox_description')),
		'image_id'    => (int) $request->get_param('infobox_image_id'),
	]);

	$wpdb->insert(
		$wpdb->prefix . 'cns_map_areas',
		[
			'map_id'         => $map_id,
			'linked_post_id' => $request->get_param('linked_post_id') ?: null,
			'type'           => $request->get_param('type'),
			'shape_type'     => $request->get_param('shape_type'),
			'title'          => $request->get_param('title'),
			'object_time'    => $request->get_param('object_time'),
			'nodes'          => wp_json_encode($nodes_decoded),
			'infobox_source' => $request->get_param('infobox_source'),
			'infobox_data'   => $infobox_data,
			'canvas_styles'  => cns_map_suite_area_styles_from_args($request),
		],
		['%d', '%d', '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s']
	);

	if (!$wpdb->insert_id) {
		return new WP_Error('db_error', __('Failed to save area.', 'cns-map-suite'), ['status' => 500]);
	}

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_areas WHERE id = %d", $wpdb->insert_id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_area_row($row), 201);
}

function cns_map_suite_rest_update_area(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_areas WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Area not found.', 'cns-map-suite'), ['status' => 404]);
	}

	$nodes_raw     = $request->get_param('nodes');
	$nodes_decoded = json_decode($nodes_raw, true);
	if (!is_array($nodes_decoded)) $nodes_decoded = [];

	$infobox_data = wp_json_encode([
		'title'       => (string) $request->get_param('infobox_title'),
		'description' => wp_kses_post($request->get_param('infobox_description')),
		'image_id'    => (int) $request->get_param('infobox_image_id'),
	]);

	$wpdb->update(
		$wpdb->prefix . 'cns_map_areas',
		[
			'linked_post_id' => $request->get_param('linked_post_id') ?: null,
			'type'           => $request->get_param('type'),
			'shape_type'     => $request->get_param('shape_type'),
			'title'          => $request->get_param('title'),
			'object_time'    => $request->get_param('object_time'),
			'nodes'          => wp_json_encode($nodes_decoded),
			'infobox_source' => $request->get_param('infobox_source'),
			'infobox_data'   => $infobox_data,
			'canvas_styles'  => cns_map_suite_area_styles_from_args($request),
		],
		['id' => $id],
		['%d', '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s'],
		['%d']
	);

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_areas WHERE id = %d", $id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_area_row($row), 200);
}

function cns_map_suite_rest_delete_area(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_areas WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Area not found.', 'cns-map-suite'), ['status' => 404]);
	}

	$wpdb->delete($wpdb->prefix . 'cns_map_areas', ['id' => $id], ['%d']);
	return new WP_REST_Response(['deleted' => true], 200);
}

// ── Objects — move ────────────────────────────────────────────────────────────

function cns_map_suite_rest_move_object(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_objects WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Object not found.', 'cns-map-suite'), ['status' => 404]);
	}

	$wpdb->update(
		$wpdb->prefix . 'cns_map_objects',
		['x' => (int) $request->get_param('x'), 'y' => (int) $request->get_param('y')],
		['id' => $id],
		['%d', '%d'],
		['%d']
	);

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_objects WHERE id = %d", $id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_object_row($row), 200);
}
