<script lang="ts">
	import type { metadata_def } from '$lib/services/novel.d';
	import Fieldeditor from '$lib/components/Fieldeditor.svelte';
	import { DateTime } from 'luxon';
	import { _ } from 'svelte-i18n';
	const fields = ['title', 'author', 'created', 'modified', 'expose'];
	import { current, saveMetadata } from '$lib/services/fileio';
	// import { listFiles } from '$lib/services/fileio';
	import globals from '$lib/global';

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
	async function open(file = undefined) {
		let filename = file;
		if (!filename) {
			filename = bookname.value;
		}
		console.log('book: Open ' + filename);
		const res = await fetch(`/novel/open-${filename}.json`);
		if (res.ok) {
			const result = await res.json();
			if (result.result !== 'fail') {
				console.log(JSON.stringify(result));
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

	async function listFiles(): Promise<Array<string>> {
		const res = await fetch('/novel/listfiles.json');
		if (res.ok) {
			const result = await res.json();
			return result.result;
		} else {
			return [];
		}
	}
	/*
	async function listFiles() : Promise<Array<string>>{
		return ["a","b","c"]
	}
*/
</script>

<template>
	{#if metadata}
		<Fieldeditor {fields} entity={metadata} on:save={saveBook} />
		<hr class="py-4" />
		<button class="btn">Generate PDF</button>
		<button class="btn">Generate eBook</button>
		<span role="button" class="btn" on:click={close}>{$_('general.close')}</span>
	{:else}
		<h1>{$_('book.open')}</h1>
		{#await listFiles() then files}
			<ul>
				{#each files as file}
					<li class="item" on:click={() => open(file)}>{file}</li>
				{/each}
			</ul>
		{/await}

		<input class="border-solid border-1" type="text" id="name" bind:this={bookname} />
		<button class="btn" on:click={open}>{$_('general.open')}</button>
	{/if}
</template>
