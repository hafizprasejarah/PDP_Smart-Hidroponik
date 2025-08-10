<script>
    import { auth, rtdb } from "$lib/firebase";
    import {
        getProgress,
        getProgressHumidity,
        getProgresspH,
        getProgressRain,
        getProgressNutrition,
        getProgressWaterHeigt,
    } from "$lib/index";
    import { ref, onValue } from "firebase/database";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { onMount } from "svelte";

    import { onAuthStateChanged } from "firebase/auth";
    import { goto } from "$app/navigation";

    let suhu = 0;
    let ph = 0;
    let curahHujan = 0;
    let kelembapan = 0;
    let nutrisi = 0;
    let tinggiAir = 0;
    let suhuAir = 0;

    let reLay1 = 0;
    let reLay2 = 0;

    $: progress = getProgress(suhu);
    $: progresspH = getProgresspH(ph);
    $: progressRain = getProgressRain(curahHujan);
    $: progressHumidity = getProgressHumidity(kelembapan);
    $: progressNutrition = getProgressNutrition(nutrisi);
    $: progressWaterHeight = getProgressWaterHeigt(tinggiAir);

    onMount(() => {

        const email = import.meta.env.VITE_FIREBASE_EMAIL;
        const password = import.meta.env.VITE_FIREBASE_PASSWORD;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                const sensorRef = ref(rtdb, "sensor/");
                onValue(sensorRef, (snapshot) => {
                    const data = snapshot.val();
                    suhu = data?.suhu || 0;
                    ph = data?.pH || 0;
                    curahHujan = data?.curahHujan || 0;
                    kelembapan = data?.kelembaban || 0;
                    nutrisi = data?.tds || 0;
                    tinggiAir = data?.volumeAir || 0;
                    suhuAir = data?.suhuAir || 0;
                });

                const relayStatus = ref(rtdb, "status/");
                onValue(relayStatus, (snapshot) => {
                    const data = snapshot.val();
                    reLay1 = data?.relay1;
                    reLay2 = data?.relay2;
                });
            })
            .catch((err) => {
                console.error("Login gagal:", err.message);
            });

        getBMKGData();
    });

    let cuaca = {
        weather_desc: "Memuat data...",
        t: "-",
        hu: "-",
        ws: "-",
        tcc: "-",
        local_datetime: "-",
        image: "",
    };

    $: statusRelay1 = reLay1 == 0 ? "OFF" : "ON";
    $: statusRelay2 = reLay2 == 0 ? "OFF" : "ON";

    $: relay = {
        relays: [statusRelay1, statusRelay2],
    };

    async function getBMKGData() {
        const url =
            "https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=33.72.01.1001";

        try {
            const res = await fetch(url);
            const data = await res.json();
            const cuacaData = data.data[0].cuaca.flat()[0];

            cuaca = {
                weather_desc: cuacaData.weather_desc,
                t: cuacaData.t,
                hu: cuacaData.hu,
                ws: cuacaData.ws,
                tcc: cuacaData.tcc,
                local_datetime: cuacaData.local_datetime,
                image: cuacaData.image || "",
            };
        } catch (e) {
            cuaca.weather_desc = "Gagal memuat data.";
        }
    }
</script>

<div
    class="bg-[#f4f7fa]"
    style="display: flex; width: 100%; justify-content: center;"
>
    <div class="w-full min-h-screen p-6 text-gray-700 max-w-4xl">
        <h1 class="text-2xl font-bold text-center mb-8 text-blue-800">
            SMART HIDROPONIK
        </h1>

        <div class="grid grid-cols-1 lg:grid-cols-1 gap-4 max-w-6xl mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                <div
                    class="flex flex-col col-span-2 md:flex-row lg:flex-row sm:flex-row items-center gap-6 bg-gradient-to-r from-blue-700 to-blue-300 text-white rounded-3xl shadow-xl p-6"
                >
                    <div class="flex-shrink-0">
                        {#if cuaca.image}
                            <img
                                src={cuaca.image}
                                alt="Ikon Cuaca"
                                class="w-24 h-24 object-contain"
                            />
                        {/if}
                    </div>

                    <div class="flex-1 space-y-2">
                        <h2 class="text-xl font-semibold">
                            Prakiraan Cuaca Surakarta
                        </h2>
                        <p class="text-lg capitalize">{cuaca.weather_desc}</p>
                        <div class="grid grid-cols-1 gap-3 text-sm">
                            <p><strong>Suhu:</strong> {cuaca.t}°C</p>
                            <p><strong>Kelembapan:</strong> {cuaca.hu}%</p>
                            <p>
                                <strong>Kecepatan Angin:</strong>
                                {cuaca.ws} km/jam
                            </p>
                        </div>
                        <p class="text-xs mt-2">
                            Waktu Update: {cuaca.local_datetime}
                        </p>
                    </div>
                </div>

                <div
                    class="bg-white rounded-xl shadow p-4 border-2 mt-4 sm:mt-0 border-blue-500 flex flex-rwo items-center gap-4"
                >
                    <div
                        class="fa-solid fa-temperature-arrow-up text-6xl mb-2 text-blue-500 m-2"
                        style="display: flex; align-items: center;"
                    ></div>
                    <div class="flex w-full content-end flex-col">
                        <div class="">
                            <div class="text-md text-gray-950">Suhu Air</div>
                            <div class="text-2xl font-semibold">
                                {suhuAir.toFixed(2)} °C
                            </div>
                        </div>

                        <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                                class="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                                style="width: {progress}%"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- KIRI: Sensor -->
            <div
                class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                <div
                    class="bg-white rounded-xl shadow p-4 border-2 border-blue-500"
                >
                    <div class="flex gap-5 content-end">
                        <div
                            class="fa-solid fa-temperature-three-quarters text-4xl mb-2 text-blue-500 m-2"
                            style="display: flex; align-items: center;"
                        ></div>
                        <div class="">
                            <div class="text-sm text-gray-950">Suhu</div>
                            <div class="text-xl font-semibold">
                                {suhu.toFixed(2)} °C
                            </div>
                        </div>
                    </div>

                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                            class="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                            style="width: {progress}%"
                        ></div>
                    </div>
                </div>
                <div
                    class="bg-white rounded-xl shadow p-4 border-2 {` ${ph < 5.5 ? 'border-red-500' : 'border-blue-500'} `}"
                >
                    <div class="flex gap-5 content-end">
                        <div
                            class="fa-solid fa-droplet text-4xl mb-2 m-2 {`${ph < 5.5 ? 'text-red-500' : 'text-blue-500'}`}"
                            style="display: flex; align-items: center;"
                        ></div>
                        <div class="">
                            <div class="text-sm text-gray-500">PH Air</div>
                            <div class="text-xl font-semibold">
                                {ph.toFixed(2)} pH
                            </div>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                            class=" {`h-2.5 rounded-full transition-all duration-300 ${ph < 5.5 ? 'bg-red-500' : 'bg-blue-500'}`}"
                            style="width: {progresspH}%"
                        ></div>
                    </div>
                </div>
                <div
                    class="bg-white rounded-xl shadow p-4 border-2 border-blue-500"
                >
                    <div class="flex gap-5 content-end">
                        <div
                            class="fa-solid fa-cloud-rain text-4xl mb-2 text-blue-500 m-2"
                            style="display: flex; align-items: center;"
                        ></div>
                        <div class="">
                            <div class="text-sm text-gray-500">Curah Hujan</div>
                            <div class="text-xl font-semibold">
                                {curahHujan.toFixed(2)} mm
                            </div>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                            class=" bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                            style="width: {progressRain}%"
                        ></div>
                    </div>
                </div>
                <div
                    class="bg-white rounded-xl shadow p-4 border-2 border-blue-500"
                >
                    <div class="flex gap-5 content-end">
                        <div
                            class="fa-solid fa-droplet text-4xl mb-2 text-blue-500 m-2"
                            style="display: flex; align-items: center;"
                        ></div>
                        <div class="">
                            <div class="text-sm text-gray-500">Kelembapan</div>
                            <div class="text-xl font-semibold">
                                {kelembapan.toFixed(2)} %
                            </div>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                            class="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                            style="width: {progressHumidity}%"
                        ></div>
                    </div>
                </div>
                <div
                    class="bg-white rounded-xl shadow p-4 border-2 border-blue-500"
                >
                    <div class="flex gap-5 content-end">
                        <div
                            class="fa-brands fa-nutritionix text-4xl mb-2 text-blue-500 m-2"
                            style="display: flex; align-items: center;"
                        ></div>
                        <div class="">
                            <div class="text-sm text-gray-500">Nutrisi</div>
                            <div class="text-xl font-semibold">
                                {Math.trunc(nutrisi)} ppm
                            </div>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                            class="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                            style="width: {progressNutrition}%"
                        ></div>
                    </div>
                </div>
                <div
                    class="bg-white rounded-xl shadow p-4 border-2 border-blue-500"
                >
                    <div class="flex gap-5 content-end">
                        <div
                            class="fa-solid fa-water-ladder text-4xl mb-2 text-blue-500 m-2"
                            style="display: flex; align-items: center;"
                        ></div>
                        <div class="">
                            <div class="text-sm text-gray-500">Volume Air</div>
                            <div class="text-xl font-semibold">
                                {tinggiAir.toFixed(2)} Liter
                            </div>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                            class="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                            style="width: {progressWaterHeight}%"
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Relay -->
        <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 max-w-4xl mx-auto"
        >
            {#each relay.relays as status, i}
                <div class="bg-white rounded-xl shadow p-4 text-center">
                    <div class="text-sm text-gray-600 mb-2">
                        Kondisi Pompa {i + 1}
                    </div>
                    <div
                        class={`text-lg font-bold ${status === "ON" ? "text-green-600" : "text-red-500"}`}
                    >
                        ⚡ {status}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>
