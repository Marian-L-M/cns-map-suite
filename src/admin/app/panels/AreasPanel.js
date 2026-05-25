import { useState, useEffect } from '@wordpress/element';
import AreasCanvas  from '../canvases/AreasCanvas.js';
import AreasList    from '../lists/AreasList.js';
import { apiFetch } from '../../utils.js';
import { settingsToDrawState } from '../../canvas.js';
import { getDefaultNodes } from '../../areas.js';

export default function AreasPanel( {
	mapId, settings, areas, selectedAreaId,
	onAreasLoaded, onSelect, onDeselect, onNodesUpdate, onDelete,
} ) {
	const [ initialized, setInitialized ] = useState( false );

	useEffect( () => {
		if ( initialized || ! mapId ) return;
		apiFetch( 'GET', `/maps/${ mapId }/areas` )
			.then( ( r ) => r.json() )
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
			const data = await res.json();
			if ( ! res.ok ) throw new Error( data.message || 'Failed to create area.' );
			onAreasLoaded( [ ...areas, data ] );
			onSelect( data.id );
		} catch ( err ) { alert( err.message ); }
	}

	async function handleDelete( id ) {
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
