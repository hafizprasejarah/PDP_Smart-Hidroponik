<script>
    import { onMount } from "svelte";
    import { auth } from "$lib/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import { goto } from "$app/navigation";

    let loading = true;

    onMount(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                goto("/login");
            } else {
                loading = false;
            }
        });
    });
</script>

{#if loading}
    <p class="flex h-screen items-center justify-center">Loading...</p>
{:else}
    <slot /> <!-- halaman anak akan dirender di sini -->
{/if}
