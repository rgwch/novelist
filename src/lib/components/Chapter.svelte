<!--
 ********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************
-->
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Editor from './Editor.svelte';
	import type { metadata_def, noveldef, chapter_def } from '../services/novel.d';
	export let metadata: metadata_def;
	import { load, save } from '../services/fileio';
	let chaptername;
	let currentChapter: chapter_def;
	let currentChapterText: string;

	function addChapter() {
		fetch(`/novel/chapter-${chaptername}.json`, {
			method: 'post',
			body: JSON.stringify({
				title: chaptername,
				text: '# ' + chaptername + '\n\n'
			})
		}).then((ok) => {
			metadata.chapters.push(chaptername);
		});
	}

	async function saveChapter(text: string) {
		try {
			await save('chapter', metadata.title, text);
		} catch (err) {
			alert(err);
		}
	}

	async function select(ch: string) {
		try {
			const def: chapter_def = await load('chapter', ch);
			currentChapter = def;
			currentChapterText = def.text;
		} catch (err) {
			alert(err);
		}
	}
</script>

<template>
	<div class="flex gap-4 flex-row">
		<div class="flex-none h-full">
			<ul>
				{#if metadata}
					{#each metadata.chapters as chapter}
						<ul on:click={() => select(chapter)}>{chapter}</ul>
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
			<h3>
				{currentChapter ? currentChapter.title : ''}, {currentChapter ? currentChapter.time : ''}
			</h3>
			<Editor save={saveChapter} contents={currentChapterText} />
		</div>
	</div>
</template>

<style lang="scss">
</style>
