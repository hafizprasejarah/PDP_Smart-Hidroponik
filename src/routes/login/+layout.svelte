<script>
    import { onMount } from "svelte";
    import { auth } from "$lib/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import { goto } from "$app/navigation";

    onMount(() => {
        onAuthStateChanged(auth, (user) => {
            if (auth.currentUser) {
                goto("/login/admin/dashboard");
            }
        });
    });
</script>

<slot />
