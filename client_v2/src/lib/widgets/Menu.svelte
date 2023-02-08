<script lang="ts">
    import Popup from './Popup.svelte';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let menudef: Array<MenuDef> = [];
    let hamburgerbtn;
    let expanded = false;
</script>

<template>
    <div class="fixed z-50 top-0 w-full bg-gray-300 py-1" id="menubar">
        <nav class="flex-row md:justify-between">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <img
                src="/hamburger.png"
                alt="menu"
                class="md:hidden bg-gray-300"
                bind:this={hamburgerbtn}
                on:click={() => {
                    expanded = !expanded;
                }}
            />
            <ul class="hidden md:(flex flex-row px-2 mx-2) cursor-pointer">
                {#each menudef as item}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    {#if typeof item.name == 'string'}
                        <li
                            class="mr-2 pr-2"
                            on:click={() => dispatch('menuselect', item.name)}
                        >
                            {item.label}
                        </li>
                    {:else}
                        <Popup items={item.name} on:menuselect />
                    {/if}
                {/each}
            </ul>
        </nav>
    </div>
</template>
