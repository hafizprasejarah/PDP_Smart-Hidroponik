<script>
    import { onMount } from "svelte";
    import { rtdb } from "$lib/firebase";
    import { ref, onValue } from "firebase/database";
    import {
        getProgress,
        getProgressHumidity,
        getProgresspH,
        getProgressRain,
        getProgressNutrition,
        getProgressWaterHeigt,
    } from "$lib/index";
    import { auth } from "$lib/firebase";
    import { signOut } from "firebase/auth";
    import { goto } from "$app/navigation";

    let sensorData = [];
    let relay = [];

    onMount(() => {
        //iterasi data
        const relayRef = ref(rtdb, "status/");
        onValue(relayRef, (snapshot) => {
            const data = snapshot.val();
            relay = [
                {
                    relayStatus: data?.relay1 == 0 ? "OFF" : "ON",
                },
                {
                    relayStatus: data?.relay2 == 0 ? "OFF" : "ON",
                },
            ];
        });

        const sensorRef = ref(rtdb, "sensor/");
        onValue(sensorRef, (snapshot) => {
            const data = snapshot.val();
            sensorData = [
                {
                    label: "Suhu Udara",
                    value: data?.suhu ?? 0,
                    unit: "°C",
                    progress: getProgress(data?.suhu || 0),
                },
                {
                    label: "pH",
                    value: data?.pH ?? 0,
                    unit: "pH",
                    progress: getProgresspH(data?.pH || 0),
                },
                {
                    label: "Curah Hujan",
                    value: data?.curahHujan ?? 0,
                    unit: "mm",
                    progress: getProgressRain(data?.curahHujan || 0),
                },
                {
                    label: "Kelembapan",
                    value: data?.kelembaban ?? 0,
                    unit: "%",
                    progress: getProgressHumidity(data?.kelembaban || 0),
                },
                {
                    label: "Nutrisi (TDS)",
                    value: data?.tds ?? 0,
                    unit: "ppm",
                    progress: getProgressNutrition(data?.tds || 0),
                },
                {
                    label: "Tinggi Air",
                    value: data?.waterLevel ?? 0,
                    unit: "liter",
                    progress: getProgressNutrition(data?.waterLevel || 0),
                },
                {
                    label: "Suhu Air",
                    value: data?.suhuAir ?? 0,
                    unit: "°C",
                    progress: getProgressWaterHeigt(data?.suhuAir || 0),
                },
            ];
        });

        //sidebar

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
            goto("/admin"); // Redirect ke halaman login
        } catch (error) {
            alert(`Logout gagal: ${error.message}`);
        }
    }
</script>

<div class="w-full flex flex-row bg-[#f4f7fa]">
    <div
        class="bg-blue-400 min-h-screen w-0 overflow-hidden transition-[width] duration-300 ease-in-out"
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
        <div class="py-12 text-2xl font-medium px-6">
            Admin <span class="font-semibold">|</span>
            <span class="text-[12px] tracking-[3px]">Smart Hidroponik</span>
        </div>
        <div class="flex flex-wrap gap-3 px-6">
            {#each sensorData as item}
                <div
                    class="bg-white rounded-xl shadow p-4 border-2 border-blue-500"
                >
                    <div class="flex gap-5 content-end">
                        <div
                            class="fa-solid fa-water-ladder text-4xl mb-2 text-blue-500 m-2"
                            style="display: flex; align-items: center;"
                        ></div>
                        <div class="">
                            <div class="text-sm text-gray-500">
                                {item.label}
                            </div>
                            <div class="text-xl font-semibold">
                                {item.value.toFixed(2)}
                                {item.unit}
                            </div>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                            class="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                            style="width: {item.progress}%"
                        ></div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="flex flex-wrap gap-3 p-6">
            {#each relay as item, i}
                <div class="bg-white rounded-xl shadow p-4 text-center">
                    <div class="text-sm text-gray-600 mb-2">
                        Kondisi Pompa {i + 1}
                    </div>
                    <div
                        class={`text-lg font-bold ${item.relayStatus === "ON" ? "text-green-600" : "text-red-500"}`}
                    >
                        ⚡ {item.relayStatus}
                    </div>
                </div>
            {/each}
        </div>

        <div>
            <button
                type="submit"
                on:click={logout}
                class="mt-4 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
                Logout
            </button>
        </div>

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
