import { useEffect, useRef, useState } from '@wordpress/element';
import EditorHeader from './EditorHeader';
import TabBar from './TabBar';
import ContextPanel from './ContextPanel';
import SettingsPanel from './panels/SettingsPanel';
import DescriptionPanel from './panels/DescriptionPanel';
import ObjectsPanel from './panels/ObjectsPanel';
import AreasPanel from './panels/AreasPanel';
import LabelsPanel from './panels/LabelsPanel';
import HierarchyPanel from './panels/HierarchyPanel';
import PreviewPanel from './panels/PreviewPanel';
import { apiFetch } from '../utils';
import { normalizeNodesForShapeType } from '../areas';
import { defaultLabelFormData, collectLabelPayload } from './forms/LabelForm';
import {
	defaultObjectFormData,
	collectObjectPayload,
} from './forms/ObjectForm';
import { defaultAreaFormData } from './forms/AreaForm';
import type {
	MapSettings,
	MapObject,
	MapArea,
	MapLabel,
	HierarchyRegion,
	HierarchyFormData,
	Node,
	ObjectSavePayload,
	LabelSavePayload,
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
		description: d.description ?? '',
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
		thumbnailId: d.thumbnailId ? d.thumbnailId : null,
		thumbnailUrl: d.thumbnailUrl ?? '',
	};
}

export default function MapEditorApp() {
	const d = window.cnsMapEditor || ( {} as typeof window.cnsMapEditor );
	const mapId = d.mapId || 0;
	const isNew = d.isNew || false;
	const overviewUrl = d.overviewUrl || '#';
	const initialParentMaps: ParentMapRef[] = d.parentMaps || [];

	const [ settings, setSettings ] =
		useState< MapSettings >( buildInitialSettings );
	const [ viewUrl, setViewUrl ] = useState< string >( d.viewUrl || '' );
	const [ activeTab, setActiveTab ] = useState< Tab >( 'settings' );
	const [ objectsList, setObjectsList ] = useState< MapObject[] >( [] );
	const [ areasList, setAreasList ] = useState< MapArea[] >( [] );
	const [ selectedObjectId, setSelectedObjectId ] = useState< number | null >(
		null
	);
	const [ selectedAreaId, setSelectedAreaId ] = useState< number | null >(
		null
	);
	const [ labelsList, setLabelsList ] = useState< MapLabel[] >( [] );
	const [ selectedLabelId, setSelectedLabelId ] = useState< number | null >(
		null
	);
	const [ repositioningLabelId, setRepositioningLabelId ] = useState<
		number | null
	>( null );
	const [ selectedRegionId, setSelectedRegionId ] = useState< number | null >(
		null
	);
	const [ regionsList, setRegionsList ] = useState< HierarchyRegion[] >( [] );
	const [ repositioningObjId, setRepositioningObjId ] = useState<
		number | null
	>( null );
	const [ saveStatus, setSaveStatus ] = useState< SaveStatus >( {
		text: '',
		type: '',
	} );

	const selectedObject =
		objectsList.find( ( o ) => o.id === selectedObjectId ) || null;
	const selectedArea =
		areasList.find( ( a ) => a.id === selectedAreaId ) || null;
	const selectedLabel =
		labelsList.find( ( l ) => l.id === selectedLabelId ) || null;
	const selectedRegion =
		regionsList.find( ( r ) => r.id === selectedRegionId ) || null;

	// Warn before leaving with unsaved map settings, or while a debounced
	// area-geometry save is still pending. Everything else persists through
	// its own endpoint as you edit.
	const savedSettingsRef = useRef( JSON.stringify( buildInitialSettings() ) );

	useEffect( () => {
		function handleBeforeUnload( e: BeforeUnloadEvent ) {
			if (
				JSON.stringify( settings ) !== savedSettingsRef.current ||
				areaGeomSave.current.timer !== null
			) {
				e.preventDefault();
				e.returnValue = '';
			}
		}
		window.addEventListener( 'beforeunload', handleBeforeUnload );
		return () =>
			window.removeEventListener( 'beforeunload', handleBeforeUnload );
	}, [ settings ] );

	// ── Tab switching ─────────────────────────────────────────────────────────

	function handleTabChange( tab: Tab ) {
		if ( tab !== 'objects' ) {
			setSelectedObjectId( null );
			setRepositioningObjId( null );
		}
		if ( tab !== 'labels' ) {
			setSelectedLabelId( null );
			setRepositioningLabelId( null );
		}
		if ( tab !== 'areas' ) setSelectedAreaId( null );
		if ( tab !== 'hierarchy' ) setSelectedRegionId( null );
		setActiveTab( tab );
	}

	// ── Map settings save ─────────────────────────────────────────────────────

	async function handleSave() {
		setSaveStatus( { text: 'Saving…', type: '' } );
		const payload = {
			map_id: mapId,
			title: settings.title,
			description: settings.description,
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
			thumbnail_id: settings.thumbnailId ?? 0,
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
			savedSettingsRef.current = JSON.stringify( settings );
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

	// Live/local updates: keyboard nudges patch the in-memory object so the
	// canvas moves immediately; the position PATCH persists shortly after.
	function handleObjectLocalUpdate(
		id: number,
		patch: Partial< MapObject >
	) {
		setObjectsList( ( prev ) =>
			prev.map( ( o ) => ( o.id === id ? { ...o, ...patch } : o ) )
		);
	}

	async function handleObjectDuplicate( id: number ) {
		const obj = objectsList.find( ( o ) => o.id === id );
		if ( ! obj ) return;
		const payload = collectObjectPayload(
			defaultObjectFormData( obj, null, null )
		);
		payload.x += 24;
		payload.y += 24;
		const created = await handleObjectAdd( payload );
		setSelectedObjectId( created.id );
	}

	// ── Label operations ──────────────────────────────────────────────────────

	async function handleLabelAdd(
		payload: LabelSavePayload
	): Promise< MapLabel > {
		const res = await apiFetch(
			'POST',
			`/maps/${ mapId }/labels`,
			payload
		);
		const data = ( await res.json() ) as MapLabel;
		if ( ! res.ok )
			throw new Error(
				( data as unknown as { message?: string } ).message || 'Failed.'
			);
		setLabelsList( ( prev ) => [ ...prev, data ] );
		return data;
	}

	async function handleLabelSave(
		payload: LabelSavePayload
	): Promise< MapLabel | undefined > {
		if ( ! selectedLabelId ) return;
		const res = await apiFetch(
			'POST',
			`/labels/${ selectedLabelId }`,
			payload
		);
		const data = ( await res.json() ) as MapLabel;
		if ( ! res.ok )
			throw new Error(
				( data as unknown as { message?: string } ).message ||
					'Save failed.'
			);
		setLabelsList( ( prev ) =>
			prev.map( ( l ) => ( l.id === selectedLabelId ? data : l ) )
		);
		return data;
	}

	async function handleLabelGeometryUpdate(
		id: number,
		geometry: Partial< {
			x: number;
			y: number;
			offset_x: number;
			offset_y: number;
		} >
	): Promise< void > {
		const res = await apiFetch(
			'PATCH',
			`/labels/${ id }/position`,
			geometry
		);
		const data = ( await res.json() ) as MapLabel;
		if ( res.ok ) {
			setLabelsList( ( prev ) =>
				prev.map( ( l ) => ( l.id === id ? data : l ) )
			);
		}
	}

	// Live preview: form edits update the in-memory label immediately so the
	// canvas reflects colors/text/placement before saving.
	function handleLabelLocalUpdate( id: number, patch: Partial< MapLabel > ) {
		setLabelsList( ( prev ) =>
			prev.map( ( l ) => ( l.id === id ? { ...l, ...patch } : l ) )
		);
	}

	async function handleLabelDuplicate( id: number ) {
		const label = labelsList.find( ( l ) => l.id === id );
		if ( ! label ) return;
		const payload = collectLabelPayload(
			defaultLabelFormData( label, null, null )
		);
		payload.x += 24;
		payload.y += 24;
		const created = await handleLabelAdd( payload );
		setSelectedLabelId( created.id );
	}

	async function handleLabelDeleteById( id: number ) {
		const res = await apiFetch( 'DELETE', `/labels/${ id }` );
		if ( ! res.ok ) throw new Error( 'Delete failed.' );
		setLabelsList( ( prev ) => prev.filter( ( l ) => l.id !== id ) );
		if ( selectedLabelId === id ) setSelectedLabelId( null );
	}

	// ── Area operations ───────────────────────────────────────────────────────

	// Canvas node edits, node-list edits, and shape-type switches update local
	// state for instant feedback and are persisted shortly after via the
	// geometry PATCH — matching how object/label moves save immediately. The
	// debounce absorbs per-keystroke node-list edits; reading the area from a
	// ref at flush time sends the latest geometry.
	const areasRef = useRef( areasList );
	areasRef.current = areasList;
	const areaGeomSave = useRef< {
		timer: number | null;
		areaId: number | null;
	} >( {
		timer: null,
		areaId: null,
	} );

	async function commitAreaGeometry( areaId: number ) {
		const area = areasRef.current.find( ( a ) => a.id === areaId );
		if ( ! area ) return;
		await apiFetch( 'PATCH', `/areas/${ areaId }/nodes`, {
			nodes: JSON.stringify( area.nodes || [] ),
			shape_type: area.shape_type || 'POLYGON',
		} );
	}

	function scheduleAreaGeometrySave( areaId: number ) {
		const pending = areaGeomSave.current;
		if ( pending.timer ) {
			window.clearTimeout( pending.timer );
			// Switching areas mid-debounce: flush the previous one first.
			if ( pending.areaId !== null && pending.areaId !== areaId ) {
				void commitAreaGeometry( pending.areaId );
			}
		}
		pending.areaId = areaId;
		pending.timer = window.setTimeout( () => {
			pending.timer = null;
			pending.areaId = null;
			void commitAreaGeometry( areaId );
		}, 600 );
	}

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
		scheduleAreaGeometrySave( areaId );
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
		scheduleAreaGeometrySave( areaId );
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

	async function handleAreaDuplicate( id: number ) {
		const area = areasList.find( ( a ) => a.id === id );
		if ( ! area ) return;
		const W = settings.width || 1000;
		const H = W / ( settings.aspectRatio || 1 );
		// Nodes are normalized 0–1; offset the copy by 24 px worth.
		const nodes = ( area.nodes || [] ).map( ( n ) => ( {
			...n,
			x: n.x + 24 / W,
			y: n.y + 24 / H,
		} ) );
		const payload = {
			...defaultAreaFormData( area ),
			nodes: JSON.stringify( nodes ),
		};
		const res = await apiFetch( 'POST', `/maps/${ mapId }/areas`, payload );
		const data = ( await res.json() ) as MapArea;
		if ( ! res.ok ) {
			throw new Error(
				( data as unknown as { message?: string } ).message || 'Failed.'
			);
		}
		setAreasList( ( prev ) => [ ...prev, data ] );
		setSelectedAreaId( data.id );
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

	async function handleRegionSave(
		formData: HierarchyFormData
	): Promise< HierarchyRegion | undefined > {
		if ( ! selectedRegionId || ! formData.child_map_id ) {
			throw new Error( 'Select a child map before saving.' );
		}

		const region = regionsList.find( ( r ) => r.id === selectedRegionId );
		if ( ! region ) return;

		const payload = {
			child_map_id: formData.child_map_id,
			nodes: JSON.stringify( region.nodes ),
			style_fill: formData.style_fill,
			style_fill_opacity: formData.style_fill_opacity,
			style_stroke: formData.style_stroke,
			style_stroke_width: formData.style_stroke_width,
			title_override: formData.title_override,
			description_override: formData.description_override,
		};

		let res: Response;
		if ( selectedRegionId === -1 ) {
			// Unsaved draft — create.
			res = await apiFetch(
				'POST',
				`/maps/${ mapId }/hierarchy`,
				payload
			);
		} else {
			res = await apiFetch(
				'POST',
				`/hierarchy/${ selectedRegionId }`,
				payload
			);
		}

		const data = ( await res.json() ) as HierarchyRegion;
		if ( ! res.ok )
			throw new Error(
				( data as unknown as { message?: string } ).message ||
					'Save failed.'
			);

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
			<div className="cns-map-editor__main">
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
						{ activeTab === 'description' && (
							<DescriptionPanel
								value={ settings.description }
								onChange={ ( html ) =>
									setSettings( ( prev ) => ( {
										...prev,
										description: html,
									} ) )
								}
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
								onLocalUpdate={ handleObjectLocalUpdate }
								onDuplicate={ handleObjectDuplicate }
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
								onDuplicate={ handleAreaDuplicate }
								onDelete={ handleAreaDeleteById }
							/>
						) }
						{ activeTab === 'labels' && ! settings.isMaster && (
							<LabelsPanel
								mapId={ mapId }
								settings={ settings }
								labels={ labelsList }
								selectedLabelId={ selectedLabelId }
								repositioningLabelId={ repositioningLabelId }
								onLabelsLoaded={ setLabelsList }
								onSelect={ setSelectedLabelId }
								onDeselect={ () => setSelectedLabelId( null ) }
								onAdd={ handleLabelAdd }
								onGeometryUpdate={ handleLabelGeometryUpdate }
								onLocalUpdate={ handleLabelLocalUpdate }
								onDuplicate={ handleLabelDuplicate }
								onRepositionComplete={ () =>
									setRepositioningLabelId( null )
								}
								onDelete={ handleLabelDeleteById }
							/>
						) }
						{ activeTab === 'hierarchy' && (
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
								labels={ labelsList }
								viewUrl={ ! isNew && viewUrl ? viewUrl : '' }
							/>
						) }
						{ activeTab === 'stories' && (
							<div
								id="cns-map-stories-panel"
								data-map-id={ mapId }
								data-overview-url={
									window.cnsMapEditorExtensions
										?.storySuiteOverviewUrl || ''
								}
							/>
						) }
					</div>
				</div>
				<ContextPanel
					activeTab={ activeTab }
					selectedObject={ selectedObject }
					selectedArea={ selectedArea }
					selectedLabel={ selectedLabel }
					selectedRegion={ selectedRegion }
					onObjectSave={ handleObjectSave }
					onObjectDelete={ () =>
						handleObjectDeleteById( selectedObjectId! )
					}
					onObjectClose={ () => setSelectedObjectId( null ) }
					onObjectReposition={ () =>
						setRepositioningObjId( selectedObjectId )
					}
					onObjectDuplicate={ () =>
						handleObjectDuplicate( selectedObjectId! )
					}
					onLabelSave={ handleLabelSave }
					onLabelDelete={ () =>
						handleLabelDeleteById( selectedLabelId! )
					}
					onLabelClose={ () => setSelectedLabelId( null ) }
					onLabelReposition={ () =>
						setRepositioningLabelId( selectedLabelId )
					}
					onLabelDuplicate={ () =>
						handleLabelDuplicate( selectedLabelId! )
					}
					onLabelLocalUpdate={ handleLabelLocalUpdate }
					onAreaSave={ handleAreaSave }
					onAreaDelete={ () =>
						handleAreaDeleteById( selectedAreaId! )
					}
					onAreaClose={ () => setSelectedAreaId( null ) }
					onAreaDuplicate={ () =>
						handleAreaDuplicate( selectedAreaId! )
					}
					onAreaNodesUpdate={ handleAreaNodesUpdate }
					onAreaShapeTypeChange={ handleAreaShapeTypeChange }
					onRegionSave={ handleRegionSave }
					onRegionDelete={ () =>
						handleRegionDeleteById( selectedRegionId! )
					}
					onRegionClose={ () => setSelectedRegionId( null ) }
					onRegionNodesUpdate={ handleRegionNodesUpdate }
				/>
			</div>
		</div>
	);
}
