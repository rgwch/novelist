<!-- 
	@component
	A dropdown list. Dispatches a 'selected' event if user changes selection.
	Allows to create new Elements.
  Dispatches 'select' if selection changes
	
-->
<script lang="ts">
	import { SvelteComponentTyped } from "svelte";
	import { _ } from "svelte-i18n";
	import { onMount } from "svelte";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	/**
	 * Definition of the items and the prompts to add new elements
	 */
	export let elements = [];
	export let newelem: string = "New...";
	export let promptname: string = "New";
	/** function returns true if element shuld be displayed */
	export let filter: (elem) => boolean = (n) => true;
	/** function returns string as label for element */
	export let label: (elem) => string = (n) => n?.toString();
	/** function creates new element from label */
	export let create: (label) => Promise<any> = (l) => Promise.resolve(l);

	let value;

	onMount(() => {
		if (Array.isArray(elements) && elements.length > 0) {
			dispatch("selected", elements[0]);
		}
	});

	function select() {
		if (value === "_new") {
			value = prompt($_(newelem));
			if (value) {
				create(value)
					.then((ok) => {
						elements = [...elements, value];
						dispatch("selected", value);
					})
					.catch((err) => {
						alert(err);
					});
			} else {
				alert($_(promptname));
				value = elements[0];
			}
		} else {
			dispatch("selected", value);
		}
	}
</script>

<!-- svelte-ignore a11y-no-onchange -->
<select class="flex-grow" bind:value on:change={select} on:click={select}>
	{#each elements as elem}
		{#if filter(elem)}
			<option value={elem} class="item">
				{label(elem)}
			</option>
		{/if}
	{/each}
	<option value="_new">{$_(newelem)}...</option>
</select>
