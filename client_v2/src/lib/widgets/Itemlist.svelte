<!-- @component Lists an Array of items 
    events: selected, edit, delete
-->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import move from 'array-move';
	import { _ } from 'svelte-i18n';

	export let items: Array<string> = [];
	const dispatch = createEventDispatcher();
	let currentItem: string;

	function _move(idx, dir) {
		items = move(items, idx, idx + dir);
	}
	function edit(idx) {
		const newtitle = prompt($_('actions.rename'));
		if (newtitle) {
			dispatch('rename', { old: items[idx], new: newtitle });
		}
	}
</script>

<template>
	<!-- svelte-ignore a11y-click-events-have-key-events -->

	{#each items as elem, idx}
		<div class="item relative">
			<div
				class={currentItem == elem ? 'font-bold' : 'font-normal'}
				on:click={() => dispatch('selected', elem)}
			>
				<span class="z-0">{elem}</span>
				<span class="absolute right-0 px-3 z-10 bg-blue-100">
					<span on:click={() => _move(idx, -1)}
						><i class="fa fa-angle-up " /></span
					>
					<span on:click={() => _move(idx, 1)} class="px-2"
						><i class="fa fa-angle-down" />
					</span>
					<span on:click={() => edit(idx)}
						><i class="fa fa-edit pointer-events-auto" /></span
					>
					<span on:click={() => dispatch('delete', elem)}
						><i class="fa fa-trash pointer-events-auto" /></span
					>
				</span>
			</div>
		</div>
	{/each}
	<div class="flex flex-row m-1">
		<input class="border-2" type="text" bind:value={currentItem} />
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<span
			on:click={() => dispatch('create', currentItem)}
			class="bg-green-400 border-2"
		>
			{$_('general.new')}
		</span>
	</div>
</template>
