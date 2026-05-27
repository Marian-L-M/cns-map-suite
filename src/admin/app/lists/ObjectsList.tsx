import type { MapObject } from '../../../types';

interface Props {
	objects: MapObject[];
	onEdit: ( obj: MapObject ) => void;
	onDelete: ( id: number ) => void;
}

export default function ObjectsList( { objects, onEdit, onDelete }: Props ) {
	if ( ! objects.length ) {
		return <p className="cns-objects-empty">No objects yet. Click on the canvas to place one.</p>;
	}

	return (
		<table className="widefat cns-objects-table">
			<thead>
				<tr>
					<th style={ { width: 36 } }></th>
					<th>Title</th>
					<th>Type</th>
					<th>Position</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{ objects.map( ( obj ) => (
					<tr key={ obj.id }>
						<td className="col-icon">
							{ obj.icon_url
								? <img src={ obj.icon_url } width="28" height="28" alt="" style={ { display: 'block', objectFit: 'contain' } } />
								: <span className="cns-obj-dot" style={ { background: obj.canvas_styles?.fillStyle || '#2271b1' } } />
							}
						</td>
						<td>{ obj.title || '(no title)' }</td>
						<td><span className="cns-badge cns-badge--type">{ obj.type }</span></td>
						<td>{ obj.x }, { obj.y }</td>
						<td className="cns-maps-actions">
							<button className="button button-small" onClick={ () => onEdit( obj ) }>Edit</button>
							{ ' ' }
							<button className="button button-small" onClick={ () => onDelete( obj.id ) }>Delete</button>
						</td>
					</tr>
				) ) }
			</tbody>
		</table>
	);
}
