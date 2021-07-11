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
			if (!res) {
				alert('Error encountered');
			}
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
	<div class="fixed mt-8 px-5 overflow-y-auto bg-green-100 h-full w-screen">
		<div class="flex flex-col md:flex-row">
			<div>
				{#if visible.chapter}
					<div>
						<Chapter />
					</div>
				{/if}
			</div>
			<div>
				{#if visible.book}
					<Book />
				{/if}

				{#if visible.persons}
					<div><Person {metadata} /></div>
				{/if}
				{#if visible.places}
					<div><Place {metadata} /></div>
				{/if}
				{#if visible.notes}
					<div><Notes /></div>
				{/if}
			</div>
		</div>
	</div>
	{#if modal}
		<div class="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800">
			<div class="bg-white rounded-lg w-1/2">
				<div class="flex flex-col items-start p-4">
					<div class="flex items-center w-full">
						<div class="text-gray-900 font-medium text-lg">My modal title</div>
						<svg
							class="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 18 18"
						>
							<path
								d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
							/>
						</svg>
					</div>
					<hr />
					<div class="">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua.
					</div>
					<hr />
					<div class="ml-auto">
						<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
							Agree
						</button>
						<button
							class="bg-transparent hover:bg-gray-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</template>

<style>
</style>
