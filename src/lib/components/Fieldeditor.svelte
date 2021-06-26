<script lang="ts">
	import { _ } from 'svelte-i18n';
	export let fields: Array<string> = [];
	export let entity: any = {};

	let local = {};
	
	$: local=entity

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
	<table>
		{#if entity}
			{#each fields as field}
				<tr>
					<td class="pr-4 ">{toDisplay(field)}</td>
					<td class="focus:outline-black pl-4">
						<span contenteditable="true" bind:innerHTML={local[field]} on:blur={()=>change(field)} />
					</td>
				</tr>
			{/each}
		{/if}
	</table>
</template>
