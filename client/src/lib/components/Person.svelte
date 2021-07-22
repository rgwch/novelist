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
	const fields: Array<{ label: string; type: string }> = [
		{ label: 'name', type: 'string' },
		{ label: 'nicknames', type: 'text' },
		{ label: 'gender', type: 'string' },
		{ label: 'height', type: 'string' },
		{ label: 'stature', type: 'string' },
		{ label: 'hair', type: 'string' },
		{ label: 'age', type: 'string' },
		{ label: 'description', type: 'text' }
	];
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
			if (def) {
				for (let field of fields) {
					if (!def[field.label]) {
						def[field.label] = '';
					}
				}
				currentPerson = def;
				currentName = def.name;
			}
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
