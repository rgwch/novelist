<script lang="ts">
	import type { metadata_def } from '$lib/services/novel.d';
	import Fieldeditor from '$lib/components/Fieldeditor.svelte';
	import { DateTime } from 'luxon';
	import { _ } from 'svelte-i18n';
	const fields = ['title', 'author', 'created', 'modified', 'expose'];
	import { current, saveMetadata } from '$lib/services/fileio';

	let bookname;
	let metadata;
	current.subscribe((value) => {
		console.log('Update ' + value);
		metadata = value;
	});
	function saveBook(event) {
		saveMetadata(metadata);
	}
	function close() {
		try {
			fetch('/novel/close.json').then((res) => {
				if (res.ok) {
					current.set(undefined);
				}
			});
		} catch (err) {
			alert(err);
		}
	}
	async function open() {
		console.log('book: Open ' + bookname.value);
		const res = await fetch(`/novel/open-${bookname.value}.json`);
		if (res.ok) {
			const result = await res.json();
			if (result.result !== 'fail') {
				current.set(result.result);
				setTimeout(() => {
					console.log('metadata=' + JSON.stringify(metadata));
				}, 100);
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
		<Fieldeditor {fields} entity={metadata} on:save={saveBook} />
		<hr class="py-4" />
		<span role="button" class="ring-2 bg-blue-200 px-3 mx-1" on:click={close}>{$_('general.close')}</span>
	{:else}
		<h1>{$_('book.open')}</h1>
		<input class="border-solid border-1" type="text" id="name" bind:this={bookname} />
		<button class="bg-green-300" on:click={open}>{$_('general.open')}</button>
	{/if}
</template>
