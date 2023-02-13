<script lang="ts">
  import Leftpanel from './lib/components/Leftpanel.svelte';
  import Rightpanel from './lib/components/Rightpanel.svelte';
  import { ping } from './lib/services/fileio';
  import { _ } from 'svelte-i18n';
  function warned() {
    ping();
    window.document.getElementById('warner').style.display = 'none';
  }
</script>

  <!-- svelte-ignore a11y-click-events-have-key-events -->

  <main class="w-max">
    <div class="container overflow-hidden ml-2 p-1 w-screen">
      <div
        style="display:none"
        id="warner"
        class="ml-2 cursor-pointer text-red-600"
        on:click={warned}>
        <i class="fa fa-hourglass-end mx-2" />{$_('messages.autoclose')}
      </div>
      <div
        class="flex flex-col md:(grid grid-cols-[400px,auto] grid-rows-[min-content]) ml-1 p-1">
        <div class="left bg-green-100 m-1 p-1"><Leftpanel /></div>
        <div class="right col-start-2 col-span-1 row-span-3 bg-blue-300 h-screen border-1">
          <Rightpanel />
        </div>
      </div>
    </div>
  </main>

<style windi:preflights:global windi:safelist:global>
</style>
