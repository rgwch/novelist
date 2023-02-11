<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Elementlist from '../widgets/Elementlist.svelte';
	import Editor from '../widgets/Editor.svelte';
	import { currentBook, currentChapter } from '../services/store';

	import { load, save } from '../services/fileio';
	const definition = {
		type: 'chapters',
		newelem: 'book.newchapter',
		promptname: 'book.nochaptername',
	};

	let currentChapterText: string = '';
	let enterTime = false;

	async function saveChapter(text: string) {
		try {
			// console.log('saving ' + currentChapter.name);
			if ($currentChapter.name) {
				if (text && text.length > 1) {
					$currentChapter.text = text;
					await save('chapters', currentChapter);
				}
			}
		} catch (err) {
			alert(err);
		}
	}

	async function saveMetadata() {
		try {
			if ($currentChapter.name) {
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
			currentChapter.set(def);
			setTimeout(() => {
				currentChapterText = def.text ? def.text : '';
			}, 100);
		} catch (err) {
			alert(err);
		}
	}
</script>

<!--
	@component
	Display of the currently selected chapter.
	
-->
<template>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="flex gap-4 flex-col md:flex-row h-screen">
		<div class="flex-none h-full m-1">
			<!-- div class="w-full md:w-2/6" -->
			<Elementlist {metadata} {definition} on:selected={select} />
		</div>
		<div class="flex-grow w-full v-full m-1">
			{#if $currentChapter && $currentChapter.name}
				<h3
					class="text-lg font-semibold text-blue-400"
					on:click={() => {
						enterTime = !enterTime;
					}}
				>
					{$currentChapter ? $currentChapter.name : ''}
					{$currentChapter && $currentChapter.time
						? ', ' + $currentChapter.time
						: ''}
				</h3>
				{#if enterTime}
					<input
						on:blur={saveMetadata}
						placeholder={$_('book.timestamp')}
						bind:value={$currentChapter.time}
					/>
				{/if}
				{#if $currentChapter.persons && $currentChapter.persons.length}
					<div class="border-2 border-solid border-red-600">
						{#each $currentChapter.persons as person}
							<span>{person} </span>
						{/each}
					</div>
				{/if}
				{#if $currentChapter.places && $currentChapter.places.length}
					<div class="border-2 border-solid border-red-200">
						{#each $currentChapter.places as place}
							<span>{place} </span>
						{/each}
					</div>
				{/if}
				<textarea
					on:blur={saveMetadata}
					class="border-2 border-solid w-full"
					placeholder={$_('book.summary')}
					bind:value={$currentChapter.summary}
				/>
				<Editor save={saveChapter} contents={currentChapterText} />
			{/if}
		</div>
	</div>
</template>
