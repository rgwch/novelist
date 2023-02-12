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

<template>
  <!-- svelte-ignore a11y-click-events-have-key-events -->

  <main>
    <div class="container p-2">
      <div
        style="display:none"
        id="warner"
        class="ml-2 cursor-pointer text-red-600"
        on:click={warned}>
        <i class="fa fa-hourglass-end mx-2" />{$_('messages.autoclose')}
      </div>
      <div
        class="grid grid-cols-[400px,auto] grid-rows-[min-content] h-screen w-screen">
        <div class="left bg-green-100"><Leftpanel /></div>
        <div class="right col-start-2 col-span-1 row-span-3 bg-blue-100">
          <Rightpanel />
        </div>
      </div>
    </div>
  </main>
</template>

<style windi:preflights:global windi:safelist:global>
</style>
