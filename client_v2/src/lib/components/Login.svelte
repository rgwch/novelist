<script lang="ts">
    import { login } from "../services/fileio";
    import { onMount } from "svelte";
    let username: string = "";
    let password: string = "";
    let savecred: boolean = false;

    onMount(async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try{
            const result=await login(token)
            }catch(err){
                console.log("invalid token")
                // localStorage.removeItem("token")
            }
        }
    });

    async function doLogin() {
        try {
            const token = await login(username, password);
            if (token && savecred) {
                localStorage.setItem("token", token);
            } else {
                localStorage.removeItem("token");
            }
        } catch (err) {
            alert(err);
        }
    }
</script>

<div class="flex flex-col">
    <input name="username" bind:value={username} placeholder="Username" />
    <input
        name="password"
        bind:value={password}
        type="password"
        placeholder="Password"
    />
    <span
        >Save<input
            class="ml-5"
            type="checkbox"
            bind:checked={savecred}
        /></span
    >
    <button on:click={doLogin}>Login</button>
</div>
