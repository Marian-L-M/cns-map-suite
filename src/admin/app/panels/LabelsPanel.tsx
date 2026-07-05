import { useState, useEffect, useRef } from '@wordpress/element';
import LabelsCanvas from '../canvases/LabelsCanvas';
import type { LabelGeometry } from '../canvases/LabelsCanvas';
import LabelsList   from '../lists/LabelsList';
import { apiFetch } from '../../utils';
import { settingsToDrawState } from '../../canvas';
import { defaultLabelFormData, collectLabelPayload } from '../forms/LabelForm';
import { isTypingTarget } from '../../labels';
import type { MapSettings, MapLabel, LabelSavePayload } from '../../../types';

// Internal clipboard for ⌘/Ctrl+C/V. Module scope so it survives tab
// switches within the editor page (not across page loads / other maps).
let labelClipboard: LabelSavePayload | null = null;

interface Props {
	mapId: number;
	settings: MapSettings;
	labels: MapLabel[];
	selectedLabelId: number | null;
	repositioningLabelId: number | null;
	onLabelsLoaded: ( labels: MapLabel[] ) => void;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onAdd: ( payload: LabelSavePayload ) => Promise<MapLabel>;
	onGeometryUpdate: ( id: number, geometry: Partial<LabelGeometry> ) => Promise<void>;
	onLocalUpdate: ( id: number, patch: Partial<MapLabel> ) => void;
	onDuplicate: ( id: number ) => Promise<void>;
	onRepositionComplete: () => void;
	onDelete: ( id: number ) => Promise<void>;
}

export default function LabelsPanel( {
	mapId, settings, labels, selectedLabelId,
	repositioningLabelId,
	onLabelsLoaded, onSelect, onDeselect,
	onAdd, onGeometryUpdate, onLocalUpdate, onDuplicate,
	onRepositionComplete,
	onDelete,
}: Props ) {
	const [ initialized, setInitialized ] = useState( false );

	// Keyboard handlers bind once; refs keep values/handlers current.
	const stateRef   = useRef( { labels, selectedLabelId } );
	stateRef.current = { labels, selectedLabelId };
	const propsRef   = useRef( { onSelect, onAdd, onGeometryUpdate, onLocalUpdate, onDuplicate, onDelete } );
	propsRef.current = { onSelect, onAdd, onGeometryUpdate, onLocalUpdate, onDuplicate, onDelete };

	useEffect( () => {
		if ( initialized || ! mapId ) return;
		apiFetch( 'GET', `/maps/${ mapId }/labels` )
			.then( ( r ) => r.json() as Promise<MapLabel[]> )
			.then( ( data ) => { if ( Array.isArray( data ) ) onLabelsLoaded( data ); } )
			.catch( () => {} )
			.finally( () => setInitialized( true ) );
	}, [ mapId ] );

	// ── Keyboard shortcuts (active while the Labels tab is mounted) ────────────

	useEffect( () => {
		// Arrow-key nudges update the canvas immediately and persist once the
		// keys go quiet, so holding an arrow doesn't fire a PATCH per pixel.
		let nudgeTimer: number | null = null;
		let pendingNudge: { id: number; x: number; y: number } | null = null;

		function flushNudge() {
			if ( nudgeTimer ) {
				window.clearTimeout( nudgeTimer );
				nudgeTimer = null;
			}
			const p = pendingNudge;
			pendingNudge = null;
			if ( p ) void propsRef.current.onGeometryUpdate( p.id, { x: p.x, y: p.y } );
		}

		function nudge( label: MapLabel, dx: number, dy: number ) {
			if ( pendingNudge && pendingNudge.id !== label.id ) flushNudge();
			const base = pendingNudge ?? { id: label.id, x: label.x, y: label.y };
			const x = Math.max( 0, base.x + dx );
			const y = Math.max( 0, base.y + dy );
			pendingNudge = { id: label.id, x, y };
			propsRef.current.onLocalUpdate( label.id, { x, y } );
			if ( nudgeTimer ) window.clearTimeout( nudgeTimer );
			nudgeTimer = window.setTimeout( flushNudge, 500 );
		}

		async function paste() {
			if ( ! labelClipboard ) return;
			// Cascade repeated pastes instead of stacking copies exactly on
			// top of each other.
			const payload = {
				...labelClipboard,
				x: labelClipboard.x + 24,
				y: labelClipboard.y + 24,
			};
			labelClipboard = payload;
			const created = await propsRef.current.onAdd( payload );
			propsRef.current.onSelect( created.id );
		}

		function onKeyDown( e: KeyboardEvent ) {
			if ( isTypingTarget( e ) ) return;
			const { labels: lbls, selectedLabelId: selId } = stateRef.current;
			const label = lbls.find( ( l ) => l.id === selId ) || null;
			const mod   = e.metaKey || e.ctrlKey;
			const key   = e.key.toLowerCase();

			if ( mod && key === 'c' ) {
				// Leave real text-selection copies alone.
				if ( label && ! window.getSelection()?.toString() ) {
					labelClipboard = collectLabelPayload( defaultLabelFormData( label, null, null ) );
				}
				return;
			}
			if ( mod && key === 'v' ) {
				void paste();
				return;
			}
			if ( mod && key === 'd' ) {
				if ( label ) {
					e.preventDefault(); // browser "bookmark page" shortcut
					void propsRef.current.onDuplicate( label.id );
				}
				return;
			}
			if ( ( e.key === 'Delete' || e.key === 'Backspace' ) && label ) {
				e.preventDefault();
				if ( confirm( 'Delete this label?' ) ) {
					void propsRef.current.onDelete( label.id );
				}
				return;
			}

			const arrows: Record<string, [ number, number ]> = {
				ArrowUp: [ 0, -1 ], ArrowDown: [ 0, 1 ],
				ArrowLeft: [ -1, 0 ], ArrowRight: [ 1, 0 ],
			};
			if ( arrows[ e.key ] && label ) {
				e.preventDefault(); // page scroll
				const step = e.shiftKey ? 10 : 1;
				nudge( label, arrows[ e.key ][ 0 ] * step, arrows[ e.key ][ 1 ] * step );
			}
		}

		document.addEventListener( 'keydown', onKeyDown );
		return () => {
			document.removeEventListener( 'keydown', onKeyDown );
			flushNudge(); // persist a pending nudge when leaving the tab
		};
	}, [] );

	async function handleAdd() {
		const cx = Math.round( settings.width / 2 );
		const cy = Math.round( settings.width / settings.aspectRatio / 2 );
		const payload = collectLabelPayload( {
			...defaultLabelFormData( null, cx, cy ),
			text: 'New Label',
		} );
		const created = await onAdd( payload );
		onSelect( created.id );
	}

	async function handleDelete( id: number ) {
		if ( ! confirm( 'Delete this label?' ) ) return;
		await onDelete( id );
	}

	const drawState = settingsToDrawState( settings );

	return (
		<div className="cns-tab-panel cns-tab-panel--active" data-panel="labels" role="tabpanel">
			<div className="cns-objects-layout">
				<div className="cns-objects-toolbar">
					<button type="button" className="button button-primary" onClick={ handleAdd }>
						Add Label
					</button>
					<p className="description">
						Click a label to pick it up — it follows the cursor; click or press Enter to drop (Esc cancels).
						In indicator mode the dot and the text box move independently.
						With a label selected: Enter picks it up, arrow keys nudge (Shift&nbsp;=&nbsp;10&nbsp;px),
						Ctrl/⌘+C&nbsp;&amp;&nbsp;V copy &amp; paste, Ctrl/⌘+D duplicates, Delete removes.
					</p>
				</div>

				<LabelsCanvas
					drawState={ drawState }
					labels={ labels }
					selectedLabelId={ selectedLabelId }
					repositioningLabelId={ repositioningLabelId }
					onSelect={ onSelect }
					onDeselect={ onDeselect }
					onGeometryUpdate={ onGeometryUpdate }
					onRepositionComplete={ onRepositionComplete }
				/>

				<LabelsList
					labels={ labels }
					onEdit={ ( label ) => onSelect( label.id ) }
					onDuplicate={ ( id ) => void onDuplicate( id ) }
					onDelete={ handleDelete }
				/>
			</div>
		</div>
	);
}
