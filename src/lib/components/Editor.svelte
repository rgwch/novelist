<script lang="ts">
	// import '../node_modules/simplemde/dist/simplemde.min.css';
	import '../../../node_modules/simplemde/dist/simplemde.min.css';
	import { onDestroy, onMount, setContext } from 'svelte';

	let container;
	let editor;
	export let save: (data) => void;
	export let contents: string;

	$: setValue(contents);

	function setValue(val: string) {
		if (editor) {
			editor.value(val);
		}
	}
	onMount(async () => {
		let module = await import('simplemde');
		let SimpleMDE = module.default;
		editor = new SimpleMDE({
			element: container,
			autofocus: true,
			spellChecker: false,
			autosave: { enabled: true, uniqueId: new Date().toString() }
		});
		editor.codemirror.on('blur', () => {
			console.log('Editor: blur');
			save(editor.value());
		});
	});
</script>

<template>
	<textarea bind:this={container} />
</template>

<style>
	:global(.CodeMirror, .CodeMirror-scroll) {
		max-height: 300px;
	}
</style>
