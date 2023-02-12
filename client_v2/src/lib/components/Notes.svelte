<script lang="ts">
  import { currentBook } from "../services/store";
  import { onMount } from "svelte";
  import { load, save as do_save } from "../services/fileio";

  let note: note_def = {
    name: "notes",
    text: "",
  };
  currentBook.subscribe((b) => {
    load("notes", "")
      .then((n: note_def) => {
        if (!n.text) {
          note = {
            name: "note",
            text: n.toString(),
          };
        } else {
          note = n;
        }
      })
      .catch((errmsg) => {
        note = {
          name: "note",
          text: "",
        };
        console.log(errmsg);
      });
  });

  function save(): void {
    do_save("notes", note)
      .then((ok) => {
        if (!ok) {
          alert("Error");
        }
      })
      .catch((err) => {
        alert(err);
      });
  }
</script>

<textarea
  class="border-2 border-solid w-full h-full"
  on:blur={save}
  bind:value={note.text}
/>
