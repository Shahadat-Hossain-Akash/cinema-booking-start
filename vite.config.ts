import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite';

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), nitro(), tailwindcss(), tanstackStart(), viteReact()],
  server: {
    proxy: {
      '/movies': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/sessions': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})

export default config
