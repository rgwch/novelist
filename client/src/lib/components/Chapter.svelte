<!--
	@component
	Display of the currently selected chapter.
	
-->
<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Elementlist from './Elementlist.svelte';
	import Editor from './Editor.svelte';

	import { load, save, current } from '../services/fileio';
	const definition = {
		type: 'chapters',
		newelem: 'book.newchapter',
		promptname: 'book.nochaptername'
	};

	let metadata = $current;
	let currentChapter: chapter_def = {};
	let currentChapterText: string = '';

	async function saveChapter(text: string) {
		try {
			// console.log('saving ' + currentChapter.name);
			if (currentChapter.name) {
				if (text && text.length > 1) {
					currentChapter.text = text;
					await save('chapters', currentChapter);
				}
			}
		} catch (err) {
			alert(err);
		}
	}

	async function saveMetadata() {
		try {
			if (currentChapter.name) {
				await save('chapters', currentChapter);
			}
		} catch (err) {
			alert(err);
		}
	}

	async function select(event) {
		try {
			let def: chapter_def = await load('chapters', event.detail);
			if (!def) {
				def = { name: event.detail, text: '' };
			} else {
				if (def.text == undefined) {
					def.text = def.name || '';
				}
			}
			currentChapter = def;
			setTimeout(() => {
				currentChapterText = def.text ? def.text : '';
			}, 100);
		} catch (err) {
			alert(err);
		}
	}
</script>

<template>
	<div class="flex gap-4 flex-col md:flex-row">
		<div class="flex-none h-full">
			<Elementlist {metadata} {definition} on:selected={select} />
		</div>
		<div class="flex-1 w-full v-full m-1">
			{#if currentChapter && currentChapter.name}
				<h3 class="text-lg font-semibold text-blue-400">
					{currentChapter ? currentChapter.name : ''}
					{currentChapter && currentChapter.time ? ', ' + currentChapter.time : ''}
				</h3>
				<textarea
					on:blur={saveMetadata}
					class="border-2 border-solid w-full"
					placeholder={$_('book.summary')}
					bind:value={currentChapter.summary}
				/>
				<Editor save={saveChapter} contents={currentChapterText} />
			{/if}
		</div>
	</div>
</template>
