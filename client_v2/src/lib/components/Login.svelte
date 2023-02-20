<script lang="ts">
    import { login } from "../services/fileio";
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    let username: string = "";
    let password: string = "";
    let savecred: boolean = false;

    onMount(async () => {
        const token = localStorage.getItem("token") || "autocheck";
        if (token) {
            try {
                const result = await login(token);
            } catch (err) {
                console.log("invalid token");
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

<div class="w-100vw h-100vh">
    <div
        class="flex flex-col mx-auto bg-blue-100 w-300px h-200px border-2 border-blue-500 p-5 mt-10">
        <input
            class="m-1"
            name="username"
            bind:value={username}
            placeholder={$_("general.username")} />
        <input
            class="m-1"
            name="password"
            bind:value={password}
            type="password"
            placeholder={$_("general.password")} />
        <span class="mt-2">
            <input
                class="mt-2 mr-5"
                type="checkbox"
                bind:checked={savecred} />{$_("actions.autologin")}</span>
        <button class="ring bg-blue-200 mt-3" on:click={doLogin}
            >{$_("actions.login")}</button>
    </div>
</div>
