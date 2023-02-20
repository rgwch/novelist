<script>
    import { _ } from 'svelte-i18n';
    import { save, closeBook, integrityCheck } from '../services/fileio';
    import { currentBook } from '../services/store';

    async function close() {
        try {
            await save('metadata', $currentBook);
            await closeBook();
        } catch (err) {
            alert(err);
        }
    }
    async function check(){
        try{
            await integrityCheck()
        }catch(err){
            alert(err)
        }

    }
</script>

<button on:click={close}>{$_('actions.close')}</button>
<button on:click={check}>{$_('actions.check')}</button>
