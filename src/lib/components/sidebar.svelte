<script>
    import { page } from "$app/stores";
    import Logo from "$lib/components/logo.svg.svelte";
    import { derived } from "svelte/store";
    import { base } from "$app/paths";
    import { auth } from "$lib/firebase";
    import { goto } from "$app/navigation";
    import { signOut } from "firebase/auth";

    const currentPath = derived(page, ($page) => $page.url.pathname);

    async function logout() {
        try {
            await signOut(auth);

            goto(`${base}/login`);
        } catch (error) {
            alert(`Logout gagal: ${error.message}`);
        }
    }
</script>

<div
    class=" hidden sm:block fixed bg-blue-500 min-h-screen w-[80px] overflow-hidden transition-[width] duration-300 ease-in-out"
    id="navbar"
>
    <div
        class="flex flex-row items-center gap-2  w-full px-6 py-[10px] top-[20px] relative bg-[#59b23b]"
    >
        <div>
            <Logo />
        </div>
        <span class="sidebar-label text-[15px] text-white font-bold self-end"
            >Hidroponik</span
        >
    </div>

    <nav class="m-6 relative top-[-15px]">
        <ul class="flex flex-col gap-3">
            <li class="relative top-8 cursor-pointer">
                <a
                    href="{base}/login/admin/dashboard"
                    class={`flex items-center gap-4 p-2  rounded-md transition duration-200 hover:bg-white/30 ${
                        currentPath === "{base}/login/admin/dashboard"
                            ? "bg-white/30 text-white font-semibold"
                            : "text-white/70"
                    }`}
                >
                    <i class="fa-solid fa-chart-line"></i>
                    <span class="sidebar-label text-[12px]">Dashboard</span>
                </a>
            </li>

            <li class="relative top-8">
                <a
                    href="{base}/login/admin/log"
                    class={`flex items-center gap-4 p-2 rounded-md transition duration-200 hover:bg-white/30 ${
                        currentPath === "{base}/login/admin/log"
                            ? "bg-white/30 text-white font-semibold"
                            : "text-white/70"
                    }`}
                >
                    <i class="fa-solid fa-clock-rotate-left"></i>
                    <span class="sidebar-label text-[12px]">Riwayat</span>
                </a>
            </li>
        </ul>
    </nav>
</div>


<div
    class="sm:hidden fixed bottom-0 left-0 right-0 bg-blue-500 text-white shadow-lg z-50 flex justify-center w-full"
>
    <ul class="flex justify-around items-center py-2 w-[80%]">
        <li>
            <a
                href="{base}/login/admin/dashboard"
                class={`flex flex-col items-center text-xs ${
                    currentPath === "{base}/login/admin/dashboard"
                        ? "text-white font-semibold"
                        : "text-white/70"
                }`}
            >
                <i class="fa-solid fa-chart-line text-lg"></i>
                Dashboard
            </a>
        </li>

        <li>
            <a
                href="{base}/login/admin/log"
                class={`flex flex-col items-center text-xs ${
                    currentPath === "{base}/login/admin/log"
                        ? "text-white font-semibold"
                        : "text-white/70"
                }`}
            >
                <i class="fa-solid fa-clock-rotate-left text-lg"></i>
                Riwayat
            </a>
        </li>

        <li>
            <button
                type="submit"
                on:click={logout}
                class="h-fit block sm:block text-xs text-white/70 rounded-md hover:scale-110 transition duration-200"
            >
                <i class="fa-solid fa-right-from-bracket text-lg"></i>
                <div>Keluar</div>
            </button>
        </li>
    </ul>
</div>

<style>
    .active-icon {
        color: #fff;
        transform: scale(1.1);
    }

    #navbar:hover {
        width: 170px;
    }

    .sidebar-label {
        opacity: 0;
        width: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    #navbar:hover .sidebar-label {
        opacity: 1;
        width: auto; /* atau width: 100px; tergantung kebutuhan */
        visibility: visible;
    }
</style>
