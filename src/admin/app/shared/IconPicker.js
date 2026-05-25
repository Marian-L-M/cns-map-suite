export default function IconPicker( { icons, selectedIconId, onSelect } ) {
	if ( ! icons || ! icons.length ) {
		const iconsUrl = window.cnsMapSuite?.iconsUrl || '#';
		return (
			<p className="description">
				No icons yet.{ ' ' }
				<a href={ iconsUrl } target="_blank" rel="noreferrer">Add icons →</a>
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
