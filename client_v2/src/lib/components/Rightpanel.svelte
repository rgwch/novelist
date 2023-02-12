<script lang="ts">
    import { currentChapter } from '../services/store';
    import Chapter from '../components/Chapter.svelte';
    import Notes from '../components/Notes.svelte';
</script>

<template>
    <div>
        <Chapter />
    </div>
    <div>
        <Notes />
    </div>
</template>
