// ── WordPress globals ─────────────────────────────────────────────────────────

interface WpMediaSelection {
	first(): { toJSON(): { id: number; url: string; [key: string]: unknown } };
}
interface WpMediaState {
	get(key: 'selection'): WpMediaSelection;
}
interface WpMediaFrame {
	on(event: string, handler: () => void): WpMediaFrame;
	open(): void;
	state(): WpMediaState;
}
interface WpMediaOptions {
	title: string;
	button: { text: string };
	multiple: boolean;
	library?: { type: string };
}

declare global {
	interface Window {
		cnsMapEditor: CnsMapEditorGlobal;
		cnsMapSuite: CnsMapSuiteGlobal;
		wp: { media: (options: WpMediaOptions) => WpMediaFrame };
	}
}

export interface CnsMapEditorGlobal {
	mapId: number;
	isNew: boolean;
	status: PostStatus;
	title: string;
	width: number;
	aspectRatio: number;
	time: number;
	imageId: number;
	imageUrl: string;
	imageX: number;
	imageY: number;
	imageWidth: number;
	isMaster: boolean;
	featured: boolean;
	bgType: BgType;
	bgColor: string;
	bgImageId: number;
	bgImageUrl: string;
	overviewUrl: string;
	viewUrl: string;
}

export interface CnsMapSuiteGlobal {
	nonce: string;
	restUrl: string;
	wpRestUrl: string;
	iconsUrl: string;
}

// ── Primitive unions ──────────────────────────────────────────────────────────

export type PostStatus    = 'publish' | 'draft' | 'private';
export type ShapeType     = 'POLYGON' | 'BEZIER' | 'CIRCLE' | 'RECTANGLE';
export type ObjectType    = 'LOCATION' | 'HISTORY' | 'NATURAL' | 'EVENT' | 'OTHER';
export type AreaType      = 'GEOGRAPHY' | 'HISTORY' | 'NATURAL' | 'EVENT' | 'OTHER';
export type InfoboxSource = 'manual' | 'post';
export type IconSource    = 'svg' | 'image';
export type BgType        = 'color' | 'image';
export type SaveStatusKind = '' | 'ok' | 'error';
export type Tab           = 'settings' | 'objects' | 'areas' | 'hierarchy' | 'preview';

// ── Canvas ────────────────────────────────────────────────────────────────────

export interface CanvasPoint {
	x: number;
	y: number;
}

// ── Domain: Node ──────────────────────────────────────────────────────────────

export interface Node {
	x: number; // 0–1 normalised relative to canvas width/height
	y: number;
}

// ── Domain: canvas style bags ─────────────────────────────────────────────────

export interface ObjectCanvasStyles {
	size?: number;
	fillStyle?: string;
	strokeStyle?: string;
}

export interface AreaCanvasStyles {
	fill?: string;
	fillOpacity?: number;
	stroke?: string;
	strokeWidth?: number;
}

// ── Domain: infobox data (stored as JSON in the DB) ───────────────────────────

export interface InfoboxData {
	title?: string;
	description?: string;
	image_id?: number;
}

// ── Domain: MapObject ─────────────────────────────────────────────────────────

export interface MapObject {
	id: number;
	map_id: number;
	linked_post_id: number | null;
	type: ObjectType;
	svg_slug: string;
	icon_image_id: number | null;
	icon_url: string;
	icon_mime: string;
	title: string;
	x: number; // canvas pixel coordinate
	y: number;
	object_time: number;
	infobox_source: InfoboxSource;
	infobox_data: InfoboxData | null;
	canvas_styles: ObjectCanvasStyles | null;
	created_at: string;
	updated_at: string;
}

// ── Domain: MapArea ───────────────────────────────────────────────────────────

export interface MapArea {
	id: number;
	map_id: number;
	linked_post_id: number | null;
	type: AreaType;
	shape_type: ShapeType;
	title: string;
	object_time: number;
	nodes: Node[];
	background_image_id: number | null;
	infobox_source: InfoboxSource;
	infobox_data: InfoboxData | null;
	canvas_styles: AreaCanvasStyles | null;
	created_at: string;
	updated_at: string;
}

// ── Domain: LibraryIcon ───────────────────────────────────────────────────────

export interface LibraryIcon {
	id: number;
	url: string;
	title: string;
}

// ── Domain: MediaAttachment ───────────────────────────────────────────────────

export interface MediaAttachment {
	id: number;
	url: string;
}

// ── Domain: PostSearchResult ──────────────────────────────────────────────────

export interface PostSearchResult {
	id: number;
	title: string;
	subtype: string;
}

// ── Editor state ──────────────────────────────────────────────────────────────

export interface MapSettings {
	status: PostStatus;
	title: string;
	width: number;
	aspectRatio: number;
	time: number;
	imageId: number;
	imageUrl: string;
	imageX: number;
	imageY: number;
	imageW: number;
	isMaster: boolean;
	featured: boolean;
	bgType: BgType;
	bgColor: string;
	bgImageId: number;
	bgImageUrl: string;
}

export interface DrawState {
	width: number;
	aspectRatio: number;
	bgType: BgType;
	bgColor: string;
	bgImageUrl: string;
	imgUrl: string;
	imageX: number;
	imageY: number;
	imageW: number;
}

export interface SaveStatus {
	text: string;
	type: SaveStatusKind;
}

// ── Form data ─────────────────────────────────────────────────────────────────

export interface ObjectFormData {
	icon_source: IconSource;
	icon_image_id_svg: number | null;
	icon_image_id_custom: number;
	icon_image_url: string;
	title: string;
	type: ObjectType;
	object_time: number;
	x: number;
	y: number;
	infobox_source: InfoboxSource;
	infobox_title: string;
	infobox_description: string;
	infobox_image_id: number;
	infobox_image_url: string;
	linked_post_id: number;
	linked_post_label: string;
	style_size: number;
	style_fill: string;
	style_stroke: string;
}

export interface AreaFormData {
	title: string;
	type: AreaType;
	shape_type: ShapeType;
	object_time: number;
	infobox_source: InfoboxSource;
	infobox_title: string;
	infobox_description: string;
	linked_post_id: number;
	linked_post_label: string;
	style_fill: string;
	style_fill_opacity: number;
	style_stroke: string;
	style_stroke_width: number;
}

// ── API payloads ──────────────────────────────────────────────────────────────

export interface ObjectSavePayload {
	icon_image_id: number;
	title: string;
	type: ObjectType;
	x: number;
	y: number;
	object_time: number;
	infobox_source: InfoboxSource;
	linked_post_id: number;
	infobox_title: string;
	infobox_description: string;
	infobox_image_id: number;
	style_size: number;
	style_fill: string;
	style_stroke: string;
}

export type AreaSavePayload = AreaFormData & { nodes: string };

// ── Canvas callback signatures (used to avoid circular imports) ───────────────

export type DrawAreaFn = (
	ctx: CanvasRenderingContext2D,
	area: MapArea,
	W: number,
	H: number,
	isSelected: boolean,
	repoNodeIdx: number | null,
	repoCursor: CanvasPoint | null,
) => void;

export type DrawObjectFn = (
	ctx: CanvasRenderingContext2D,
	obj: MapObject,
	isSelected: boolean,
) => Promise<void>;
