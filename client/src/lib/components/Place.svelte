<!--
 ********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021                       *
 * License and Terms see LICENSE            *
 ********************************************
-->
<script lang="ts">
	import Dropdown from './Dropdown.svelte';
	import Fieldeditor from './Fieldeditor.svelte';
	import { load, save, remove } from '../services/fileio';

	export let metadata: metadata_def;
	let currentPlace: place_def = {};
	const fields = ['name', 'surround', 'description'];
	const definition = {
		type: 'places',
		newelem: 'book.newplace',
		promptname: 'book.noplacename'
	};
	async function select(event) {
		try {
			const def = await load('place', event.detail);
			for (let field of fields) {
				if (!def[field]) {
					def[field] = '';
				}
			}
			currentPlace = def;
		} catch (err) {
			alert(err);
		}
	}
	async function saveFields(event) {
		try {
			currentPlace = event.detail;
			await save('place', currentPlace);
		} catch (err) {
			alert(err);
		}
	}
	async function del(event) {
		try {
			currentPlace = event.detail;
			await remove('place', currentPlace.name);
			const idx = metadata.places.indexOf(currentPlace.name);
			if (idx !== -1) {
				metadata.places.splice(idx, 1);
			}
		} catch (err) {
			alert(err);
		}
	}
</script>

<template>
	<div class="flex gap-4 flex-col">
		<div class="flex-none h-full">
			<Dropdown {definition} on:selected={select} />
		</div>

		<div class="flex-1 h-full">
			<div class="flex flex-row">
				<Fieldeditor {fields} entity={currentPlace} on:save={saveFields} />
			</div>
		</div>
	</div>
</template>
