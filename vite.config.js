import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { PHONE_DISPLAY, PHONE_TEL } from './src/shared/contact.js'

// index.html dagi %PHONE_DISPLAY% / %PHONE_TEL% ni src/shared/contact.js qiymatlari bilan almashtiradi
const contactHtml = () => ({
  name: 'contact-html',
  transformIndexHtml: (html) =>
    html.replaceAll('%PHONE_DISPLAY%', PHONE_DISPLAY).replaceAll('%PHONE_TEL%', PHONE_TEL),
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), contactHtml()],
})
