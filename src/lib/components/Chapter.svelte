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
	let currentChapter: chapter_def = {};
	let currentChapterText: string = '';

	function addChapter() {
		if (chaptername) {
			fetch(`/novel/chapter-${chaptername}.json`, {
				method: 'post',
				body: JSON.stringify({
					title: chaptername,
					text: '# ' + chaptername + '\n\n'
				})
			}).then((ok) => {
				metadata.chapters = [...metadata.chapters, chaptername];
				chaptername = '';
			});
		} else {
			alert($_('book.nochaptername'));
		}
	}

	async function saveChapter(text: string) {
		try {
			currentChapter.text = text;
			await save('chapter', currentChapter.title, currentChapter);
		} catch (err) {
			alert(err);
		}
	}

	async function saveMetadata() {
		try {
      await save('chapter', currentChapter.title,currentChapter)
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
						<div
							class="cursor-pointer border-solid border-2 border-rounded-x1 m-1 bg-gray-100 hover:bg-gray-400"
						>
							<ul
								class={currentChapter && chapter == currentChapter.title
									? 'font-bold'
									: 'font-normal'}
								on:click={() => select(chapter)}
							>
								{chapter}
							</ul>
						</div>
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
			<h3 class="text-lg font-semibold text-blue-400">
				{currentChapter ? currentChapter.title : ''}
				{currentChapter && currentChapter.time ? ', ' + currentChapter.time : ''}
			</h3>
			<textarea
				on:blur={saveMetadata}
				class="border-2 border-solid"
				placeholder={$_('book.summary')}
				bind:value={currentChapter.summary}
			/>
			<Editor save={saveChapter} contents={currentChapterText} />
		</div>
	</div>
</template>

<style lang="scss">
</style>
