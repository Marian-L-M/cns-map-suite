const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: async () => {
		// defaultConfig.entry is a function in wp-scripts v26+; call it to get
		// the auto-detected block entry points, then merge in the admin bundle.
		const blockEntries = await defaultConfig.entry();
		return {
			...blockEntries,
			'admin/index': './src/admin/index.js',
		};
	},
};
