import SaveStatus from './shared/SaveStatus';
import type { SaveStatus as SaveStatusType, PostStatus } from '../../types';

const STATUS_LABELS: Record< PostStatus, string > = {
	draft:   'Draft',
	publish: 'Published',
	private: 'Private',
};

interface Props {
	pageTitle: string;
	overviewUrl: string;
	viewUrl: string;
	status: PostStatus;
	onStatusChange: ( status: PostStatus ) => void;
	saveStatus: SaveStatusType;
	onSave: () => void;
}

export default function EditorHeader( { pageTitle, overviewUrl, viewUrl, status, onStatusChange, saveStatus, onSave }: Props ) {
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
				<select
					className="cns-status-select"
					value={ status }
					onChange={ ( e ) => onStatusChange( e.target.value as PostStatus ) }
					aria-label="Post status"
				>
					{ ( Object.keys( STATUS_LABELS ) as PostStatus[] ).map( ( s ) => (
						<option key={ s } value={ s }>{ STATUS_LABELS[ s ] }</option>
					) ) }
				</select>
				<button className="button button-primary" onClick={ onSave }>Save Map</button>
			</div>
		</div>
	);
}
