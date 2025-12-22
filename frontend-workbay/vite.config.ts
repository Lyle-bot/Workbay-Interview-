import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'babel-plugin-react-compiler', // ✅ just the plugin, no tailwind here
        ],
      },
    }),
    tailwindcss(), // ✅ Tailwind as a Vite plugin, at top level
  ],
})
