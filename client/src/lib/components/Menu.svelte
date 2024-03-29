<script lang="ts">
	import { current, ping, integrityCheck, openCurrent } from '../services/fileio';
	import { _ } from 'svelte-i18n';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let visible = {
		book: false,
		chapter: false,
		persons: false,
		places: false,
		notes: false,
		timeline: false
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
	function warned() {
		ping();
		window.document.getElementById('warner').style.display = 'none';
	}
	async function check() {
		const res = await integrityCheck();
		if (res) {
			const res = await openCurrent();
			alert(res.title + ' ok');
		} else {
			alert('Fehler');
		}
	}
  function close(){
    visible.chapter=false
    visible.persons=false
    visible.places=false
    visible.notes=false
    visible.book=false
    dispatch('close')
  }
</script>

<template>
	<div class="fixed z-50 w-full bg-gray-300 py-1" id="menubar">
		<nav class="flex-row md:justify-between">
			<img
				src="/hamburger.png"
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
						<span id="menuFile">{$_('menu.file')}</span>
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
							<span class="menuitem" id="menuChangepwd" on:click={() => dispatch('changepwd')}>
								{$_('actions.changePWD')}
							</span>
						</li>
						<li>
							<span class="menuitem" id="menuGeneratehtml" on:click={() => dispatch('html')}>
								{$_('actions.generateHTML')}
							</span>
						</li>
						<li>
							<span class="menuitem" id="menuGenerateepub" on:click={() => dispatch('epub')}>
								{$_('actions.generateEPUB')}
							</span>
						</li>
						<li>
							<span id="menuCheck" class="menuitem" on:click={check}>
								{$_('actions.check')}
							</span>
						</li>
						<li>
							<span id="menuClose" class="menuitem" on:click={close}>
								{$_('actions.close')}
							</span>
						</li>
					</ul>
				</li>
				<li class="relative parent">
					<div
						class="flex justify-between md:inline-flex px-4 items-center hover:bg-gray-300 space-x-2"
					>
						<span id="menuDisplay">{$_('menu.display')}</span>
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
								id="menuBook"
								class="checkitem"
								class:bg-blue-300={visible.book}
								on:click={() => toggle('book')}>{$_('book.metadata')}</span
							>
						</li>
						<li>
							<span
								id="menuChapter"
								class="checkitem"
								class:bg-blue-300={visible.chapter}
								on:click={() => toggle('chapter')}>{$_('book.chapter')}</span
							>
						</li>
						<li>
							<span
								id="menuPersons"
								class="checkitem"
								class:bg-blue-300={visible.persons}
								on:click={() => toggle('persons')}>{$_('book.persons')}</span
							>
						</li>
						<li>
							<span
								id="menuPlaces"
								class="checkitem"
								class:bg-blue-300={visible.places}
								on:click={() => toggle('places')}>{$_('book.places')}</span
							>
						</li>
						<li>
							<span
								id="menuNotes"
								class="checkitem"
								class:bg-blue-300={visible.notes}
								on:click={() => toggle('notes')}>{$_('book.notes')}</span
							>
						</li>
						<li>
							<span
								id="menuTimeline"
								class="checkitem"
								class:bg-blue-300={visible.timeline}
								on:click={() => toggle('timeline')}>{$_('book.timeline')}</span
							>
						</li>
					</ul>
				</li>
			</ul>
		</nav>
		<div
			style="display:none"
			id="warner"
			class="ml-2 cursor-pointer text-red-600"
			on:click={warned}
		>
			<i class="fa fa-hourglass-end mx-2" />{$_('messages.autoclose')}
		</div>
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
