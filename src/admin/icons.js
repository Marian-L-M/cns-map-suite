import { apiFetch } from './utils.js';

export let iconLibraryCache = null;

export async function loadIconLibraryIntoCache() {
	try {
		const res  = await apiFetch( 'GET', '/icons' );
		const data = await res.json();
		if ( res.ok ) iconLibraryCache = data;
	} catch { iconLibraryCache = []; }
}
