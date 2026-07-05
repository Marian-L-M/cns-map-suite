import EntityTable from './EntityTable';
import type { EntityColumn } from './EntityTable';
import type { MapArea } from '../../../types';

interface Props {
	areas: MapArea[];
	onSelect: ( id: number ) => void;
	onDuplicate: ( id: number ) => void;
	onDelete: ( id: number ) => void;
}

const COLUMNS: EntityColumn<MapArea>[] = [
	{ header: 'Title', render: ( area ) => area.title || '(no title)' },
	{ header: 'Type',  render: ( area ) => <span className="cns-badge cns-badge--type">{ area.type }</span> },
	{ header: 'Nodes', render: ( area ) => `${ ( area.nodes || [] ).length } nodes` },
];

export default function AreasList( { areas, onSelect, onDuplicate, onDelete }: Props ) {
	return (
		<EntityTable
			items={ areas }
			columns={ COLUMNS }
			emptyText={ 'No areas yet. Click “Add Area” to create one.' }
			renderActions={ ( area ) => (
				<>
					<button className="button button-small" onClick={ () => onSelect( area.id ) }>Edit</button>
					{ ' ' }
					<button className="button button-small" onClick={ () => onDuplicate( area.id ) }>Duplicate</button>
					{ ' ' }
					<button className="button button-small" onClick={ () => onDelete( area.id ) }>Delete</button>
				</>
			) }
		/>
	);
}
