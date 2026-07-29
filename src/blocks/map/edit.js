import { useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ComboboxControl, Placeholder } from "@wordpress/components";
import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";

const STATUS_LABELS = {
	draft: __("Draft", "cns-map-suite"),
	private: __("Private", "cns-map-suite"),
};

function mapLabel(record) {
	const title =
		decodeEntities(record.title?.rendered || "") ||
		__("(no title)", "cns-map-suite");
	const status = STATUS_LABELS[record.status];
	return status ? `${title} — ${status}` : title;
}

export default function Edit({ attributes, setAttributes }) {
	const { mapId } = attributes;
	const blockProps = useBlockProps({ className: "cns-map-block-editor" });
	const [search, setSearch] = useState("");

	const { map, searchResults, isSearching } = useSelect(
		(select) => {
			const { getEntityRecord, getEntityRecords, isResolving } =
				select(coreStore);
			const query = {
				per_page: 20,
				status: ["publish", "draft", "private"],
				_fields: "id,title,status",
				...(search ? { search } : {}),
			};
			return {
				map: mapId ? getEntityRecord("postType", "maps", mapId) : null,
				searchResults: getEntityRecords("postType", "maps", query),
				isSearching: isResolving("getEntityRecords", [
					"postType",
					"maps",
					query,
				]),
			};
		},
		[mapId, search]
	);

	const options = [
		// Keep the current selection visible even when it doesn't match the search.
		...(mapId && map ? [{ value: String(mapId), label: mapLabel(map) }] : []),
		...(searchResults ?? [])
			.filter((r) => r.id !== mapId)
			.map((r) => ({ value: String(r.id), label: mapLabel(r) })),
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Map Settings", "cns-map-suite")}>
					<ComboboxControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__("Map", "cns-map-suite")}
						placeholder={__("Search maps…", "cns-map-suite")}
						value={mapId ? String(mapId) : null}
						options={options}
						onFilterValueChange={setSearch}
						onChange={(value) =>
							setAttributes({ mapId: parseInt(value ?? "", 10) || 0 })
						}
						allowReset
						help={
							isSearching
								? __("Searching…", "cns-map-suite")
								: __("Type to search maps by title.", "cns-map-suite")
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{!mapId ? (
					<Placeholder
						icon="location-alt"
						label={__("CNS Map", "cns-map-suite")}
						instructions={__(
							"Pick a map in the block settings panel.",
							"cns-map-suite"
						)}
					/>
				) : (
					<div className="cns-map-block-editor__preview">
						<span className="dashicons dashicons-location-alt" />
						<p>
							{map
								? decodeEntities(map.title?.rendered || "") ||
								  __("(no title)", "cns-map-suite")
								: __("Map #", "cns-map-suite") + mapId}
						</p>
						<small>{__("Rendered on the frontend.", "cns-map-suite")}</small>
					</div>
				)}
			</div>
		</>
	);
}
