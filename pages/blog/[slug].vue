<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()
const uuid = ref(null)
const comments = ref([])
const newComment = ref('')

const { path } = useRoute()
const { data } = await useAsyncData(`content-${path}`, async () => {
    let res = await queryContent().where({ _path: path }).findOne()
    uuid.value = res.uuid
    return res
})

watchEffect(async () => {
    if (uuid.value) {
        let { data, error } = await client.from('comments').select('*, profiles (username)')
            .eq('post_uuid', uuid.value)
        if (error) {
            console.log(error)
        } else {
            comments.value = data
        }
    }
})

const submitComment = async () => {

}

</script>

<template>
    <main>
        <div class="flex flex-col m-4 sm:mx-auto max-w-7xl bg-white rounded-lg overflow-hidden prose">
            <div class="flex-shrink-0">
                <img class="object-cover w-full m-0" :src="data.img" :alt="data.title">
            </div>
            <div class="p-2">
                <ContentRenderer :value="data" />
                <div class="border-y-2 py-2">
                    <label v-if="comments"> {{ comments.length }} Comments:</label>
                    <div class="flex flex-col">
                        <div class="flex flex-row items-center border-l-2 my-1" v-for="comment in comments"
                            :key="comment.id">
                            <span class="text-sm text-gray-300 pl-2">{{ comment.id }}</span>
                            <span v-if="!comment.parent_comment_id" class="font-semibold px-2">{{ comment.profiles.username
                            }}:</span>
                            <span class="font-semibold px-2" v-else>{{ comment.profiles.username }} <i
                                    class="text-sm text-gray-600">replying to comment
                                    {{
                                        comment.parent_comment_id
                                    }}</i>:</span>
                            <div>{{ comment.text }}</div>
                        </div>
                    </div>
                </div>
                <div class="py-2">
                    <label class="">Add a comment:</label>
                    <textarea id="message" rows="4"
                        class="p-2 w-full text-sm rounded-lg border bg-gray-300 border-gray-300 focus:bg-white"
                        placeholder="Your comment..."></textarea>

                </div>
            </div>
        </div>
    </main>
</template>
  