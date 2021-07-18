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
	let currentPerson: person_def = {};
	let currentName: string = '';
	const fields = ['name', 'nicknames', 'gender', 'height', 'stature', 'hair', 'age', 'description'];
	const definition = {
		type: 'persons',
		newelem: 'book.newperson',
		promptname: 'book.nopersonname'
	};
	async function select(event) {
		try {
			if (currentPerson) {
				await save('persons', currentPerson);
			}
			const def = await load('persons', event.detail);
			for (let field of fields) {
				if (!def[field]) {
					def[field] = '';
				}
			}
			currentPerson = def;
			currentName = def.name;
		} catch (err) {
			alert(err);
		}
	}
	async function saveFields(event) {
		try {
			if (currentPerson) {
				if (currentPerson.name !== currentName) {
					metadata = await rename('persons', currentName, currentPerson.name);
					// metadata=await openCurrent();
				}
			}
			currentName = currentPerson.name;
			await save('persons', currentPerson);
		} catch (err) {
			alert(err);
		}
	}
	async function del() {
		try {
			await remove('persons', currentPerson.name);
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
				<Fieldeditor
					{fields}
					entity={currentPerson}
					actions={true}
					on:save={saveFields}
					on:delete={del}
				/>
			</div>
		</div>
	</div>
</template>
