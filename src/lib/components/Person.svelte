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

	let currentPerson: person_def={}
	export let metadata: metadata_def;
	const fields = ['Name', 'Nicknames', 'Gender', 'Height', 'Age', 'Description'];
	const definition = {
		type: 'persons',
		newelem: 'book.newperson',
		promptname: 'book.nopersonname'
	};
	async function select(event) {
		console.log(event.detail);
		try {
			const def = await load('persons', event.detail);
			currentPerson = def;
		} catch (err) {
			alert(err);
		}
	}
</script>

<template>
	<div class="flex gap-4 flex-row">
		<div class="flex-none h-full">
			<Elementlist {metadata} {definition} on:selected={select} />
		</div>

		<div class="flex-1 h-full">
			<div class="flex flex-row">
				<Fieldeditor {fields} entity={metadata[currentPerson.name]} />
			</div>
		</div>
	</div>
</template>
