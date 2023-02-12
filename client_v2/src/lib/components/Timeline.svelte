<script lang="ts">
	import { DateTime } from "luxon";
	import { load } from "../services/fileio";
	import { currentChapter } from "../services/store";
	let entries: Array<timeline_entry> = [];
	load("timeline", "").then((tl) => {
		entries = tl;
	});
	function dateString(ds) {
		const dt = DateTime.fromISO(ds);
		return dt.toLocaleString();
	}
	function select(chapter) {
		load("chapters", chapter).then((ch) => {
			currentChapter.set(ch);
		});
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->

<ul>
	{#each entries as entry}
		<li class="cursor-pointer" on:click={() => select(entry.chapter)}>
			<p class="font-semibold text-sm text-blue-600">
				{dateString(entry.date)}
				{entry.remark} - {entry.chapter}
			</p>
			{entry.summary ? entry.summary : ""}
		</li>
	{/each}
</ul>
