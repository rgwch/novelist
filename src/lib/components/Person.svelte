<!--
 ********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************
-->
<script lang="ts">
	import type { metadata_def, person_def } from '$lib/services/novel.d';
	import Elementlist from '$lib/components/Elementlist.svelte';
	import Fieldeditor from '$lib/components/Fieldeditor.svelte';
	import { load, save } from '../services/fileio';

	let currentPerson: person_def = {};
	const fields = ['name', 'nicknames', 'gender', 'height', 'stature', 'hair', 'age', 'description'];
	const definition = {
		type: 'persons',
		newelem: 'book.newperson',
		promptname: 'book.nopersonname'
	};
	async function select(event) {
		try {
			const def = await load('persons', event.detail);
			for (let field of fields) {
				if (!def[field]) {
					def[field] = '';
				}
			}
			currentPerson = def;
		} catch (err) {
			alert(err);
		}
	}
	async function saveFields(event) {
		try {
			currentPerson = event.detail;
			await save('persons', currentPerson.name, currentPerson);
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
				<Fieldeditor {fields} entity={currentPerson} on:save={saveFields} />
			</div>
		</div>
	</div>
</template>
