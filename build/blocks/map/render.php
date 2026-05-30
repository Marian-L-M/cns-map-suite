<?php

defined('ABSPATH') || exit;

$map_id = (int) ($attributes['mapId'] ?? 0);

if (! $map_id) {
	return;
}

$map = get_post($map_id);

if (! $map || $map->post_type !== 'maps') {
	return;
}

// Respect post status: draft/pending only visible to map managers; private requires read_private_posts.
if ($map->post_status === 'private' && ! current_user_can('read_private_posts')) {
	return;
}
if (! in_array($map->post_status, ['publish', 'private'], true) && ! current_user_can('manage_maps')) {
	return;
}

global $wpdb;

// ── Map settings ──────────────────────────────────────────────────────────────

$width       = (int) (get_post_meta($map_id, '_cns_map_width', true) ?: 1000);
$ratio       = (float) (get_post_meta($map_id, '_cns_map_aspect_ratio', true) ?: 1.0);
$height      = $ratio > 0 ? (int) round($width / $ratio) : $width;
$bg_type     = get_post_meta($map_id, '_cns_map_bg_type', true) ?: 'color';
$bg_color    = get_post_meta($map_id, '_cns_map_bg_color', true) ?: '#1a1a2e';
$bg_image_id = (int) get_post_meta($map_id, '_cns_map_bg_image_id', true);
$image_id    = (int) get_post_meta($map_id, '_cns_map_image_id', true);
$image_x     = (float) get_post_meta($map_id, '_cns_map_image_x', true);
$image_y     = (float) get_post_meta($map_id, '_cns_map_image_y', true);
$image_w     = (float) (get_post_meta($map_id, '_cns_map_image_width', true) ?: 1.0);
$is_master   = (bool) get_post_meta($map_id, '_cns_map_is_master', true);

// ── Infobox resolver ──────────────────────────────────────────────────────────

// Local closure — avoids redeclaration if render.php is somehow included twice.
// For linked-post mode: title and excerpt are used as-is; content is the full
// rendered post HTML (apply_filters is safe here because the_content re-entry
// is blocked by the static $rendering guard in post-type.php).
$resolve_infobox = static function (array $item): array {
	if (($item['infobox_source'] ?? '') === 'post' && ! empty($item['linked_post_id'])) {
		$linked = get_post((int) $item['linked_post_id']);
		if ($linked) {
			$item['infobox_resolved'] = [
				'title'     => $linked->post_title,
				'excerpt'   => $linked->post_excerpt,
				'content'   => apply_filters('the_content', $linked->post_content),
				'image_url' => get_the_post_thumbnail_url($linked->ID, 'medium') ?: '',
				'post_url'  => get_permalink($linked) ?: '',
			];
			return $item;
		}
	}
	$ib = is_array($item['infobox_data'] ?? null) ? $item['infobox_data'] : [];
	$item['infobox_resolved'] = [
		'title'     => $ib['title']       ?? '',
		'excerpt'   => '',
		'content'   => $ib['description'] ?? '',
		'image_url' => ! empty($ib['image_id']) ? (wp_get_attachment_image_url((int) $ib['image_id'], 'medium') ?: '') : '',
		'post_url'  => '',
	];
	return $item;
};

// ── Objects ───────────────────────────────────────────────────────────────────

$object_rows = $wpdb->get_results(
	$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_objects WHERE map_id = %d ORDER BY id ASC", $map_id),
	ARRAY_A
);

$objects = array_map(
	fn($row) => $resolve_infobox(cns_map_suite_normalize_object_row($row)),
	$object_rows ?: []
);

// ── Areas ─────────────────────────────────────────────────────────────────────

$area_rows = $wpdb->get_results(
	$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_areas WHERE map_id = %d ORDER BY id ASC", $map_id),
	ARRAY_A
);

$areas = array_map(
	fn($row) => $resolve_infobox(cns_map_suite_normalize_area_row($row)),
	$area_rows ?: []
);

// ── Inline data ───────────────────────────────────────────────────────────────

$map_data = [
	'mapId'      => $map_id,
	'width'      => $width,
	'height'     => $height,
	'bgType'     => $bg_type,
	'bgColor'    => $bg_color,
	'bgImageUrl' => $bg_image_id ? (wp_get_attachment_image_url($bg_image_id, 'full') ?: '') : '',
	'imgUrl'     => $image_id    ? (wp_get_attachment_image_url($image_id, 'full')    ?: '') : '',
	'imageX'     => $image_x,
	'imageY'     => $image_y,
	'imageW'     => $image_w,
	'objects'    => $objects,
	'areas'      => $areas,
];

$wrapper_attrs = get_block_wrapper_attributes([
	'class'       => 'cns-map',
	'data-map-id' => (string) $map_id,
]);
?>
<div <?php echo $wrapper_attrs; ?>>
	<div class="cns-map-canvas-wrap">
		<canvas
			class="cns-map-canvas"
			width="<?php echo esc_attr($width); ?>"
			height="<?php echo esc_attr($height); ?>"
			aria-label="<?php echo esc_attr($map->post_title); ?>"
		></canvas>
	</div>
	<script type="application/json" data-cns-map><?php echo wp_json_encode($map_data, JSON_HEX_TAG | JSON_HEX_AMP); ?></script>
	<noscript>
		<p><?php
			printf(
				/* translators: %s: map title */
				esc_html__('Map: %s — JavaScript is required to view this interactive map.', 'cns-map-suite'),
				esc_html($map->post_title)
			);
		?></p>
	</noscript>
</div>
