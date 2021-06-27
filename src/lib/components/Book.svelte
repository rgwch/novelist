<script lang="ts">
	import type { metadata_def } from '$lib/services/novel.d';
	import Fieldeditor from '$lib/components/Fieldeditor.svelte';
	import { DateTime } from 'luxon';
	import { _ } from 'svelte-i18n';
	export let metadata: metadata_def;
	const fields = ['title', 'author', 'created', 'modified', 'expose'];

	let bookname;
	function saveMetadata(event) {}
	function close() {
		fetch('/novel/close.json').then((res) => {
			if (res.ok) {
				metadata = undefined;
			}
		});
	}
	async function open() {
		console.log('book: Open ' + bookname.value);
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
		<Fieldeditor {fields} entity={metadata} on:save={saveMetadata} />
		<span role="button" on:click={close}>Close</span>
	{:else}
		<h1>{$_('book.open')}</h1>
		<input class="border-solid border-1" type="text" id="name" bind:this={bookname} />
		<button class="bg-green-300" on:click={open}>{$_('general.open')}</button>
	{/if}
</template>
