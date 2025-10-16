const nodeExternals = require("webpack-node-externals");

module.exports = (options) => {
	return {
		...options,
		externals: [
			nodeExternals({
				// Allow bundling of local workspace libraries
				allowlist: [/^@app\//],
			}),
		],
		target: "node",
		node: {
			__dirname: false,
			__filename: false,
		},
		output: {
			...options.output,
			libraryTarget: "commonjs2",
		},
	};
};
