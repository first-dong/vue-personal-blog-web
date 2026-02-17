// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: true },

  // Nuxt UI v3 (includes Tailwind CSS v4)
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/eslint',
  ],

  // CSS
  css: ['~/assets/css/main.css'],

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false,
  },

  // Runtime config - public vars accessible on client and server
  runtimeConfig: {
    // Private keys (only server-side)
    apiSecret: '',
    // Public keys (exposed to client)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'PersonalBlog',
    },
  },

  // App config
  app: {
    head: {
      title: 'PersonalBlog',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '个人博客 - 分享技术与生活' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Nitro server config
  nitro: {
    compressPublicAssets: true,
  },
})
