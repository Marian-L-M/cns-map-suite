import { drawMapCanvas } from './canvas';
import type { MapLabel, DrawState, CanvasPoint } from '../types';

// ── Geometry ──────────────────────────────────────────────────────────────────

interface LabelBox {
	left: number;
	top: number;
	w: number;
	h: number;
	cx: number;
	cy: number;
	fontSize: number;
}

const PAD_X = 8;
const PAD_Y = 5;

/**
 * Computes the label box in canvas pixels. 'centered' boxes sit on the
 * anchor; 'indicator' boxes sit at anchor + offset (the anchor gets a dot
 * and a leader line). Mirrors the frontend renderer in blocks/map/view.js.
 */
export function measureLabelBox( ctx: CanvasRenderingContext2D, label: MapLabel ): LabelBox {
	const fontSize = label.canvas_styles?.fontSize || 14;
	ctx.font = `bold ${ fontSize }px sans-serif`;
	const textW = ctx.measureText( label.text || '' ).width;
	const w = textW + PAD_X * 2;
	const h = fontSize + PAD_Y * 2;

	const cx = label.placement === 'indicator' ? label.x + ( label.offset_x ?? 40 ) : label.x;
	const cy = label.placement === 'indicator' ? label.y + ( label.offset_y ?? -40 ) : label.y;

	return { left: cx - w / 2, top: cy - h / 2, w, h, cx, cy, fontSize };
}

function traceRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number, y: number, w: number, h: number, r: number,
): void {
	if ( typeof ctx.roundRect === 'function' ) {
		ctx.roundRect( x, y, w, h, r );
	} else {
		ctx.rect( x, y, w, h );
	}
}

// ── Canvas rendering ──────────────────────────────────────────────────────────

export function drawLabelShape(
	ctx: CanvasRenderingContext2D,
	label: MapLabel,
	isSelected: boolean,
): void {
	const bg        = label.canvas_styles?.bgColor     || '#ffffff';
	const border    = label.canvas_styles?.borderColor || '#1e1e1e';
	const textColor = label.canvas_styles?.textColor   || '#1e1e1e';
	const box       = measureLabelBox( ctx, label );

	ctx.save();

	// Leader line + anchor dot first, so the box covers the inner segment.
	if ( label.placement === 'indicator' ) {
		ctx.beginPath();
		ctx.moveTo( label.x, label.y );
		ctx.lineTo( box.cx, box.cy );
		ctx.strokeStyle = border;
		ctx.lineWidth   = 1.5;
		ctx.stroke();

		ctx.beginPath();
		ctx.arc( label.x, label.y, 4, 0, Math.PI * 2 );
		ctx.fillStyle = border;
		ctx.fill();
	}

	ctx.beginPath();
	traceRoundedRect( ctx, box.left, box.top, box.w, box.h, 4 );
	ctx.fillStyle = bg;
	ctx.fill();
	ctx.strokeStyle = border;
	ctx.lineWidth   = 1.5;
	ctx.stroke();

	ctx.font         = `bold ${ box.fontSize }px sans-serif`;
	ctx.textAlign    = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle    = textColor;
	ctx.fillText( label.text || '(empty label)', box.cx, box.cy );

	if ( isSelected ) {
		ctx.beginPath();
		traceRoundedRect( ctx, box.left - 4, box.top - 4, box.w + 8, box.h + 8, 6 );
		ctx.strokeStyle = '#2271b1';
		ctx.lineWidth   = 2;
		ctx.setLineDash( [ 4, 3 ] );
		ctx.stroke();
	}

	ctx.restore();
}

export async function drawLabelsOnCanvas(
	canvas: HTMLCanvasElement,
	drawState: DrawState,
	labels: MapLabel[],
	selectedLabelId: number | null,
	repositioningId: number | null,
	repositionCursor: CanvasPoint | null,
): Promise<void> {
	await drawMapCanvas( canvas, drawState );
	const ctx = canvas.getContext( '2d' )!;
	for ( const label of labels ) {
		if ( repositioningId === label.id && repositionCursor ) {
			drawLabelShape( ctx, { ...label, ...repositionCursor }, true );
		} else {
			drawLabelShape( ctx, label, selectedLabelId === label.id );
		}
	}
}

/** Hit test against the label box (and the anchor dot in indicator mode). */
export function findLabelAtPoint(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	labels: MapLabel[],
): MapLabel | null {
	for ( let i = labels.length - 1; i >= 0; i-- ) {
		const label = labels[ i ];
		const box   = measureLabelBox( ctx, label );
		ctx.beginPath();
		ctx.rect( box.left, box.top, box.w, box.h );
		if ( label.placement === 'indicator' ) {
			ctx.moveTo( label.x + 6, label.y );
			ctx.arc( label.x, label.y, 6, 0, Math.PI * 2 );
		}
		if ( ctx.isPointInPath( x, y ) ) return label;
	}
	return null;
}
