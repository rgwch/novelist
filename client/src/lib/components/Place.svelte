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
	import Elementlist from './Elementlist.svelte';

	export let metadata: metadata_def;
	let currentPlace: place_def = {};
	let currentName: string = '';
	let compact = true;
	let filter: (elem) => boolean = (elem) => true;

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
	async function setFilter() {
		const f = prompt('Filter');
		const rx = new RegExp(f, 'ig');
		if (f) {
			const pcache = {};
			for (const place of metadata.places) {
				pcache[place] = await load('places', place);
			}
			filter = (elem) => {
				const pd: person_def = pcache[elem];
				for (const prop of Object.keys(pd)) {
					if (pd[prop].match(rx)) {
						return true;
					}
				}
				return false;
			};
		} else {
			filter = (elem) => true;
		}
	}
</script>

<template>
	{#if compact}
		<div class="flex flex-row">
			<Dropdown {metadata} {definition} on:selected={select} {filter} />
			<span on:click={() => setFilter()}><i class="fa fa-filter ml-2" /></span>
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
			<span on:click={() => setFilter()}><i class="fa fa-filter ml-2" /></span>

			<span
				on:click={() => {
					compact = true;
				}}><i class="fa fa-list-alt mx-2" /></span
			>
		</div>
		<Elementlist {metadata} {definition} {filter} />
	{/if}
</template>
