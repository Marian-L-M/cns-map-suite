<?php

defined('ABSPATH') || exit;

/**
 * Grants the manage_maps primitive capability to the administrator role.
 * Called on plugin activation so the capability is available immediately.
 * Other roles can be granted it via a role management plugin (e.g. Members).
 */
function cns_map_suite_add_capabilities(): void {
	$role = get_role('administrator');
	if ($role) {
		$role->add_cap('manage_maps');
	}
}

/**
 * Removes manage_maps from all roles.
 * Called only from uninstall.php — not on deactivation, because deactivation
 * is reversible and stripping capabilities would break re-activation.
 */
function cns_map_suite_remove_capabilities(): void {
	foreach (wp_roles()->roles as $role_name => $unused) {
		$role = get_role($role_name);
		if ($role && $role->has_cap('manage_maps')) {
			$role->remove_cap('manage_maps');
		}
	}
}
