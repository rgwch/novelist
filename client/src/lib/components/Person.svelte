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
	import { element } from 'svelte/internal';

	export let metadata: metadata_def;
	let currentPerson: person_def = {};
	let currentName: string = '';
	let compact = true;
	let filter: (elem: string) => boolean = (elem: string) => true;
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
	async function setFilter() {
		const f = prompt('Filter');
    const rx=new RegExp(f,"ig")
		if (f) {
			const pcache = {};
			for (const person of metadata.persons) {
				pcache[person] = await load('persons', person);
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
			<span on:click={() => (compact = false)}><i class="fa fa-edit mx-2" /></span>
		</div>
		<Fieldeditor {fields} entity={currentPerson} on:save={saveFields} />
	{:else}
		<div class="flex flex-row">
			<span class="flex-grow">{$_('book.persons')}</span>
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
