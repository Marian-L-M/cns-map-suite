import { useRef, useEffect } from '@wordpress/element';
import { drawFullCanvas } from '../../canvas';
import { drawObjectMarker } from '../../objects';
import { drawAreaShape } from '../../areas';
import type { DrawState, MapObject, MapArea } from '../../../types';

interface Props {
	drawState: DrawState;
	objects: MapObject[];
	areas: MapArea[];
}

export default function PreviewCanvas( { drawState, objects, areas }: Props ) {
	const canvasRef = useRef<HTMLCanvasElement>( null );

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		drawFullCanvas( canvas, objects, areas, drawState, drawAreaShape, drawObjectMarker );
	} );

	return (
		<div className="cns-canvas-wrap">
			<canvas ref={ canvasRef } />
		</div>
	);
}
