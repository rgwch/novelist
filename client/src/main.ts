/**
 * Entry point of the app
 */
import './lib/services/i18n/i18n'
import App from './App.svelte';
import props from './lib/services/properties'

const prod = props.production === "true" ? "production" : "development"
console.log(`Novelist v.${props.version}, built: ${props.build}, running in ${prod} mode`)
const app = new App({
	target: document.body,

});


export default app;
