/// <reference types='vitest/config' />
import path from 'path'
import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'
import tsconfigPaths from 'vite-tsconfig-paths'

import react from '@vitejs/plugin-react'

export default defineConfig({
    build: {
        outDir: './dist',
    },
    plugins: [tsconfigPaths(), wasm(), react()],
    server: {
        port: 2080,
    },
    resolve: {
        alias: {
            // Added for inspector theme
            '@inspector': path.resolve(__dirname, 'src/inspector'),
        },
    },
    test: {
        typecheck: {
            enabled: true,
            ignoreSourceErrors: true,
        },
    },
})
