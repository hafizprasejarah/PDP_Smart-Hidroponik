<script>
    import { goto } from "$app/navigation";
    import { auth } from "$lib/firebase";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { base } from '$app/paths';

    let email = "";
    let password = "";
    let errorMSG = "";
    let successMSG = "";
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    async function loginUser(event) {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );

            successMSG = "Berhasil Login";
            const user = userCredential.user;
            await delay(1000);
            goto(`${base}/login/admin/dashboard`);
        } catch (error) {
            errorMSG = "Email atau password salah";
        }
    }
</script>

<div
    class="bg-[#f4f7fa] flex flex-col w-full h-[100vh] justify-center items-center"
>
    <!-- wrapper -->
    <div
        class="flex flex-col w-full max-w-[240px] shadow-2xl p-8 bg-white rounded-2xl sm:max-w-sm"
    >
        <h1
            class="text-2xl sm:text-4xl font-bold text-center text-gray-800 mb-6"
        >
            Login
        </h1>
        <form
            on:submit={loginUser}
            class="flex flex-col mt-5 text-[14px] sm:text-[18px]"
        >
            <label for="email">Email</label>
            <input
                required
                type="email"
                id="email"
                bind:value={email}
                class="border-none outline-none pl-2 required rounded-md"
                on:input={() => {
                    errorMSG = "";
                    successMSG = "";
                }}
            />
            <div class="border-b-2 mb-5"></div>
            <label for="password">password</label>
            <input
                required
                type="password"
                id="password"
                bind:value={password}
                class="border-none outline-none pl-2 required rounded-md"
                on:input={() => {
                    errorMSG = "";
                    successMSG = "";
                }}
            />
            <div class="border-b-2 mb-5"></div>

            {#if errorMSG != ""}
                <div
                    class=" bg-red-100 rounded-[5px] text-[12px] p-3 text-red-500 font-semibold"
                >
                    {errorMSG}
                </div>
            {:else if successMSG != ""}
                <div
                    class=" bg-green-100 rounded-[5px] text-[12px] p-3 text-green-500 font-semibold"
                >
                    {successMSG}
                </div>
            {:else}{/if}

            <button
                type="submit"
                class="mt-4 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
                Login
            </button>
        </form>
    </div>
</div>
