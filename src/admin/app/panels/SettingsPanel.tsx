import MediaPicker   from '../shared/MediaPicker';
import SettingsCanvas from '../canvases/SettingsCanvas';
import type { MapSettings } from '../../../types';

interface Props {
	settings: MapSettings;
	onChange: ( updater: ( prev: MapSettings ) => MapSettings ) => void;
}

export default function SettingsPanel( { settings, onChange }: Props ) {
	function set<K extends keyof MapSettings>( key: K, val: MapSettings[ K ] ) {
		onChange( ( prev ) => ( { ...prev, [ key ]: val } ) );
	}

	return (
		<div className="cns-tab-panel cns-tab-panel--active" data-panel="settings" role="tabpanel">
			<div className="cns-settings-layout">
				<div className="cns-settings-form">
					<div className="cns-form-grid">

						<div className="cns-form-row cns-form-row--full">
							<label htmlFor="cns-map-title">Map Title</label>
							<input
								id="cns-map-title"
								type="text"
								className="large-text"
								value={ settings.title }
								placeholder="Enter map title…"
								onChange={ ( e ) => set( 'title', e.target.value ) }
							/>
						</div>

						<div className="cns-form-row">
							<label htmlFor="cns-map-width">Max Width (px)</label>
							<input
								id="cns-map-width"
								type="number"
								className="small-text"
								min="100"
								step="10"
								value={ settings.width }
								onChange={ ( e ) => set( 'width', parseInt( e.target.value, 10 ) || 1000 ) }
							/>
						</div>

						<div className="cns-form-row">
							<label htmlFor="cns-map-aspect-ratio">Aspect Ratio</label>
							<div className="cns-range-wrap">
								<input
									id="cns-map-aspect-ratio"
									type="range"
									min="0.25" max="4" step="0.01"
									value={ settings.aspectRatio }
									onChange={ ( e ) => set( 'aspectRatio', parseFloat( e.target.value ) ) }
								/>
								<output className="cns-range-value">{ settings.aspectRatio.toFixed( 2 ) }</output>
							</div>
							<p className="description">Width ÷ Height (1.77 = 16:9, 1.0 = square, 0.75 = portrait)</p>
						</div>

						<div className="cns-form-row">
							<label htmlFor="cns-map-time">Map Time</label>
							<input
								id="cns-map-time"
								type="number"
								className="small-text"
								value={ settings.time }
								onChange={ ( e ) => set( 'time', parseInt( e.target.value, 10 ) || 0 ) }
							/>
							<p className="description">In-world timeline value.</p>
						</div>

						<div className="cns-form-row cns-form-row--full">
							<label>Base Map Image</label>
							<MediaPicker
								imageId={ settings.imageId }
								imageUrl={ settings.imageUrl }
								title="Select Base Map Image"
								onChange={ ( att ) => onChange( ( prev ) => ( {
									...prev,
									imageId:  att ? att.id  : 0,
									imageUrl: att ? att.url : '',
								} ) ) }
							/>
						</div>

						<div className="cns-form-row">
							<label htmlFor="cns-map-image-x">Image X offset</label>
							<div className="cns-range-wrap">
								<input id="cns-map-image-x" type="range" min="0" max="1" step="0.01"
									value={ settings.imageX }
									onChange={ ( e ) => set( 'imageX', parseFloat( e.target.value ) ) }
								/>
								<output className="cns-range-value">{ settings.imageX.toFixed( 2 ) }</output>
							</div>
						</div>

						<div className="cns-form-row">
							<label htmlFor="cns-map-image-y">Image Y offset</label>
							<div className="cns-range-wrap">
								<input id="cns-map-image-y" type="range" min="0" max="1" step="0.01"
									value={ settings.imageY }
									onChange={ ( e ) => set( 'imageY', parseFloat( e.target.value ) ) }
								/>
								<output className="cns-range-value">{ settings.imageY.toFixed( 2 ) }</output>
							</div>
						</div>

						<div className="cns-form-row">
							<label htmlFor="cns-map-image-width">Image Width</label>
							<div className="cns-range-wrap">
								<input id="cns-map-image-width" type="range" min="0.1" max="2" step="0.01"
									value={ settings.imageW }
									onChange={ ( e ) => set( 'imageW', parseFloat( e.target.value ) ) }
								/>
								<output className="cns-range-value">{ settings.imageW.toFixed( 2 ) }</output>
							</div>
							<p className="description">1.0 = full canvas width. Height follows image ratio.</p>
						</div>

						<div className="cns-form-row cns-form-row--full">
							<label>Background</label>
							<div className="cns-bg-type-toggle">
								<label>
									<input type="radio" name="cns-map-bg-type" value="color"
										checked={ settings.bgType === 'color' }
										onChange={ () => set( 'bgType', 'color' ) }
									/>
									{ ' ' }Color
								</label>
								<label>
									<input type="radio" name="cns-map-bg-type" value="image"
										checked={ settings.bgType === 'image' }
										onChange={ () => set( 'bgType', 'image' ) }
									/>
									{ ' ' }Image
								</label>
							</div>
							{ settings.bgType === 'color' && (
								<div className="cns-bg-section cns-bg-section--color">
									<input
										type="color"
										className="cns-color-picker"
										value={ settings.bgColor }
										onChange={ ( e ) => set( 'bgColor', e.target.value ) }
									/>
								</div>
							) }
							{ settings.bgType === 'image' && (
								<div className="cns-bg-section cns-bg-section--image">
									<MediaPicker
										imageId={ settings.bgImageId }
										imageUrl={ settings.bgImageUrl }
										title="Select Background Image"
										onChange={ ( att ) => onChange( ( prev ) => ( {
											...prev,
											bgImageId:  att ? att.id  : 0,
											bgImageUrl: att ? att.url : '',
										} ) ) }
									/>
								</div>
							) }
						</div>

						<div className="cns-form-row">
							<label>
								<input
									type="checkbox"
									checked={ settings.isMaster }
									onChange={ ( e ) => set( 'isMaster', e.target.checked ) }
								/>
								{ ' ' }MasterMap mode
							</label>
							<p className="description">Links to child maps instead of posts. Switches Objects/Areas tabs to Hierarchy.</p>
						</div>

						<div className="cns-form-row">
							<label>
								<input
									type="checkbox"
									checked={ settings.featured }
									onChange={ ( e ) => set( 'featured', e.target.checked ) }
								/>
								{ ' ' }Featured
							</label>
						</div>

					</div>
				</div>

				<SettingsCanvas settings={ settings } />
			</div>
		</div>
	);
}
