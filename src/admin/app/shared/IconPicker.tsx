import type { LibraryIcon } from '../../../types';

interface Props {
	icons: LibraryIcon[];
	selectedIconId: number | null;
	onSelect: ( id: number ) => void;
}

export default function IconPicker( { icons, selectedIconId, onSelect }: Props ) {
	if ( ! icons || ! icons.length ) {
		return (
			<p className="description">
				No icons yet.{ ' ' }
				<a href={ window.cnsMapSuite.iconsUrl } target="_blank" rel="noreferrer">Add icons →</a>
			</p>
		);
	}

	return (
		<div className="cns-icon-picker-grid">
			{ icons.map( ( icon ) => (
				<button
					key={ icon.id }
					type="button"
					className={ `cns-icon-item${ icon.id === selectedIconId ? ' cns-icon-item--active' : '' }` }
					title={ icon.title }
					onClick={ () => onSelect( icon.id ) }
				>
					<img src={ icon.url } alt={ icon.title } />
				</button>
			) ) }
		</div>
	);
}
