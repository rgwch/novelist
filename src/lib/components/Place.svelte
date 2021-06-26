<!--
 ********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************
-->
<script lang="ts">
	import type { metadata_def } from '$lib/services/novel.d';
	import Elementlist from '$lib/components/Elementlist.svelte';
	let currentPlace;
	export let metadata: metadata_def;
	const definition = {
		type: 'places',
		newelem: 'book.newplace',
		promptname: 'book.noplacename'
	};
	function select(event) {
		console.log(event.detail);
	}
</script>

<template>
	<div class="flex gap-4 flex-row">
		<div class="flex-none h-full">
			<Elementlist {metadata} {definition} currentElement={currentPlace} on:selected={select} />
		</div>

		<div class="flex-1 h-full">
			<div class="flex flex-row">
				<span>Name</span>
				<input type="text" placeholder="name" />
			</div>
		</div>
	</div>
</template>
