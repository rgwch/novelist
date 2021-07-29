<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let title: string = '';
</script>

<template>
	<div class="border-2 border-blue-800 border-solid p-1">
		<div class="flex flex-row bg-blue-700 text-white">
			<div class="flex-grow px-2">{title}</div>
			<div
				class="px-2"
				on:click={() => {
					dispatch('close');
				}}
			>
				<i class="fa fa-window-close" />
			</div>
		</div>
		<slot name="contents" />
	</div>
</template>
