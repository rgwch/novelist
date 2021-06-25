<script lang="ts">
	import type { metadata_def } from '$lib/services/novel.d';
	export let metadata: metadata_def;
</script>

<template>
	<div class="flex gab-4 flex-row">
		<div class="flex-none h-full">
			{#if metadata && metadata.persons}
      {#each metadata.persons as person}
        <div class="cursor-pointer border-solid botder-2 border-rounded-x1 m1 bg-gray-100 hover:bg-gray-400">
          
        </div>
      {/each}
      
      {/if}
		</div>
	</div>
</template>
