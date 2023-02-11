<script lang="ts">
    import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';
    import { currentBook } from '../services/store';
    import { _ } from 'svelte-i18n';
    import Chapter from './Chapter.svelte';
    import Book from './Book.svelte';
</script>

<template>
    <Tabs>
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
            <p>Chapter</p>
        </TabPanel>
        <TabPanel>
            <p>Persons</p>
        </TabPanel>
        <TabPanel>
            <p>Places</p>
        </TabPanel>
    </Tabs>
</template>
