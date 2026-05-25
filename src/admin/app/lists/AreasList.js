export default function AreasList( { areas, onSelect, onDelete } ) {
	if ( ! areas.length ) {
		return <p className="cns-objects-empty">No areas yet. Click "Add Area" to create one.</p>;
	}

	return (
		<table className="widefat cns-objects-table">
			<thead>
				<tr>
					<th>Title</th>
					<th>Type</th>
					<th>Nodes</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{ areas.map( ( area ) => (
					<tr key={ area.id }>
						<td>{ area.title || '(no title)' }</td>
						<td><span className="cns-badge cns-badge--type">{ area.type }</span></td>
						<td>{ ( area.nodes || [] ).length } nodes</td>
						<td className="cns-maps-actions">
							<button className="button button-small" onClick={ () => onSelect( area.id ) }>Select</button>
							{ ' ' }
							<button className="button button-small" onClick={ () => onDelete( area.id ) }>Delete</button>
						</td>
					</tr>
				) ) }
			</tbody>
		</table>
	);
}
