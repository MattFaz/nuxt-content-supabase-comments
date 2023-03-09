// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // ssr: true,
    // modules: ['@nuxt/content', '@nuxtjs/supabase', '@nuxtjs/tailwindcss'],
    modules: ['@nuxt/content', '@nuxtjs/tailwindcss'],
    content: {
        // https://content.nuxtjs.org/api/configuration
    },
    // supabase: {
    // https://supabase.nuxtjs.org/get-started#options
    // },
    tailwindcss: {
        // https://tailwindcss.nuxtjs.org/getting-started/options
    },
    dir: {
        public: "public"
    },
    runtimeConfig: {
        public: {
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_KEY: process.env.SUPABASE_KEY,
        },
    },
})
