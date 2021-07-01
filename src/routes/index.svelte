<!-- 
*********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ******************************************** 
-->
<script lang="ts">
	import '$lib/services/i18n/i18n';

	import Book from '$lib/components/Book.svelte';
	import { onMount } from 'svelte';
	import type { metadata_def, noveldef } from '$lib/services/novel.d';
	import Chapter from '$lib/components/Chapter.svelte';
	import Person from '$lib/components/Person.svelte';
	import Place from '$lib/components/Place.svelte';
	import Notes from '$lib/components/Notes.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import Split from 'split-grid';

	import { _ } from 'svelte-i18n';
	import { current, openCurrent } from '$lib/services/fileio';

	let metadata;
	let column1;

	onMount(async () => {
		current.subscribe((value) => {
			metadata = value;
			if (!metadata) {
				visible.book = true;
				visible.chapter = false;
				visible.persons = false;
				visible.places = false;
				visible.notes = false;
			}
		});

		await openCurrent();
		Split({
			columnGutters: [
				{
					track: 1,
					element: column1
				}
			]
		});
	});
	let visible = {
		book: true,
		chapter: false,
		persons: false,
		places: false,
		notes: false
	};

	function toggle(elem) {
		visible[elem] = !visible[elem];
	}
</script>

<template>
	<Menu bind:visible />
	<div class="gridd">
		<div class="bg-green-200">
			{#if visible.book}
				<Book />
			{/if}
			{#if visible.chapter}
				<div>
					<Chapter />
				</div>
			{/if}
		</div>
		<div class="gutter" bind:this={column1} />
		<div class="bg-blue-200">
			{#if visible.persons}
				<div class="border-solid"><Person /></div>
			{/if}
			{#if visible.places}
				<div><Place /></div>
			{/if}
			{#if visible.notes}
				<div><Notes /></div>
			{/if}
		</div>
	</div>
</template>

<style>
	.gridd {
		display: grid;
		grid-template-columns: 3fr 10px 2fr;
	}
	.gutter {
		grid-area: 1 / 2 / 1 / 2;
		border: solid 2px red;
	}
</style>
