<!--
 ********************************************
 * This file is part of Novelist            *
 * License and Terms see LICENSE            *
 ********************************************
-->
<script lang="ts">
	import ExtensibleDropdown from '../widgets/ExtensibleDropdown.svelte';
	import Fieldeditor from '../widgets/Fieldeditor.svelte';
	import { load, save, remove, rename } from '../services/fileio';
	import { _ } from 'svelte-i18n';
	import Elementlist from '../widgets/Elementlist.svelte';
	import { currentBook, currentPerson } from '../services/store';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

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
		{ label: 'description', type: 'text' },
	];

	const newelem = 'book.newperson';
	const promptname = 'book.nopersonname';

	async function select(event) {
		try {
			if ($currentPerson) {
				await save('persons', $currentPerson);
			}
			const def = await load('persons', event.detail);
			if (def) {
				for (let field of fields) {
					if (!def[field.label]) {
						def[field.label] = '';
					}
				}
				currentPerson.set(def);
			}
		} catch (err) {
			alert(err);
		}
	}
	async function saveFields(event) {
		try {
			await save('persons', $currentPerson);
		} catch (err) {
			alert(err);
		}
	}

	async function setFilter() {
		const f = prompt('Filter');
		const rx = new RegExp(f, 'ig');
		if (f) {
			const pcache = {};
			for (const person of $currentBook.persons) {
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
	const create = async (name) => {
		const person: person_def = {
			name,
		};
		await save('persons', person);
		await select({ detail: name });
		return name;
	};
	const do_remove = async(name)=>{
		await remove('persons',name.detail)
	}

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $currentBook}
	{#if compact}
		<div class="flex flex-row">
			<ExtensibleDropdown
				bind:elements={$currentBook.persons}
				{newelem}
				{promptname}
				{create}
				on:selected={select}
				{filter} />
			<span on:click={() => setFilter()}
				><i class="fa fa-filter ml-2" /></span>
			<span on:click={() => (compact = false)}
				><i class="fa fa-edit mx-2" /></span>
		</div>
		<Fieldeditor {fields} entity={$currentPerson} on:save={saveFields} />
	{:else}
		<div class="flex flex-row">
			<span class="flex-grow">{$_('actions.edit')}</span>
			<span on:click={() => setFilter()}
				><i class="fa fa-filter ml-2" /></span>
			<span
				on:click={() => {
					compact = true;
				}}><i class="fa fa-list-alt mx-2" /></span>
		</div>
		<div class="flex flex-row">
			<Elementlist
				bind:elements={$currentBook.persons}
				{filter}
				on:selected={select}
				on:delete={do_remove}
				/>
		</div>
	{/if}
{/if}
