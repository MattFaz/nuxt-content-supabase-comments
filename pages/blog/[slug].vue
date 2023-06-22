<script setup>
import { formatDateTime } from '#imports'
const client = useSupabaseClient()
const user = useSupabaseUser()
const uuid = ref('')
const comments = ref([])
const newComment = ref('')

const { path } = useRoute()
const { data: post } = await useAsyncData(`content-${path}`, async () => {
    let res = await queryContent().where({ _path: path }).findOne()
    uuid.value = res.uuid
    return res
},)

const getComments = async () => {
    let { data, error } = await client.from('comments').select('*, profiles (username)')
        .eq('post_uuid', uuid.value)
    if (error) {
        console.log(error)
    } else {
        comments.value = data
    }
}

onMounted(async () => {
    getComments()
})

watchEffect(async () => {
    if (uuid.value) {
        getComments()
    }
})

const submitComment = async () => {
    let { data: profile, error } = await client.from('profiles').select('id').eq('username', user.value.user_metadata.username).single()
    if (error || !profile) {
        console.error('Error retrieving profile:', error)
    }

    let { data: comment, error: insertError } = await client.from('comments').insert([
        {
            text: newComment.value,
            post_uuid: uuid.value,
            profile_id: profile.id
        }
    ])
    if (insertError) {
        console.error('Error inserting comment:', insertError)
    } else {
        getComments()
    }
}
// getComments()

</script>

<template>
    <main class="flex flex-col py-2 lg:p-8">
        <div class="bg-white p-2 lg:rounded-lg flex flex-col space-y-2">
            <img :src="post.img" :alt="post.title" class="object-cover lg:object-contain lg:max-h-fit rounded-t-lg">
            <ContentRenderer :value="post" class="grow text-gray-500 prose max-w-none" />
            <span class="text-sm text-gray-400">Published: {{ formatDate(post.date) }}</span>
            <label v-if="comments"> {{ comments.length }} Comments:</label>
            <div class="border-y-2 py-2 flex flex-col">

                <div class="flex flex-row items-center border-l-2 my-1" v-for="comment in comments" :key="comment.id">
                    <span class="text-sm text-gray-300 pl-2">{{ formatDateTime(comment.created_at)
                    }}</span>
                    <span v-if="!comment.parent_comment_id" class="font-semibold px-2 text-blue-500">{{
                        comment.profiles.username
                    }}:</span>
                    <span v-else class="font-semibold px-2 text-blue-500">{{ comment.profiles.username }} <i
                            class="text-sm text-gray-600">replying to comment
                            {{
                                comment.parent_comment_id
                            }}</i>:</span>
                    <div>{{ comment.text }}</div>
                </div>
            </div>
            <div class="py-2">
                <label class="">Add a comment:</label>
                <textarea id="message" rows="4" v-model="newComment"
                    class="p-2 w-full text-sm rounded-lg border bg-gray-300 border-gray-300 focus:bg-white"
                    placeholder="Your comment..."></textarea>
                <button class="p-2 bg-green-200 rounded-lg" @click="submitComment()">Submit</button>
            </div>
        </div>
    </main>
</template>
  