import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
    placement: 'bottom-left',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
  /*
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: '',
      cssVariable: ''
    },
    {
      provider: fontProviders.fontsource(),
      name: '',
      cssVariable: ''
    }
  ],
  */
  i18n: {
    defaultLocale: 'en',
    locales: ['es', 'pt-br', 'fr', 'en'],
    fallback: {
      es: 'en',
      fr: 'en',
      'pt-br': 'en',
    },
  },
})
