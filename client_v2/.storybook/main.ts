import type { StorybookConfig } from '@storybook/svelte-vite';
import path from 'path'
import * as preprocess from 'svelte-windicss-preprocess'
import WindiCSS from "vite-plugin-windicss"

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx|svelte)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": {
    "name": "@storybook/svelte-vite",
    "options": { builder: { viteConfigPath: "./vite.config.ts" } }
  },
  "docs": {
    "autodocs": "tag"
  },
  async viteFinal(config, { configType }) {
    config.plugins = config.plugins ?? [];
    config.plugins.push(
      WindiCSS({
        config: path.join(__dirname, "..", "windi.config.ts")
      })
    )
    return config
  }
};

export default config;