<!--
 ********************************************
 * This file is part of Novelist            *
 * License and Terms see LICENSE            *
 ********************************************
-->
<script lang="ts">
	import Dropdown from './Dropdown.svelte';
	import Fieldeditor from './Fieldeditor.svelte';
	import { load, save, remove, rename, openCurrent } from '../services/fileio';
	import Itemlist from './Itemlist.svelte';
	import { _ } from 'svelte-i18n';

	export let metadata: metadata_def;
	let currentPlace: place_def = {};
	let currentName: string = '';
	let compact = true;
	const fields = [
		{ label: 'name', type: 'string' },
		{ label: 'surround', type: 'string' },
		{ label: 'description', type: 'text' }
	];
	const definition = {
		type: 'places',
		newelem: 'book.newplace',
		promptname: 'book.noplacename'
	};
	async function select(event) {
		try {
			if (currentPlace) {
				await save('places', currentPlace);
			}
			const def = await load('places', event.detail);
			for (let field of fields) {
				if (!def[field.label]) {
					def[field.label] = '';
				}
			}
			currentPlace = def;
			currentName = def.name;
		} catch (err) {
			alert(err);
		}
	}
	async function saveFields(event) {
		try {
			if (currentPlace) {
				if (currentPlace.name !== currentName) {
					metadata = await rename('places', currentName, currentPlace.name);
				}
			}
			currentName = currentPlace.name;
			await save('places', currentPlace);
		} catch (err) {
			alert(err);
		}
	}
	async function del(event) {
		if (confirm($_('messages.reallydelete', { values: { element: event.detail } }))) {
			try {
				await remove('places', event.detail);
				metadata = await openCurrent();
			} catch (err) {
				alert(err);
			}
		}
	}
	async function _rename(event) {
		try {
			metadata = await rename('places', event.detail.old, event.detail.new);
			await openCurrent();
		} catch (err) {
			alert(err);
		}
	}
</script>

<template>
	{#if compact}
		<div class="flex flex-row">
			<Dropdown {metadata} {definition} on:selected={select} />
			<span
				on:click={() => {
					compact = false;
				}}><i class="fa fa-edit mx-2" /></span
			>
		</div>
		<Fieldeditor {fields} entity={currentPlace} on:save={saveFields} on:delete={del} />
	{:else}
		<div class="flex flex-row">
			<span class="flex-grow">{$_('book.places')}</span>
			<span
				on:click={() => {
					compact = true;
				}}><i class="fa fa-list-alt" /></span
			>
		</div>
		<Itemlist bind:items={metadata.places} on:delete={del} on:rename={_rename} />
	{/if}
</template>
