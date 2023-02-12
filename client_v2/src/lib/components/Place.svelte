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
	import { currentBook, currentPlace } from '../services/store';
	import { _ } from 'svelte-i18n';
	import Elementlist from '../widgets/Elementlist.svelte';

	let compact = true;
	let filter: (elem) => boolean = (elem) => true;

	const fields = [
		{ label: 'name', type: 'string' },
		{ label: 'alias', type: 'text' },
		{ label: 'surround', type: 'string' },
		{ label: 'description', type: 'text' },
	];

	const newelem = 'book.newplace';
	const promptname = 'book.noplacename';

	async function select(event) {
		try {
			if ($currentPlace) {
				await save('places', $currentPlace);
			}
			const def = await load('places', event.detail);
			for (let field of fields) {
				if (!def[field.label]) {
					def[field.label] = '';
				}
			}
			currentPlace.set(def);
		} catch (err) {
			alert(err);
		}
	}
	async function saveFields(event) {
		try {
			await save('places', $currentPlace);
		} catch (err) {
			alert(err);
		}
	}

	async function setFilter() {
		const f = prompt('Filter');
		const rx = new RegExp(f, 'ig');
		if (f) {
			const pcache = {};
			for (const place of $currentBook.places) {
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
	const create = async (name) => {
		const place: place_def = {
			name,
		};
		await save('places', place);
		await select({ detail: name });
		return name;
	};
</script>

<template>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	{#if compact}
		<div class="flex flex-row">
			<ExtensibleDropdown
				bind:elements={$currentBook.places}
				{newelem}
				{promptname}
				on:selected={select}
				{filter}
				{create}
			/>
			<span on:click={() => setFilter()}
				><i class="fa fa-filter ml-2" /></span
			>
			<span
				on:click={() => {
					compact = false;
				}}><i class="fa fa-edit mx-2" /></span
			>
		</div>
		<Fieldeditor {fields} entity={currentPlace} on:save={saveFields} />
	{:else}
		<div class="flex flex-row">
			<span class="flex-grow">{$_('book.places')}</span>
			<span on:click={() => setFilter()}
				><i class="fa fa-filter ml-2" /></span
			>

			<span
				on:click={() => {
					compact = true;
				}}><i class="fa fa-list-alt mx-2" /></span
			>
		</div>
		<div class="flex flex-row">
			<Elementlist
				bind:elements={$currentBook.places}
				{filter}
				on:selected={select}
			/>
		</div>
	{/if}
</template>
