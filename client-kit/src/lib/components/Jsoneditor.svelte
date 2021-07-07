<script lang="ts">
	import '../../../node_modules/jsoneditor/dist/jsoneditor.min.css';
	import { onMount } from 'svelte';

	export let json;
	export let title;
	let container;
	const options = {
		modes: ['form', 'text'],
		enableSort: false,
		name: title
	};
	let editor;
	onMount(async () => {
        let module=await import('jsoneditor')
        let jsoneditor=module.default
		editor = new jsoneditor(container, options, json);
		editor.expandAll();
	});
</script>

<template>
	<div class="editor" bind:this={container} />
</template>

<style lang="scss">
	.editor {
		width: 100%;
		height: 70vh;
		overflow-y: scroll;
	}
</style>
