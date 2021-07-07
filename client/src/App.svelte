<script lang="ts">
	import Book from './lib/components/Book.svelte';
	import { onMount } from 'svelte';
	import Chapter from './lib/components/Chapter.svelte';
	import Person from './lib/components/Person.svelte';
	import Place from './lib/components/Place.svelte';
	import Notes from './lib/components/Notes.svelte';
	import Menu from './lib/components/Menu.svelte';

	import { _ } from 'svelte-i18n';
	import { current, openCurrent } from './lib/services/fileio';

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
	})

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
	<div class="fixed mt-8 px-5 overflow-y-auto bg-green-100 h-full w-screen">
		<div class="flex flex-col md:flex-row">
			<div>
				{#if visible.chapter}
					<div>
						<Chapter />
					</div>
				{/if}
			</div>
			<div>
				{#if visible.book}
					<Book />
				{/if}

				{#if visible.persons}
					<div><Person {metadata} /></div>
				{/if}
				{#if visible.places}
					<div><Place {metadata} /></div>
				{/if}
				{#if visible.notes}
					<div><Notes /></div>
				{/if}
			</div>
		</div>
	</div>
</template>

<!-- template>
	<Menu bind:visible />
	<div class="gridd">
		<div>
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
		<div class="bg-blue-100">
			{#if visible.persons}
				<div><Person {metadata} /></div>
			{/if}
			{#if visible.places}
				<div><Place {metadata} /></div>
			{/if}
			{#if visible.notes}
				<div><Notes /></div>
			{/if}
		</div>
	</div>
</template -->
<style>
	/*
	.gridd {
		display: grid;
		grid-template-columns: 3fr 6px 2fr;
		padding: 10px;
	}
	.gutter {
		grid-area: 1 / 2 / 1 / 2;
		border: solid 1px black;
	}
  */
</style>
