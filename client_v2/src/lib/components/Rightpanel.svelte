<script lang="ts">
    import { currentChapter } from "../services/store";
    import Chapter from "../components/Chapter.svelte";
    import Notes from "../components/Notes.svelte";
</script>

<div class="flex flex-col bg-red-100 h-full pb-30px">
    <div class="flex-auto">
        <Chapter />
    </div>
    <div>
        <Notes />
    </div>
</div>
