module.exports = {
	env: {
		browser: true,
		es2020: true,
		node: true,
	},
	extends: [
		"airbnb-base",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/typescript",
		"prettier/@typescript-eslint",
		"plugin:prettier/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"import/prefer-default-export": "off",
		"prettier/prettier": "off",
		"no-unused-vars": "off",
		"no-console": "off",
		"import/extensions": [
			"error",
			"ignorePackages",
			{
				js: "never",
				jsx: "never",
				ts: "never",
				tsx: "never",
			},
		],
	},
};
