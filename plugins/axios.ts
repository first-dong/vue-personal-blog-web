import { createAxiosInstance } from '~/utils/axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const api = createAxiosInstance(config.public.apiBase)

  return {
    provide: {
      api,
    },
  }
})
