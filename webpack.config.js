module.exports = (options) => {
	return {
		...options,
		externals: {
			// Mark Node.js built-in modules as external
			crypto: "commonjs crypto",
		},
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
