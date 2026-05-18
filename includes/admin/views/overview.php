<?php

defined('ABSPATH') || exit;

// Handle individual map delete.
if (
	isset($_GET['action'], $_GET['map_id']) &&
	$_GET['action'] === 'delete' &&
	check_admin_referer('cns_delete_map_' . (int) $_GET['map_id'])
) {
	wp_delete_post((int) $_GET['map_id'], true);
	wp_safe_redirect(add_query_arg(
		['page' => sanitize_key($_GET['page'] ?? 'cns-maps'), 'deleted' => '1'],
		admin_url('admin.php')
	));
	exit;
}

// Handle plugin settings save (Danger Zone checkbox).
if (
	isset($_POST['cns_map_action']) &&
	$_POST['cns_map_action'] === 'save_settings' &&
	check_admin_referer('cns_map_save_settings')
) {
	update_option('cns_map_suite_delete_on_uninstall', isset($_POST['delete_on_uninstall']) ? 1 : 0, false);
	wp_safe_redirect(add_query_arg(
		['page' => sanitize_key($_GET['page'] ?? 'cns-maps'), 'settings-saved' => '1'],
		admin_url('admin.php')
	));
	exit;
}

$maps = get_posts([
	'post_type'      => 'maps',
	'posts_per_page' => -1,
	'post_status'    => ['publish', 'draft'],
	'orderby'        => 'date',
	'order'          => 'DESC',
]);

$current_page          = sanitize_key($_GET['page'] ?? 'cns-maps');
$editor_url            = add_query_arg(['page' => 'cns-map-editor'], admin_url('admin.php'));
$delete_on_uninstall   = (bool) get_option('cns_map_suite_delete_on_uninstall', false);
?>
<div class="cns-maps-overview wrap">

	<?php if (isset($_GET['deleted'])) : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e('Map deleted.', 'cns-map-suite'); ?></p>
		</div>
	<?php endif; ?>

	<?php if (isset($_GET['settings-saved'])) : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e('Settings saved.', 'cns-map-suite'); ?></p>
		</div>
	<?php endif; ?>

	<div class="cns-maps-overview__header">
		<h1><?php esc_html_e('Maps', 'cns-map-suite'); ?></h1>
		<a href="<?php echo esc_url($editor_url); ?>" class="page-title-action">
			<?php esc_html_e('+ New Map', 'cns-map-suite'); ?>
		</a>
	</div>

	<?php if (empty($maps)) : ?>
		<div class="cns-maps-overview__empty">
			<p><?php esc_html_e('No maps yet.', 'cns-map-suite'); ?></p>
			<a href="<?php echo esc_url($editor_url); ?>" class="button button-primary">
				<?php esc_html_e('Create your first map', 'cns-map-suite'); ?>
			</a>
		</div>
	<?php else : ?>
		<table class="wp-list-table widefat fixed striped cns-maps-table">
			<thead>
				<tr>
					<th class="col-thumb"></th>
					<th><?php esc_html_e('Title', 'cns-map-suite'); ?></th>
					<th><?php esc_html_e('Mode', 'cns-map-suite'); ?></th>
					<th><?php esc_html_e('Status', 'cns-map-suite'); ?></th>
					<th><?php esc_html_e('Date', 'cns-map-suite'); ?></th>
					<th><?php esc_html_e('Actions', 'cns-map-suite'); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ($maps as $map) :
					$is_master   = (bool) get_post_meta($map->ID, '_cns_map_is_master', true);
					$is_featured = (bool) get_post_meta($map->ID, '_cns_map_featured', true);
					$thumb_id    = (int) get_post_meta($map->ID, '_cns_map_image_id', true);
					$thumb_url   = $thumb_id ? wp_get_attachment_image_url($thumb_id, 'thumbnail') : '';

					$edit_url   = esc_url(add_query_arg(
						['page' => 'cns-map-editor', 'map_id' => $map->ID],
						admin_url('admin.php')
					));
					$delete_url = esc_url(wp_nonce_url(
						add_query_arg(
							['page' => $current_page, 'action' => 'delete', 'map_id' => $map->ID],
							admin_url('admin.php')
						),
						'cns_delete_map_' . $map->ID
					));
				?>
					<tr>
						<td class="col-thumb">
							<?php if ($thumb_url) : ?>
								<img src="<?php echo esc_url($thumb_url); ?>" alt="" width="40" height="40" />
							<?php else : ?>
								<div class="cns-thumb-placeholder"></div>
							<?php endif; ?>
						</td>
						<td>
							<strong>
								<a href="<?php echo $edit_url; ?>">
									<?php echo esc_html($map->post_title ?: __('(no title)', 'cns-map-suite')); ?>
								</a>
							</strong>
							<?php if ($is_featured) : ?>
								<span class="cns-badge cns-badge--featured"><?php esc_html_e('Featured', 'cns-map-suite'); ?></span>
							<?php endif; ?>
						</td>
						<td>
							<span class="cns-badge <?php echo $is_master ? 'cns-badge--master' : 'cns-badge--map'; ?>">
								<?php echo $is_master ? esc_html__('MasterMap', 'cns-map-suite') : esc_html__('Map', 'cns-map-suite'); ?>
							</span>
						</td>
						<td><?php echo esc_html(ucfirst($map->post_status)); ?></td>
						<td><?php echo esc_html(get_the_date('Y-m-d', $map)); ?></td>
						<td class="cns-maps-actions">
							<a href="<?php echo $edit_url; ?>"><?php esc_html_e('Edit', 'cns-map-suite'); ?></a>
							&nbsp;&middot;&nbsp;
							<a
								href="<?php echo $delete_url; ?>"
								class="cns-delete-link"
								onclick="return confirm('<?php esc_attr_e('Permanently delete this map?', 'cns-map-suite'); ?>')"
							><?php esc_html_e('Delete', 'cns-map-suite'); ?></a>
						</td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	<?php endif; ?>

	<!-- ── Danger Zone ──────────────────────────────────────────────────────── -->
	<div class="cns-danger-zone">
		<h2><?php esc_html_e('Plugin Settings', 'cns-map-suite'); ?></h2>
		<form method="post">
			<?php wp_nonce_field('cns_map_save_settings'); ?>
			<input type="hidden" name="cns_map_action" value="save_settings" />

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e('Uninstall behaviour', 'cns-map-suite'); ?></th>
					<td>
						<label>
							<input
								type="checkbox"
								name="delete_on_uninstall"
								value="1"
								<?php checked($delete_on_uninstall); ?>
							/>
							<?php esc_html_e('Delete all map posts and their data when this plugin is uninstalled', 'cns-map-suite'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('When unchecked (default), maps are kept after uninstall. Custom DB tables are always removed.', 'cns-map-suite'); ?>
						</p>
					</td>
				</tr>
			</table>

			<?php submit_button(__('Save Settings', 'cns-map-suite'), 'secondary'); ?>
		</form>
	</div>

</div>
