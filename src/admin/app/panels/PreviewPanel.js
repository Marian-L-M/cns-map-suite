import PreviewCanvas from '../canvases/PreviewCanvas.js';

function settingsToDrawState( s ) {
	return {
		width: s.width, aspectRatio: s.aspectRatio,
		bgType: s.bgType, bgColor: s.bgColor, bgImageUrl: s.bgImageUrl,
		imgUrl: s.imageUrl, imageX: s.imageX, imageY: s.imageY, imageW: s.imageW,
	};
}

export default function PreviewPanel( { settings, objects, areas, viewUrl } ) {
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
