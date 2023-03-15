<script setup>
const user = useSupabaseUser()
const client = useSupabaseAuthClient()

const logout = async () => {
    try {
        const { error } = await client.auth.signOut()
        if (error) throw error;
        console.log('Signed out')
        user.value = null;
    } catch (error) {
        console.error(error)
    }
}

</script>

<template>
    <nav class="grid grid-cols-2 px-2 border-b border-black">
        <nuxt-link to="/" class="inline-flex items-center">
            <img src="/logo.png" class="p-2 max-h-12" alt="">
            <p class="text-2xl text-blue-800">Demo site</p>
        </nuxt-link>
        <div class="flex flex-row items-center justify-end space-x-2">
            <nuxt-link to="/" class="place-self-center rounded-lg p-2 bg-blue-200">Home</nuxt-link>
            <nuxt-link v-if="!user" to="/login" class="place-self-center rounded-lg p-2 bg-blue-200">Login</nuxt-link>
            <button v-else @click="logout" class="place-self-center rounded-lg p-2 bg-blue-200">Logout</button>
        </div>

    </nav>
</template>