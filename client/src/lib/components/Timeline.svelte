<script lang="ts">
	import { DateTime } from 'luxon';
	import { load } from '../services/fileio';
	let entries: Array<timeline_entry> = [];
	load('timeline', '').then((tl) => {
		entries = tl;
	});
	function dateString(ds){
		const dt=DateTime.fromISO(ds)
		if(dt.hour==0 && dt.minute==0){
			return dt.toLocaleString()
		}else{
			return "m"+dt.toLocaleString()
		}
	}
</script>

<template>
	<ul>
		{#each entries as entry}
			<li>
				<p class="font-semibold text-sm text-blue-600">
					{dateString(entry.date)} {entry.remark} - {entry.chapter}
				</p>
				{entry.summary}
			</li>
		{/each}
	</ul>
</template>
I
