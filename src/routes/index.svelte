
<script lang="ts">
	import '$lib/services/i18n/i18n';
	
	import { onMount } from 'svelte';
	import type { metadata_def } from '$lib/services/novel.d';
	import '../../node_modules/simplemde/dist/simplemde.min.css';
	import Chapter from '$lib/components/Chapter.svelte';
	import { _ } from 'svelte-i18n';
	
	
	let metadata;

	const visible = {
		chapter: 'invisible',
		persons: 'invisible',
		places: 'invisible'
	};

	function toggle(elem) {
		visible[elem] = visible[elem] === 'visible' ? 'invisible' : 'visible';
	}
	onMount(async () => {
		const res = await fetch('/novel/metadata.json');
		if (res.ok) {
			const md = await res.json();
			metadata = md.metadata;
		}
		/*
		if (!editor) {
			let module = await import('simplemde');
			let SimpleMDE = module.default;
			editor = new SimpleMDE({ element: ed_chapter });
		}
		*/
	});

	let bookname;
	async function openbook() {
		console.log('Open ' + bookname.value);
		const res = await fetch(`/novel/open-${bookname.value}.json`);
		if (res.ok) {
			const result = await res.json();
			if (result.result !== 'fail') {
				metadata = result.result;
				console.log('metadata=' + metadata);
			}
		}
	}
</script>

<template>
	{#if metadata}
		<p>{JSON.stringify(metadata)}</p>
		<h1 class="h1">
			{metadata.title}, {$_('general.created')}: {new Date(metadata.created).toString()}
		</h1>
	{:else}
		<h1>Open Book</h1>
		<input class="border" type="text" id="name" bind:this={bookname} />
		<button class="bg-green-300" on:click={openbook}>{$_('general.open')}</button>
	{/if}
	<br />
	<span
		role="button"
		on:click={() => {
			toggle('chapter');
		}}>Editor</span
	>
	<div class={visible.chapter}>
		<Chapter {metadata} />
	</div>
</template>
