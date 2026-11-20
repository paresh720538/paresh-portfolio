/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(dirname, 'node_modules')],
        silenceDeprecations: ['legacy-js-api', 'import'],
      },
    },
  },
  test: {
    environment: 'node',
    globals: true,
  },
})

