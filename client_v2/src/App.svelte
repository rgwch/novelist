<script lang="ts">
  import Menu from './lib/widgets/Menu.svelte';
  import Leftpanel from './lib/components/Leftpanel.svelte';
  import Rightpanel from './lib/components/Rightpanel.svelte';
  import mainMenu from './menu';
  import { closeBook } from './lib/services/fileio';
  import { _ } from 'svelte-i18n';
  import Rigthpanel from './lib/components/Rightpanel.svelte';

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
      <div class="grid grid-cols-[400px,auto] grid-rows-[min-content]">
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
