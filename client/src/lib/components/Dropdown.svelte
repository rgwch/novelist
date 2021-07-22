<!-- 
	@component
	A dropdown list. Dispatches a 'selected' event if user changes selection.
	Allows to create new Elements.
  Dispatches 'select' if selection changes
	
-->
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { current, save } from '../services/fileio';
	export let definition = {
		type: 'chapters',
		newelem: 'book.newchapter',
		promptname: 'book.nochaptername'
	};
	export let metadata: metadata_def;

	let value;

	onMount(() => {
		if (metadata) {
			const elements = metadata[definition.type];
			if (Array.isArray(elements) && elements.length > 0) {
				dispatch('selected', elements[0]);
			}
		}
	});

	function select() {
		if (value === '_new') {
			value = prompt('Name ');
			const arr = definition.type;
			if (value) {
				save(arr, { name: value })
					.then((ok) => {
						metadata[arr] = [...metadata[arr], value];
						dispatch('selected', value);
					})
					.catch((err) => {
						alert(err);
					});
			} else {
				alert($_(definition.promptname));
				value = metadata[arr][0];
			}
		} else {
			dispatch('selected', value);
		}
	}
</script>

<template>
	{#if metadata && metadata[definition.type] && Array.isArray(metadata[definition.type])}
		<!-- svelte-ignore a11y-no-onchange -->
		<select class="w-full item" bind:value on:change={select} on:click={select}>
			{#each metadata[definition.type] as elem}
				<option value={elem} class="item">
					{elem}
				</option>
			{/each}
			<option value="_new">{$_('general.new')}...</option>
		</select>
	{/if}
</template>
