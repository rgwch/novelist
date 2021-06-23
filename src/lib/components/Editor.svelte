 <script lang="ts">
	import { onMount } from 'svelte';
	let container;
	let editor;
	export let save: (data) => void;

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
