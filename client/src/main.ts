import './lib/services/i18n/i18n'
import App from './App.svelte';


const app = new App({
	target: document.body,

});

export const version = "NOVELIST_VERSION"
console.log("Novelist v." + version)
export default app;
