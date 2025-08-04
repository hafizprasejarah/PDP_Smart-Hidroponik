<script>
    import { onMounnt } from "svelte";

    onMounnt(() => {
        const navbar = document.getElementById("navbar");
        const navBtn = document.getElementById("btnnav");

        navBtn.onclick = () => {
            if (navbar.classList.contains("w-0")) {
                navbar.classList.remove("w-0");
                navbar.classList.add("w-[70px]");
                navBtn.classList.add("rotate-90");
                navBtn.classList.add("text-white");
                navBtn.classList.remove("text-blue-500");
            } else {
                navbar.classList.remove("w-[70px]");
                navBtn.classList.remove("rotate-90");
                navbar.classList.add("w-0");

                navBtn.classList.add("text-blue-500");
                navBtn.classList.remove("text-white");
            }
        };
    });

    async function logout() {
        try {
            await signOut(auth);
            alert("Logout berhasil!");
            goto("/login"); // Redirect ke halaman login
        } catch (error) {
            alert(`Logout gagal: ${error.message}`);
        }
    }
</script>

<div class="w-full flex flex-row bg-[#f4f7fa]">
    <div
        class="bg-blue-400 min-h-screen w-0n overflow-hidden transition-[width] duration-300 ease-in-out"
        id="navbar"
    >
        <nav class="mx-[20px] my-[20px] text-[20px]">
            <ul>
                <li>
                    <div
                        class="fa-solid fa-xmark text-[28px] absolute font-bold text-blue-500 cursor-pointer transition-all duration-300 ease-in-out"
                        id="btnnav"
                    ></div>
                </li>
                <li class="relative top-8 cursor-pointer">
                    <div class="fa-solid fa-user"></div>
                </li>

                <li class="relative top-8">
                    <a
                        href="log/"
                        aria-label="Riwayat log"
                        class="cursor-pointer"
                        ><div class="fa-solid fa-clock-rotate-left"></div></a
                    >
                </li>
            </ul>
        </nav>
    </div>

    <div class="w-full flex flex-col mx-6">
        <div class="shadow-xl px-6 rounded-[15px]">
            <div class="flex flex-row justify-between">
                <div class="py-12 text-2xl font-medium">
                    History <span class="font-semibold">|</span>
                    <span class="text-[12px] tracking-[3px]"
                        >Smart Hidroponik</span
                    >
                </div>

                <button type="button">Unduh</button>
            </div>

            <div
                class="grid grid-cols-9 gap-2 text-sm font-medium p-4 bg-gray-100"
            >
                <!-- header -->
                <div>Waktu</div>
                <div>Suhu</div>
                <div>Kelembapan</div>
                <div>pH Air</div>
                <div>Nutrisi</div>
                <div>Curah Hujan</div>
                <div>Ketinggian Air</div>
                <div>Pompa 1</div>
                <div>Pompa 2</div>

                <!-- baris data -->
                <!-- {#each relay.relays as status, i}
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                {/each} -->
            </div>
        </div>
    </div>
</div>
