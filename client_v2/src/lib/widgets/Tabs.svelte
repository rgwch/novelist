<script lang="ts">
    export let tabs;
    export let activeTab = 0;
</script>

<template>
    {#each tabs as tab, idx}
        {#if tab.display}
            <button
                class="tab"
                class:active={idx === activeTab}
                on:click={() => {
                    activeTab = idx;
                }}>
                {tab.name}
            </button>
        {/if}
    {/each}
    {#each tabs as tab, idx}
        {#if idx === activeTab}
            <svelte:component this={tab.content} />
        {/if}
    {/each}
</template>

<style>
    .tab {
        margin-right: 4px;
        padding-left: 2px;
    }
    .tab.active {
        border-bottom: 1px solid blue;
    }
</style>
