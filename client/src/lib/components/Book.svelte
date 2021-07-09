<script lang="ts">
	import Fieldeditor from './Fieldeditor.svelte';
	import { DateTime } from 'luxon';
	import { _ } from 'svelte-i18n';
	const fields = [
		'title',
		'author',
		'fileAs',
		'id',
		'series',
		'sequence',
		'created',
		'genre',
		'language',
		'description',
		'tags',
		'copyright',
		'publisher',
		'published',
		'modified',
		'expose'
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

	let bookname;
	let metadata: metadata_def;
	let filedialog = false;
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
		// console.log('book: Open ' + filename);
		const password = prompt($_('general.password'));
		let res;
		if (password) {
			try {
				res = await openBook(filename, password);
				current.set(res);
				setTimeout(() => {
					console.log('metadata=' + JSON.stringify(metadata));
				}, 100);
			} catch (err) {
				alert('Can not open ' + err);
			}
		}
	}

	function dateText(d: Date) {
		const dt = DateTime.fromJSDate(d);
		return dt.toLocaleString();
	}

	async function toHtml() {
		/*

const chapters = metadata.chapters;

let html = '';

marked.setOptions({});

for (const chapter of chapters) {

const text: chapter_def = await load('chapters', chapter);

if (text && text.text) {

const compiled = marked(text.text);

html = html + '<p>' + compiled + '</p>';

}

}

const win = window.open('_blank');

if (win) {

win.document.write(html);

} else {

alert('please allow pop-ups from this site');

}
    */
	}
	async function toEpub() {
		try {
			const ret = await fetch('/novel/createbook.json', {
				method: 'POST',
				body: JSON.stringify({
					filename: metadata.title
				})
			});
			if (ret.ok) {
				// const data = ret.body;
				alert('ok');
			} else {
				alert('error ');
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
	{#if metadata}
		<Fieldeditor {fields} entity={metadata} on:save={saveBook} />
		<hr class="py-4" />
		<button class="btn" on:click={toHtml}>{$_('actions.generateHTML')}</button>
		<button class="btn" on:click={toEpub}>{$_('actions.generateEPUB')}</button>
		<button class="btn" on:click={chpwd}>{$_('actions.changePWD')}</button>
		<span role="button" class="btn" on:click={close}>{$_('actions.close')}</span>
	{:else}
		<h1>{$_('book.open')}</h1>
		<div class="h-full p-1 mb-18 overflow-auto">
			{#await showBooks() then files}
				<ul>
					{#each files as file}
						<li class="item" on:click={() => open(file)}>{file}</li>
					{/each}
				</ul>
			{/await}

			<input
				class="border-solid border-4"
				type="text"
				id="name"
				bind:this={bookname}
				placeholder={$_('book.filename')}
			/>
			<button class="btn" on:click={() => open(bookname.value)}>{$_('actions.open')}</button>
		</div>
	{/if}
</template>