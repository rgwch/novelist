<script lang="ts">
  import Menu, { type MenuDef } from "./lib/widgets/Menu.svelte";
  const def: Array<MenuDef> = [
    { name: "first", label: "eins" },
    { name: "second", label: "zwei" },
  ];
</script>

<main>
  
  <Menu
    menudef={def}
    on:menuselect={(event) => {
      console.log(event.detail);
    }}
  />

  <div class="container mt-30px">
    <div
      class="grid grid-cols-[200px,auto] grid-rows-[min-content,min-content,min-content"
    >
      <div class="left bg-green-100">Left<br />2<br />3<br /></div>
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

<style windi:preflights:global windi:safelist:global>
</style>
