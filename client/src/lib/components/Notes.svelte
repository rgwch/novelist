<script lang="ts">
	import Editor from './Editor.svelte';
	import { onMount } from 'svelte';
	let contents: string = '';
	import { loadNotes, saveNotes } from '../services/fileio';
	function save(text:string) {
		contents=text
		saveNotes(text)
			.then((ok) => {
				if (!ok) {
					alert('Error');
				}
			})
			.catch((err) => {
				alert(err);
			});
	}
	onMount(async () => {
		try {
			contents = await loadNotes();
		} catch (err) {
			alert(err);
		}
	});
</script>

<template>
	<Editor {save} {contents} />
</template>
