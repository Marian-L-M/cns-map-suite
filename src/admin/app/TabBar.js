const TABS = [
	{ id: 'settings',  label: 'Settings',  masterHide: false, masterShow: false },
	{ id: 'objects',   label: 'Objects',   masterHide: true,  masterShow: false },
	{ id: 'areas',     label: 'Areas',     masterHide: true,  masterShow: false },
	{ id: 'hierarchy', label: 'Hierarchy', masterHide: false, masterShow: true  },
	{ id: 'preview',   label: 'Preview',   masterHide: false, masterShow: false },
];

export default function TabBar( { activeTab, isMaster, onChange } ) {
	const visible = TABS.filter( ( t ) => {
		if ( t.masterHide && isMaster ) return false;
		if ( t.masterShow && ! isMaster ) return false;
		return true;
	} );

	return (
		<nav className="cns-map-editor__tabs" role="tablist" aria-label="Editor modes">
			{ visible.map( ( t ) => (
				<button
					key={ t.id }
					className={ `cns-tab${ activeTab === t.id ? ' cns-tab--active' : '' }` }
					role="tab"
					aria-selected={ activeTab === t.id }
					onClick={ () => onChange( t.id ) }
				>
					{ t.label }
				</button>
			) ) }
		</nav>
	);
}
