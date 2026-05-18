import { useSelect } from "@wordpress/data";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, SelectControl, Placeholder, Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";

export default function Edit({ attributes, setAttributes }) {
	const { mapId } = attributes;
	const blockProps = useBlockProps({ className: "cns-map-block-editor" });

	const { maps, isLoading } = useSelect((select) => {
		const { getEntityRecords, isResolving } = select(coreStore);
		const records = getEntityRecords("postType", "maps", {
			per_page: -1,
			status: "publish",
			_fields: "id,title",
		});
		return {
			maps: records,
			isLoading: isResolving("getEntityRecords", [
				"postType",
				"maps",
				{ per_page: -1, status: "publish", _fields: "id,title" },
			]),
		};
	}, []);

	const options = [
		{ label: __("— Select a map —", "cns-map-suite"), value: 0 },
		...(maps || []).map((map) => ({
			label: map.title?.rendered || __("(no title)", "cns-map-suite"),
			value: map.id,
		})),
	];

	const selectedMap = (maps || []).find((m) => m.id === mapId);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Map Settings", "cns-map-suite")}>
					{isLoading ? (
						<Spinner />
					) : (
						<SelectControl
							label={__("Select Map", "cns-map-suite")}
							value={mapId}
							options={options}
							onChange={(val) =>
								setAttributes({ mapId: parseInt(val, 10) })
							}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{!mapId ? (
					<Placeholder
						icon="location-alt"
						label={__("CNS Map", "cns-map-suite")}
						instructions={__(
							"Select a map from the block settings panel.",
							"cns-map-suite"
						)}
					/>
				) : (
					<div className="cns-map-block-editor__preview">
						<span className="dashicons dashicons-location-alt" />
						<p>
							{selectedMap
								? selectedMap.title?.rendered
								: __("Map #", "cns-map-suite") + mapId}
						</p>
						<small>
							{__("Rendered on the frontend.", "cns-map-suite")}
						</small>
					</div>
				)}
			</div>
		</>
	);
}
