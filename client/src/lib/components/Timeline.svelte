<script lang="ts">
	import { DateTime } from 'luxon';
	import { load } from '../services/fileio';
	let entries: Array<timeline_entry> = [];
	load('timeline', '').then((tl) => {
		entries = tl;
	});
</script>

<template>
	<ul>
		{#each entries as entry}
			<li>
				{DateTime.fromISO(entry.date.toString()).toLocaleString()} - {entry.chapter}
				<br />
				{entry.summary}
			</li>
		{/each}
	</ul>
</template>
I
