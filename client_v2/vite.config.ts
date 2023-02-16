import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import filterReplace from "vite-plugin-filter-replace";
const infos = require('./package.json')
import WindiCSS from 'vite-plugin-windicss'
const production = process.env.NODE_ENV != "development"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), WindiCSS(),
  filterReplace.default(
    [
      {
        filter: ['src/lib/services/properties.ts'],
        replace: [{
          from: "isproduction",
          to: production.toString(),
        }, {
          from: "NOVELIST_VERSION",
          to: infos.version,
        }, {
          from: "NOVELIST_BUILDDATE",
          to: new Date().toISOString()
        }]
      }]
  )]
})

