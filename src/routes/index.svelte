<script lang="ts">
	import { stringify } from 'postcss';
	import { onMount } from 'svelte';
	import '../../node_modules/simplemde/dist/simplemde.min.css';
	export async function load({ page, fetch, session, context }) {
		const res = await fetch('/novel/metadata.json');
		if (res.ok) {
			metadata = await res.json();
		}
	}
	let metadata;
	let container;
	let editor;
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
	<p>${JSON.stringify(metadata)}</p>
	<textarea id=".editor" bind:this={container} />
</template>
