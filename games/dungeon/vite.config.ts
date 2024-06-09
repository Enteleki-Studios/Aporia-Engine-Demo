import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    build: {
        outDir: './dist',
    },
    plugins: [tsconfigPaths(), wasm(), react()],
    server: {
        port: 2080,
    },
})
