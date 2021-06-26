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

	export let metadata: metadata_def;
	const definition = {
		type: 'persons',
		newelem: 'book.newperson',
		promptname: 'book.nopersonname'
	};
</script>

<template>
	<div class="flex gap-4 flex-row">
		<div class="flex-none h-full">
			<Elementlist {metadata} {definition} />
		</div>

		<div class="flex-1 h-full">
			<div class="flex flex-row">
				<span>Name</span>
				<input type="text" placeholder="name" />
			</div>
		</div>
	</div>
</template>
