import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    build: {
        outDir: './dist',
    },
    plugins: [tsconfigPaths(), react()],
    server: {
        port: 2080,
    },
})
