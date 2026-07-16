import { __ } from '@wordpress/i18n';
import {
	RangeControl,
	TextControl,
	Tooltip,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { chevronRightSmall, chevronLeftSmall } from '@wordpress/icons';

// Custom elements
import MediaPicker from '../shared/MediaPicker';
import RangeField from '../shared/RangeField';
import SettingsCanvas from '../canvases/SettingsCanvas';
import type { MapSettings } from '../../../types';

interface Props {
	settings: MapSettings;
	onChange: ( updater: ( prev: MapSettings ) => MapSettings ) => void;
}

export default function SettingsPanel( { settings, onChange }: Props ) {
	function set< K extends keyof MapSettings >(
		key: K,
		val: MapSettings[ K ]
	) {
		onChange( ( prev ) => ( { ...prev, [ key ]: val } ) );
	}

	function openThumbnailPicker() {
		const frame = window.wp?.media?.( {
			title: __( 'Select Map Thumbnail', 'cns-map-suite' ),
			button: { text: __( 'Use as thumbnail', 'cns-map-suite' ) },
			multiple: false,
			library: { type: 'image' },
		} );
		if ( ! frame ) return;
		frame.on( 'select', () => {
			const att = frame.state().get( 'selection' ).first().toJSON();
			onChange( ( prev ) => ( {
				...prev,
				thumbnailId: att.id,
				thumbnailUrl: att.url,
			} ) );
		} );
		frame.open();
	}

	return (
		<div
			className="cns-tab-panel cns-tab-panel--active"
			data-panel="settings"
			role="tabpanel"
		>
			<div className="cns-settings-layout">
				<div className="cns-settings-form">
					<div className="cns-grid cns-grid__24">
						{ /* Title Input */ }
						<div className="cns-grid__group cns-grid__group-input cns-grid__span-3">
							<TextControl
								__next40pxDefaultSize
								label={ __( 'Map Title', 'cns-map-suite' ) }
								value={ settings.title }
								placeholder={ __(
									'Enter map title…',
									'cns-map-suite'
								) }
								onChange={ ( title ) => set( 'title', title ) }
							/>
						</div>

						{ /*  Map Time Value */ }
						<div className="cns-grid__group cns-grid__group-input cns-grid__span-1">
							<NumberControl
								__next40pxDefaultSize
								label={ __( 'Map Time', 'cns-map-suite' ) }
								value={ settings.time }
								step={ 1 }
								spinControls="native"
								isDragEnabled
								isShiftStepEnabled
								shiftStep={ 10 }
								onChange={ ( value ) =>
									set(
										'time',
										parseInt( value ?? '', 10 ) || 0
									)
								}
								help={ __(
									'In-world timeline value.',
									'cns-map-suite'
								) }
							/>
						</div>

						{ /* Aspect Ratio */ }
						<div className="cns-grid__group cns-grid__group-input cns-grid__span-3">
							<RangeControl
								__next40pxDefaultSize
								label={ __( 'Aspect Ratio', 'cns-map-suite' ) }
								help={ __(
									'Width ÷ Height (1.77 = 16:9, 1.0 = square, 0.75 = portrait)',
									'cns-map-suite'
								) }
								beforeIcon={ chevronLeftSmall }
								afterIcon={ chevronRightSmall }
								withInputField={ true }
								separatorType="none"
								trackColor="green"
								isShiftStepEnabled
								marks={ [
									{
										value: 0,
										label: '0',
									},
									{
										value: 1,
										label: '1',
									},
									{
										value: 2,
										label: '2',
									},
									{
										value: 3,
										label: '3',
									},
									{
										value: 4,
										label: '4',
									},
								] }
								railColor="red"
								value={ settings.aspectRatio }
								onChange={ ( v ) =>
									set( 'aspectRatio', v ?? 1 )
								}
								allowReset
								resetFallbackValue={ 1.0 }
								min={ 0.25 }
								max={ 4 }
								step={ 0.01 }
							/>
						</div>
						{ /*  Canvas max width input */ }
						<div className="cns-grid__group cns-grid__group-input cns-grid__span-1">
							<TextControl
								__next40pxDefaultSize
								type="number"
								label={ __(
									'Max Width (px)',
									'cns-map-suite'
								) }
								min={ 100 }
								step={ 10 }
								value={ settings.width }
								onChange={ ( value ) =>
									set(
										'width',
										parseInt( value, 10 ) || 1000
									)
								}
							/>
						</div>

						<div className="cns-grid__group  cns-grid__span-2">
							<MediaPicker
								imageId={ settings.imageId }
								imageUrl={ settings.imageUrl }
								label="Base Map Image2"
								title="Select Base Map Image"
								onChange={ ( att ) =>
									onChange( ( prev ) => ( {
										...prev,
										imageId: att ? att.id : 0,
										imageUrl: att ? att.url : '',
									} ) )
								}
							/>
						</div>
						{ /*

						<div className="cns-grid__row">
							<label htmlFor="cns-map-image-x">
								Image X offset
							</label>
							<RangeField
								id="cns-map-image-x"
								min={ 0 }
								max={ 1 }
								step={ 0.01 }
								value={ settings.imageX }
								onChange={ ( v ) => set( 'imageX', v ) }
							/>
						</div>

						<div className="cns-grid__row">
							<label htmlFor="cns-map-image-y">
								Image Y offset
							</label>
							<RangeField
								id="cns-map-image-y"
								min={ 0 }
								max={ 1 }
								step={ 0.01 }
								value={ settings.imageY }
								onChange={ ( v ) => set( 'imageY', v ) }
							/>
						</div>

						<div className="cns-grid__row">
							<label htmlFor="cns-map-image-width">
								Image Width
							</label>
							<RangeField
								id="cns-map-image-width"
								min={ 0.1 }
								max={ 2 }
								step={ 0.01 }
								value={ settings.imageW }
								onChange={ ( v ) => set( 'imageW', v ) }
							/>
							<p className="description">
								1.0 = full canvas width. Height follows image
								ratio.
							</p>
						</div>

						<div className="cns-grid__row cns-grid__row__full">
							<label>Background</label>
							<div className="cns-bg-type-toggle">
								<label>
									<input
										type="radio"
										name="cns-map-bg-type"
										value="color"
										checked={ settings.bgType === 'color' }
										onChange={ () =>
											set( 'bgType', 'color' )
										}
									/>{ ' ' }
									Color
								</label>
								<label>
									<input
										type="radio"
										name="cns-map-bg-type"
										value="image"
										checked={ settings.bgType === 'image' }
										onChange={ () =>
											set( 'bgType', 'image' )
										}
									/>{ ' ' }
									Image
								</label>
							</div>
							{ settings.bgType === 'color' && (
								<div className="cns-bg-section cns-bg-section--color">
									<input
										type="color"
										className="cns-color-picker"
										value={ settings.bgColor }
										onChange={ ( e ) =>
											set( 'bgColor', e.target.value )
										}
									/>
								</div>
							) }
							{ settings.bgType === 'image' && (
								<div className="cns-bg-section cns-bg-section--image">
									<MediaPicker
										imageId={ settings.bgImageId }
										imageUrl={ settings.bgImageUrl }
										title="Select Background Image"
										onChange={ ( att ) =>
											onChange( ( prev ) => ( {
												...prev,
												bgImageId: att ? att.id : 0,
												bgImageUrl: att ? att.url : '',
											} ) )
										}
									/>
								</div>
							) }
						</div>

						<div className="cns-grid__row">
							<label>
								<input
									type="checkbox"
									checked={ settings.isMaster }
									onChange={ ( e ) =>
										set( 'isMaster', e.target.checked )
									}
								/>{ ' ' }
								MasterMap mode
							</label>
							<p className="description">
								Links to child maps instead of posts. Switches
								Objects/Areas tabs to Hierarchy.
							</p>
						</div>

						<div className="cns-grid__row cns-grid__row__full">
							<label>Thumbnail</label>
							{ settings.thumbnailUrl && (
								<div style={ { marginBottom: 8 } }>
									<img
										src={ settings.thumbnailUrl }
										alt=""
										style={ {
											maxWidth: 120,
											maxHeight: 80,
											display: 'block',
											borderRadius: 4,
											border: '1px solid #ddd',
										} }
									/>
								</div>
							) }
							<div style={ { display: 'flex', gap: 8 } }>
								<button
									type="button"
									className="button"
									onClick={ openThumbnailPicker }
								>
									{ settings.thumbnailId
										? 'Change thumbnail'
										: 'Set thumbnail' }
								</button>
								{ settings.thumbnailId && (
									<button
										type="button"
										className="button"
										onClick={ () =>
											onChange( ( p ) => ( {
												...p,
												thumbnailId: null,
												thumbnailUrl: '',
											} ) )
										}
									>
										Remove
									</button>
								) }
							</div>
							<p className="description">
								Used as the map&rsquo;s featured image in
								listings.
							</p>
						</div>

						<div className="cns-grid__row">
							<label>
								<input
									type="checkbox"
									checked={ settings.featured }
									onChange={ ( e ) =>
										set( 'featured', e.target.checked )
									}
								/>{ ' ' }
								Featured
							</label>
						</div>
 */ }
					</div>
				</div>

				<SettingsCanvas settings={ settings } />
			</div>
		</div>
	);
}
