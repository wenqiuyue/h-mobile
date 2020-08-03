module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true,
		node: true
	},
	extends: ['plugin:vue/essential', 'airbnb-base', '@vue/prettier'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
		parser: 'babel-eslint'
	},
	plugins: ['vue'],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		strict: 'error',
		'import/prefer-default-export': 'off',
		'import/no-extraneous-dependencies': 'off',
		'no-param-reassign': 'off',
		'import/newline-after-import': 'off',
		'import/first': 'off'
	}
};
