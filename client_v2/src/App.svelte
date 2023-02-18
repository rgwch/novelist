<script lang="ts">
  import Leftpanel from './lib/components/Leftpanel.svelte';
  import Rightpanel from './lib/components/Rightpanel.svelte';
  import Chapter from './lib/components/Chapter.svelte';
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
<div class="parent p-5 bg-blue-100">
  <div class="div1">
    <Leftpanel />
    <div class="h-3">
      <p class="text-gray-400 text-xs">
        {defs.version}, {defs.build}
      </p>
    </div>
  </div>
  <div class="div2">
    <Notes />
  </div>
  <div class="div3">
    <Buttons />
  </div>
  <div class="div4">
    <div style="display:none" id="warner" class="warn" on:click={warned}>
      <i class="fa fa-hourglass-end mx-2" />{$_('messages.autoclose')}
    </div>
    <Chapter />
  </div>
  <!-- div class=" bg-blue-200 border-1 row-span-2">
    <div
      style="display:none"
      id="warner"
      class="ml-2 cursor-pointer text-red-600"
      on:click={warned}>
      <i class="fa fa-hourglass-end mx-2" />{$_('messages.autoclose')}
    </div -->
</div>
{#if false}
  <div class="bg-green-500">
    <div class="h-20">
      <Notes />
    </div>
    <div class="h-6 max-h-6">
      <Buttons />
    </div>
  </div>
{/if}

<style windi:preflights:global windi:safelist:global>
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  @media screen and (min-width: 768px) {
    .parent {
      margin-left: 5px;
      display: grid;
      grid-template-columns: 400px auto;
      grid-template-rows: auto auto 1.5rem;
      grid-column-gap: 8px;
      grid-row-gap: 2px;
      height: 95vh;
      width: 95vw;
      align-content: space-between;
    }

    .div1 {
      grid-area: 1 / 1 / 2 / 2;
    }
    .div2 {
      grid-area: 2 / 1 / 3 / 2;
    }
    .div3 {
      grid-area: 3 / 1 / 4 / 2;
      height: 1.5rem;
      max-height: 1.5rem;
      background-color: rgba(16, 185, 129);
    }
    .div4 {
      grid-area: 1 / 2 / 4 / 3;
      background-color: rgba(191, 219, 254);
      width: 100%;
      padding-left: 4px;
      margin-left: 4px;
    }
  }
  @media screen and (max-width: 768px) {
    .parent {
      display: flex;
      flex-direction: column;
    }
  }
  .warn {
    background-color: rgba(220, 38, 38);
    cursor: pointer;
  }
</style>
