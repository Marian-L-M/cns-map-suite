import { loadImage, loadSvgWithColors } from './utils.js';
import { drawMapCanvas } from './canvas.js';

// ── Canvas rendering ──────────────────────────────────────────────────────────

function drawFallbackMarker( ctx, x, y, size, fill, stroke ) {
	ctx.save();
	ctx.beginPath();
	ctx.arc( x, y, size / 2, 0, Math.PI * 2 );
	ctx.fillStyle   = fill   || '#2271b1';
	ctx.strokeStyle = stroke || '#fff';
	ctx.lineWidth   = 2;
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}

export async function drawObjectMarker( ctx, obj, isSelected ) {
	const size   = obj.canvas_styles?.size        || 32;
	const fill   = obj.canvas_styles?.fillStyle   || '#ffffff';
	const stroke = obj.canvas_styles?.strokeStyle || '#2271b1';

	if ( obj.icon_url ) {
		const img = obj.icon_mime === 'image/svg+xml'
			? await loadSvgWithColors( obj.icon_url, fill, stroke )
			: await loadImage( obj.icon_url );
		if ( img ) {
			ctx.drawImage( img, obj.x - size / 2, obj.y - size / 2, size, size );
		} else {
			drawFallbackMarker( ctx, obj.x, obj.y, size, fill, stroke );
		}
	} else {
		drawFallbackMarker( ctx, obj.x, obj.y, size, fill, stroke );
	}

	if ( isSelected ) {
		ctx.save();
		ctx.beginPath();
		ctx.arc( obj.x, obj.y, size / 2 + 4, 0, Math.PI * 2 );
		ctx.strokeStyle = '#2271b1';
		ctx.lineWidth   = 2;
		ctx.setLineDash( [ 4, 3 ] );
		ctx.stroke();
		ctx.restore();
	}
}

// drawState: { width, aspectRatio, bgType, bgColor, bgImageUrl, imgUrl, imageX, imageY, imageW }
export async function drawObjectsOnCanvas( canvas, drawState, objects, selectedObjectId, repositioningId, repositionCursor ) {
	await drawMapCanvas( canvas, drawState );
	const ctx = canvas.getContext( '2d' );
	for ( const obj of objects ) {
		if ( repositioningId === obj.id && repositionCursor ) {
			await drawObjectMarker( ctx, { ...obj, ...repositionCursor }, true );
		} else {
			await drawObjectMarker( ctx, obj, selectedObjectId === obj.id );
		}
	}
}

export function findObjectAtPoint( ctx, x, y, objects ) {
	for ( let i = objects.length - 1; i >= 0; i-- ) {
		const obj  = objects[ i ];
		const size = obj.canvas_styles?.size || 32;
		const half = size / 2;
		ctx.beginPath();
		ctx.rect( obj.x - half, obj.y - half, size, size );
		if ( ctx.isPointInPath( x, y ) ) return obj;
	}
	return null;
}
