/* global jQuery */
import { loadImage, setupMediaPicker } from './utils.js';

// ── Draw state ────────────────────────────────────────────────────────────────

export function collectDrawState() {
	return {
		width:       parseInt( document.getElementById( 'cns-map-width' )?.value, 10 ) || 1000,
		aspectRatio: parseFloat( document.getElementById( 'cns-map-aspect-ratio' )?.value ) || 1.0,
		bgType:      document.querySelector( 'input[name="cns-map-bg-type"]:checked' )?.value || 'color',
		bgColor:     document.getElementById( 'cns-map-bg-color' )?.value || '#1a1a2e',
		bgImageUrl:  document.getElementById( 'cns-map-bg-image-id' )?.dataset.currentUrl || '',
		imgUrl:      document.getElementById( 'cns-map-image-id' )?.dataset.currentUrl || '',
		imageX:      parseFloat( document.getElementById( 'cns-map-image-x' )?.value ) || 0,
		imageY:      parseFloat( document.getElementById( 'cns-map-image-y' )?.value ) || 0,
		imageW:      parseFloat( document.getElementById( 'cns-map-image-width' )?.value ) || 1.0,
	};
}

// ── Core draw ─────────────────────────────────────────────────────────────────

export async function drawMapCanvas( canvasEl, state ) {
	const ctx    = canvasEl.getContext( '2d' );
	const width  = state.width;
	const height = Math.round( width / state.aspectRatio );

	canvasEl.width  = width;
	canvasEl.height = height;
	ctx.clearRect( 0, 0, width, height );

	if ( state.bgType === 'image' ) {
		const bgImg = await loadImage( state.bgImageUrl );
		if ( bgImg ) {
			const scale = Math.max( width / bgImg.naturalWidth, height / bgImg.naturalHeight );
			const drawW = bgImg.naturalWidth  * scale;
			const drawH = bgImg.naturalHeight * scale;
			ctx.drawImage( bgImg, ( width - drawW ) / 2, ( height - drawH ) / 2, drawW, drawH );
		} else {
			ctx.fillStyle = '#888';
			ctx.fillRect( 0, 0, width, height );
		}
	} else {
		ctx.fillStyle = state.bgColor;
		ctx.fillRect( 0, 0, width, height );
	}

	const mapImg = await loadImage( state.imgUrl );
	if ( mapImg ) {
		const drawW = width * state.imageW;
		const drawH = drawW * ( mapImg.naturalHeight / mapImg.naturalWidth );
		ctx.drawImage( mapImg, width * state.imageX, height * state.imageY, drawW, drawH );
	}
}

export function getCanvasCoords( canvas, event ) {
	const rect = canvas.getBoundingClientRect();
	return {
		x: Math.round( ( event.clientX - rect.left ) * ( canvas.width  / rect.width ) ),
		y: Math.round( ( event.clientY - rect.top )  * ( canvas.height / rect.height ) ),
	};
}

// drawAreaShape and drawObjectMarker are passed in to avoid circular imports.
export async function drawFullCanvas( canvas, objects, areas, drawAreaShape, drawObjectMarker ) {
	await drawMapCanvas( canvas, collectDrawState() );
	const ctx = canvas.getContext( '2d' );
	for ( const area of areas ) drawAreaShape( ctx, area, canvas.width, canvas.height, false );
	for ( const obj of objects ) await drawObjectMarker( ctx, obj, false );
}

// ── Settings tab canvas ───────────────────────────────────────────────────────

function drawEditorCanvas() {
	const canvas = document.getElementById( 'cns-editor-canvas' );
	if ( ! canvas ) return;
	return drawMapCanvas( canvas, collectDrawState() );
}

export function initSettingsCanvas() {
	const canvas = document.getElementById( 'cns-editor-canvas' );
	if ( ! canvas ) return;

	const imageIdEl   = document.getElementById( 'cns-map-image-id' );
	const bgImageIdEl = document.getElementById( 'cns-map-bg-image-id' );
	if ( imageIdEl   && window.cnsMapEditor ) imageIdEl.dataset.currentUrl   = window.cnsMapEditor.imageUrl   || '';
	if ( bgImageIdEl && window.cnsMapEditor ) bgImageIdEl.dataset.currentUrl = window.cnsMapEditor.bgImageUrl || '';

	[ 'cns-map-width', 'cns-map-aspect-ratio', 'cns-map-image-x', 'cns-map-image-y', 'cns-map-image-width' ].forEach( ( id ) => {
		document.getElementById( id )?.addEventListener( 'input', drawEditorCanvas );
	} );
	document.querySelectorAll( 'input[name="cns-map-bg-type"]' ).forEach( ( r ) => {
		r.addEventListener( 'change', drawEditorCanvas );
	} );

	drawEditorCanvas();
}

export function initColorPicker() {
	const colorInput = document.getElementById( 'cns-map-bg-color' );
	if ( ! colorInput || typeof jQuery === 'undefined' || ! jQuery.fn.wpColorPicker ) return;
	jQuery( colorInput ).wpColorPicker( {
		change: () => setTimeout( drawEditorCanvas, 20 ),
		clear:  () => setTimeout( drawEditorCanvas, 20 ),
	} );
}

export function initBgTypeToggle() {
	document.querySelectorAll( 'input[name="cns-map-bg-type"]' ).forEach( ( radio ) => {
		radio.addEventListener( 'change', () => {
			const isImage = radio.value === 'image';
			document.querySelectorAll( '.cns-bg-section--color' ).forEach( ( el ) => el.classList.toggle( 'cns-hidden', isImage ) );
			document.querySelectorAll( '.cns-bg-section--image' ).forEach( ( el ) => el.classList.toggle( 'cns-hidden', ! isImage ) );
		} );
	} );
}

export function initImagePicker() {
	const hiddenEl = document.getElementById( 'cns-map-image-id' );
	setupMediaPicker(
		document.getElementById( 'cns-select-image' ),
		document.getElementById( 'cns-remove-image' ),
		hiddenEl,
		document.getElementById( 'cns-image-preview' ),
		'Select Base Map Image',
		( att ) => { hiddenEl.dataset.currentUrl = att ? att.url : ''; drawEditorCanvas(); }
	);
}

export function initBgImagePicker() {
	const hiddenEl = document.getElementById( 'cns-map-bg-image-id' );
	setupMediaPicker(
		document.getElementById( 'cns-select-bg-image' ),
		document.getElementById( 'cns-remove-bg-image' ),
		hiddenEl,
		document.getElementById( 'cns-bg-image-preview' ),
		'Select Background Image',
		( att ) => { hiddenEl.dataset.currentUrl = att ? att.url : ''; drawEditorCanvas(); }
	);
}

export function initRangeSliders() {
	document.querySelectorAll( 'input[type="range"]' ).forEach( ( slider ) => {
		const output = document.querySelector( `output[for="${ slider.id }"]` );
		if ( ! output ) return;
		output.textContent = parseFloat( slider.value ).toFixed( 2 );
		slider.addEventListener( 'input', () => {
			output.textContent = parseFloat( slider.value ).toFixed( 2 );
		} );
	} );
}
