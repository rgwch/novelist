<script lang="ts">
  import Leftpanel from './lib/components/Leftpanel.svelte';
  import Rightpanel from './lib/components/Rightpanel.svelte';
  import { ping } from './lib/services/fileio';
  import { _ } from 'svelte-i18n';
  import defs from './lib/services/properties';
  import Buttons from './lib/components/Buttons.svelte';
  import Notes from './lib/components/Notes.svelte';
  import { currentBook } from './lib/services/store';
  function warned() {
    ping();
    window.document.getElementById('warner').style.display = 'none';
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->

<!-- {defs.production}, {defs.build} -->
<div
  class="flex flex-col md:(grid grid-cols-[420px,auto] grid-rows-[min-content,min-content] content-between w-95vw h-90vh) ml-1 p-1">
  <div class="left bg-green-100 m-1 p-1">
    <Leftpanel />
    <div class="h-3">
      <p class="text-gray-800 text-xs">
        {defs.version}, {defs.build}
      </p>
    </div>
  </div>
  <div
    class="right col-start-2 col-span-1 row-span-2 bg-blue-200 h-full border-1">
    <div
      style="display:none"
      id="warner"
      class="ml-2 cursor-pointer text-red-600"
      on:click={warned}>
      <i class="fa fa-hourglass-end mx-2" />{$_('messages.autoclose')}
    </div>
    <Rightpanel />
  </div>
  {#if $currentBook}
    <div class="bg-green-500">
      <div class="h-20 max-h-30">
        <Notes />
      </div>
      <div class="h-6 max-h-6">
        <Buttons />
      </div>
    </div>
  {/if}
</div>

<style windi:preflights:global windi:safelist:global>
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
</style>
