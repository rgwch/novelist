module.exports = {
	rootDir: "../src",
	transform: {
		'^.+\\.svelte$': [
			'svelte-jester',
			{
				preprocess: true,
				compilerOptions: {},
			},
		],
		'^.+\\.ts$': 'ts-jest',
	},
	moduleFileExtensions: ['js', 'ts', 'svelte'],
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', '../.config/jest-setup.ts'],
};
