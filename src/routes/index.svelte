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

	import { _ } from 'svelte-i18n';
	import { current, openCurrent } from '$lib/services/fileio';
	
	let metadata;

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
	});
	const visible = {
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
	<Menu {visible}></Menu>
	<div class="border-solid border-1 border-blue-100 pb-5">
		<span
			role="button"
			class="btn"
			on:click={() => {
				toggle('book');
			}}
		>
			{#if metadata}
				{metadata.title}
			{:else}
				{$_('book.title')}
			{/if}
		</span>
		<span
			role="button"
			class="btn"
			on:click={() => {
				toggle('chapter');
			}}>{$_('book.chapter')}</span
		>
		<span role="button" class="btn" on:click={() => toggle('persons')}>
			{$_('book.persons')}
		</span>
		<span role="button" class="btn" on:click={() => toggle('places')}>
			{$_('book.places')}
		</span>
		<span role="button" class="btn" on:click={() => toggle('notes')}>
			{$_('book.notes')}
		</span>
	</div>
	{#if visible.book}
		<Book />
	{/if}
	{#if visible.chapter}
		<div>
			<Chapter />
		</div>
	{/if}
	{#if visible.persons}
		<div class="border-solid"><Person /></div>
	{/if}
	{#if visible.places}
		<div><Place /></div>
	{/if}
	{#if visible.notes}
		<div><Notes /></div>
	{/if}
</template>
