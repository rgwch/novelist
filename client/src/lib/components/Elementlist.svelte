<script lang="ts">
	import '../../../node_modules/@fortawesome/fontawesome-free/js/solid';
	import '../../../node_modules/@fortawesome/fontawesome-free/js/fontawesome';
	import { _ } from 'svelte-i18n';
	import move from 'array-move';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { load, save, remove, rename, openCurrent } from '../services/fileio';
	export let definition = {
		type: 'chapters',
		newelem: 'book.newchapter',
		promptname: 'book.nochaptername'
	};
	export let metadata;
	export let filter: (elem) => boolean = (elem) => true;

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
		const arr = metadata[definition.type];
		const idx = arr.indexOf(elem);
		metadata[definition.type] = move(arr, idx, idx - 1);
	}
	function down(elem) {
		const arr = metadata[definition.type];
		const idx = arr.indexOf(elem);
		metadata[definition.type] = move(arr, idx, idx + 1);
	}
	async function del(elem) {
		console.log('del ' + elem);
		if (confirm($_('messages.reallydelete', { values: { element: elem } }))) {
			const done = await remove(definition.type, elem);
			if (!done) {
				alert('Could not delete');
			}
			metadata = await openCurrent();
		}
	}
	async function edit(elem) {
		const newtitle = prompt($_(definition.promptname));
		if (newtitle) {
			try {
				metadata = await rename(definition.type, elem, newtitle);
				await openCurrent();
			} catch (err) {
				alert(err);
			}
		}
	}
</script>

<template>
	<div class="h-full" >
		{#if metadata && metadata[definition.type] && Array.isArray(metadata[definition.type])}
			{#each metadata[definition.type] as elem}
				{#if filter(elem)}
					<div class="item relative">
						<div
							class={currentElementName == elem ? 'font-bold' : 'font-normal'}
							on:click={() => select(elem)}
						>
							<span class="z-0">{elem}</span>
							<span class="absolute right-0 px-3 z-10 bg-blue-100">
								<span on:click={() => up(elem)}><i class="fa fa-angle-up " /></span>
								<span on:click={() => down(elem)} class="px-2"
									><i class="fa fa-angle-down" />
								</span>
								<span on:click={() => edit(elem)}><i class="fa fa-edit pointer-events-auto" /></span
								>
								<span on:click={() => del(elem)}><i class="fa fa-trash pointer-events-auto" /></span
								>
							</span>
						</div>
					</div>
				{/if}
			{/each}
		{/if}
		<div class="m-1">
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
