<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	const dispatch = createEventDispatcher();

	export let fields: Array<string> = [];
	export let entity: any = {};
	export let actions = false;

	function toDisplay(elem) {
		return $_('fields.' + elem);
	}
	function change(field) {
		// console.log(field, local[field]);
		// entity[field] = local[field];
	}
	onMount(() => {
		for (let field of fields) {
			entity[field] = entity[field] || '';
		}
	});
	onDestroy(async () => {
		console.log('closing fieldeditor');
		dispatch('save', entity);
	});
</script>

<template>
	<div>
		<table class="m-4 p-2 border-collapse table-auto">
			{#if entity}
				{#each fields as field}
					<tr>
						<td class="pr-4 ">{toDisplay(field)}</td>
						<td class="pl-4">
							<input
								class="border focus:outline-none focus:ring-2 focus:ring-blue-400"
								bind:value={entity[field]}
								on:blur={() => change(field)}
							/>
						</td>
					</tr>
				{/each}
			{/if}
		</table>
		<hr />
		{#if actions}
			<span role="button" class="btn" on:click={() => dispatch('delete', entity)}>
				{$_('actions.delete')}
			</span>
			<span role="button" class="btn" on:click={() => dispatch('save', entity)}
				>{$_('actions.save')}</span
			>
		{/if}
	</div>
</template>
