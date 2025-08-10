<script>
    import sidebar from "$lib/components/sidebar.svelte";
    import { onMount } from "svelte";
    import { rtdb } from "$lib/firebase";
    import { ref, onValue } from "firebase/database";
    import { page } from "$app/stores";
    import {
        collection,
        getDocs,
        query,
        orderBy,
        where,
        Timestamp,
    } from "firebase/firestore";
    import { db } from "$lib/firebase";

    import Sidebar from "$lib/components/sidebar.svelte";

    $: currentPath = $page.url.pathname;
    let logs = [];
    let selectedData = "All";

    async function fetchLogs(filter) {
        try {
            const logRef = collection(db, "historisensor");
            let q;

            if (filter == "All") {
                q = query(logRef, orderBy("timestamp", "desc"));
            } else if (filter == "Daily") {
                const now = new Date();
                const yesterday = new Date();
                yesterday.setDate(now.getDate() - 1);

                q = query(
                    logRef,
                    where("timestamp", ">=", Timestamp.fromDate(yesterday)),
                    orderBy("timestamp", "desc"),
                );
            } else if (filter == "Weekly") {
                const now = new Date();
                const lastWeek = new Date();
                lastWeek.setDate(now.getDate() - 7);

                q = query(
                    logRef,
                    where("timestamp", ">=", Timestamp.fromDate(lastWeek)),
                    orderBy("timestamp", "desc"),
                );
            }
            const snapshot = await getDocs(q);

            logs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            console.error("Gagal mengambil log:", error);
        }
    }

    $: fetchLogs(selectedData);

    onMount(() => {
        fetchLogs(selectedData);
    });

    async function exportLogsToExcel() {
        if (!logs || logs.length === 0) {
            alert("Data log kosong.");
            return;
        }

        const XLSX = await import("xlsx");

        const data = logs.map((log) => ({
            Tanggal: new Date(log.timestamp?.seconds * 1000).toLocaleDateString(
                "id-ID",
                {
                    timeZone: "Asia/Jakarta",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                },
            ),
            Suhu: log.suhu,
            Kelembaban: log.kelembaban,
            pH: log.ph,
            Nutrisi: log.tds,
            CurahHujan: log.curahHujan,
            TinggiAir: log.volumeAir,
            Suhu_Air: log.suhuAir,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Log Sensor");

        XLSX.writeFile(workbook, "log_sensor.xlsx");
    }
</script>

<div class="w-full flex flex-row bg-[#f4f7fa] min-h-screen pb-[80px] sm:p-0">
    <Sidebar />

    <div class="w-full flex justify-center">
        <div
            class="w-full flex flex-col px-4 sm:pl-[calc(100px)] sm:pr-[20px] max-w-[1080px]"
        >
            <!-- Header -->
            <div
                class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6"
            >
                <div>
                    <h1 class="text-2xl font-semibold">
                        History <span class="font-bold text-blue-500">|</span>
                    </h1>
                    <span class="text-xs tracking-[3px] text-gray-500"
                        >Smart Hidroponik</span
                    >
                </div>
                <div class="flex flex-row gap-4">
                    <form action="">
                        <select
                            id="dataType"
                            name="dataType"
                            bind:value={selectedData}
                            class="bg-gray-50 border-2 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-500"
                        >
                            <option value="Daily">24 Jam Terakhir</option>
                            <option value="Weekly">7 Hari Terakhir</option>
                            <option value="All">Sepanjang Waktu</option>
                        </select>
                    </form>

                    <button
                        on:click={exportLogsToExcel}
                        type="button"
                        class="flex flex-col items-center text-blue-500 hover:text-blue-600 transition transform hover:scale-110"
                    >
                        <i class="fa-solid fa-arrow-down text-2xl"></i>
                        <span class="text-xs">Unduh</span>
                    </button>
                </div>
            </div>

            <!-- Table / Card Responsive -->
            <div class="overflow-x-auto">
                <table class="min-w-full text-sm text-gray-700">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="px-4 py-2 text-left">No</th>
                            <th class="px-4 py-2 text-left">Waktu</th>
                            <th class="px-4 py-2 text-left">Suhu</th>
                            <th class="px-4 py-2 text-left">Kelembapan</th>
                            <th class="px-4 py-2 text-left">pH Air</th>
                            <th class="px-4 py-2 text-left">Nutrisi</th>
                            <th class="px-4 py-2 text-left">Curah Hujan</th>
                            <th class="px-4 py-2 text-left">Ketinggian Air</th>
                            <th class="px-4 py-2 text-left">Suhu Air</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#if logs.length > 0}
                            {#each logs.slice(0, 15) as log, i}
                                <tr
                                    class="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                                >
                                    <td class="px-4 py-2">{i + 1}</td>
                                    <td class="px-4 py-2">
                                        {new Date(
                                            log.timestamp?.seconds * 1000,
                                        ).toLocaleDateString("id-ID", {
                                            timeZone: "Asia/Jakarta",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td class="px-4 py-2">{log.suhu}</td>
                                    <td class="px-4 py-2">{log.kelembaban}</td>
                                    <td class="px-4 py-2">{log.ph}</td>
                                    <td class="px-4 py-2">{log.tds}</td>
                                    <td class="px-4 py-2">{log.curahHujan}</td>
                                    <td class="px-4 py-2">{log.volumeAir}</td>
                                    <td class="px-4 py-2">{log.suhuAir}</td>
                                </tr>
                            {/each}
                        {:else}
                            <tr>
                                <td
                                    colspan="9"
                                    class="px-4 py-6 text-center text-gray-500"
                                >
                                    Tidak ada data log ditemukan.
                                </td>
                            </tr>
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<style>
    /* Mode Scroll Horizontal Mobile */
    @media (max-width: 640px) {
        .overflow-x-auto {
            -webkit-overflow-scrolling: touch;
        }
        table {
            min-width: 800px; /* Biar tabel tetap lebar */
        }
    }
</style>
