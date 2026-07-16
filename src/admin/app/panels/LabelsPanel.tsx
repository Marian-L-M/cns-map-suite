import { useEffect, useRef } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import LabelsCanvas from '../canvases/LabelsCanvas';
import type { LabelGeometry } from '../canvases/LabelsCanvas';
import LabelsList   from '../lists/LabelsList';
import { settingsToDrawState } from '../../canvas';
import { defaultLabelFormData, collectLabelPayload } from '../forms/LabelForm';
import { useCanvasKeyboard, createDebouncedNudge } from '../useCanvasKeyboard';
import { useMapResource } from '../useMapResource';
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
	useMapResource<MapLabel>( mapId, 'labels', onLabelsLoaded );

	// The nudge factory is created once; these refs feed it live values.
	const stateRef   = useRef( { labels, selectedLabelId } );
	stateRef.current = { labels, selectedLabelId };
	const propsRef   = useRef( { onGeometryUpdate, onLocalUpdate } );
	propsRef.current = { onGeometryUpdate, onLocalUpdate };

	// ── Keyboard shortcuts (active while the Labels tab is mounted) ────────────

	const selectedLabel = labels.find( ( l ) => l.id === selectedLabelId ) || null;

	const nudger = useRef( createDebouncedNudge(
		() => {
			const s = stateRef.current;
			return s.labels.find( ( l ) => l.id === s.selectedLabelId ) || null;
		},
		( id, x, y ) => propsRef.current.onLocalUpdate( id, { x, y } ),
		( id, x, y ) => void propsRef.current.onGeometryUpdate( id, { x, y } ),
	) );
	useEffect( () => () => nudger.current.flush(), [] ); // persist pending nudge on tab leave

	async function pasteLabel() {
		if ( ! labelClipboard ) return;
		// Cascade repeated pastes instead of stacking copies exactly on top
		// of each other.
		const payload = {
			...labelClipboard,
			x: labelClipboard.x + 24,
			y: labelClipboard.y + 24,
		};
		labelClipboard = payload;
		const created = await onAdd( payload );
		onSelect( created.id );
	}

	useCanvasKeyboard( {
		copy: () => {
			if ( ! selectedLabel ) return false;
			labelClipboard = collectLabelPayload( defaultLabelFormData( selectedLabel, null, null ) );
			return true;
		},
		paste: () => {
			if ( ! labelClipboard ) return false;
			void pasteLabel();
			return true;
		},
		duplicate: () => {
			if ( ! selectedLabel ) return false;
			void onDuplicate( selectedLabel.id );
			return true;
		},
		remove: () => {
			if ( ! selectedLabel ) return false;
			if ( confirm( __( 'Delete this label?', 'cns-map-suite' ) ) ) void onDelete( selectedLabel.id );
			return true;
		},
		nudge: ( dx, dy ) => nudger.current.nudge( dx, dy ),
	} );

	async function handleAdd() {
		const cx = Math.round( settings.width / 2 );
		const cy = Math.round( settings.width / settings.aspectRatio / 2 );
		const payload = collectLabelPayload( {
			...defaultLabelFormData( null, cx, cy ),
			text: __( 'New Label', 'cns-map-suite' ),
		} );
		const created = await onAdd( payload );
		onSelect( created.id );
	}

	async function handleDelete( id: number ) {
		if ( ! confirm( __( 'Delete this label?', 'cns-map-suite' ) ) ) return;
		await onDelete( id );
	}

	const drawState = settingsToDrawState( settings );

	return (
		<div className="cns-tab-panel cns-tab-panel--active" data-panel="labels" role="tabpanel">
			<div className="cns-objects-layout">
				<div className="cns-objects-toolbar">
					<Button variant="primary" icon={ plus } onClick={ handleAdd }>
						{ __( 'Add Label', 'cns-map-suite' ) }
					</Button>
					<p className="description">
						{ __(
							'Click a label to pick it up — it follows the cursor; click or press Enter to drop (Esc cancels). In indicator mode the dot and the text box move independently. With a label selected: Enter picks it up, arrow keys nudge (Shift = 10 px), Ctrl/⌘+C & V copy & paste, Ctrl/⌘+D duplicates, Delete removes.',
							'cns-map-suite'
						) }
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
