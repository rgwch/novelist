<script lang="ts">
  import Editor from "./Editor.svelte";
  import { onMount } from "svelte";
  let contents: string = "";
  import { load, save as do_save} from "../services/fileio";

  function save(text: string): void {
    contents = text;
    do_save("notes", text)
      .then((ok) => {
        if (!ok) {
          alert("Error");
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
  onMount(async () => {
    try {
      contents = await load("notes", "");
    } catch (err) {
      alert(err);
    }
  });
</script>

<template>
  <Editor {save} {contents} />
</template>
