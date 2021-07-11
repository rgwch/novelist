<script lang="ts">
	import { current } from '../services/fileio';
	import { _ } from 'svelte-i18n';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

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
	let metadata: metadata_def;
	let bookPresent;
	current.subscribe((data) => {
		metadata = data;
		bookPresent = metadata !== undefined;
	});

	function toggle(elem) {
		visible[elem] = !visible[elem];
		expanded = false;
	}
</script>

<template>
	<div class="fixed z-50 w-full bg-gray-300 py-1">
		<nav class="flex-row md:justify-between">
			<img
				src="hamburger.svg"
				alt="menu"
				class="md:hidden bg-gray-300"
				bind:this={hamburgerbtn}
				on:click={() => {
					expanded = !expanded;
				}}
			/>

			<ul class="hidden md:flex md:flex-row" class:active={expanded} bind:this={mobileMenu}>
				<li class="relative parent">
					<div
						class="flex justify-between md:inline-flex px-4 items-center hover:bg-gray-300 space-x-2"
					>
						<span>{$_('menu.file')}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4 fill-current pt-1"
							viewBox="0 0 24 24"
						>
							<path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
						</svg>
					</div>
					<ul
						class="child transition duration-300 md:absolute top-full left-0 md:w-48 bg-gray-300 md:shadow-lg md:rounded-b "
					>
						<li>
							<span class="menuitem" on:click={() => dispatch('changepwd')}>
								{$_('actions.changePWD')}
							</span>
						</li>
						<li>
							<span class="menuitem" on:click={() => dispatch('html')}>
								{$_('menu.exporthtml')}
							</span>
						</li>
						<li>
							<span class="menuitem" on:click={() => dispatch('epub')}>
								{$_('menu.exportebook')}
							</span>
						</li>
						<li>
							<span class="flex px-4 py-3 hover:bg-gray-200" on:click={() => dispatch('close')}>
								{$_('menu.close')}
							</span>
						</li>
					</ul>
				</li>
				<li class="relative parent">
					<div
						class="flex justify-between md:inline-flex px-4 items-center hover:bg-gray-300 space-x-2"
					>
						<span>{$_('menu.display')}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4 fill-current pt-1"
							viewBox="0 0 24 24"
						>
							<path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" />
						</svg>
					</div>
					<ul
						class="child transition duration-300 md:absolute top-full left-0 md:w-48 bg-gray-300 md:shadow-lg md:rounded-b "
					>
						<li>
							<span
								class="checkitem"
								class:bg-blue-300={visible.book}
								on:click={() => toggle('book')}>{$_('book.metadata')}</span
							>
						</li>
						<li>
							<span
								class="checkitem"
								class:bg-blue-300={visible.chapter}
								on:click={() => toggle('chapter')}>{$_('book.chapter')}</span
							>
						</li>
						<li>
							<span
								class="checkitem"
								class:bg-blue-300={visible.persons}
								on:click={() => toggle('persons')}>{$_('book.persons')}</span
							>
						</li>
						<li>
							<span
								class="checkitem"
								class:bg-blue-300={visible.places}
								on:click={() => toggle('places')}>{$_('book.places')}</span
							>
						</li>
						<li>
							<span
								class="checkitem"
								class:bg-blue-300={visible.notes}
								on:click={() => toggle('notes')}>{$_('book.notes')}</span
							>
						</li>
					</ul>
				</li>
			</ul>
		</nav>
	</div>
</template>

<style>
	.active {
		display: block;
	}

	.checkitem {
		@apply flex px-4 py-3  cursor-pointer;
	}

	.checkitem:hover {
		@apply bg-gray-200;
	}

	.menuitem {
		@apply flex px-4 py-3;
	}
	.menuitem:hover {
		@apply bg-gray-200;
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
