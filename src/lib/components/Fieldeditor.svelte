<script lang="ts">
	export let fields: Array<string> = [];
	export let entity: any = {};
</script>

<template>
	<table>
		{#if entity}
			{#each fields as field}
				<tr>
					<td>{field}</td>
					<td>{entity[field]}</td>
				</tr>
			{/each}
		{/if}
	</table>
</template>
