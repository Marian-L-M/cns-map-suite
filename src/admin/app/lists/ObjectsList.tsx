import EntityTable from './EntityTable';
import type { EntityColumn } from './EntityTable';
import type { MapObject } from '../../../types';

interface Props {
	objects: MapObject[];
	onEdit: ( obj: MapObject ) => void;
	onDuplicate: ( id: number ) => void;
	onDelete: ( id: number ) => void;
}

const COLUMNS: EntityColumn<MapObject>[] = [
	{
		header: '',
		width: 36,
		className: 'col-icon',
		render: ( obj ) => obj.icon_url
			? <img src={ obj.icon_url } width="28" height="28" alt="" style={ { display: 'block', objectFit: 'contain' } } />
			: <span className="cns-obj-dot" style={ { background: obj.canvas_styles?.fillStyle || '#2271b1' } } />,
	},
	{ header: 'Title',    render: ( obj ) => obj.title || '(no title)' },
	{ header: 'Type',     render: ( obj ) => <span className="cns-badge cns-badge--type">{ obj.type }</span> },
	{ header: 'Position', render: ( obj ) => <>{ obj.x }, { obj.y }</> },
];

export default function ObjectsList( { objects, onEdit, onDuplicate, onDelete }: Props ) {
	return (
		<EntityTable
			items={ objects }
			columns={ COLUMNS }
			emptyText="No objects yet. Click on the canvas to place one."
			renderActions={ ( obj ) => (
				<>
					<button className="button button-small" onClick={ () => onEdit( obj ) }>Edit</button>
					{ ' ' }
					<button className="button button-small" onClick={ () => onDuplicate( obj.id ) }>Duplicate</button>
					{ ' ' }
					<button className="button button-small" onClick={ () => onDelete( obj.id ) }>Delete</button>
				</>
			) }
		/>
	);
}
