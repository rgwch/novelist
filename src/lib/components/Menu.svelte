<script lang="ts">
	import { onMount } from 'svelte';
	import { current } from '$lib/services/fileio';
	import { _ } from 'svelte-i18n';

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
		expanded = false;
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
				<li class="relative parent">
					<a
						href="#"
						class="flex justify-between md:inline-flex px-4 items-center hover:bg-gray-300 space-x-2"
					>
						<span>Service</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4 fill-current pt-1"
							viewBox="0 0 24 24"
						>
							<path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
						</svg>
					</a>
					<ul
						class="child transition duration-300 md:absolute top-full left-0 md:w-48 bg-gray-300 md:shadow-lg md:rounded-b "
					>
						<li>
							<span class="flex px-4 py-3 hover:bg-gray-200"> Web development </span>
						</li>
						<li>
							<span class="flex px-4 py-3 hover:bg-gray-200"> Web Design </span>
						</li>
						<li>
							<span class="flex px-4 py-3 hover:bg-gray-200"> Machine Learning </span>
						</li>
					</ul>
				</li>
				<li />
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

	@media only screen and (min-width: 768px) {
		.parent:hover .child {
			opacity: 1;
			height: auto;
			overflow: none;
			transform: translateY(0);
		}

		.child {
			opacity: 0;
			height: 0;
			overflow: hidden;
			transform: translateY(-10%);
		}
	}
</style>
