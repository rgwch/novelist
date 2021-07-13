module.exports= {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: "../src",
  moduleFileExtensions: ['js', 'ts', 'svelte', 'json'],
  testMatch: [
    //   "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  transform:{
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(svelte|css)$": [
      'svelte-jester',
      {
        "preprocess": true,
        compilerOptions: {
        }
      }
    ]
  }

}