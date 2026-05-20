<?php

defined('ABSPATH') || exit;
?>
<div class="cns-icon-library wrap">

	<div class="cns-maps-overview__header">
		<h1><?php esc_html_e('Icon Library', 'cns-map-suite'); ?></h1>
		<button type="button" class="button button-primary" id="cns-add-icon-btn">
			<?php esc_html_e('Add Icon', 'cns-map-suite'); ?>
		</button>
	</div>

	<p class="description">
		<?php esc_html_e('SVG icons added here are available as object icons across all maps. Only SVG files are accepted and are sanitized on upload to remove executable content.', 'cns-map-suite'); ?>
	</p>

	<div id="cns-icon-library-grid" class="cns-icon-library-grid">
		<p class="cns-icon-library-grid__empty"><?php esc_html_e('Loading icons…', 'cns-map-suite'); ?></p>
	</div>

</div>
