import { useState, useEffect } from '@wordpress/element';
import AreasCanvas  from '../canvases/AreasCanvas';
import AreasList    from '../lists/AreasList';
import { apiFetch } from '../../utils';
import { settingsToDrawState } from '../../canvas';
import { getDefaultNodes } from '../../areas';
import type { MapSettings, MapArea, Node } from '../../../types';

interface Props {
	mapId: number;
	settings: MapSettings;
	areas: MapArea[];
	selectedAreaId: number | null;
	onAreasLoaded: ( areas: MapArea[] ) => void;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onNodesUpdate: ( areaId: number, nodes: Node[] ) => void;
	onDelete: ( id: number ) => Promise<void>;
}

export default function AreasPanel( {
	mapId, settings, areas, selectedAreaId,
	onAreasLoaded, onSelect, onDeselect, onNodesUpdate, onDelete,
}: Props ) {
	const [ initialized, setInitialized ] = useState( false );

	useEffect( () => {
		if ( initialized || ! mapId ) return;
		apiFetch( 'GET', `/maps/${ mapId }/areas` )
			.then( ( r ) => r.json() as Promise<MapArea[]> )
			.then( ( data ) => { if ( Array.isArray( data ) ) onAreasLoaded( data ); } )
			.catch( () => {} )
			.finally( () => setInitialized( true ) );
	}, [ mapId ] );

	async function handleAddArea() {
		if ( ! mapId ) return;
		const defaultNodes = getDefaultNodes( 'POLYGON' );
		try {
			const res  = await apiFetch( 'POST', `/maps/${ mapId }/areas`, {
				title:               'New Area',
				nodes:               JSON.stringify( defaultNodes ),
				style_fill:          '#2271b1',
				style_fill_opacity:  0.3,
				style_stroke:        '#2271b1',
				style_stroke_width:  2,
			} );
			const data = await res.json() as MapArea;
			if ( ! res.ok ) throw new Error( ( data as unknown as { message?: string } ).message || 'Failed to create area.' );
			onAreasLoaded( [ ...areas, data ] );
			onSelect( data.id );
		} catch ( err ) { alert( ( err as Error ).message ); }
	}

	async function handleDelete( id: number ) {
		if ( ! confirm( 'Delete this area?' ) ) return;
		await onDelete( id );
	}

	const drawState = settingsToDrawState( settings );

	return (
		<div className="cns-tab-panel cns-tab-panel--active" data-panel="areas" role="tabpanel">
			<div className="cns-objects-layout">
				<div className="cns-objects-toolbar">
					<button type="button" className="button button-primary" onClick={ handleAddArea }>
						Add Area
					</button>
					<p className="description">Click a node to reposition it. Click empty space on a selected area to add a node.</p>
				</div>

				<AreasCanvas
					drawState={ drawState }
					areas={ areas }
					selectedAreaId={ selectedAreaId }
					onSelect={ onSelect }
					onDeselect={ onDeselect }
					onNodesChange={ onNodesUpdate }
				/>

				<AreasList
					areas={ areas }
					onSelect={ onSelect }
					onDelete={ handleDelete }
				/>
			</div>
		</div>
	);
}
