const path = require('path')

module.exports = {
  "stories": [
    "../../src/**/*.stories.mdx",
    "../../src/**/*.stories.@(js|jsx|ts|tsx|svelte)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-svelte-csf",
    "@storybook/addon-postcss"
  ],
  "svelteOptions": {
    "preprocess": require("../../svelte.config.js").preprocess
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader", options: { modules: true, importLoaders: 1 } },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
            plugins: [
              require('tailwindcss')
            ],
          },
        },
      ],
      include: path.resolve(__dirname, '../../'),
    })
    return config
  }
}