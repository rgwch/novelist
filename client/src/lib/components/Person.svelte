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
	let currentPerson: person_def = {};
	let currentName: string = '';
	let compact = true;
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
	async function del(event) {
		if (confirm($_('messages.reallydelete', { values: { element: event.detail } }))) {
			try {
				await remove('persons', event.detail);
				metadata = await openCurrent();
			} catch (err) {
				alert(err);
			}
		}
	}
	async function _rename(event) {
		try {
			metadata = await rename('persons', event.detail.old, event.detail.new);
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
			<span on:click={() => (compact = false)}><i class="fa fa-edit mx-2" /></span>
		</div>
		<Fieldeditor {fields} entity={currentPerson} on:save={saveFields} />
	{:else}
		<div class="flex flex-row">
			<span class="flex-grow">{$_('book.persons')}</span>
			<span
				on:click={() => {
					compact = true;
				}}><i class="fa fa-list-alt" /></span
			>
		</div>
		<Itemlist bind:items={metadata.persons} on:delete={del} on:rename={_rename} />
	{/if}
</template>
