import { useState, useEffect } from '@wordpress/element';
import HierarchyCanvas      from '../canvases/HierarchyCanvas';
import HierarchyRegionList  from '../lists/HierarchyRegionList';
import { apiFetch }         from '../../utils';
import { settingsToDrawState } from '../../canvas';
import { getDefaultNodes }  from '../../areas';
import type { MapSettings, HierarchyRegion, Node, ParentMapRef } from '../../../types';

interface Props {
	mapId: number;
	settings: MapSettings;
	regions: HierarchyRegion[];
	selectedRegionId: number | null;
	parentMaps: ParentMapRef[];
	onRegionsLoaded: ( regions: HierarchyRegion[] ) => void;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onNodesUpdate: ( regionId: number, nodes: Node[] ) => void;
	onDelete: ( id: number ) => Promise<void>;
}

export default function HierarchyPanel( {
	mapId, settings, regions, selectedRegionId, parentMaps,
	onRegionsLoaded, onSelect, onDeselect, onNodesUpdate, onDelete,
}: Props ) {
	const [ initialized, setInitialized ] = useState( false );

	useEffect( () => {
		if ( initialized || ! mapId ) return;
		apiFetch( 'GET', `/maps/${ mapId }/hierarchy` )
			.then( ( r ) => r.json() as Promise<HierarchyRegion[]> )
			.then( ( data ) => { if ( Array.isArray( data ) ) onRegionsLoaded( data ); } )
			.catch( () => {} )
			.finally( () => setInitialized( true ) );
	}, [ mapId ] );

	async function handleAddRegion() {
		if ( ! mapId ) return;
		// Create a placeholder region with no child yet; user assigns it in the context panel.
		// We use child_map_id=0 as a sentinel and immediately select it.
		// The REST API requires a valid child_map_id, so we create with the map's own ID as
		// a placeholder — but the API rejects self-links. Instead, just insert an empty polygon
		// that the user fills in via the context form.
		//
		// Strategy: optimistically add a local-only "draft" region, select it for editing.
		// It won't be persisted until the user saves from the context panel (which requires
		// a valid child_map_id). We mark it with id=-1 as an unsaved sentinel.
		const draft: HierarchyRegion = {
			id:                  -1,
			parent_map_id:       mapId,
			child_map_id:        0,
			nodes:               getDefaultNodes( 'POLYGON' ),
			canvas_styles:       { fill: '#e8a020', fillOpacity: 0.25, stroke: '#e8a020', strokeWidth: 2 },
			child_map_title:     '',
			child_map_excerpt:   '',
			child_map_status:    '',
			child_map_thumbnail: '',
			child_map_url:       '',
			created_at:          '',
			updated_at:          '',
		};
		onRegionsLoaded( [ ...regions, draft ] );
		onSelect( -1 );
	}

	async function handleDelete( id: number ) {
		if ( id === -1 ) {
			// Unsaved draft — just remove locally.
			onRegionsLoaded( regions.filter( ( r ) => r.id !== -1 ) );
			onDeselect();
			return;
		}
		if ( ! confirm( 'Delete this hierarchy region?' ) ) return;
		await onDelete( id );
	}

	const drawState = settingsToDrawState( settings );

	return (
		<div className="cns-tab-panel cns-tab-panel--active" data-panel="hierarchy" role="tabpanel">
			<div className="cns-objects-layout">

				{ /* ── Parent maps breadcrumb scaffold ── */ }
				{ parentMaps.length > 0 && (
					<div className="cns-hierarchy-parents">
						<span className="cns-hierarchy-parents__label">Parent maps:</span>
						{ parentMaps.map( ( p ) => (
							<a key={ p.map_id } href={ p.url } className="cns-hierarchy-parents__link">
								{ p.thumbnail && <img src={ p.thumbnail } alt="" /> }
								{ p.title }
							</a>
						) ) }
					</div>
				) }

				<div className="cns-objects-toolbar">
					<button type="button" className="button button-primary" onClick={ handleAddRegion }>
						Add Region
					</button>
					<p className="description">
						Draw a polygon region that links to a child map. Click a node to reposition it; click empty canvas on a selected region to add a node.
					</p>
				</div>

				<HierarchyCanvas
					drawState={ drawState }
					regions={ regions }
					selectedRegionId={ selectedRegionId }
					onSelect={ onSelect }
					onDeselect={ onDeselect }
					onNodesChange={ onNodesUpdate }
				/>

				<HierarchyRegionList
					regions={ regions.filter( ( r ) => r.id !== -1 ) }
					onSelect={ onSelect }
					onDelete={ handleDelete }
				/>
			</div>
		</div>
	);
}
