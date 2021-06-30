<script>
    import {onMount} from 'svelte'
	
    let hamburgerbtn
    let mobileMenu


</script>

<template>
	<div class="container mx-auto bg-purple-300 p-5">
		<nav class="flex-row md:justify-between">
			<div class="flex flex-row justify-between">
				<a href="#">Logfo</a>

				<p class="md:hidden bg-purple-200" bind:this={hamburgerbtn} on:click={()=>{mobileMenu.classList.toggle('active')}}>menu</p>
			</div>

			<ul class="hidden md:flex md:flex-row active" bind:this={mobileMenu}>
				<li class="pr-5"><a> Services </a></li>
				<li class="pr-5"><a>Porfolio</a></li>
				<li class="pr-5"><a>About</a></li>
				<li><a>Contact</a></li>
			</ul>
		</nav>
	</div>
</template>

<style>
    .active{
        display:block;
    }
</style>