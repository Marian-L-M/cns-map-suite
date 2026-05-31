import { useState } from '@wordpress/element';
import EditorHeader from './EditorHeader';
import TabBar from './TabBar';
import ContextPanel from './ContextPanel';
import SettingsPanel from './panels/SettingsPanel';
import ObjectsPanel from './panels/ObjectsPanel';
import AreasPanel from './panels/AreasPanel';
import HierarchyPanel from './panels/HierarchyPanel';
import PreviewPanel from './panels/PreviewPanel';
import { apiFetch } from '../utils';
import { normalizeNodesForShapeType } from '../areas';
import type {
	MapSettings,
	MapObject,
	MapArea,
	HierarchyRegion,
	HierarchyFormData,
	Node,
	ObjectSavePayload,
	AreaFormData,
	PostStatus,
	ShapeType,
	Tab,
	SaveStatus,
	ParentMapRef,
} from '../../types';

function buildInitialSettings(): MapSettings {
	const d = window.cnsMapEditor || ( {} as typeof window.cnsMapEditor );
	return {
		status: d.status ?? 'draft',
		title: d.title ?? '',
		width: d.width ?? 1000,
		aspectRatio: d.aspectRatio ?? 1.0,
		time: d.time ?? 0,
		imageId: d.imageId ?? 0,
		imageUrl: d.imageUrl ?? '',
		imageX: d.imageX ?? 0,
		imageY: d.imageY ?? 0,
		imageW: d.imageWidth ?? 1.0,
		isMaster: d.isMaster ?? false,
		featured: d.featured ?? false,
		bgType: d.bgType ?? 'color',
		bgColor: d.bgColor ?? '#1a1a2e',
		bgImageId: d.bgImageId ?? 0,
		bgImageUrl: d.bgImageUrl ?? '',
	};
}

export default function MapEditorApp() {
	const d = window.cnsMapEditor || ( {} as typeof window.cnsMapEditor );
	const mapId      = d.mapId      || 0;
	const isNew      = d.isNew      || false;
	const overviewUrl = d.overviewUrl || '#';
	const initialParentMaps: ParentMapRef[] = d.parentMaps || [];

	const [ settings, setSettings ] =
		useState< MapSettings >( buildInitialSettings );
	const [ viewUrl, setViewUrl ] = useState< string >( d.viewUrl || '' );
	const [ activeTab, setActiveTab ] = useState< Tab >( 'settings' );
	const [ objectsList, setObjectsList ] = useState< MapObject[] >( [] );
	const [ areasList, setAreasList ] = useState< MapArea[] >( [] );
	const [ selectedObjectId,   setSelectedObjectId   ] = useState< number | null >( null );
	const [ selectedAreaId,     setSelectedAreaId     ] = useState< number | null >( null );
	const [ selectedRegionId,   setSelectedRegionId   ] = useState< number | null >( null );
	const [ regionsList,        setRegionsList        ] = useState< HierarchyRegion[] >( [] );
	const [ repositioningObjId, setRepositioningObjId ] = useState< number | null >( null );
	const [ saveStatus, setSaveStatus ] = useState< SaveStatus >( { text: '', type: '' } );

	const selectedObject = objectsList.find( ( o ) => o.id === selectedObjectId ) || null;
	const selectedArea   = areasList.find( ( a ) => a.id === selectedAreaId )   || null;
	const selectedRegion = regionsList.find( ( r ) => r.id === selectedRegionId ) || null;

	// ── Tab switching ─────────────────────────────────────────────────────────

	function handleTabChange( tab: Tab ) {
		if ( tab !== 'objects' ) {
			setSelectedObjectId( null );
			setRepositioningObjId( null );
		}
		if ( tab !== 'areas' )     setSelectedAreaId( null );
		if ( tab !== 'hierarchy' ) setSelectedRegionId( null );
		setActiveTab( tab );
	}

	// ── Map settings save ─────────────────────────────────────────────────────

	async function handleSave() {
		setSaveStatus( { text: 'Saving…', type: '' } );
		const payload = {
			map_id: mapId,
			title: settings.title,
			status: settings.status,
			width: settings.width,
			aspect_ratio: settings.aspectRatio,
			time: settings.time,
			image_id: settings.imageId,
			image_x: settings.imageX,
			image_y: settings.imageY,
			image_width: settings.imageW,
			is_master: settings.isMaster,
			featured: settings.featured,
			bg_type: settings.bgType,
			bg_color: settings.bgColor,
			bg_image_id: settings.bgImageId,
		};
		try {
			const res = await apiFetch( 'POST', '/maps', payload );
			const data = ( await res.json() ) as {
				created?: boolean;
				edit_url?: string;
				view_url?: string;
				message?: string;
			};
			if ( ! res.ok ) throw new Error( data.message || 'Save failed.' );
			if ( data.created && data.edit_url ) {
				window.location.href = data.edit_url;
			} else {
				if ( data.view_url !== undefined ) {
					setViewUrl( data.view_url );
				}
				setSaveStatus( { text: 'Saved.', type: 'ok' } );
				setTimeout(
					() => setSaveStatus( { text: '', type: '' } ),
					2000
				);
			}
		} catch ( err ) {
			setSaveStatus( { text: ( err as Error ).message, type: 'error' } );
		}
	}

	// ── Object operations ─────────────────────────────────────────────────────

	async function handleObjectSave(
		formPayload: ObjectSavePayload
	): Promise< MapObject | undefined > {
		if ( ! selectedObjectId ) return;
		const res = await apiFetch(
			'POST',
			`/objects/${ selectedObjectId }`,
			formPayload
		);
		const data = ( await res.json() ) as MapObject;
		if ( ! res.ok )
			throw new Error(
				( data as unknown as { message?: string } ).message ||
					'Save failed.'
			);
		setObjectsList( ( prev ) =>
			prev.map( ( o ) => ( o.id === selectedObjectId ? data : o ) )
		);
		return data;
	}

	async function handleObjectPositionUpdate(
		id: number,
		x: number,
		y: number
	): Promise< void > {
		const res = await apiFetch( 'PATCH', `/objects/${ id }/position`, {
			x,
			y,
		} );
		const data = ( await res.json() ) as MapObject;
		if ( res.ok ) {
			setObjectsList( ( prev ) =>
				prev.map( ( o ) => ( o.id === id ? data : o ) )
			);
		}
	}

	// ── Area operations ───────────────────────────────────────────────────────

	async function handleAreaSave(
		formData: AreaFormData
	): Promise< MapArea | undefined > {
		if ( ! selectedAreaId ) return;
		const area = areasList.find( ( a ) => a.id === selectedAreaId );
		if ( ! area ) return;
		const payload = { ...formData, nodes: JSON.stringify( area.nodes ) };
		const res = await apiFetch(
			'POST',
			`/areas/${ selectedAreaId }`,
			payload
		);
		const data = ( await res.json() ) as MapArea;
		if ( ! res.ok )
			throw new Error(
				( data as unknown as { message?: string } ).message ||
					'Save failed.'
			);
		setAreasList( ( prev ) =>
			prev.map( ( a ) => ( a.id === selectedAreaId ? data : a ) )
		);
		return data;
	}

	function handleAreaNodesUpdate( areaId: number, nodes: Node[] ) {
		setAreasList( ( prev ) =>
			prev.map( ( a ) => ( a.id === areaId ? { ...a, nodes } : a ) )
		);
	}

	function handleAreaShapeTypeChange( areaId: number, shapeType: ShapeType ) {
		setAreasList( ( prev ) =>
			prev.map( ( a ) => {
				if ( a.id !== areaId ) return a;
				return {
					...a,
					shape_type: shapeType,
					nodes: normalizeNodesForShapeType(
						a.nodes || [],
						shapeType
					),
				};
			} )
		);
	}

	// ── Object add / delete ───────────────────────────────────────────────────

	async function handleObjectAdd(
		payload: ObjectSavePayload
	): Promise< MapObject > {
		const res = await apiFetch(
			'POST',
			`/maps/${ mapId }/objects`,
			payload
		);
		const data = ( await res.json() ) as MapObject;
		if ( ! res.ok )
			throw new Error(
				( data as unknown as { message?: string } ).message || 'Failed.'
			);
		setObjectsList( ( prev ) => [ ...prev, data ] );
		return data;
	}

	async function handleObjectDeleteById( id: number ) {
		const res = await apiFetch( 'DELETE', `/objects/${ id }` );
		if ( ! res.ok ) throw new Error( 'Delete failed.' );
		setObjectsList( ( prev ) => prev.filter( ( o ) => o.id !== id ) );
		if ( selectedObjectId === id ) setSelectedObjectId( null );
	}

	async function handleAreaDeleteById( id: number ) {
		const res = await apiFetch( 'DELETE', `/areas/${ id }` );
		if ( ! res.ok ) throw new Error( 'Delete failed.' );
		setAreasList( ( prev ) => prev.filter( ( a ) => a.id !== id ) );
		if ( selectedAreaId === id ) setSelectedAreaId( null );
	}

	// ── Hierarchy region operations ───────────────────────────────────────────

	function handleRegionNodesUpdate( regionId: number, nodes: Node[] ) {
		setRegionsList( ( prev ) =>
			prev.map( ( r ) => ( r.id === regionId ? { ...r, nodes } : r ) )
		);
	}

	async function handleRegionSave( formData: HierarchyFormData ): Promise< HierarchyRegion | undefined > {
		if ( ! selectedRegionId || ! formData.child_map_id ) {
			throw new Error( 'Select a child map before saving.' );
		}

		const region = regionsList.find( ( r ) => r.id === selectedRegionId );
		if ( ! region ) return;

		const payload = {
			child_map_id:        formData.child_map_id,
			nodes:               JSON.stringify( region.nodes ),
			style_fill:          formData.style_fill,
			style_fill_opacity:  formData.style_fill_opacity,
			style_stroke:        formData.style_stroke,
			style_stroke_width:  formData.style_stroke_width,
		};

		let res: Response;
		if ( selectedRegionId === -1 ) {
			// Unsaved draft — create.
			res = await apiFetch( 'POST', `/maps/${ mapId }/hierarchy`, payload );
		} else {
			res = await apiFetch( 'POST', `/hierarchy/${ selectedRegionId }`, payload );
		}

		const data = ( await res.json() ) as HierarchyRegion;
		if ( ! res.ok )
			throw new Error( ( data as unknown as { message?: string } ).message || 'Save failed.' );

		setRegionsList( ( prev ) =>
			prev.map( ( r ) => ( r.id === selectedRegionId ? data : r ) )
		);
		// After creating a draft, update the selected ID to the real one.
		if ( selectedRegionId === -1 ) setSelectedRegionId( data.id );
		return data;
	}

	async function handleRegionDeleteById( id: number ) {
		if ( id === -1 ) {
			setRegionsList( ( prev ) => prev.filter( ( r ) => r.id !== -1 ) );
			setSelectedRegionId( null );
			return;
		}
		const res = await apiFetch( 'DELETE', `/hierarchy/${ id }` );
		if ( ! res.ok ) throw new Error( 'Delete failed.' );
		setRegionsList( ( prev ) => prev.filter( ( r ) => r.id !== id ) );
		if ( selectedRegionId === id ) setSelectedRegionId( null );
	}

	// ── Render ────────────────────────────────────────────────────────────────

	const pageTitle = isNew
		? 'New Map'
		: `Edit: ${ settings.title || '(no title)' }`;

	return (
		<div className="cns-map-editor">
			<EditorHeader
				pageTitle={ pageTitle }
				overviewUrl={ overviewUrl }
				viewUrl={ ! isNew && viewUrl ? viewUrl : '' }
				status={ settings.status }
				onStatusChange={ ( s: PostStatus ) =>
					setSettings( ( prev ) => ( { ...prev, status: s } ) )
				}
				saveStatus={ saveStatus }
				onSave={ handleSave }
			/>
			<div className="cns-editor-main">
				<div className="cns-map-editor__body">
					<TabBar
						activeTab={ activeTab }
						isMaster={ settings.isMaster }
						onChange={ handleTabChange }
					/>

					<div className="cns-map-editor__content">
						{ activeTab === 'settings' && (
							<SettingsPanel
								settings={ settings }
								onChange={ setSettings }
							/>
						) }
						{ activeTab === 'objects' && ! settings.isMaster && (
							<ObjectsPanel
								mapId={ mapId }
								settings={ settings }
								objects={ objectsList }
								selectedObjectId={ selectedObjectId }
								repositioningObjectId={ repositioningObjId }
								onObjectsLoaded={ setObjectsList }
								onSelect={ setSelectedObjectId }
								onDeselect={ () => setSelectedObjectId( null ) }
								onAdd={ handleObjectAdd }
								onPositionUpdate={ handleObjectPositionUpdate }
								onRepositionStart={ ( id ) =>
									setRepositioningObjId( id )
								}
								onRepositionComplete={ () =>
									setRepositioningObjId( null )
								}
								onDelete={ handleObjectDeleteById }
							/>
						) }
						{ activeTab === 'areas' && ! settings.isMaster && (
							<AreasPanel
								mapId={ mapId }
								settings={ settings }
								areas={ areasList }
								selectedAreaId={ selectedAreaId }
								onAreasLoaded={ setAreasList }
								onSelect={ setSelectedAreaId }
								onDeselect={ () => setSelectedAreaId( null ) }
								onNodesUpdate={ handleAreaNodesUpdate }
								onDelete={ handleAreaDeleteById }
							/>
						) }
						{ ( activeTab === 'hierarchy' ||
							( settings.isMaster &&
								activeTab !== 'settings' &&
								activeTab !== 'preview' ) ) && (
							<HierarchyPanel
								mapId={ mapId }
								settings={ settings }
								regions={ regionsList }
								selectedRegionId={ selectedRegionId }
								parentMaps={ initialParentMaps }
								onRegionsLoaded={ setRegionsList }
								onSelect={ setSelectedRegionId }
								onDeselect={ () => setSelectedRegionId( null ) }
								onNodesUpdate={ handleRegionNodesUpdate }
								onDelete={ handleRegionDeleteById }
							/>
						) }
						{ activeTab === 'preview' && (
							<PreviewPanel
								settings={ settings }
								objects={ objectsList }
								areas={ areasList }
								viewUrl={ ! isNew && viewUrl ? viewUrl : '' }
							/>
						) }
						{ activeTab === 'stories' && (
							<div
								id="cns-map-stories-panel"
								data-map-id={ mapId }
								data-overview-url={ window.cnsMapEditorExtensions?.storySuiteOverviewUrl || '' }
							/>
						) }
					</div>
				</div>
				<ContextPanel
					activeTab={ activeTab }
					selectedObject={ selectedObject }
					selectedArea={ selectedArea }
					selectedRegion={ selectedRegion }
					onObjectSave={ handleObjectSave }
					onObjectDelete={ () => handleObjectDeleteById( selectedObjectId! ) }
					onObjectClose={ () => setSelectedObjectId( null ) }
					onObjectReposition={ () => setRepositioningObjId( selectedObjectId ) }
					onAreaSave={ handleAreaSave }
					onAreaDelete={ () => handleAreaDeleteById( selectedAreaId! ) }
					onAreaClose={ () => setSelectedAreaId( null ) }
					onAreaNodesUpdate={ handleAreaNodesUpdate }
					onAreaShapeTypeChange={ handleAreaShapeTypeChange }
					onRegionSave={ handleRegionSave }
					onRegionDelete={ () => handleRegionDeleteById( selectedRegionId! ) }
					onRegionClose={ () => setSelectedRegionId( null ) }
				/>
			</div>
		</div>
	);
}
