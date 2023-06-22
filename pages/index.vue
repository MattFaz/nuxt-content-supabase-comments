<script setup>
import { formatDate } from '#imports'
const { data: posts } = await useAsyncData('posts', () => queryContent('/blog').find())
</script>

<template>
    <main class="p-6 mx-auto lg:max-w-7xl">
        <div class="grid gap-5 lg:grid-cols-3">
            <nuxt-link v-for="post in posts" :to="post._path" class="bg-white p-2 rounded-lg flex flex-col space-y-2">
                <img :src="post.img" :alt="post.title" class="object-cover  h-48 rounded-t-lg">
                <span class="text-xl text-gray-800 font-bold">{{ post.title }}</span>
                <span class="grow text-gray-500">{{ post.description.split(" ").slice(0, 20).join(" ")
                }}... <span class="text-sm text-blue-400">Read More</span></span>
                <span class="text-sm text-gray-400">Published: {{ formatDate(post.date) }}</span>

            </nuxt-link>
        </div>
    </main>
</template> 