<script lang="ts">
    import { currentBook, currentChapter } from '../services/store';
    import { load, save } from '../services/fileio';
    import Elementlist from '../widgets/Elementlist.svelte';
    const elements = $currentBook?.chapters;
    const newelem = 'book.newchapter';
    const promptname = 'book.nochaptername';
    function update(event) {}
    async function selected(event) {
        try {
            if ($currentChapter) {
                await save('chapters', $currentChapter);
            }
            const l = await load('chapters', event.detail);
            currentChapter.set(l);
        } catch (err) {
            alert(err);
        }
    }
</script>

<template>
    <Elementlist
        {elements}
        {newelem}
        {promptname}
        on:update={update}
        on:selected={selected}
    />
</template>
