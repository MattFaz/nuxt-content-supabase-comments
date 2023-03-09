<script setup lang="ts">
const loading = ref(false)
const email = ref("")
const password = ref("")
const username = ref("")
const isSignUp = ref(false)

const client = useSupabaseAuthClient()

const signUp = async () => {
    try {
        // loading.value = true
        const { data, error } = await client.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                data: {
                    username: username.value
                }
            }
        })
        if (error) throw error;
        console.log(data)
        alert("Check your email to confirm account!")
    } catch (error) {
        console.error(error)
    } finally {
        // loading.value = false;
    }
}

const login = async () => {
    try {
        // loading.value = true
        const { data, error } = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })
        if (error) throw error;
        console.log(data)
    } catch (error) {
        console.error(error)
    } finally {
        navigateTo("/")
    }
}

</script>

<template>
    <div class="flex flex-col m-4 sm:mx-auto bg-white rounded-lg prose">
        <form action="" @submit.prevent="() => (isSignUp ? signUp() : login())"
            class="flex flex-col gap-2 py-2 w-3/4 mx-auto">
            <label class="text-center font-semibold">Email:</label>
            <input type="email" placeholder="email" class="p-2 bg-gray-200 rounded-lg">
            <label class="text-center font-semibold">Password:</label>
            <input type="password" placeholder="password" class="p-2 bg-gray-200 rounded-lg">
            <label v-if="isSignUp" class="text-center font-semibold">Username:</label>
            <input v-if="isSignUp" type="text" placeholder="username" class="p-2 bg-gray-200 rounded-lg">
            <div class="inline-flex justify-center">
                <button type="submit" class="p-2 text-white bg-green-500 rounded-lg w-1/2 items-center">
                    <span v-if="isSignUp">Sign up</span>
                    <span v-else>Log in</span>
                </button>
            </div>

        </form>
        <button @click="isSignUp = !isSignUp" class="w-full my-2 text-sm text-center underline ">
            <span v-if="isSignUp">Have an account? Log in instead</span>
            <span v-else>Create a new account</span>
        </button>
    </div>
</template>