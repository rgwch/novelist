<script lang="ts">
    import { _ } from "svelte-i18n";
    import {
        save,
        closeBook,
        integrityCheck,
        toEpub,
        toHtml,
    } from "../services/fileio";
    import props from "../services/properties";

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
    async function exportHtml() {
        try {
            const html = await toHtml();
            const win: Window = window.open("_blank");
            if (win) {
                win.document.write(html);
                win.document.title=$currentBook.title

            } else {
                alert("please allow pop-ups from this site");
            }
        } catch (err) {
            alert(err);
        }
    }
    async function exportEPub() {
        try {
            const title = $currentBook.title ?? "export";
            const data = await toEpub(title + ".epub");
            const anchor = document.createElement("a");
            anchor.href = "http://localhost:2999/" + data;
            if (props.production == "true") {
                anchor.href = "/" + data;
            }
            anchor.target = "_blank";
            anchor.download = data;
            anchor.click();
        } catch (err) {
            alert(err);
        }
    }
</script>

<div class="flex justify-center">
    <button class="btn" on:click={close}>{$_("actions.close")}</button>
    <button class="btn" on:click={check}>{$_("actions.check")}</button>
    <button class="btn" on:click={exportHtml}
        >{$_("actions.generateHTML")}</button>
    <button class="btn" on:click={exportEPub}
        >{$_("actions.generateEPUB")}</button>
</div>

<style>
    .btn {
        padding: 1px;
        margin-left: 1px;
        margin-right: 1px;
        background-color: rgba(147, 197, 253);
        flex: 1 1 0%;
    }
</style>
