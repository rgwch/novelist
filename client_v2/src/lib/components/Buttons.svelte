<script>
    import { _ } from "svelte-i18n";
    import { save, closeBook, integrityCheck } from "../services/fileio";
    import { currentBook } from "../services/store";

    async function close() {
        try {
            await save("metadata", $currentBook);
            await closeBook();
        } catch (err) {
            alert(err);
        }
    }
    async function check() {
        try {
            await integrityCheck();
            alert("ok");
        } catch (err) {
            alert(err);
        }
    }
</script>

<div class="flex justify-center">
    <button class="btn" on:click={close}
        >{$_("actions.close")}</button>
    <button class="btn" on:click={check}
        >{$_("actions.check")}</button>
    <button class="btn">Preview</button>
    <button class="btn">E-Book</button>
</div>

<style>
    .btn{
        padding: 1px;
        margin-left: 1px;
        margin-right: 1px;
        background-color: rgba(147, 197, 253);
        flex: 1 1 0%;
    }
</style>