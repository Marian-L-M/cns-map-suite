import SaveStatus from './shared/SaveStatus';
import type { SaveStatus as SaveStatusType } from '../../types';

interface Props {
	pageTitle: string;
	overviewUrl: string;
	viewUrl: string;
	saveStatus: SaveStatusType;
	onSave: () => void;
}

export default function EditorHeader( { pageTitle, overviewUrl, viewUrl, saveStatus, onSave }: Props ) {
	return (
		<div className="cns-map-editor__header">
			<a href={ overviewUrl } className="cns-back-link">&larr; All Maps</a>
			<h1>{ pageTitle }</h1>
			<div className="cns-map-editor__header-actions">
				<SaveStatus text={ saveStatus.text } type={ saveStatus.type } />
				{ viewUrl && (
					<a href={ viewUrl } className="button" target="_blank" rel="noopener noreferrer">
						View Map
					</a>
				) }
				<button className="button button-primary" onClick={ onSave }>Save Map</button>
			</div>
		</div>
	);
}
