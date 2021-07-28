<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let title: string = '';
</script>

<template>
	<div class="flex flex-row bg-blue-700 text-white">
		<div class="flex-grow">{title}</div>
		<div
			on:click={() => {
				dispatch('close');
			}}
		>
			<i class="fa fa-window-close" />
		</div>
	</div>
	<slot name="contents" />
</template>
