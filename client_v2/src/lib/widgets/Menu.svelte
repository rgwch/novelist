<script context="module">
    export type MenuDef = {
        name: string | Array<MenuDef>;
        label: string;
    };
    
</script>

<script lang="ts">
    import {createEventDispatcher} from 'svelte'
    const dispatch=createEventDispatcher()
    export let menudef: Array<MenuDef> = [];
    let hamburgerbtn;
    let expanded=false;
</script>

<template>
    <div class="fixed z-50 w-full bg-gray-300-py-1" id="menubar">
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
            <ul class="hidden md:(flex,flex-row)">
                {#each menudef as item}
                    
                {/each}
            </ul> 
        </nav>
    </div>
</template>
