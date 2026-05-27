import type { LibraryIcon } from '../types';
import { apiFetch } from './utils';

export let iconLibraryCache: LibraryIcon[] | null = null;

export async function loadIconLibraryIntoCache(): Promise<void> {
	try {
		const res  = await apiFetch( 'GET', '/icons' );
		const data = await res.json() as LibraryIcon[];
		if ( res.ok ) iconLibraryCache = data;
	} catch { iconLibraryCache = []; }
}
