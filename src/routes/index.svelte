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
	import { _ } from 'svelte-i18n';
	import { writable } from 'svelte/store';

	export const metadata=writable({})

	const visible = {
		book: true,
		chapter: false,
		persons: false,
		places: false
	};

	function toggle(elem) {
		visible[elem] = !visible[elem];
	}
	/*
	onMount(async () => {
		const res = await fetch('/novel/metadata.json');
		if (res.ok) {
			const md = await res.json();
			metadata = md.metadata;
		}
	});
	*/
</script>

<template>
	<span
		role="button"
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
		on:click={() => {
			toggle('chapter');
		}}>{$_('book.chapter')}</span
	>
	<span role="button" on:click={() => toggle('persons')}>
		{$_('book.persons')}
	</span>
	<span role="button" on:click={() => toggle('places')}>
		{$_('book.places')}
	</span>
	{#if visible.book}
		<Book {metadata} />
	{/if}
	<br />

	{#if visible.chapter}
		<div>
			<Chapter {metadata} />
		</div>
	{/if}

	{#if visible.persons}
		<div class="border-solid"><Person {metadata} /></div>
	{/if}

	{#if visible.places}
		<div><Place {metadata} /></div>
	{/if}
</template>
