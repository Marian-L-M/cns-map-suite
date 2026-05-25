import { useRef, useEffect } from '@wordpress/element';
import { drawFullCanvas } from '../../canvas.js';
import { drawObjectMarker } from '../../objects.js';
import { drawAreaShape } from '../../areas.js';

export default function PreviewCanvas( { drawState, objects, areas } ) {
	const canvasRef = useRef( null );

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		drawFullCanvas( canvas, objects, areas, drawState, drawAreaShape, drawObjectMarker );
	}, [ drawState, objects, areas ] );

	return (
		<div className="cns-canvas-wrap">
			<canvas ref={ canvasRef } />
		</div>
	);
}
