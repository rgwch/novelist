<script lang="ts">
	import SimpleMDE from 'simplemde';
	import { onDestroy, onMount, setContext } from 'svelte';
	import { _ } from 'svelte-i18n';

	export let save: (data: string) => void;
	export let contents: string;

	let container;
	let editor;
	let timer;
	const toolbar = [
		{ name: 'bold', action: 'toggleBold', className: 'fa fa-bold', title: $_('actions.bold') },
		'italic',
		'heading-bigger',
		'heading-smaller',
		'preview',
		'fullscreen',
		'|',
		{
			name: 'save',
			action: (editor) => save(editor.value),
			className: 'fa fa-save',
			title: $_('actions.save')
		}
	];

	$: setValue(contents);

	function setValue(val: string) {
		if (editor) {
			editor.value(val);
		}
	}
	onMount(async () => {
		try {
			editor = new SimpleMDE({
				element: container,
				autofocus: true,
				spellChecker: false,
				toolbar: false,
				autoDownloadFontAwesome: false
				// autosave: { enabled: true, uniqueId: new Date().toString() }
			});
			editor.codemirror.on('blur', () => {
				// console.log('Editor: blur');
				save(editor.value());
			});
			// Autosave every 5 minutes
			timer = setInterval(() => {
				save(editor.value());
			}, 300000);
		} catch (err) {
			console.log('Editor: Error in initializer ' + err);
		}
	});
	onDestroy(() => {
		if (editor) {
			editor.value('');
		}
	});
</script>

<template>
	<textarea bind:this={container} />
</template>

<style>
	:global(.CodeMirror) {
		height: 70vh;
		width: 100%;
	}
	:global(.CodeMirror-fullscreen) {
		max-height: none;
		margin-top: 18px;
	}
	:global(.editor-toolbar) {
		margin-top: 18px;
	}
	/*
	.cm-wrap{ height: 100%}
	.cm-scroller {overflow: auto}
	*/
</style>
