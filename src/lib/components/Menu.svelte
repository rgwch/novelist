<script lang="ts">
	import { onMount } from 'svelte';
	import { current } from '$lib/services/fileio';
	import type { metadata_def } from '$lib/services/novel.d';
	import { _ } from 'svelte-i18n';

    
	export let visible={
        book:true,
        chapter:true,
        persons:false,
        places: true
    };
    
	let hamburgerbtn;
	let mobileMenu;
	let expanded: boolean = false;
</script>

<template>
	<div class="container mx-auto bg-purple-300 p-5">
		<nav class="flex-row md:justify-between">
			<div class="flex flex-row justify-between">
				<span>
					{#if $current}
						{$current.title}
					{:else}
						unknown
					{/if}
				</span>

				<span
					class="md:hidden bg-purple-200"
					bind:this={hamburgerbtn}
					on:click={() => {
						expanded = !expanded;
					}}>menu</span
				>
			</div>
            <ul class="hidden md:flex md:flex-row" class:active={expanded} bind:this={mobileMenu}>
				<li class="pr-5" class:bg-red-200={visible.book}>{$_('book.chapter')}</li>
				<li class="pr-5" class:bg-red-200={visible.persons}>{$_('book.persons')}</li>
				<!-- li class="pr-5" class:bg-red-200={visible.places}>{$_('book.places')}</li>
				<li>{$_('book.notes')}</li -->
			</ul>
		</nav>
	</div>
</template>

<style>
	.active {
		display: block;
	}
</style>
