import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
	...nextCoreWebVitals,
	...nextTypescript,
	{
		name: 'moon-charm/overrides',
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'react-hooks/set-state-in-effect': 'off',
		},
	},
];

export default config;
