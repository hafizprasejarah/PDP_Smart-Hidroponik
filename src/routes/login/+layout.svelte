<script>
    import { auth, db } from "$lib/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import { doc, getDoc, collection, getDocs } from "firebase/firestore";
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { onMount } from "svelte";

    onMount(() => {
            
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                goto(`${base}`); // kalau belum login
                return;
            }

            // Ambil role dari Firestore
            const userSnap = await getDoc(doc(db, "users", user.uid));
            const userData = userSnap.data();
            

            if (userData?.role == "admin") {    
                goto(`${base}/login/admin/dashboard`);

            }else if(userData?.role == undefined){
                goto(`${base}/login`); // redirect kalau bukan admin
                return;
                
            }
        });
    });
</script>

<slot />
