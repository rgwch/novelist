<script lang="ts">
	import { onMount } from 'svelte';
    export let metadata
	let container;
	let editor;

	onMount(async () => {
		let module = await import('simplemde');
		let SimpleMDE = module.default;
		editor = new SimpleMDE({ element: container });
	});
</script>

<template>
	<div class="flex gap-4 flex-row">
		<div class="flex-none h-full">
            <p>Kapitel</p>
			<ul>
				{#if metadata}
                {#each metadata.chapters as chapter}
                   <ul>{chapter}</ul> 
                {/each}
				{:else}
				<ul>Neu...</ul>
				{/if}
			</ul>
		</div>
		<div class="flex-1 h-full">
			<textarea bind:this={container} />
		</div>
	</div>
</template>

<style lang="scss">
</style>
