<script setup>
const username = ref('')
const client = useSupabase();

const { data: { session } } = await client.auth.getSession();
if (session?.user) {
    const { data } = await client.from("profiles").select("username");
    username.value = data[0].username
} else {
    username.value = ''
}
</script>

<template>
    <ContentList path="/blog" v-slot="{ list }">
        <div class="p-6 lg:px-8">
            <div class="mx-auto max-w-7xl">
                <div class="mb-2 text-center">
                    <label class="text-lg font-semibold">
                        <span v-if="username">Hi {{ username }}, welcome to my blog!</span>
                        <span v-else>Welcome to my blog!</span>
                    </label>
                </div>

                <div class="grid max-w-lg gap-5 mx-auto lg:grid-cols-3 lg:max-w-none">
                    <nuxt-link :href="article._path" v-for="article in list" :key="article._path"
                        class="flex flex-col overflow-hidden rounded-lg shadow-lg">
                        <div class="flex-shrink-0">
                            <img class="object-cover w-full h-48" :src="article.img" :alt="article.title">
                        </div>
                        <div class="flex flex-col bg-white p-2">
                            <a href="#" class="block mt-2">
                                <p class="text-xl font-semibold text-neutral-600">{{ article.title }}</p>
                                <p class="mt-3 text-base text-gray-500">{{ article.description.split(" ").slice(0,
                                    20).join(" ") }}...</p>
                            </a>
                            <time datetime="2020-03-16" class="text-sm text-gray-500"> {{ article.date }} </time>
                        </div>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </ContentList>
</template> 