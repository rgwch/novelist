/**
 * Copyright @see LICENSE file
 */
import './lib/services/i18n/i18n'
import App from './App.svelte'
import 'virtual:windi.css'

const app = new App({
  target: document.getElementById('app'),
})

export default app
