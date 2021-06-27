<!--
 ********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************
-->
<script lang="ts">
	import type { metadata_def, place_def } from '$lib/services/novel.d';
	import Elementlist from '$lib/components/Elementlist.svelte';
	import Fieldeditor from '$lib/components/Fieldeditor.svelte';
	import { load, save } from '../services/fileio';

	let currentPlace: place_def = {};
	const fields = ['name', 'surround', 'description'];
	const definition = {
		type: 'places',
		newelem: 'book.newplace',
		promptname: 'book.noplacename'
	};
	async function select(event) {
		console.log(event.detail);
		try {
			const def = await load('places', event.detail);
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
			await save('places', currentPlace.name, currentPlace);
		} catch (err) {
			alert(err);
		}
	}
</script>

<template>
	<div class="flex gap-4 flex-row">
		<div class="flex-none h-full">
			<Elementlist {definition} on:selected={select} />
		</div>

		<div class="flex-1 h-full">
			<div class="flex flex-row">
				<Fieldeditor {fields} entity={currentPlace} on:save={saveFields} />
			</div>
		</div>
	</div>
</template>
