export default function HierarchyPanel() {
	return (
		<div className="cns-tab-panel cns-tab-panel--active" data-panel="hierarchy" role="tabpanel">
			<div className="cns-placeholder">
				<span className="dashicons dashicons-networking cns-placeholder__icon"></span>
				<h3>Map Hierarchy</h3>
				<p>Define regions on this MasterMap that link to child maps. Hovering a region shows the child map's thumbnail and excerpt; clicking navigates to it.</p>
				<p className="cns-placeholder__tag">— Coming soon —</p>
			</div>
		</div>
	);
}
