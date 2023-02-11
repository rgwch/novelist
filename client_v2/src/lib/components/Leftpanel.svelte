<script lang="ts">
    import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';
    import { currentBook } from '../services/store';
    import { _ } from 'svelte-i18n';
    import Chapters from './Chapters.svelte';
    import Book from './Book.svelte';
    let idx = 0;
    currentBook.subscribe((b) => {
        if (b == undefined) {
            idx = 0;
        }
    });
</script>

<template>
    <Tabs initialSelectedIndex={idx}>
        <TabList>
            <Tab>{$_('book.metadata')}</Tab>
            {#if $currentBook}
                <Tab>{$_('book.chapter')}</Tab>
                <Tab>{$_('book.persons')}</Tab>
                <Tab>{$_('book.places')}</Tab>
            {/if}
        </TabList>
        <TabPanel>
            <Book />
        </TabPanel>
        <TabPanel>
            <Chapters />
        </TabPanel>
        <TabPanel>
            <p>Persons</p>
        </TabPanel>
        <TabPanel>
            <p>Places</p>
        </TabPanel>
    </Tabs>
</template>
