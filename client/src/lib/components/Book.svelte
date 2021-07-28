<!-- 
@component
Display of the metadata of the currently opened book or a list of books available.
	
-->
<script lang="ts">
	import Fieldeditor from './Fieldeditor.svelte';
	import { DateTime } from 'luxon';
	import { _ } from 'svelte-i18n';
	import Modal from './Modal.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let visible;
	/** The metadata fields for a book. All are optional*/
	const fields = [
		'title',
		'author',
		'fileAs',
		'id',
		'series',
		'sequence',
		{ label: 'created', type: 'date' },
		'genre',
		'language',
		'description',
		'tags',
		'copyright',
		'publisher',
		{ label: 'published', type: 'date' },
		{ label: 'modified', type: 'datetime' },
		{ label: 'expose', type: 'text' }
	];
	import {
		current,
		closeBook,
		load,
		save,
		changePwd,
		showBooks,
		openBook
	} from '../services/fileio';

	/** Name of the currently opened book */
	let booknameInput;
	let bookFilename: string;
	let metadata: metadata_def;
	let modal: boolean = false;
	let password: string = '';

	current.subscribe((value) => {
		metadata = value;
	});

	async function saveBook(event) {
		await save('metadata', metadata);
	}

	async function close() {
		await saveBook({});
		await closeBook();
		current.set(undefined);
	}
	async function open(filename) {
		password = '';
		if (!filename) {
			filename = prompt($_('book.filename'));
		}
		if (filename) {
			bookFilename = filename;
			modal = true;
		}
	}

	async function modalClosed(result) {
		modal = false;
		if (result) {
			metadata = undefined;
			let res;
			try {
				res = await openBook(bookFilename, password);
				current.set(res);
				visible.chapter = true;
			} catch (err) {
				if (err.includes('incorrect header')) {
					alert($_('messages.badpwd'));
				} else {
					alert('Can not open ' + err);
				}
			} finally {
				password = '';
			}
		}
	}
	function dateText(d: Date) {
		const dt = DateTime.fromJSDate(d);
		return dt.toLocaleString();
	}
</script>

<template>
	{#if metadata}
		<Fieldeditor {fields} entity={metadata} on:save={saveBook} />
	{:else}
		<div class="p-1 overflow-y-auto">
			{#await showBooks() then files}
				<ul>
					{#each files as file}
						<li class="item" on:click={() => open(file)}>{file}</li>
					{/each}
				</ul>
			{/await}

			<input
				class="border-solid border-4 mx-1"
				type="text"
				id="name"
				bind:this={booknameInput}
				placeholder={$_('book.filename')}
			/>
			<button class="btn" on:click={() => open(booknameInput.value)}>{$_('actions.open')}</button>
		</div>
		{#if modal}
			<Modal title={$_('general.password')} dismiss={modalClosed}>
				<div slot="body" class="w-full">
					<!-- svelte-ignore a11y-autofocus -->
					<input
						type="password"
						id="passwd"
						class="border-solid border-2 border-blue-200 hover:border-blue-300 w-full"
						bind:value={password}
						autofocus
					/>
				</div>
			</Modal>
		{/if}
	{/if}
</template>
