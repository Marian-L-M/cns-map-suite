import PreviewCanvas from '../canvases/PreviewCanvas';
import { settingsToDrawState } from '../../canvas';
import type { MapSettings, MapObject, MapArea } from '../../../types';

interface Props {
	settings: MapSettings;
	objects: MapObject[];
	areas: MapArea[];
	viewUrl: string;
}

export default function PreviewPanel( { settings, objects, areas, viewUrl }: Props ) {
	return (
		<div className="cns-tab-panel cns-tab-panel--active" data-panel="preview" role="tabpanel">
			<PreviewCanvas
				drawState={ settingsToDrawState( settings ) }
				objects={ objects }
				areas={ areas }
			/>
			{ viewUrl && (
				<div className="cns-preview-actions">
					<a href={ viewUrl } className="button" target="_blank" rel="noopener noreferrer">
						View map page
					</a>
				</div>
			) }
		</div>
	);
}
