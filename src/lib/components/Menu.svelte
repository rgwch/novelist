<script lang="ts">
	import { onMount } from 'svelte';
	import { current } from '$lib/services/fileio';
	import type { metadata_def } from '$lib/services/noveltypes';
	import { _ } from 'svelte-i18n';
	import Book from './Book.svelte';

	export let visible = {
		book: false,
		chapter: false,
		persons: false,
		places: false,
		notes: false
	};

	let hamburgerbtn;
	let mobileMenu;
	let expanded: boolean = false;

	function toggle(elem) {
		visible[elem] = !visible[elem];
	}
</script>

<template>
	<div class="fixed z-50 w-full bg-gray-300 py-1">
		<nav class="flex-row md:justify-between">
			<img
				src="/hamburger.svg"
				alt="menu"
				class="md:hidden bg-gray-300"
				bind:this={hamburgerbtn}
				on:click={() => {
					expanded = !expanded;
				}}
			/>

			<ul class="hidden md:flex md:flex-row" class:active={expanded} bind:this={mobileMenu}>
				<li
					class="pr-5 cursor-pointer"
					class:bg-gray-200={visible.book}
					on:click={() => toggle('book')}
				>
					{$_('book.metadata')}
				</li>
				<li
					class="pr-5 cursor-pointer"
					class:bg-gray-200={visible.chapter}
					on:click={() => toggle('chapter')}
				>
					{$_('book.chapter')}
				</li>
				<li
					class="pr-5 cursor-pointer"
					class:bg-gray-200={visible.persons}
					on:click={() => toggle('persons')}
				>
					{$_('book.persons')}
				</li>
				<li
					class="pr-5 cursor-pointer"
					class:bg-gray-200={visible.places}
					on:click={() => toggle('places')}
				>
					{$_('book.places')}
				</li>
				<li
					class="pr-5 cursor-pointer"
					class:bg-gray-200={visible.notes}
					on:click={() => toggle('notes')}
				>
					{$_('book.notes')}
				</li>
			</ul>
		</nav>
	</div>
</template>

<style>
	.active {
		display: block;
	}
</style>
