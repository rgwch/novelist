<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let fields: Array<string> = [];
	export let entity: any = {};

	let local = {};

	$: local = entity;

	for (let field of fields) {
		local[field] = entity[field] ? entity[field] : '';
	}

	function toDisplay(elem) {
		return $_('fields.' + elem);
	}
	function change(field) {
		console.log(field, local[field]);
	}
</script>

<template>
	<div>
		<table m-24 p-4>
			{#if entity}
				{#each fields as field}
					<tr>
						<td class="pr-4 ">{toDisplay(field)}</td>
						<td class="border border-solid border-black-400 focus:outline-black pl-4">
							<span class="border border-solid"
								contenteditable="true"
								bind:innerHTML={local[field]}
								on:blur={() => change(field)}
							/>
						</td>
					</tr>
				{/each}
			{/if}
		</table>
		<hr />
		<span role="button" class="btn" on:click={() => dispatch('save', local)}
			>{$_('general.save')}</span
		>
	</div>
</template>
