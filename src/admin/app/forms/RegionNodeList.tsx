import type { HierarchyRegion, Node } from '../../../types';

interface Props {
	region: HierarchyRegion;
	onNodesChange: ( nodes: Node[] ) => void;
}

export default function RegionNodeList( { region, onNodesChange }: Props ) {
	const nodes = region.nodes || [];

	function updateNode( idx: number, axis: 'x' | 'y', rawVal: string ) {
		const val     = Math.max( 0, Math.min( 100, parseFloat( rawVal ) || 0 ) ) / 100;
		const updated = nodes.map( ( n ) => ( { ...n } ) );
		updated[ idx ] = { ...updated[ idx ], [ axis ]: val };
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
				<button type="button" className="button button-small cns-nodes-add-btn" onClick={ addNode }>
					+ Add Node
				</button>
			</h3>
			{ nodes.length === 0 ? (
				<p className="description">No nodes yet. Click the canvas to add nodes.</p>
			) : (
				<table className="cns-nodes-table">
					<thead><tr><th>#</th><th>X&nbsp;%</th><th>Y&nbsp;%</th><th></th></tr></thead>
					<tbody>
						{ nodes.map( ( node, idx ) => (
							<tr key={ idx }>
								<td className="cns-node-num">{ idx + 1 }</td>
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
									<button
										type="button"
										className="button button-small cns-node-del"
										onClick={ () => deleteNode( idx ) }
									>&times;</button>
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			) }
		</section>
	);
}
