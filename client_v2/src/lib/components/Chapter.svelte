<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { currentBook, currentChapter } from '../services/store';

	import { load, save } from '../services/fileio';

	let enterTime = false;

	async function saveChapter(event) {
		try {
			console.log('saving ' + $currentChapter.name);
			// console.log($currentChapter.text);
			const done = await save('chapters', $currentChapter);
			console.log(done);
		} catch (err) {
			alert(err);
		}
	}
</script>

<!--
	@component
	Display of the currently selected chapter.
	
-->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $currentBook && $currentChapter}
	<div class="h-90vh">
		<div class="bg-blu-200">
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
		</div>
		<div class="bg-red-300 textwrapper h-78vh">
			<textarea
				class="border-2 border-solid w-full h-full"
				on:blur={saveChapter}
				bind:value={$currentChapter.text} />
			<!-- Editor save={saveChapter} bind:contents={$currentChapter.text} / -->
		</div>
	</div>
{/if}

<style>
	.textwrapper {
		height: calc(100%-100px);
	}
</style>
