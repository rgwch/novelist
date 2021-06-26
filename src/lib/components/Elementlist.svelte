<script lang="ts">
	import type { metadata_def } from '$lib/services/novel.d';
	import { _ } from 'svelte-i18n';
	import { select_multiple_value } from 'svelte/internal';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let definition = {
		type: 'chapters',
		newelem: 'book.newchapter',
		promptname: 'book.nochaptername'
	};

	export let metadata: metadata_def;
	
	let currentElementName: string;

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
	{#if metadata}
		{#each metadata[definition.type] as elem}
			<div
				class="cursor-pointer border-solid border-2 border-rounded-x1 m-1 bg-gray-100 hover:bg-gray-400"
			>
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
