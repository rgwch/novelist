<script lang="ts">
	import Fieldeditor from '$lib/components/Fieldeditor.svelte';
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
	import { current, saveMetadata, load, changePwd } from '$lib/services/fileio';
	import marked from 'marked';
	import globals from '$lib/global';

	let bookname;
	let metadata: metadata_def;
	let filedialog = false;
	current.subscribe((value) => {
		metadata = value;
	});
	function saveBook(event) {
		saveMetadata(metadata);
	}
	function close() {
		try {
			fetch('/novel/close.json').then((res) => {
				if (res.ok) {
					current.set(undefined);
				}
			});
		} catch (err) {
			alert(err);
		}
	}
	async function open(filename) {
		// console.log('book: Open ' + filename);
		const password = prompt($_('general.password'));
		let res;
		if (password) {
			res = await fetch('/novel/open.json', {
				method: 'POST',
				body: JSON.stringify({ filename, password })
			});
		} else {
			res = await fetch(`/novel/open-${filename}.json`);
		}
		if (res.ok) {
			const result = await res.json();
			if (result.result !== 'fail') {
				current.set(result.result);
				setTimeout(() => {
					console.log('metadata=' + JSON.stringify(metadata));
				}, 100);
			}
		} else {
			const text = await res.json();
			alert(text.message);
		}
	}
	function dateText(d: Date) {
		const dt = DateTime.fromJSDate(d);
		return dt.toLocaleString();
	}

	async function listFiles(): Promise<Array<string>> {
		try {
			const res = await fetch('/novel/showbooks.json');
			if (res.ok) {
				const result = await res.json();
				return result.result;
			} else {
				return [];
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function toHtml() {
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
			}else{
        alert("error ")
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
		{#await listFiles() then files}
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
	{/if}
	<div class:hidden={!filedialog}>
		<form action="/novel/createbook.json" method="POST">
			<input type="file" name="filename" />
			<button type="submit">Create</button>
		</form>
	</div>
</template>
