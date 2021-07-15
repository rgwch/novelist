<script lang="ts">
	import '../../../node_modules/@fortawesome/fontawesome-free/js/solid';
	import '../../../node_modules/@fortawesome/fontawesome-free/js/fontawesome';
	import { _ } from 'svelte-i18n';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { save } from '../services/fileio';
	export let definition = {
		type: 'chapters',
		newelem: 'book.newchapter',
		promptname: 'book.nochaptername'
	};
	export let metadata;

	let currentElementName: string;

	let newelement: string;
	async function addElement() {
		if (newelement) {
			const arr = definition.type;
			const result = await save(arr, { name: newelement });
			if (result) {
				metadata[arr] = [...metadata[arr], newelement];
				newelement = '';
			} else {
				alert('Error');
			}
		} else {
			alert($_(definition.promptname));
		}
	}
	function select(item) {
		currentElementName = item;
		dispatch('selected', item);
	}
	function up(elem) {
		alert(up);
	}
	function down(elem) {}
	function del(elem) {}
</script>

<template>
	<div class="max-h-full">
		{#if metadata && metadata[definition.type] && Array.isArray(metadata[definition.type])}
			{#each metadata[definition.type] as elem}
				<div class="item relative">
					<div
						class={currentElementName == elem ? 'font-bold' : 'font-normal'}
						on:click={() => select(elem)}
					>
						{elem}
						<span class="absolute right-0 px-3 z-10 bg-blue-100">
							<i class="fa fa-angle-up" on:click={() => up(elem)} />
							<i class="fas fa-angle-down" />
							<i class="fa fa-trash" />
						</span>
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
			<span on:click={addElement} class="bg-green-400 border-2">Neu...</span>
		</div>
	</div>
</template>
