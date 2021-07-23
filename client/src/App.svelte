<!-- Toplevel-Component -->
<script lang="ts">
	import Book from './lib/components/Book.svelte';
	import { onMount } from 'svelte';
	import Chapter from './lib/components/Chapter.svelte';
	import Person from './lib/components/Person.svelte';
	import Place from './lib/components/Place.svelte';
	import Notes from './lib/components/Notes.svelte';
	import Menu from './lib/components/Menu.svelte';

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
			}
		});
	});

	let visible = {
		book: true,
		chapter: false,
		persons: false,
		places: false,
		notes: false
	};

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
	<div class="fixed my-5 mt-8 px-5 overflow-y-auto h-4/5 w-screen">
		<div class="flex flex-col md:flex-row bg-red-400">
			<div class="bg-blue-400 m-1 p-1">
				{#if visible.book}
					<Book {visible}/>
				{/if}

				{#if visible.persons}
					<Person {metadata} />
				{/if}
				{#if visible.places}
					<div><Place {metadata} /></div>
				{/if}
				{#if visible.notes}
					<div><Notes /></div>
				{/if}
			</div>
			<div class="bg-green-400 flex-grow">
				{#if visible.chapter}
					<Chapter />
				{/if}
			</div>
		</div>
	</div>
</template>

<style>
</style>
