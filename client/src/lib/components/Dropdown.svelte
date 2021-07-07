<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { current } from '../services/fileio';
	export let definition = {
		type: 'chapters',
		newelem: 'book.newchapter',
		promptname: 'book.nochaptername'
	};

	let metadata = $current;
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
			const elem = prompt('Name ');
			const arr = definition.type;
			if (elem) {
				fetch(`/novel/${arr}-${elem}.json`, {
					method: 'post',
					body: JSON.stringify({ name: elem })
				})
					.then((ok) => {
						metadata[arr] = [...metadata[arr], elem];
						value = elem;
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
