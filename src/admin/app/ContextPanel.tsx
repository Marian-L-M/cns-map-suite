import { useState, useEffect } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { close, copy } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import ObjectForm,         { defaultObjectFormData, collectObjectPayload } from './forms/ObjectForm';
import LabelForm,          { defaultLabelFormData, collectLabelPayload } from './forms/LabelForm';
import AreaForm,           { defaultAreaFormData }   from './forms/AreaForm';
import HierarchyRegionForm, { defaultHierarchyFormData } from './forms/HierarchyRegionForm';
import NodeList            from './forms/NodeList';
import RegionNodeList      from './forms/RegionNodeList';
import { iconLibraryCache, loadIconLibraryIntoCache } from '../icons';
import type {
	Tab, MapObject, MapArea, MapLabel, HierarchyRegion, HierarchyFormData,
	ObjectFormData, AreaFormData, LabelFormData,
	ObjectSavePayload, LabelSavePayload, ShapeType, Node, LibraryIcon,
} from '../../types';

interface Props {
	activeTab: Tab;
	selectedObject: MapObject | null;
	selectedArea: MapArea | null;
	selectedLabel: MapLabel | null;
	selectedRegion: HierarchyRegion | null;
	onObjectSave: ( payload: ObjectSavePayload ) => Promise<MapObject | undefined>;
	onObjectDelete: () => Promise<void>;
	onObjectClose: () => void;
	onObjectReposition: () => void;
	onObjectDuplicate: () => void;
	onLabelSave: ( payload: LabelSavePayload ) => Promise<MapLabel | undefined>;
	onLabelDelete: () => Promise<void>;
	onLabelClose: () => void;
	onLabelReposition: () => void;
	onLabelDuplicate: () => void;
	onLabelLocalUpdate: ( id: number, patch: Partial<MapLabel> ) => void;
	onAreaSave: ( formData: AreaFormData ) => Promise<MapArea | undefined>;
	onAreaDelete: () => Promise<void>;
	onAreaClose: () => void;
	onAreaDuplicate: () => void;
	onAreaNodesUpdate: ( areaId: number, nodes: Node[] ) => void;
	onAreaShapeTypeChange: ( areaId: number, shapeType: ShapeType ) => void;
	onRegionSave: ( formData: HierarchyFormData ) => Promise<HierarchyRegion | undefined>;
	onRegionDelete: () => Promise<void>;
	onRegionClose: () => void;
	onRegionNodesUpdate: ( regionId: number, nodes: Node[] ) => void;
}

export default function ContextPanel( {
	activeTab,
	selectedObject, selectedArea, selectedLabel, selectedRegion,
	onObjectSave, onObjectDelete, onObjectClose, onObjectReposition,
	onObjectDuplicate,
	onLabelSave,  onLabelDelete,  onLabelClose,  onLabelReposition,
	onLabelDuplicate, onLabelLocalUpdate,
	onAreaSave,   onAreaDelete,   onAreaClose,   onAreaDuplicate,
	onAreaNodesUpdate, onAreaShapeTypeChange,
	onRegionSave, onRegionDelete, onRegionClose, onRegionNodesUpdate,
}: Props ) {
	const [ objFormData,    setObjFormData    ] = useState<ObjectFormData | null>( null );
	const [ areaFormData,   setAreaFormData   ] = useState<AreaFormData | null>( null );
	const [ labelFormData,  setLabelFormData  ] = useState<LabelFormData | null>( null );
	const [ regionFormData, setRegionFormData ] = useState<HierarchyFormData | null>( null );
	const [ icons,          setIcons          ] = useState<LibraryIcon[]>( iconLibraryCache || [] );
	const [ saving,         setSaving         ] = useState( false );
	const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

	useEffect( () => {
		if ( selectedObject ) {
			setObjFormData( defaultObjectFormData( selectedObject, null, null ) );
			if ( ! iconLibraryCache ) {
				loadIconLibraryIntoCache().then( () => setIcons( iconLibraryCache || [] ) );
			}
		}
	}, [ selectedObject?.id ] );

	useEffect( () => {
		if ( selectedArea ) {
			setAreaFormData( defaultAreaFormData( selectedArea ) );
		}
	}, [ selectedArea?.id ] );

	// Geometry deps: canvas drags update x/y/offsets on the list — the form
	// must pick those up. Form-driven live edits round-trip to the same
	// values, so the reset is a no-op for them.
	useEffect( () => {
		if ( selectedLabel ) {
			setLabelFormData( defaultLabelFormData( selectedLabel, null, null ) );
		}
	}, [ selectedLabel?.id, selectedLabel?.x, selectedLabel?.y, selectedLabel?.offset_x, selectedLabel?.offset_y ] );

	useEffect( () => {
		if ( selectedRegion ) {
			setRegionFormData( defaultHierarchyFormData( selectedRegion ) );
		}
	}, [ selectedRegion?.id ] );

	const hasSelection = !! selectedObject || !! selectedArea || !! selectedLabel || !! selectedRegion;

	if ( ! hasSelection ) {
		return (
			<aside className="cns-editor-context" aria-label="Context panel">
				<div className="cns-editor-context__empty">
					<p>{ activeTab === 'areas'
						? 'Select an area on the canvas to edit it here.'
						: activeTab === 'labels'
						? 'Select a label on the canvas to edit it here.'
						: activeTab === 'hierarchy'
						? 'Select a region on the canvas to edit it here.'
						: 'Select an object on the canvas to edit it here.'
					}</p>
				</div>
			</aside>
		);
	}

	const isObject = !! selectedObject;
	const isLabel  = ! isObject && !! selectedLabel;
	const isRegion = ! isObject && ! isLabel && !! selectedRegion;
	const title    = isObject
		? ( selectedObject!.title || '(no title)' )
		: isLabel
		? ( selectedLabel!.text || '(empty label)' )
		: isRegion
		? ( selectedRegion!.child_map_title || 'New Region' )
		: ( selectedArea!.title || '(no title)' );

	async function handleSave() {
		setSaving( true );
		try {
			if ( isObject && objFormData ) {
				const data = await onObjectSave( collectObjectPayload( objFormData ) );
				if ( data?.title ) setObjFormData( ( prev ) => prev ? { ...prev, title: data.title } : prev );
			} else if ( isLabel && labelFormData ) {
				const data = await onLabelSave( collectLabelPayload( labelFormData ) );
				if ( data ) setLabelFormData( defaultLabelFormData( data, null, null ) );
			} else if ( isRegion && regionFormData ) {
				const data = await onRegionSave( regionFormData );
				if ( data ) setRegionFormData( defaultHierarchyFormData( data ) );
			} else if ( areaFormData ) {
				await onAreaSave( areaFormData );
			}
			createSuccessNotice( __( 'Saved.', 'cns-map-suite' ), {
				type: 'snackbar',
			} );
		} catch ( err ) {
			createErrorNotice(
				( err as Error ).message ||
					__( 'Save failed.', 'cns-map-suite' ),
				{ type: 'snackbar' }
			);
		} finally {
			setSaving( false );
		}
	}

	async function handleDelete() {
		if ( isObject ) {
			if ( ! confirm( 'Delete this object?' ) ) return;
			await onObjectDelete();
		} else if ( isLabel ) {
			if ( ! confirm( 'Delete this label?' ) ) return;
			await onLabelDelete();
		} else if ( isRegion ) {
			if ( ! confirm( 'Delete this hierarchy region?' ) ) return;
			await onRegionDelete();
		} else {
			if ( ! confirm( 'Delete this area?' ) ) return;
			await onAreaDelete();
		}
	}

	function handleClose() {
		if ( isObject ) onObjectClose();
		else if ( isLabel ) onLabelClose();
		else if ( isRegion ) onRegionClose();
		else onAreaClose();
	}

	return (
		<aside className="cns-editor-context" aria-label="Context panel">
			<div id="cns-context-form">
				<div className="cns-editor-context__header">
					<span className="cns-editor-context__title">{ title }</span>
					{ isObject && (
						<>
							<Button variant="secondary" size="small" onClick={ onObjectReposition }>
								{ __( 'Reposition', 'cns-map-suite' ) }
							</Button>
							<Button
								size="small"
								icon={ copy }
								label={ __( 'Duplicate', 'cns-map-suite' ) }
								onClick={ onObjectDuplicate }
							/>
						</>
					) }
					{ ! isObject && ! isLabel && ! isRegion && (
						<Button
							size="small"
							icon={ copy }
							label={ __( 'Duplicate', 'cns-map-suite' ) }
							onClick={ onAreaDuplicate }
						/>
					) }
					{ isLabel && (
						<>
							<Button variant="secondary" size="small" onClick={ onLabelReposition }>
								{ __( 'Reposition', 'cns-map-suite' ) }
							</Button>
							<Button
								size="small"
								icon={ copy }
								label={ __( 'Duplicate', 'cns-map-suite' ) }
								onClick={ onLabelDuplicate }
							/>
						</>
					) }
					<Button
						size="small"
						icon={ close }
						label={ __( 'Close', 'cns-map-suite' ) }
						onClick={ handleClose }
					/>
				</div>

				<div className="cns-editor-context__body">
					{ isObject && objFormData && (
						<ObjectForm
							formData={ objFormData }
							onChange={ setObjFormData }
							icons={ icons }
						/>
					) }
					{ isLabel && labelFormData && (
						<LabelForm
							formData={ labelFormData }
							onChange={ ( fd ) => {
								setLabelFormData( fd );
								// Live preview: mirror every form change onto
								// the in-memory label so the canvas updates
								// immediately (Save persists it).
								if ( selectedLabel ) {
									onLabelLocalUpdate( selectedLabel.id, {
										text:           fd.text,
										placement:      fd.placement,
										x:              fd.x,
										y:              fd.y,
										offset_x:       fd.offset_x,
										offset_y:       fd.offset_y,
										infobox_source: fd.infobox_source,
										linked_post_id: fd.linked_post_id,
										infobox_data: {
											title:       fd.infobox_title,
											description: fd.infobox_description,
											image_id:    fd.infobox_image_id,
										},
										canvas_styles: {
											bgColor:     fd.style_bg,
											borderColor: fd.style_border,
											textColor:   fd.style_text_color,
											fontSize:    fd.style_font_size,
										},
									} );
								}
							} }
						/>
					) }
					{ ! isObject && ! isLabel && ! isRegion && areaFormData && (
						<>
							<AreaForm
								formData={ areaFormData }
								onChange={ setAreaFormData }
								onShapeTypeChange={ ( st ) => {
									if ( selectedArea ) onAreaShapeTypeChange?.( selectedArea.id, st );
									setAreaFormData( ( prev ) => prev ? { ...prev, shape_type: st } : prev );
								} }
							/>
							{ selectedArea && (
								<NodeList
									area={ selectedArea }
									onNodesChange={ ( nodes ) => onAreaNodesUpdate?.( selectedArea.id, nodes ) }
								/>
							) }
						</>
					) }
					{ isRegion && regionFormData && (
						<>
							<HierarchyRegionForm
								formData={ regionFormData }
								onChange={ setRegionFormData }
							/>
							{ selectedRegion && (
								<RegionNodeList
									region={ selectedRegion }
									onNodesChange={ ( nodes ) => onRegionNodesUpdate( selectedRegion.id, nodes ) }
								/>
							) }
						</>
					) }
				</div>

				<div className="cns-editor-context__footer">
					<Button
						variant="primary"
						size="small"
						isBusy={ saving }
						disabled={ saving }
						onClick={ handleSave }
					>
						{ __( 'Save', 'cns-map-suite' ) }
					</Button>
					<Button
						variant="secondary"
						size="small"
						isDestructive
						onClick={ handleDelete }
					>
						{ __( 'Delete', 'cns-map-suite' ) }
					</Button>
				</div>
			</div>
		</aside>
	);
}
