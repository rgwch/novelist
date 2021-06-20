<script lang="ts">
	import { onMount } from 'svelte';
	import '../../node_modules/simplemde/dist/simplemde.min.css';
	let container;
	onMount(async () => {
		const module = await import('simplemde');
		const SimpleMDE = module.default;
		const editor = new SimpleMDE({ element: container });
		editor.value('Hello, world');
	});
</script>

<template>
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	<textarea id=".editor" bind:this={container} />
</template>
