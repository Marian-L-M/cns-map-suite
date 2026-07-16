import { Button, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { plus, closeSmall } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
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
				{ __( 'Nodes', 'cns-map-suite' ) }
				<Button
					variant="secondary"
					size="small"
					icon={ plus }
					onClick={ addNode }
				>
					{ __( 'Add Node', 'cns-map-suite' ) }
				</Button>
			</h3>
			{ nodes.length === 0 ? (
				<p className="description">
					{ __( 'No nodes yet. Click the canvas to add nodes.', 'cns-map-suite' ) }
				</p>
			) : (
				<table className="cns-nodes-table">
					<thead><tr><th>#</th><th>X&nbsp;%</th><th>Y&nbsp;%</th><th></th></tr></thead>
					<tbody>
						{ nodes.map( ( node, idx ) => (
							<tr key={ idx }>
								<td className="cns-node-num">{ idx + 1 }</td>
								<td>
									<NumberControl
										size="small"
										label={ __( 'X %', 'cns-map-suite' ) }
										hideLabelFromVision
										value={ ( node.x * 100 ).toFixed( 1 ) }
										min={ 0 } max={ 100 } step={ 0.1 }
										onChange={ ( v ) => updateNode( idx, 'x', v ?? '' ) }
									/>
								</td>
								<td>
									<NumberControl
										size="small"
										label={ __( 'Y %', 'cns-map-suite' ) }
										hideLabelFromVision
										value={ ( node.y * 100 ).toFixed( 1 ) }
										min={ 0 } max={ 100 } step={ 0.1 }
										onChange={ ( v ) => updateNode( idx, 'y', v ?? '' ) }
									/>
								</td>
								<td>
									<Button
										size="small"
										icon={ closeSmall }
										label={ __( 'Remove node', 'cns-map-suite' ) }
										onClick={ () => deleteNode( idx ) }
									/>
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			) }
		</section>
	);
}
