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
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('autoprefixer'),
                require('tailwindcss')
              ],
              include: "../../src"
            }
          }
        }
      ]
    });

    return config;
  }

}