<script lang="ts">
	import { load as extload } from '$lib/fileio';
	import { onMount } from 'svelte';
	import '../../node_modules/simplemde/dist/simplemde.min.css';
	let container;
	let editor;
	let load = async function () {
		const text = await extload();
		editor.value(text);
		console.log('switched to ' + text);
	};
	onMount(async () => {
		const module = await import('simplemde');
		const SimpleMDE = module.default;
		editor = new SimpleMDE({ element: container });
		// editor.value('Hello, world');
	});
</script>

<template>
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	<textarea id=".editor" bind:this={container} />
	<button on:click={load}>Load</button>
</template>
