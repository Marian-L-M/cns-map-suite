import EntityTable from './EntityTable';
import type { EntityColumn } from './EntityTable';
import type { MapLabel } from '../../../types';

interface Props {
	labels: MapLabel[];
	onEdit: ( label: MapLabel ) => void;
	onDuplicate: ( id: number ) => void;
	onDelete: ( id: number ) => void;
}

const COLUMNS: EntityColumn<MapLabel>[] = [
	{
		header: '',
		width: 36,
		className: 'col-icon',
		render: ( label ) => (
			<span
				className="cns-obj-dot"
				style={ {
					background:  label.canvas_styles?.bgColor || '#ffffff',
					border:      `2px solid ${ label.canvas_styles?.borderColor || '#1e1e1e' }`,
					borderRadius: 3,
				} }
			/>
		),
	},
	{ header: 'Text', render: ( label ) => label.text || '(empty label)' },
	{
		header: 'Placement',
		render: ( label ) => (
			<span className="cns-badge cns-badge--type">
				{ label.placement === 'indicator' ? 'Indicator' : 'Centered' }
			</span>
		),
	},
	{ header: 'Position', render: ( label ) => <>{ label.x }, { label.y }</> },
];

export default function LabelsList( { labels, onEdit, onDuplicate, onDelete }: Props ) {
	return (
		<EntityTable
			items={ labels }
			columns={ COLUMNS }
			emptyText="No labels yet. Click on the canvas to place one."
			renderActions={ ( label ) => (
				<>
					<button className="button button-small" onClick={ () => onEdit( label ) }>Edit</button>
					{ ' ' }
					<button className="button button-small" onClick={ () => onDuplicate( label.id ) }>Duplicate</button>
					{ ' ' }
					<button className="button button-small" onClick={ () => onDelete( label.id ) }>Delete</button>
				</>
			) }
		/>
	);
}
