import { useState } from '@wordpress/element';
import EditorHeader    from './EditorHeader.js';
import TabBar          from './TabBar.js';
import ContextPanel    from './ContextPanel.js';
import SettingsPanel   from './panels/SettingsPanel.js';
import ObjectsPanel    from './panels/ObjectsPanel.js';
import AreasPanel      from './panels/AreasPanel.js';
import HierarchyPanel  from './panels/HierarchyPanel.js';
import PreviewPanel    from './panels/PreviewPanel.js';
import { apiFetch }    from '../utils.js';
import { normalizeNodesForShapeType } from '../areas.js';

function buildInitialSettings() {
	const d = window.cnsMapEditor || {};
	return {
		title:       d.title       ?? '',
		width:       d.width       ?? 1000,
		aspectRatio: d.aspectRatio ?? 1.0,
		time:        d.time        ?? 0,
		imageId:     d.imageId     ?? 0,
		imageUrl:    d.imageUrl    ?? '',
		imageX:      d.imageX      ?? 0,
		imageY:      d.imageY      ?? 0,
		imageW:      d.imageWidth  ?? 1.0,
		isMaster:    d.isMaster    ?? false,
		featured:    d.featured    ?? false,
		bgType:      d.bgType      ?? 'color',
		bgColor:     d.bgColor     ?? '#1a1a2e',
		bgImageId:   d.bgImageId   ?? 0,
		bgImageUrl:  d.bgImageUrl  ?? '',
	};
}

export default function MapEditorApp() {
	const d          = window.cnsMapEditor || {};
	const mapId      = d.mapId      || 0;
	const isNew      = d.isNew      || false;
	const overviewUrl = d.overviewUrl || '#';
	const viewUrl    = d.viewUrl    || '';

	const [ settings,             setSettings             ] = useState( buildInitialSettings );
	const [ activeTab,            setActiveTab            ] = useState( 'settings' );
	const [ objectsList,          setObjectsList          ] = useState( [] );
	const [ areasList,            setAreasList            ] = useState( [] );
	const [ selectedObjectId,     setSelectedObjectId     ] = useState( null );
	const [ selectedAreaId,       setSelectedAreaId       ] = useState( null );
	const [ repositioningObjId,   setRepositioningObjId   ] = useState( null );
	const [ saveStatus,           setSaveStatus           ] = useState( { text: '', type: '' } );

	const selectedObject = objectsList.find( ( o ) => o.id === selectedObjectId ) || null;
	const selectedArea   = areasList.find(   ( a ) => a.id === selectedAreaId   ) || null;

	// ── Tab switching ─────────────────────────────────────────────────────────

	function handleTabChange( tab ) {
		if ( tab !== 'objects' ) { setSelectedObjectId( null ); setRepositioningObjId( null ); }
		if ( tab !== 'areas'   )   setSelectedAreaId( null );
		setActiveTab( tab );
	}

	// ── Map settings save ─────────────────────────────────────────────────────

	async function handleSave() {
		setSaveStatus( { text: 'Saving…', type: '' } );
		const payload = {
			map_id:       mapId,
			title:        settings.title,
			status:       'publish',
			width:        settings.width,
			aspect_ratio: settings.aspectRatio,
			time:         settings.time,
			image_id:     settings.imageId,
			image_x:      settings.imageX,
			image_y:      settings.imageY,
			image_width:  settings.imageW,
			is_master:    settings.isMaster,
			featured:     settings.featured,
			bg_type:      settings.bgType,
			bg_color:     settings.bgColor,
			bg_image_id:  settings.bgImageId,
		};
		try {
			const res  = await apiFetch( 'POST', '/maps', payload );
			const data = await res.json();
			if ( ! res.ok ) throw new Error( data.message || 'Save failed.' );
			if ( data.created ) {
				window.location.href = data.edit_url;
			} else {
				setSaveStatus( { text: 'Saved.', type: 'ok' } );
				setTimeout( () => setSaveStatus( { text: '', type: '' } ), 2000 );
			}
		} catch ( err ) {
			setSaveStatus( { text: err.message, type: 'error' } );
		}
	}

	// ── Object operations ─────────────────────────────────────────────────────

	async function handleObjectSave( formPayload ) {
		if ( ! selectedObjectId ) return;
		const res  = await apiFetch( 'POST', `/objects/${ selectedObjectId }`, formPayload );
		const data = await res.json();
		if ( ! res.ok ) throw new Error( data.message || 'Save failed.' );
		setObjectsList( ( prev ) => prev.map( ( o ) => o.id === selectedObjectId ? data : o ) );
		return data;
	}

	async function handleObjectPositionUpdate( id, x, y ) {
		const res  = await apiFetch( 'PATCH', `/objects/${ id }/position`, { x, y } );
		const data = await res.json();
		if ( res.ok ) {
			setObjectsList( ( prev ) => prev.map( ( o ) => o.id === id ? data : o ) );
		}
	}

	// ── Area operations ───────────────────────────────────────────────────────

	async function handleAreaSave( formData ) {
		if ( ! selectedAreaId ) return;
		const area = areasList.find( ( a ) => a.id === selectedAreaId );
		if ( ! area ) return;
		const payload = { ...formData, nodes: JSON.stringify( area.nodes ) };
		const res  = await apiFetch( 'POST', `/areas/${ selectedAreaId }`, payload );
		const data = await res.json();
		if ( ! res.ok ) throw new Error( data.message || 'Save failed.' );
		setAreasList( ( prev ) => prev.map( ( a ) => a.id === selectedAreaId ? data : a ) );
		return data;
	}

	function handleAreaNodesUpdate( areaId, nodes ) {
		setAreasList( ( prev ) => prev.map( ( a ) => a.id === areaId ? { ...a, nodes } : a ) );
	}

	function handleAreaShapeTypeChange( areaId, shapeType ) {
		setAreasList( ( prev ) => prev.map( ( a ) => {
			if ( a.id !== areaId ) return a;
			return { ...a, shape_type: shapeType, nodes: normalizeNodesForShapeType( a.nodes || [], shapeType ) };
		} ) );
	}

	// ── Object add helper (used by ObjectsPanel) ──────────────────────────────

	async function handleObjectAdd( payload ) {
		const res  = await apiFetch( 'POST', `/maps/${ mapId }/objects`, payload );
		const data = await res.json();
		if ( ! res.ok ) throw new Error( data.message || 'Failed.' );
		setObjectsList( ( prev ) => [ ...prev, data ] );
		return data;
	}

	async function handleObjectDeleteById( id ) {
		const res = await apiFetch( 'DELETE', `/objects/${ id }` );
		if ( ! res.ok ) throw new Error( 'Delete failed.' );
		setObjectsList( ( prev ) => prev.filter( ( o ) => o.id !== id ) );
		if ( selectedObjectId === id ) setSelectedObjectId( null );
	}

	async function handleAreaDeleteById( id ) {
		const res = await apiFetch( 'DELETE', `/areas/${ id }` );
		if ( ! res.ok ) throw new Error( 'Delete failed.' );
		setAreasList( ( prev ) => prev.filter( ( a ) => a.id !== id ) );
		if ( selectedAreaId === id ) setSelectedAreaId( null );
	}

	// ── Render ────────────────────────────────────────────────────────────────

	const pageTitle = isNew
		? 'New Map'
		: `Edit: ${ settings.title || '(no title)' }`;

	return (
		<div className="cns-map-editor wrap">
			<div className="cns-editor-layout">
				<div className="cns-editor-main">
					<EditorHeader
						pageTitle={ pageTitle }
						overviewUrl={ overviewUrl }
						viewUrl={ ( ! isNew && viewUrl ) ? viewUrl : '' }
						saveStatus={ saveStatus }
						onSave={ handleSave }
					/>

					<div className="cns-map-editor__body">
						<TabBar
							activeTab={ activeTab }
							isMaster={ settings.isMaster }
							onChange={ handleTabChange }
						/>

						<div className="cns-map-editor__content">
							{ activeTab === 'settings' && (
								<SettingsPanel settings={ settings } onChange={ setSettings } />
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
									onRepositionStart={ ( id ) => setRepositioningObjId( id ) }
									onRepositionComplete={ () => setRepositioningObjId( null ) }
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
							{ ( activeTab === 'hierarchy' || ( settings.isMaster && activeTab !== 'settings' && activeTab !== 'preview' ) ) && (
								<HierarchyPanel />
							) }
							{ activeTab === 'preview' && (
								<PreviewPanel
									settings={ settings }
									objects={ objectsList }
									areas={ areasList }
									viewUrl={ ( ! isNew && viewUrl ) ? viewUrl : '' }
								/>
							) }
						</div>
					</div>
				</div>

				<ContextPanel
					activeTab={ activeTab }
					selectedObject={ selectedObject }
					selectedArea={ selectedArea }
					onObjectSave={ handleObjectSave }
					onObjectDelete={ () => handleObjectDeleteById( selectedObjectId ) }
					onObjectClose={ () => setSelectedObjectId( null ) }
					onObjectReposition={ () => setRepositioningObjId( selectedObjectId ) }
					onAreaSave={ handleAreaSave }
					onAreaDelete={ () => handleAreaDeleteById( selectedAreaId ) }
					onAreaClose={ () => setSelectedAreaId( null ) }
					onAreaNodesUpdate={ handleAreaNodesUpdate }
					onAreaShapeTypeChange={ handleAreaShapeTypeChange }
				/>
			</div>
		</div>
	);
}
