<script>
    import { onMount } from "svelte";
    import { auth } from "$lib/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import { goto } from "$app/navigation";
    import { base } from '$app/paths';

    onMount(() => {
        onAuthStateChanged(auth, (user) => {
            if (auth.currentUser) {
                goto(`${base}/login/admin/dashboard`);
            }
        });
    });
</script>

<slot />
