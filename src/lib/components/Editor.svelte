<script lang="ts">
	// import '../node_modules/simplemde/dist/simplemde.min.css';
	import { onMount, setContext } from 'svelte';
	import { set_input_value } from 'svelte/internal';
	let container;
	let editor;
	export let save: (data) => void;
	function setValue(val: string) {
		editor.value(val);
	}

	onMount(async () => {
		let module = await import('simplemde');
		let SimpleMDE = module.default;
		editor = new SimpleMDE({ element: container, autofocus: true, spellChecker: false });
		editor.codemirror.on('blur', () => {
			console.log('blur');
			save(editor.value());
		});
	});
</script>

<template>
	<textarea bind:this={container} />
</template>
