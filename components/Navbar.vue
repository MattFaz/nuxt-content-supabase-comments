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
    <nav class="flex flex-row justify-between p-2">
        <nuxt-link to="/" class="inline-flex items-center">
            <img src="/logo.png" alt="logo" class="p-1 max-h-12">
            <span class="text-sm lg:text-base font-bold">NCSC Demo</span>
        </nuxt-link>
        <div class="flex flex-row items-center space-x-2 font-semibold">
            <span v-if="user" class="text-sm lg:text-base text-center">👋🏼 {{ user.user_metadata.username }}</span>
            <nuxt-link to="/" class="p-2 rounded-lg bg-blue-100">Home</nuxt-link>
            <nuxt-link v-if="!user" to="/login" class="p-2 rounded-lg bg-blue-100">Login</nuxt-link>
            <button v-else @click="logout" class="p-2 rounded-lg bg-blue-100">Logout</button>
        </div>
    </nav>
</template>