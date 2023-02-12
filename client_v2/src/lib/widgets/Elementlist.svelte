<!--
	A list of arbitrary objects
-->
<script lang="ts">
	import "@fortawesome/fontawesome-free/js/solid";
	import "@fortawesome/fontawesome-free";
	import { _ } from "svelte-i18n";
	import { arrayMoveImmutable as move } from "array-move";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	/** List of Elements in consumer-defined format */
	export let elements = [];
	/** Title for the "new Element" input */
	export let newelem = "New...";
	/** Title for the "Edit"- Prompt */
	export let promptname = "New";
	/** function returns true if element shuld be displayed */
	export let filter: (elem) => boolean = (n) => true;
	/** function returns string as label for element */
	export let label: (elem) => string = (n) => n?.toString();
	/** function creates new element from label */
	export let create: (label) => Promise<any> = (l) => Promise.resolve(l);

	let currentElement;

	let newelement: string;
	async function addElement() {
		if (newelement) {
			const e = await create(newelement);
			elements = [...elements, e];
			newelement = "";
		} else {
			alert($_(promptname));
		}
	}

	function select(item) {
		currentElement = item;
		dispatch("selected", item);
	}
	function up(elem) {
		const arr = elements;
		const idx = arr.indexOf(elem);
		elements = move(arr, idx, idx - 1);
		dispatch("update", elem);
	}
	function down(elem) {
		const arr = elements;
		const idx = arr.indexOf(elem);
		elements = move(arr, idx, idx + 1);
		dispatch("update", elem);
	}
	function del(elem) {
		console.log("del " + elem);
		if (confirm($_("messages.reallydelete", { values: { element: elem } }))) {
			const idx = elements.indexOf(elem);
			elements.splice(idx, 1);
			dispatch("update", null);
		}
	}
	async function edit(elem) {
		const newtitle = prompt($_(promptname));
		if (newtitle) {
			const idx = elements.indexOf(elem);
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="h-full max-w-60">
	{#if elements && Array.isArray(elements)}
		{#each elements as elem}
			{#if filter(elem)}
				<div class="item relative">
					<div
						class={currentElement == elem ? "font-bold" : "font-normal"}
						on:click={() => select(elem)}
					>
						<span class="z-0">{@html label(elem)}</span>
						<span class="absolute right-0 px-3 z-10 bg-blue-100 top-0">
							<span on:click={() => up(elem)}
								><i class="fa fa-angle-up " /></span
							>
							<span on:click={() => down(elem)} class="px-2"
								><i class="fa fa-angle-down" />
							</span>
							<span on:click={() => edit(elem)}
								><i class="fa fa-edit pointer-events-auto" /></span
							>
							<span on:click={() => del(elem)}
								><i class="fa fa-trash pointer-events-auto" /></span
							>
						</span>
					</div>
				</div>
			{/if}
		{/each}
	{/if}
	<div class="m-1">
		<input
			class="border-2"
			type="text"
			bind:value={newelement}
			placeholder={$_(newelem)}
		/>
		<span on:click={addElement} class="bg-green-400 border-2">Neu...</span>
	</div>
</div>
