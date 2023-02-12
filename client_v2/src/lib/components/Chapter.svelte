<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Editor from '../widgets/Editor.svelte';
	import { currentBook, currentChapter } from '../services/store';

	import { load, save } from '../services/fileio';

	let enterTime = false;

	async function saveChapter(event) {
		try {
			console.log('saving ' + $currentChapter.name);
			console.log($currentChapter.text);
			const done = await save('chapters', $currentChapter);
			console.log(done);
		} catch (err) {
			alert(err);
		}
	}
	let test = 'Haaaa';
</script>

<!--
	@component
	Display of the currently selected chapter.
	
-->
<template>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	{#if $currentBook}
		<div class="h-full">
			{#if $currentChapter && $currentChapter.name}
				<h3
					class="text-lg font-semibold text-blue-400"
					on:click={() => {
						enterTime = !enterTime;
					}}>
					{$currentChapter ? $currentChapter.name : ''}
					{$currentChapter && $currentChapter.time
						? ', ' + $currentChapter.time
						: ''}
				</h3>
				{#if enterTime}
					<input
						on:blur={saveChapter}
						placeholder={$_('book.timestamp')}
						bind:value={$currentChapter.time} />
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
					on:blur={saveChapter}
					class="border-2 border-solid w-full"
					placeholder={$_('book.summary')}
					bind:value={$currentChapter.summary} />
				<textarea
					class="border-2 border-solid w-full h-full min-h-80"
					on:blur={saveChapter}
					bind:value={$currentChapter.text} />
				<!-- Editor save={saveChapter} bind:contents={$currentChapter.text} / -->
			{/if}
		</div>
	{/if}
</template>
