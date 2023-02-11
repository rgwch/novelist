<script lang="ts">
  import Menu from './lib/widgets/Menu.svelte';
  import Leftpanel from './lib/components/Leftpanel.svelte';
  import mainMenu from './menu';
  import { closeBook } from './lib/services/fileio';
  import { _ } from 'svelte-i18n';

  function menuselect(event) {
    switch (event.detail) {
      case 'menuClose':
        closeBook();
        break;
    }
  }
</script>

<template>
  <main>
    <Menu menudef={mainMenu} on:menuselect={menuselect} />

    <div class="container mt-30px">
      <div
        class="grid grid-cols-[400px,auto] grid-rows-[min-content,min-content,min-content]"
      >
        <div class="left bg-green-100"><Leftpanel /></div>
        <div class="right col-start-2 col-span-1 row-span-3 bg-blue-100">
          right
        </div>
        <div class="left2 col-start-1 col-span-1">Left2</div>
        <div class="right2 col-start-2 col-span-1">right2</div>
        <div class="left3 col-start-1">Left3</div>
        <div class="right3 col-start-2">right3</div>
      </div>
    </div>
  </main>
</template>

<style windi:preflights:global windi:safelist:global>
</style>
