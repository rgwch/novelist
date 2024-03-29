<script lang="ts">
	import Book from './lib/components/Book.svelte';
	import { onMount } from 'svelte';
	import Chapter from './lib/components/Chapter.svelte';
	import Person from './lib/components/Person.svelte';
	import Place from './lib/components/Place.svelte';
	import Notes from './lib/components/Notes.svelte';
	import Menu from './lib/components/Menu.svelte';
	import Card from './lib/components/Card.svelte';
	import Timeline from './lib/components/Timeline.svelte';

	import { _ } from 'svelte-i18n';
	import { current, changePwd, closeBook, save, toEpub, toHtml } from './lib/services/fileio';

	let metadata: metadata_def;
	let modal = false;

	onMount(async () => {
		current.subscribe((value) => {
			metadata = value;
			if (!metadata) {
				visible.book = true;
				visible.chapter = false;
				visible.persons = false;
				visible.places = false;
				visible.notes = false;
				visible.timeline = false;
			}
		});
	});

	let visible = {
		book: true,
		chapter: false,
		persons: false,
		places: false,
		notes: false,
		timeline: false
	};

	$: leftCol = visible.book || visible.persons || visible.places || visible.timeline;

	$: rightCol = visible.chapter || visible.notes;

	function toggle(elem) {
		visible[elem] = !visible[elem];
	}

	async function open() {
		modal = true;
	}
	async function close() {
		await save('metadata', metadata);
		await closeBook();
		current.set(undefined);
	}

	async function exportHtml() {
		try {
			const html = await toHtml();
			const win = window.open('_blank');
			if (win) {
				win.document.write(html);
			} else {
				alert('please allow pop-ups from this site');
			}
		} catch (err) {
			alert(err);
		}
	}
	async function exportEpub() {
		try {
			const res = await toEpub(metadata.title);
			alert(
				$_('messages.ebookok', {
					values: {
						epub: res
					}
				})
			);
		} catch (err) {
			alert(err);
		}
	}
	async function chpwd() {
		try {
			const newPWD = prompt($_('headings.enternewpwd'));
			if (newPWD) {
				const res = await changePwd(newPWD);
				if (res) {
					alert('ok');
				} else {
					alert('fail');
				}
			}
		} catch (err) {
			alert(err);
		}
	}
</script>

<!-- Toplevel-Component -->
<template>
	{#if !!metadata}
		<Menu
			bind:visible
			on:changepwd={chpwd}
			on:close={close}
			on:open={open}
			on:html={exportHtml}
			on:epub={exportEpub}
		/>
	{/if}
	<!-- div class="flex flex-row w-screen">
		<div class="bg-blue-400 h-full w-1/4 min-w-40">Links</div>
		<div class="bg-green-400 h-full w-full">Rechts</div>
	</div -->
	<div class="fixed my-5 mt-8 px-5 overflow-y-auto h-5/6 w-screen">
		<div class="flex flex-col md:flex-row w-full">
			{#if leftCol}
				<div class="bg-blue-200 w-full md:w-1/4 ">
					{#if visible.book}
						<Card
							title={!!metadata ? $_('book.metadata') : $_('book.open')}
							on:close={() => {
								visible.book = false;
							}}
						>
							<div slot="contents">
								<Book {visible} />
							</div>
						</Card>
					{/if}

					{#if visible.persons}
						<Card
							title={$_('book.persons')}
							on:close={() => {
								visible.persons = false;
							}}
						>
							<div slot="contents">
								<Person {metadata} />
							</div>
						</Card>
					{/if}
					{#if visible.places}
						<Card
							title={$_('book.places')}
							on:close={() => {
								visible.places = false;
							}}
						>
							<div slot="contents">
								<Place {metadata} />
							</div>
						</Card>
					{/if}
					{#if visible.timeline}
						<Card
							title={$_('book.timeline')}
							on:close={() => {
								visible.timeline = false;
							}}
						>
							<div slot="contents">
								<Timeline />
							</div>
						</Card>
					{/if}
				</div>
			{/if}
			{#if rightCol}
				<div class="bg-blue-300 flex-auto">
					{#if visible.chapter}
						<Card
							title={$_('book.chapter')}
							on:close={() => {
								visible.chapter = false;
							}}
						>
							<div slot="contents">
								<Chapter />
							</div>
						</Card>
					{/if}
					{#if visible.notes}
						<Card title={$_('book.notes')} on:close={() => (visible.notes = false)}>
							<div slot="contents">
								<Notes />
							</div>
						</Card>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</template>

<style>
</style>
