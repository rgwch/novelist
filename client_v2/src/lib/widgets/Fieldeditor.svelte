<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { DateTime } from 'luxon';
	const dispatch = createEventDispatcher();

	export let fields: Array<string | { label: string; type: string }> = [];
	export let entity: any = {};
	const _fields = [];

	function toDisplay(elem) {
		return $_('fields.' + elem);
	}
	onMount(() => {
		for (let field of fields) {
			if (typeof field == 'string') {
				_fields.push({ label: field, type: 'string' });
				entity[field] = entity[field] || '';
			} else {
				_fields.push(field);
				entity[field.label] = entity[field.label] || '';
			}
		}
	});
	onDestroy(async () => {
		// console.log('closing fieldeditor');
		dispatch('save', entity);
	});
	function todate(s) {
		const dt = DateTime.fromISO(s);
		return dt.toFormat($_('adapters.datetime_format'));
	}
</script>

<div>
	<table class="mt-1 p-2 border-collapse table-fixed w-full">
		{#if entity}
			{#each _fields as field}
				<tr>
					<td class="pr-4 w-1/3 lg:w-1/4"
						>{toDisplay(field.label)}</td>
					<td class="pl-4">
						{#if field.type === 'text'}
							<textarea
								class="border focus:outline-none focus:ring-2 focus-ring-blue-600 w-full"
								bind:value={entity[field.label]} />
						{:else if field.type === 'date'}
							<input
								class="border focus-ring-blue-600"
								type="date"
								bind:value={entity[field.label]} />
						{:else if field.type === 'datetime'}
							<span>{todate(entity[field.label])}</span>
						{:else}
							<input
								class="border focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
								bind:value={entity[field.label]} />
						{/if}
					</td>
				</tr>
			{/each}
		{/if}
	</table>
</div>
