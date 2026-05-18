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

$width  = (int) (get_post_meta($map_id, '_cns_map_width', true) ?: 1000);
$ratio  = (float) (get_post_meta($map_id, '_cns_map_aspect_ratio', true) ?: 1.0);
$height = $ratio > 0 ? round($width / $ratio) : $width;
$is_master = (bool) get_post_meta($map_id, '_cns_map_is_master', true);

$wrapper_attrs = get_block_wrapper_attributes([
	'class'          => 'cns-map',
	'data-map-id'    => $map_id,
	'data-is-master' => $is_master ? 'true' : 'false',
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
	<p class="cns-map-placeholder-notice">
		<?php
		printf(
			/* translators: %s: map title */
			esc_html__('Map: %s — interactive canvas coming soon.', 'cns-map-suite'),
			esc_html($map->post_title)
		);
		?>
	</p>
</div>
