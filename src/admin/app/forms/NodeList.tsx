import { applyRectangleConstraint } from '../../areas';
import type { MapArea, Node, ShapeType } from '../../../types';

const NODE_LABELS: Partial<Record<ShapeType, string[]>> = {
	RECTANGLE: [ 'TL', 'TR', 'BR', 'BL' ],
	CIRCLE:    [ 'Center', 'Edge' ],
};

interface Props {
	area: MapArea;
	onNodesChange: ( nodes: Node[] ) => void;
}

export default function NodeList( { area, onNodesChange }: Props ) {
	const nodes     = area.nodes || [];
	const shapeType = area.shape_type || 'POLYGON';
	const isFixed   = shapeType === 'RECTANGLE' || shapeType === 'CIRCLE';
	const labels    = NODE_LABELS[ shapeType ] || null;

	function updateNode( idx: number, axis: 'x' | 'y', rawVal: string ) {
		const val = Math.max( 0, Math.min( 100, parseFloat( rawVal ) || 0 ) ) / 100;
		let updated = nodes.map( ( n ) => ( { ...n } ) );

		if ( shapeType === 'RECTANGLE' ) {
			const newX = axis === 'x' ? val : updated[ idx ].x;
			const newY = axis === 'y' ? val : updated[ idx ].y;
			updated = applyRectangleConstraint( updated, idx, newX, newY ) || updated;
		} else if ( shapeType === 'CIRCLE' && idx === 0 ) {
			const dx = ( axis === 'x' ? val : updated[ 0 ].x ) - updated[ 0 ].x;
			const dy = ( axis === 'y' ? val : updated[ 0 ].y ) - updated[ 0 ].y;
			updated[ 0 ] = { x: updated[ 0 ].x + dx, y: updated[ 0 ].y + dy };
			if ( updated[ 1 ] ) updated[ 1 ] = { x: updated[ 1 ].x + dx, y: updated[ 1 ].y + dy };
		} else {
			updated[ idx ] = { ...updated[ idx ], [ axis ]: val };
		}

		onNodesChange( updated );
	}

	function addNode() {
		onNodesChange( [ ...nodes, { x: 0.5, y: 0.5 } ] );
	}

	function deleteNode( idx: number ) {
		onNodesChange( nodes.filter( ( _, i ) => i !== idx ) );
	}

	return (
		<section className="cns-modal-section cns-nodes-section">
			<h3>
				Nodes
				{ ! isFixed && (
					<button type="button" className="button button-small cns-nodes-add-btn" onClick={ addNode }>
						+ Add Node
					</button>
				) }
			</h3>
			{ nodes.length === 0 ? (
				<p className="description">No nodes yet. Click the canvas to add nodes.</p>
			) : (
				<table className="cns-nodes-table">
					<thead><tr><th>#</th><th>X&nbsp;%</th><th>Y&nbsp;%</th><th></th></tr></thead>
					<tbody>
						{ nodes.map( ( node, idx ) => (
							<tr key={ idx }>
								<td className="cns-node-num">{ labels ? ( labels[ idx ] ?? idx + 1 ) : idx + 1 }</td>
								<td>
									<input
										type="number"
										className="small-text cns-node-x"
										value={ ( node.x * 100 ).toFixed( 1 ) }
										min="0" max="100" step="0.1"
										onChange={ ( e ) => updateNode( idx, 'x', e.target.value ) }
									/>
								</td>
								<td>
									<input
										type="number"
										className="small-text cns-node-y"
										value={ ( node.y * 100 ).toFixed( 1 ) }
										min="0" max="100" step="0.1"
										onChange={ ( e ) => updateNode( idx, 'y', e.target.value ) }
									/>
								</td>
								<td>
									{ ! isFixed && (
										<button
											type="button"
											className="button button-small cns-node-del"
											onClick={ () => deleteNode( idx ) }
										>&times;</button>
									) }
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			) }
		</section>
	);
}
