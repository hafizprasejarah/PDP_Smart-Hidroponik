<script>
    import { onMount } from "svelte";
    import { auth, db } from "$lib/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import { doc, getDoc, collection, getDocs } from "firebase/firestore";
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";

    let loading = true;

    onMount(() => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                goto(`${base}/login`);
            }

            // Ambil role dari Firestore
            const userSnap = await getDoc(doc(db, "users", user.uid));
            const userData = userSnap.data();

            if (!userData?.role || userData.role !== "admin") {
                goto(`${base}/`);
                return;
            }

            loading = false;
        });
    });
</script>

{#if loading}
    <p class="flex h-screen items-center justify-center">Loading...</p>
{:else}
    <slot /> <!-- halaman anak akan dirender di sini -->
{/if}
