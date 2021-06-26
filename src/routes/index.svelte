<!-- 
*********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ******************************************** 
-->
<script lang="ts">
	import '$lib/services/i18n/i18n';
	import { DateTime } from 'luxon';

	import { onMount } from 'svelte';
	import type { metadata_def, noveldef } from '$lib/services/novel.d';
	import '../../node_modules/simplemde/dist/simplemde.min.css';
	import Chapter from '$lib/components/Chapter.svelte';
	import Person from '$lib/components/Person.svelte';
	import Place from '$lib/components/Place.svelte';
	import { _ } from 'svelte-i18n';
	import Persons from './persons.svelte';

	let metadata: metadata_def;

	const visible = {
		chapter: false,
		persons: false,
		places: false
	};

	function toggle(elem) {
		visible[elem] = !visible[elem];
	}
	onMount(async () => {
		const res = await fetch('/novel/metadata.json');
		if (res.ok) {
			const md = await res.json();
			metadata = md.metadata;
		}
	});

	let bookname;
	async function openbook() {
		console.log('index: Open ' + bookname.value);
		const res = await fetch(`/novel/open-${bookname.value}.json`);
		if (res.ok) {
			const result = await res.json();
			if (result.result !== 'fail') {
				metadata = result.result;
				console.log('metadata=' + metadata);
			}
		}
	}
	function dateText(d: Date) {
		const dt = DateTime.fromJSDate(d);
		return dt.toLocaleString();
	}
</script>

<template>
	{#if metadata}
		<h1>
			{metadata.title}
		</h1>
		<span>{$_('general.created')}: {dateText(new Date(metadata.created))}</span>
	{:else}
		<h1>{$_('book.open')}</h1>
		<input class="border-solid border-1" type="text" id="name" bind:this={bookname} />
		<button class="bg-green-300" on:click={openbook}>{$_('general.open')}</button>
	{/if}
	<br />
	<span
		role="button"
		on:click={() => {
			toggle('chapter');
		}}>{$_('book.chapter')}</span
	>
	{#if visible.chapter}
		<div>
			<Chapter {metadata} />
		</div>
	{/if}
	<span role="button" on:click={() => toggle('persons')}>
		{$_('book.persons')}
	</span>
	{#if visible.persons}
		<div class="border-solid"><Person {metadata} /></div>
	{/if}

	<span role="button" on:click={() => toggle('places')}>
		{$_('book.places')}
	</span>
	{#if visible.places}
		<div><Place {metadata} /></div>
	{/if}
</template>
