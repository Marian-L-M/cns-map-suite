import type { Tab } from '../../types';

interface TabDef {
	id: Tab;
	label: string;
	masterHide: boolean;
	masterShow: boolean;
	extensionKey?: keyof typeof window.cnsMapEditorExtensions;
}

const TABS: TabDef[] = [
	{ id: 'settings',  label: 'Settings',  masterHide: false, masterShow: false },
	{ id: 'objects',   label: 'Objects',   masterHide: true,  masterShow: false },
	{ id: 'areas',     label: 'Areas',     masterHide: true,  masterShow: false },
	{ id: 'hierarchy', label: 'Hierarchy', masterHide: false, masterShow: true  },
	{ id: 'preview',   label: 'Preview',   masterHide: false, masterShow: false },
	{ id: 'stories',   label: 'Stories',   masterHide: false, masterShow: false, extensionKey: 'hasStorySuite' },
];

interface Props {
	activeTab: Tab;
	isMaster: boolean;
	onChange: ( tab: Tab ) => void;
}

export default function TabBar( { activeTab, isMaster, onChange }: Props ) {
	const ext = window.cnsMapEditorExtensions || {};

	const visible = TABS.filter( ( t ) => {
		if ( t.masterHide && isMaster ) return false;
		if ( t.masterShow && ! isMaster ) return false;
		if ( t.extensionKey && ! ext[ t.extensionKey ] ) return false;
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
