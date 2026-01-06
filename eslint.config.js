export default [
	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				window: 'readonly',
				document: 'readonly',
				console: 'readonly',
			},
		},
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'error',
			eqeqeq: ['error', 'always'],
		},
	},
];
