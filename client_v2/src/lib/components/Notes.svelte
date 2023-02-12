<script lang="ts">
  import { currentBook } from '../services/store';
  import { onMount } from 'svelte';
  import { load, save as do_save } from '../services/fileio';

  let note: note_def = {
    name: $currentBook?.title + ' - notes',
    text: '',
  };
  currentBook.subscribe((b) => {
    load('notes', '').then((n: note_def) => {
      note = n;
    });
  });

  function save(): void {
    do_save('notes', note)
      .then((ok) => {
        if (!ok) {
          alert('Error');
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
</script>

<template>
  <textarea
    class="border-2 border-solid w-full h-full"
    on:blur={save}
    bind:value={note.text}
  />
</template>
