<script lang="ts">
  import Leftpanel from './lib/components/Leftpanel.svelte';
  import Rightpanel from './lib/components/Rightpanel.svelte';
  import { ping } from './lib/services/fileio';
  import { _ } from 'svelte-i18n';
  import defs from './lib/services/properties';
  function warned() {
    ping();
    window.document.getElementById('warner').style.display = 'none';
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->

<!-- {defs.production}, {defs.build} -->
<div
  class="flex flex-col md:(grid grid-cols-[400px,auto] grid-rows-[min-content] w-95vw) ml-1 p-1">
  <div class="left bg-green-100 m-1 p-1 h-95vh"><Leftpanel /></div>
  <div
    class="right col-start-2 col-span-1 row-span-2 bg-blue-300 h-full border-1">
    <div
      style="display:none"
      id="warner"
      class="ml-2 cursor-pointer text-red-600"
      on:click={warned}>
      <i class="fa fa-hourglass-end mx-2" />{$_('messages.autoclose')}
    </div>
    <Rightpanel />
  </div>
</div>

<style windi:preflights:global windi:safelist:global>
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
</style>
