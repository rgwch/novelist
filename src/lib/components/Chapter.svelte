<!--
 ********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************
-->

<script lang="ts">
	import { _ } from 'svelte-i18n';
	import type { metadata_def } from '$lib/services/novel.d';
	import { onMount } from 'svelte';
	export let metadata: metadata_def;

	let container;
	let editor;
	let chaptername;

	onMount(async () => {
		let module = await import('simplemde');
		let SimpleMDE = module.default;
		editor = new SimpleMDE(
			{ element: container,
			autofocus: true,
			spellChecker: false }
			);
		editor.codemirror.on('blur',()=>{
			console.log("blur")
		})
	});
	function addChapter() {
		fetch(`/novel/chapter-${chaptername}.json`, {
			method: 'post',
			body: JSON.stringify({
				title: chaptername,
				text: "# "+chaptername+"\n\n"
			})
		});
	}
</script>

<template>
	<div class="flex gap-4 flex-row">
		<div class="flex-none h-full">
			<ul>
				{#if metadata}
					{#each metadata.chapters as chapter}
						<ul>{chapter}</ul>
					{/each}
				{/if}
				<ul>
					<input
						class="border-2"
						type="text"
						bind:value={chaptername}
						placeholder={$_('book.chaptername')}
					/>
					<span on:click={addChapter} class="bg-green-100 border-2">Neu...</span>
				</ul>
			</ul>
		</div>
		<div class="flex-1 h-full">
			<textarea bind:this={container} />
		</div>
	</div>
</template>

<style lang="scss">
</style>
