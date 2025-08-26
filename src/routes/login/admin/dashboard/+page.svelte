<script>
    import sidebar from "$lib/components/sidebar.svelte";

    import Chart from "$lib/components/chart_graph.svelte";
    import { onMount } from "svelte";
    import { rtdb } from "$lib/firebase";
    import { ref, onValue, set } from "firebase/database";
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
    import { page } from "$app/stores";
    import Sidebar from "$lib/components/sidebar.svelte";
    import { base } from "$app/paths";

    $: currentPath = $page.url.pathname;

    let sensorData = [];
    let relay = [];

    onMount(() => {
        // RelaySwitch();
        //iterasi data
        const relayRef = ref(rtdb, "status/");
        onValue(relayRef, (snapshot) => {
            const data = snapshot.val();
            relay = [
                {
                    relayStatus: data?.mode_sirkulasi ?? 0,
                    label: "Pompa Sirkulasi",
                },
                {
                    relayStatus: data?.relay_air ?? 0,
                    label: "Solenoid Valve",
                },
                {
                    relayStatus: data?.relay_nutrisi ?? 0,
                    label: "Pompa Nutrisi",
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
    });

    function RelaySwitch(index, newValue) {
        relay[index].relayStatus = newValue;

        // Tentukan key sesuai index
        const relayKey =
            index === 0
                ? "relay3"
                : index === 1
                  ? "relay_air"
                  : "relay_nutrisi";

        // Kirim ke Firebase
        const relayRef = ref(rtdb, `manual/${relayKey}`);
        set(relayRef, newValue);
    }
    async function logout() {
        try {
            await signOut(auth);

            goto(`${base}/login`);
        } catch (error) {
            alert(`Logout gagal: ${error.message}`);
        }
    }
</script>

<div class="w-full flex flex-row bg-[#f4f7fa] pb-[80px] sm:p-0">
    <Sidebar />
    <div class="w-full flex justify-center">
        <div
            class="w-full flex flex-col px-4 sm:pl-[calc(100px)] sm:pr-[20px] max-w-[1080px]"
        >
            <div class="flex flex-row justify-between py-6">
                <div class=" text-2xl font-medium">
                    Admin <span class="font-semibold text-blue-500">|</span>
                    <span class="text-[12px] tracking-[3px]"
                        >Smart Hidroponik</span
                    >
                </div>

                <button
                    type="submit"
                    on:click={logout}
                    class="h-fit hidden sm:block text-2xl text-red-500 font-semibold rounded-md hover:scale-110 transition duration-200"
                >
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <div class="text-[12px]">Keluar</div>
                </button>
            </div>

            <Chart />

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {#each sensorData as item}
                    <div
                        class="bg-white rounded-xl shadow p-4 border-2 border-blue-500"
                    >
                        <div class="flex gap-5 content-end">
                            <div
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

            <div class="flex flex-wrap gap-3 my-6">
                {#each relay as item, i}
                    <div
                        class={` flex flex-col justify-between bg-white rounded-xl shadow p-4 text-center border-2 ${
                            item.label == "Pompa Sirkulasi"
                                ? item.relayStatus == 1
                                    ? "border-green-600"
                                    : item.relayStatus == 2
                                      ? "border-blue-600"
                                      : "border-red-500"
                                : item.relayStatus == 1
                                  ? "border-green-600"
                                  : "border-red-500"
                        }`}
                    >
                        <div class="text-sm text-gray-600 mb-2">
                            {item.label}
                        </div>
                        <div>
                            {#if item.label == "Pompa Sirkulasi"}
                                <select
                                    id="mode"
                                    class="border rounded-lg px-2 py-1 text-sm "
                                    bind:value={relay[i].relayStatus}
                                    on:change={(e) =>
                                        RelaySwitch(i, +e.target.value)}
                                >
                                    <option value={0}>Mati</option>
                                    <option value={1}>Hidup</option>
                                    <option value={2}>Otomatis</option>
                                </select>
                            {/if}
                        </div>
                        <div
                            class={`text-md font-bold pt-2 ${
                                item.label == "Pompa Sirkulasi"
                                    ? item.relayStatus == 1
                                        ? "text-green-600"
                                        : item.relayStatus == 2
                                          ? "text-blue-600"
                                          : "text-red-500"
                                    : item.relayStatus == 1
                                      ? "text-green-600"
                                      : "text-red-500"
                            }`}
                        >
                            {item.label == "Pompa Sirkulasi"
                                ? item.relayStatus == 0
                                    ? "Mati"
                                    : item.relayStatus == 1
                                      ? "Hidup"
                                      : "Otomatis"
                                : item.relayStatus == 1
                                  ? "ON"
                                  : "OFF"}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
        border-radius: 28px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 22px;
        width: 22px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }
</style>
