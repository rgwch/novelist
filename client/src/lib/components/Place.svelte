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

	export let metadata: metadata_def;
	let currentPlace: place_def = {};
	let currentName: string = '';
	const fields = ['name', 'surround', 'description'];
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
				if (!def[field]) {
					def[field] = '';
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
		try {
			await remove('places', currentPlace.name);
			metadata = await openCurrent();
		} catch (err) {
			alert(err);
		}
	}
</script>

<template>
	<div class="flex gap-4 flex-col">
		<div class="flex-none h-full">
			<Dropdown {metadata} {definition} on:selected={select} />
		</div>

		<div class="flex-1 h-full">
			<div class="flex flex-row">
				<Fieldeditor {fields} entity={currentPlace} on:save={saveFields} on:delete={del} />
			</div>
		</div>
	</div>
</template>
