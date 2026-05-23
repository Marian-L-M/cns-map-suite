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
	'bg_type'      => get_post_meta($map_id, '_cns_map_bg_type', true) ?: 'color',
	'bg_color'     => get_post_meta($map_id, '_cns_map_bg_color', true) ?: '#1a1a2e',
	'bg_image_id'  => (int) get_post_meta($map_id, '_cns_map_bg_image_id', true),
] : [
	'featured' => false, 'width' => 1000, 'aspect_ratio' => 1.0,
	'time' => 0, 'image_id' => 0, 'image_x' => 0.0, 'image_y' => 0.0, 'image_width' => 1.0,
	'bg_type' => 'color', 'bg_color' => '#1a1a2e', 'bg_image_id' => 0,
];

$image_url    = $meta['image_id'] ? wp_get_attachment_image_url($meta['image_id'], 'large') : '';
$bg_image_url = $meta['bg_image_id'] ? wp_get_attachment_image_url($meta['bg_image_id'], 'large') : '';
$overview_url = add_query_arg(
	['page' => get_template() === 'clouds-and-spaceships' ? 'cns-settings-maps' : 'cns-maps'],
	admin_url('admin.php')
);
?>
<script>
window.cnsMapEditor = {
	imageUrl:   <?php echo wp_json_encode($image_url ?: ''); ?>,
	bgImageUrl: <?php echo wp_json_encode($bg_image_url ?: ''); ?>,
};
</script>

<div class="cns-map-editor wrap" data-map-id="<?php echo esc_attr($map_id); ?>">
<div class="cns-editor-layout">
<div class="cns-editor-main">

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
			<?php if (! $is_new && $map->post_status === 'publish') : ?>
				<a href="<?php echo esc_url(get_permalink($map->ID)); ?>" class="button" target="_blank" rel="noopener">
					<?php esc_html_e('View Map', 'cns-map-suite'); ?>
				</a>
			<?php endif; ?>
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
				<div class="cns-settings-layout">

					<div class="cns-settings-form">
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
								<div class="cns-range-wrap">
									<input type="range" id="cns-map-aspect-ratio" min="0.25" max="4" step="0.01" value="<?php echo esc_attr($meta['aspect_ratio']); ?>" />
									<output class="cns-range-value" for="cns-map-aspect-ratio"><?php echo esc_html(number_format($meta['aspect_ratio'], 2)); ?></output>
								</div>
								<p class="description"><?php esc_html_e('Width ÷ Height (1.77 = 16:9, 1.0 = square, 0.75 = portrait)', 'cns-map-suite'); ?></p>
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
								<label for="cns-map-image-x"><?php esc_html_e('Image X offset', 'cns-map-suite'); ?></label>
								<div class="cns-range-wrap">
									<input type="range" id="cns-map-image-x" min="0" max="1" step="0.01" value="<?php echo esc_attr($meta['image_x']); ?>" />
									<output class="cns-range-value" for="cns-map-image-x"><?php echo esc_html(number_format($meta['image_x'], 2)); ?></output>
								</div>
							</div>

							<div class="cns-form-row">
								<label for="cns-map-image-y"><?php esc_html_e('Image Y offset', 'cns-map-suite'); ?></label>
								<div class="cns-range-wrap">
									<input type="range" id="cns-map-image-y" min="0" max="1" step="0.01" value="<?php echo esc_attr($meta['image_y']); ?>" />
									<output class="cns-range-value" for="cns-map-image-y"><?php echo esc_html(number_format($meta['image_y'], 2)); ?></output>
								</div>
							</div>

							<div class="cns-form-row">
								<label for="cns-map-image-width"><?php esc_html_e('Image Width', 'cns-map-suite'); ?></label>
								<div class="cns-range-wrap">
									<input type="range" id="cns-map-image-width" min="0.1" max="2" step="0.01" value="<?php echo esc_attr($meta['image_width']); ?>" />
									<output class="cns-range-value" for="cns-map-image-width"><?php echo esc_html(number_format($meta['image_width'], 2)); ?></output>
								</div>
								<p class="description"><?php esc_html_e('1.0 = full canvas width. Height follows image ratio.', 'cns-map-suite'); ?></p>
							</div>

							<div class="cns-form-row cns-form-row--full">
								<label><?php esc_html_e('Background', 'cns-map-suite'); ?></label>
								<div class="cns-bg-type-toggle">
									<label>
										<input type="radio" name="cns-map-bg-type" value="color" <?php checked($meta['bg_type'], 'color'); ?> />
										<?php esc_html_e('Color', 'cns-map-suite'); ?>
									</label>
									<label>
										<input type="radio" name="cns-map-bg-type" value="image" <?php checked($meta['bg_type'], 'image'); ?> />
										<?php esc_html_e('Image', 'cns-map-suite'); ?>
									</label>
								</div>
								<div class="cns-bg-section cns-bg-section--color<?php echo $meta['bg_type'] === 'image' ? ' cns-hidden' : ''; ?>">
									<input type="text" id="cns-map-bg-color" class="cns-color-picker" value="<?php echo esc_attr($meta['bg_color']); ?>" />
								</div>
								<div class="cns-bg-section cns-bg-section--image<?php echo $meta['bg_type'] !== 'image' ? ' cns-hidden' : ''; ?>">
									<input type="hidden" id="cns-map-bg-image-id" value="<?php echo esc_attr($meta['bg_image_id']); ?>" />
									<div class="cns-image-picker">
										<div class="cns-image-picker__preview" id="cns-bg-image-preview">
											<?php if ($bg_image_url) : ?>
												<img src="<?php echo esc_url($bg_image_url); ?>" alt="" />
											<?php else : ?>
												<span><?php esc_html_e('No image selected', 'cns-map-suite'); ?></span>
											<?php endif; ?>
										</div>
										<button type="button" class="button" id="cns-select-bg-image">
											<?php esc_html_e('Select Image', 'cns-map-suite'); ?>
										</button>
										<button type="button" class="button <?php echo $bg_image_url ? '' : 'cns-hidden'; ?>" id="cns-remove-bg-image">
											<?php esc_html_e('Remove', 'cns-map-suite'); ?>
										</button>
									</div>
								</div>
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
					</div><!-- /.cns-settings-form -->

					<div class="cns-settings-canvas">
						<canvas id="cns-editor-canvas"></canvas>
						<p class="description"><?php esc_html_e('Live preview — updates as you edit settings.', 'cns-map-suite'); ?></p>
					</div>

				</div><!-- /.cns-settings-layout -->
			</div>

			<!-- Objects -->
			<div class="cns-tab-panel" data-panel="objects" role="tabpanel">
				<div class="cns-objects-layout">
					<div class="cns-objects-toolbar">
						<button type="button" class="button button-primary" id="cns-add-object">
							<?php esc_html_e('Add Object', 'cns-map-suite'); ?>
						</button>
						<p class="description"><?php esc_html_e('Or click directly on the canvas to place an object at that position.', 'cns-map-suite'); ?></p>
					</div>
					<div class="cns-objects-canvas-wrap">
						<canvas id="cns-objects-canvas"></canvas>
					</div>
					<div id="cns-objects-list"></div>
				</div>
			</div>

			<!-- Areas -->
			<div class="cns-tab-panel" data-panel="areas" role="tabpanel">
				<div class="cns-objects-layout">
					<div class="cns-objects-toolbar">
						<button type="button" class="button button-primary" id="cns-add-area">
							<?php esc_html_e('Add Area', 'cns-map-suite'); ?>
						</button>
						<p class="description"><?php esc_html_e('Click a node to reposition it. Click empty space on a selected area to add a node.', 'cns-map-suite'); ?></p>
					</div>
					<div class="cns-objects-canvas-wrap">
						<canvas id="cns-areas-canvas"></canvas>
					</div>
					<div id="cns-areas-list"></div>
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
					<canvas id="cns-preview-canvas"></canvas>
				</div>
				<?php if (! $is_new && $map->post_status === 'publish') : ?>
					<div class="cns-preview-actions">
						<a href="<?php echo esc_url(get_permalink($map->ID)); ?>" class="button" target="_blank" rel="noopener">
							<?php esc_html_e('View map page', 'cns-map-suite'); ?>
						</a>
					</div>
				<?php endif; ?>
			</div>

		</div><!-- /.cns-map-editor__content -->
	</div><!-- /.cns-map-editor__body -->

</div><!-- /.cns-editor-main -->

<aside class="cns-editor-context" id="cns-editor-context" aria-label="<?php esc_attr_e('Context panel', 'cns-map-suite'); ?>">
	<div class="cns-editor-context__empty" id="cns-context-empty">
		<p><?php esc_html_e('Select an object on the canvas to edit it here.', 'cns-map-suite'); ?></p>
	</div>
	<div id="cns-context-form" hidden>
		<div class="cns-editor-context__header">
			<span class="cns-editor-context__title" id="cns-context-title"></span>
			<button type="button" class="button button-small" id="cns-context-reposition"><?php esc_html_e('Reposition', 'cns-map-suite'); ?></button>
			<button type="button" class="cns-editor-context__close" id="cns-context-close" aria-label="<?php esc_attr_e('Close', 'cns-map-suite'); ?>">&times;</button>
		</div>
		<div class="cns-editor-context__body" id="cns-context-body">
			<!-- populated by JS -->
		</div>
		<div class="cns-editor-context__footer">
			<span class="cns-save-status" id="cns-context-save-status"></span>
			<button type="button" class="button button-small button-primary" id="cns-context-save"><?php esc_html_e('Save', 'cns-map-suite'); ?></button>
			<button type="button" class="button button-small" id="cns-context-delete"><?php esc_html_e('Delete', 'cns-map-suite'); ?></button>
		</div>
	</div>
</aside>

</div><!-- /.cns-editor-layout -->

	<!-- ── Object modal ──────────────────────────────────────────────────────── -->
	<div id="cns-object-modal" class="cns-modal" hidden role="dialog" aria-modal="true" aria-labelledby="cns-object-modal-title">
		<div class="cns-modal__backdrop"></div>
		<div class="cns-modal__dialog">

			<div class="cns-modal__header">
				<h2 class="cns-modal__title" id="cns-object-modal-title"><?php esc_html_e('Add Object', 'cns-map-suite'); ?></h2>
				<button type="button" class="cns-modal__close" aria-label="<?php esc_attr_e('Close', 'cns-map-suite'); ?>">&times;</button>
			</div>

			<div class="cns-modal__body" id="cns-object-modal-body">
				<!-- populated by JS via buildObjectFormHTML() -->
			</div><!-- /.cns-modal__body -->

			<div class="cns-modal__footer">
				<span class="cns-save-status" id="cns-object-save-status"></span>
				<button type="button" class="button button-primary" id="cns-object-save"><?php esc_html_e('Save Object', 'cns-map-suite'); ?></button>
				<button type="button" class="button" id="cns-object-cancel"><?php esc_html_e('Cancel', 'cns-map-suite'); ?></button>
			</div>

		</div><!-- /.cns-modal__dialog -->
	</div><!-- /#cns-object-modal -->

</div><!-- /.cns-map-editor -->
