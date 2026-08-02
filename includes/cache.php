<?php

defined('ABSPATH') || exit;

/**
 * Minimal render-data cache for the custom cns_map_* tables.
 *
 * Only raw table rows are cached (via transients, so a persistent object cache
 * is picked up automatically when one is installed). Everything WordPress can
 * already cache — posts, meta, attachment URLs — and all capability-dependent
 * filtering stays live per request; page/object caching remains the job of
 * dedicated caching plugins.
 *
 * Invalidation is a single global version bump baked into the cache key: any
 * write through the plugin's REST API or a map deletion starts a fresh
 * generation, and superseded entries simply expire via TTL. This avoids
 * per-key tracking and covers cross-map effects (hierarchy rows are cached
 * under both parent and child maps) for free.
 */

const CNS_MAP_SUITE_CACHE_TTL = 12 * HOUR_IN_SECONDS;

function cns_map_suite_cache_key(int $map_id): string {
	$ver = (int) get_option('cns_map_suite_cache_ver', 0);
	return "cns_map_rows_{$map_id}_v{$ver}";
}

/** Returns the cached row sets for a map, keyed by kind ('objects', 'areas', …). */
function cns_map_suite_cache_get(int $map_id): array {
	$rows = get_transient(cns_map_suite_cache_key($map_id));
	return is_array($rows) ? $rows : [];
}

function cns_map_suite_cache_set(int $map_id, array $rows): void {
	set_transient(cns_map_suite_cache_key($map_id), $rows, CNS_MAP_SUITE_CACHE_TTL);
}

function cns_map_suite_cache_flush(): void {
	update_option('cns_map_suite_cache_ver', (int) get_option('cns_map_suite_cache_ver', 0) + 1, true);
}

// Every table write goes through the plugin's REST namespace, so one route
// check replaces a flush call in each mutation callback.
add_filter('rest_request_after_callbacks', function ($response, $handler, $request) {
	if (
		! in_array($request->get_method(), ['GET', 'HEAD'], true) &&
		str_starts_with($request->get_route(), '/cns-map-suite/v1/') &&
		! is_wp_error($response)
	) {
		cns_map_suite_cache_flush();
	}
	return $response;
}, 10, 3);

// Map deletion removes table rows without going through the REST API.
add_action('deleted_post', function (int $post_id, WP_Post $post): void {
	if ($post->post_type === 'maps') {
		cns_map_suite_cache_flush();
	}
}, 10, 2);
