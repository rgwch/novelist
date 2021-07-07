<script lang="ts">
		import { _ } from 'svelte-i18n';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { current } from '../services/fileio';
	export let definition = {
		type: 'chapters',
		newelem: 'book.newchapter',
		promptname: 'book.nochaptername'
	};

	let currentElementName: string;
	let metadata = $current;

	let newelement: string;
	function addElement() {
		if (newelement) {
			const arr = definition.type;
			fetch(`/novel/${arr}-${newelement}.json`, {
				method: 'post',
				body: JSON.stringify({ name: newelement })
			})
				.then((ok) => {
					metadata[arr] = [...metadata[arr], newelement];
					newelement = '';
				})
				.catch((err) => {
					alert(err);
				});
		} else {
			alert($_(definition.promptname));
		}
	}
	function select(item) {
		currentElementName = item;
		dispatch('selected', item);
	}
</script>

<template>
	{#if metadata && metadata[definition.type] && Array.isArray(metadata[definition.type])}
		{#each metadata[definition.type] as elem}
			<div class="item">
				<div
					class={currentElementName == elem ? 'font-bold' : 'font-normal'}
					on:click={() => select(elem)}
				>
					{elem}
				</div>
			</div>
		{/each}
	{/if}
	<div>
		<input
			class="border-2"
			type="text"
			bind:value={newelement}
			placeholder={$_(definition.newelem)}
		/>
		<span on:click={addElement} class="bg-green-100 border-2">Neu...</span>
	</div>
</template>
