<?php

defined('ABSPATH') || exit;

$map_id    = isset($_GET['map_id']) ? (int) $_GET['map_id'] : 0;
$map       = $map_id ? get_post($map_id) : null;
$is_new    = (! $map || $map->post_type !== 'maps');
$is_master = $map_id ? (bool) get_post_meta($map_id, '_cns_map_is_master', true) : false;

$meta = $map_id ? [
	'featured'     => (bool) get_post_meta($map_id, '_cns_map_featured', true),
	'width'        => (int) (get_post_meta($map_id, '_cns_map_width', true) ?: 1000),
	'aspect_ratio' => (float) (get_post_meta($map_id, '_cns_map_aspect_ratio', true) ?: 1.0),
	'time'         => (int) get_post_meta($map_id, '_cns_map_time', true),
	'image_id'     => (int) get_post_meta($map_id, '_cns_map_image_id', true),
	'image_x'      => (float) get_post_meta($map_id, '_cns_map_image_x', true),
	'image_y'      => (float) get_post_meta($map_id, '_cns_map_image_y', true),
	'image_width'  => (float) (get_post_meta($map_id, '_cns_map_image_width', true) ?: 1.0),
] : [
	'featured' => false, 'width' => 1000, 'aspect_ratio' => 1.0,
	'time' => 0, 'image_id' => 0, 'image_x' => 0.0, 'image_y' => 0.0, 'image_width' => 1.0,
];

$image_url = $meta['image_id'] ? wp_get_attachment_image_url($meta['image_id'], 'large') : '';
$overview_url = add_query_arg(
	['page' => get_template() === 'clouds-and-spaceships' ? 'cns-settings-maps' : 'cns-maps'],
	admin_url('admin.php')
);
?>
<div class="cns-map-editor wrap" data-map-id="<?php echo esc_attr($map_id); ?>">

	<div class="cns-map-editor__header">
		<a href="<?php echo esc_url($overview_url); ?>" class="cns-back-link">
			&larr; <?php esc_html_e('All Maps', 'cns-map-suite'); ?>
		</a>
		<h1>
			<?php echo $is_new
				? esc_html__('New Map', 'cns-map-suite')
				: esc_html(sprintf(__('Edit: %s', 'cns-map-suite'), $map->post_title ?: __('(no title)', 'cns-map-suite')));
			?>
		</h1>
		<div class="cns-map-editor__header-actions">
			<span class="cns-save-status" id="cns-save-status"></span>
			<button class="button button-primary" id="cns-map-save">
				<?php esc_html_e('Save Map', 'cns-map-suite'); ?>
			</button>
		</div>
	</div>

	<div class="cns-map-editor__body">

		<!-- Tab navigation -->
		<nav class="cns-map-editor__tabs" role="tablist" aria-label="<?php esc_attr_e('Editor modes', 'cns-map-suite'); ?>">
			<button class="cns-tab cns-tab--active" role="tab" data-tab="settings" aria-selected="true">
				<?php esc_html_e('Settings', 'cns-map-suite'); ?>
			</button>
			<button class="cns-tab" role="tab" data-tab="objects" aria-selected="false" <?php echo $is_master ? 'data-master-hide' : ''; ?>>
				<?php esc_html_e('Objects', 'cns-map-suite'); ?>
			</button>
			<button class="cns-tab" role="tab" data-tab="areas" aria-selected="false" <?php echo $is_master ? 'data-master-hide' : ''; ?>>
				<?php esc_html_e('Areas', 'cns-map-suite'); ?>
			</button>
			<button class="cns-tab" role="tab" data-tab="hierarchy" aria-selected="false" <?php echo ! $is_master ? 'data-master-show' : ''; ?>>
				<?php esc_html_e('Hierarchy', 'cns-map-suite'); ?>
			</button>
			<button class="cns-tab" role="tab" data-tab="preview" aria-selected="false">
				<?php esc_html_e('Preview', 'cns-map-suite'); ?>
			</button>
		</nav>

		<!-- Tab panels -->
		<div class="cns-map-editor__content">

			<!-- Settings -->
			<div class="cns-tab-panel cns-tab-panel--active" data-panel="settings" role="tabpanel">
				<div class="cns-settings-panel">
					<div class="cns-form-grid">

						<div class="cns-form-row cns-form-row--full">
							<label for="cns-map-title"><?php esc_html_e('Map Title', 'cns-map-suite'); ?></label>
							<input
								type="text"
								id="cns-map-title"
								class="large-text"
								value="<?php echo esc_attr($map ? $map->post_title : ''); ?>"
								placeholder="<?php esc_attr_e('Enter map title…', 'cns-map-suite'); ?>"
							/>
						</div>

						<div class="cns-form-row">
							<label for="cns-map-width"><?php esc_html_e('Max Width (px)', 'cns-map-suite'); ?></label>
							<input type="number" id="cns-map-width" class="small-text" value="<?php echo esc_attr($meta['width']); ?>" min="100" step="10" />
						</div>

						<div class="cns-form-row">
							<label for="cns-map-aspect-ratio"><?php esc_html_e('Aspect Ratio', 'cns-map-suite'); ?></label>
							<input type="number" id="cns-map-aspect-ratio" class="small-text" value="<?php echo esc_attr($meta['aspect_ratio']); ?>" step="0.01" min="0.1" />
							<p class="description"><?php esc_html_e('Width ÷ Height (e.g. 1.77 for 16∶9)', 'cns-map-suite'); ?></p>
						</div>

						<div class="cns-form-row">
							<label for="cns-map-time"><?php esc_html_e('Map Time', 'cns-map-suite'); ?></label>
							<input type="number" id="cns-map-time" class="small-text" value="<?php echo esc_attr($meta['time']); ?>" />
							<p class="description"><?php esc_html_e('In-world timeline value.', 'cns-map-suite'); ?></p>
						</div>

						<div class="cns-form-row cns-form-row--full">
							<label><?php esc_html_e('Base Map Image', 'cns-map-suite'); ?></label>
							<input type="hidden" id="cns-map-image-id" value="<?php echo esc_attr($meta['image_id']); ?>" />
							<div class="cns-image-picker">
								<div class="cns-image-picker__preview" id="cns-image-preview">
									<?php if ($image_url) : ?>
										<img src="<?php echo esc_url($image_url); ?>" alt="" />
									<?php else : ?>
										<span><?php esc_html_e('No image selected', 'cns-map-suite'); ?></span>
									<?php endif; ?>
								</div>
								<button type="button" class="button" id="cns-select-image">
									<?php esc_html_e('Select Image', 'cns-map-suite'); ?>
								</button>
								<button type="button" class="button <?php echo $image_url ? '' : 'cns-hidden'; ?>" id="cns-remove-image">
									<?php esc_html_e('Remove', 'cns-map-suite'); ?>
								</button>
							</div>
						</div>

						<div class="cns-form-row">
							<label for="cns-map-image-x"><?php esc_html_e('Image X offset (0–1)', 'cns-map-suite'); ?></label>
							<input type="number" id="cns-map-image-x" class="small-text" value="<?php echo esc_attr($meta['image_x']); ?>" step="0.01" min="0" max="1" />
						</div>

						<div class="cns-form-row">
							<label for="cns-map-image-y"><?php esc_html_e('Image Y offset (0–1)', 'cns-map-suite'); ?></label>
							<input type="number" id="cns-map-image-y" class="small-text" value="<?php echo esc_attr($meta['image_y']); ?>" step="0.01" min="0" max="1" />
						</div>

						<div class="cns-form-row">
							<label for="cns-map-image-width"><?php esc_html_e('Image Width (0–1 relative)', 'cns-map-suite'); ?></label>
							<input type="number" id="cns-map-image-width" class="small-text" value="<?php echo esc_attr($meta['image_width']); ?>" step="0.01" min="0.01" max="2" />
							<p class="description"><?php esc_html_e('1.0 = full canvas width. Height follows image ratio.', 'cns-map-suite'); ?></p>
						</div>

						<div class="cns-form-row">
							<label>
								<input type="checkbox" id="cns-map-is-master" <?php checked($is_master); ?> />
								<?php esc_html_e('MasterMap mode', 'cns-map-suite'); ?>
							</label>
							<p class="description"><?php esc_html_e('Links to child maps instead of posts. Switches Objects/Areas tabs to Hierarchy.', 'cns-map-suite'); ?></p>
						</div>

						<div class="cns-form-row">
							<label>
								<input type="checkbox" id="cns-map-featured" <?php checked($meta['featured']); ?> />
								<?php esc_html_e('Featured', 'cns-map-suite'); ?>
							</label>
						</div>

					</div>
				</div>
			</div>

			<!-- Objects (placeholder) -->
			<div class="cns-tab-panel" data-panel="objects" role="tabpanel">
				<div class="cns-placeholder">
					<span class="dashicons dashicons-location-alt cns-placeholder__icon"></span>
					<h3><?php esc_html_e('Map Objects', 'cns-map-suite'); ?></h3>
					<p><?php esc_html_e('Place clickable SVG icon markers on the map. Each icon can link to a post or display manual infobox content. Clicking opens an infobox drawer.', 'cns-map-suite'); ?></p>
					<p class="cns-placeholder__tag"><?php esc_html_e('— Coming soon —', 'cns-map-suite'); ?></p>
				</div>
			</div>

			<!-- Areas (placeholder) -->
			<div class="cns-tab-panel" data-panel="areas" role="tabpanel">
				<div class="cns-placeholder">
					<span class="dashicons dashicons-editor-expand cns-placeholder__icon"></span>
					<h3><?php esc_html_e('Map Areas', 'cns-map-suite'); ?></h3>
					<p><?php esc_html_e('Draw polygon, bezier, or circular areas on the map canvas. Clicking an area opens an infobox and optionally links to a related post.', 'cns-map-suite'); ?></p>
					<p class="cns-placeholder__tag"><?php esc_html_e('— Coming soon —', 'cns-map-suite'); ?></p>
				</div>
			</div>

			<!-- Hierarchy (placeholder) -->
			<div class="cns-tab-panel" data-panel="hierarchy" role="tabpanel">
				<div class="cns-placeholder">
					<span class="dashicons dashicons-networking cns-placeholder__icon"></span>
					<h3><?php esc_html_e('Map Hierarchy', 'cns-map-suite'); ?></h3>
					<p><?php esc_html_e('Define regions on this MasterMap that link to child maps. Hovering a region shows the child map\'s thumbnail and excerpt; clicking navigates to it.', 'cns-map-suite'); ?></p>
					<p class="cns-placeholder__tag"><?php esc_html_e('— Coming soon —', 'cns-map-suite'); ?></p>
				</div>
			</div>

			<!-- Preview -->
			<div class="cns-tab-panel" data-panel="preview" role="tabpanel">
				<div class="cns-canvas-wrap">
					<canvas id="cns-map-canvas" class="cns-map-canvas"></canvas>
					<p class="cns-placeholder__tag"><?php esc_html_e('Interactive canvas preview — Coming soon', 'cns-map-suite'); ?></p>
				</div>
			</div>

		</div><!-- /.cns-map-editor__content -->
	</div><!-- /.cns-map-editor__body -->
</div><!-- /.cns-map-editor -->
