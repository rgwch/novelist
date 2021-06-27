<!--
 ********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************
-->
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Elementlist from '$lib/components/Elementlist.svelte';
	import Editor from './Editor.svelte';
	import type { metadata_def, noveldef, chapter_def } from '../services/novel.d';
	
  import { load, save } from '../services/fileio';
	const definition = {
		type: 'chapters',
		newelem: 'book.newchapter',
		promptname: 'book.nochaptername'
	};
	let chaptername;
	let currentChapter: chapter_def = {};
	let currentChapterText: string = '';

	async function saveChapter(text: string) {
		try {
			if (currentChapter.name) {
				currentChapter.text = text;
				await save('chapters', currentChapter.name, currentChapter);
			}
		} catch (err) {
			alert(err);
		}
	}

	async function saveMetadata() {
		try {
			if (currentChapter.name) {
				await save('chapters', currentChapter.name, currentChapter);
			}
		} catch (err) {
			alert(err);
		}
	}

	async function select(event) {
		try {
			const def: chapter_def = await load('chapters', event.detail);
			currentChapter = def;
			setTimeout(()=>{
				currentChapterText = def.text;
			},100)
			
		} catch (err) {
			alert(err);
		}
	}
</script>

<template>
	<div class="flex gap-4 flex-row">
		<div class="flex-none h-full">
			<Elementlist {definition} on:selected={select} />
		</div>
		<div class="flex-1 h-full">
			{#if currentChapter && currentChapter.name}
				<h3 class="text-lg font-semibold text-blue-400">
					{currentChapter ? currentChapter.name : ''}
					{currentChapter && currentChapter.time ? ', ' + currentChapter.time : ''}
				</h3>
				<textarea
					on:blur={saveMetadata}
					class="border-2 border-solid"
					placeholder={$_('book.summary')}
					bind:value={currentChapter.summary}
				/>
				<Editor save={saveChapter} contents={currentChapterText} />
			{/if}
		</div>
	</div>
</template>

<style lang="scss">
</style>
