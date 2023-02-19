<script lang="ts">
    import { login } from '../services/fileio';
    let username: string = '';
    let password: string = '';
    let savecred: boolean = false;
</script>

<div class="flex flex-col">
    <input name="username" bind:value={username} placeholder="Username" />
    <input
        name="password"
        bind:value={password}
        type="password"
        placeholder="Password" />
    <span
        >Save<input
            class="ml-5"
            type="checkbox"
            bind:checked={savecred} /></span>
    <button on:click={() => login(username, password)}>Login</button>
</div>
