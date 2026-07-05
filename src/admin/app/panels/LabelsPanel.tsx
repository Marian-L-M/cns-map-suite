import { useState, useEffect } from '@wordpress/element';
import LabelsCanvas from '../canvases/LabelsCanvas';
import LabelsList   from '../lists/LabelsList';
import { apiFetch } from '../../utils';
import { settingsToDrawState } from '../../canvas';
import { defaultLabelFormData, collectLabelPayload } from '../forms/LabelForm';
import type { MapSettings, MapLabel, LabelSavePayload } from '../../../types';

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
	onPositionUpdate: ( id: number, x: number, y: number ) => Promise<void>;
	onRepositionComplete: () => void;
	onDelete: ( id: number ) => Promise<void>;
}

export default function LabelsPanel( {
	mapId, settings, labels, selectedLabelId,
	repositioningLabelId,
	onLabelsLoaded, onSelect, onDeselect,
	onAdd, onPositionUpdate,
	onRepositionComplete,
	onDelete,
}: Props ) {
	const [ initialized, setInitialized ] = useState( false );

	useEffect( () => {
		if ( initialized || ! mapId ) return;
		apiFetch( 'GET', `/maps/${ mapId }/labels` )
			.then( ( r ) => r.json() as Promise<MapLabel[]> )
			.then( ( data ) => { if ( Array.isArray( data ) ) onLabelsLoaded( data ); } )
			.catch( () => {} )
			.finally( () => setInitialized( true ) );
	}, [ mapId ] );

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
						Select a label, then click the canvas to move its anchor point. Edit text and colors in the side panel.
					</p>
				</div>

				<LabelsCanvas
					drawState={ drawState }
					labels={ labels }
					selectedLabelId={ selectedLabelId }
					repositioningLabelId={ repositioningLabelId }
					onSelect={ onSelect }
					onDeselect={ onDeselect }
					onPositionUpdate={ onPositionUpdate }
					onRepositionComplete={ onRepositionComplete }
				/>

				<LabelsList
					labels={ labels }
					onEdit={ ( label ) => onSelect( label.id ) }
					onDelete={ handleDelete }
				/>
			</div>
		</div>
	);
}
