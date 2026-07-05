import type { MapLabel } from '../../../types';

interface Props {
	labels: MapLabel[];
	onEdit: ( label: MapLabel ) => void;
	onDelete: ( id: number ) => void;
}

export default function LabelsList( { labels, onEdit, onDelete }: Props ) {
	if ( ! labels.length ) {
		return <p className="cns-objects-empty">No labels yet. Click on the canvas to place one.</p>;
	}

	return (
		<table className="widefat cns-objects-table">
			<thead>
				<tr>
					<th style={ { width: 36 } }></th>
					<th>Text</th>
					<th>Placement</th>
					<th>Position</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{ labels.map( ( label ) => (
					<tr key={ label.id }>
						<td className="col-icon">
							<span
								className="cns-obj-dot"
								style={ {
									background:  label.canvas_styles?.bgColor || '#ffffff',
									border:      `2px solid ${ label.canvas_styles?.borderColor || '#1e1e1e' }`,
									borderRadius: 3,
								} }
							/>
						</td>
						<td>{ label.text || '(empty label)' }</td>
						<td>
							<span className="cns-badge cns-badge--type">
								{ label.placement === 'indicator' ? 'Indicator' : 'Centered' }
							</span>
						</td>
						<td>{ label.x }, { label.y }</td>
						<td className="cns-maps-actions">
							<button className="button button-small" onClick={ () => onEdit( label ) }>Edit</button>
							{ ' ' }
							<button className="button button-small" onClick={ () => onDelete( label.id ) }>Delete</button>
						</td>
					</tr>
				) ) }
			</tbody>
		</table>
	);
}
