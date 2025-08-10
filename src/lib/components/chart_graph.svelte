<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { collection, getDocs, query, orderBy } from "firebase/firestore";
    import { db } from "$lib/firebase";

    let logs = [];
    let chartCanvas;
    let max;
    let label;
    let stepsize;
    let chartColor = [];

    let selectedData = "ph";
    let chartInstance;

    $: if (logs.length > 0 && selectedData) {
        let data = [];
        let timestamp = [];

        ChartSetup(selectedData);
        UpdateData(data, timestamp);

        ChartRender(data, timestamp, logs);
    }

    onMount(() => {
        const fetchLogs = async () => {
            try {
                const logRef = collection(db, "historisensor");
                const q = query(logRef, orderBy("timestamp", "desc"));
                const snapshot = await getDocs(q);

                logs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                logs = logs.slice(0, 10).reverse();
            } catch (error) {
                console.error("Gagal mengambil log:", error);
            }
        };

        fetchLogs();
    });

    function UpdateData(data, timestamp) {
        for (let i = 0; i < logs.length; i++) {
            data.push(logs[i]?.[selectedData] ?? 0);

const tsMillis = (logs[i]?.timestamp.seconds * 1000) - (7 * 60 * 60 * 1000);
const dateObj = new Date(tsMillis);

const tanggal = dateObj.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

const waktu = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});

const formatted = `${tanggal} ${waktu}`;
timestamp.push(formatted);

        }
    }

    function ChartSetup(selectedData) {
        if (selectedData == "ph") {
            max = 14;
            label = "pH";
            stepsize = 1;
            chartColor = {
                borderColor: "rgba(34, 197, 94, 1)", // green
                backgroundColor: "rgba(34, 197, 94, 0.2)",
            };
        } else if (selectedData == "tds") {
            max = 2000;
            label = "Nutrisi";
            stepsize = 200;
            chartColor = {
                borderColor: "rgba(147, 51, 234, 1)", // purple
                backgroundColor: "rgba(147, 51, 234, 0.2)",
            };
        } else if (selectedData == "suhuAir") {
            max = 100;
            label = "Suhu Air";
            stepsize = 10;
            chartColor = {
                borderColor: "rgba(14, 165, 233, 1)", // blue
                backgroundColor: "rgba(14, 165, 233, 0.2)",
            };
        } else if (selectedData == "suhu") {
            max = 100;
            label = "Suhu";
            stepsize = 10;
            chartColor = {
                borderColor: "rgba(249, 115, 22, 1)", // orange
                backgroundColor: "rgba(249, 115, 22, 0.2)",
            };
        } else if (selectedData == "curahHujan") {
            max = 100;
            label = "Curah Hujan";
            stepsize = 10;
            chartColor = {
                borderColor: "rgba(59, 130, 246, 1)", // indigo
                backgroundColor: "rgba(59, 130, 246, 0.2)",
            };
        } else if (selectedData == "kelembaban") {
            max = 100;
            label = "Kelembapan";
            stepsize = 10;
            chartColor = {
                borderColor: "rgba(245, 158, 11, 1)", // yellow
                backgroundColor: "rgba(245, 158, 11, 0.2)",
            };
        } else {
            max = 200;
            label = "Volume Air";
            stepsize = 20;
            chartColor = {
                borderColor: "rgba(239, 68, 68, 1)", // red
                backgroundColor: "rgba(239, 68, 68, 0.2)",
            };
        }
    }

    function ChartRender(data, timestamp, logs) {
        // Destroy existing chart if exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(chartCanvas, {
            type: "line",
            data: {
                labels: timestamp,
                datasets: [
                    {
                        label: label,
                        data: data,
                        backgroundColor: chartColor.backgroundColor,
                        borderColor: chartColor.borderColor,
                        borderWidth: 3,
                        pointHitRadius: 8,
                        pointBackgroundColor: 6,
                        tension: 0.3,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: max,
                        ticks: {
                            stepSize: stepsize,
                        },
                        title: {
                            display: true,
                            text: "Nilai " + label,
                            font: {
                                size: 14,
                            },
                        },
                    },
                },
            },
        });
    }
</script>

<div class="w-full mb-6 flex flex-col items-center space-y-6">
    <form action="" class=" flex flex-row w-full gap-5">
        <div>
            <label
                for="dataType"
                class="block mb-2 text-sm font-medium text-gray-900"
            >
                Pilih Jenis Data
            </label>
            <select
                id="dataType"
                name="dataType"
                bind:value={selectedData}
                class="bg-gray-50 border-2 text-gray-900 text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-500"
            >
                <option value="ph">pH</option>
                <option value="tds">Nutrisi</option>
                <option value="suhuAir">Suhu Air</option>
                <option value="suhu">Suhu Udara</option>
                <option value="curahHujan">Curah Hujan</option>
                <option value="kelembaban">Kelembapan</option>
                <option value="volumeAir">Tinggi Air</option>
            </select>
        </div>
    </form>
    <div class=" w-full sm:max-w-screen-lg h-[400px] bg-white sm:p-4 rounded-lg sm:shadow-md">
        <canvas
            bind:this={chartCanvas}
            class="w-full h-auto"
        ></canvas>
    </div>
</div>
