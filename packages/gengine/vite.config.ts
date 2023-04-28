import { defineConfig } from 'vite'
import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'gengine',
            fileName: 'gengine',
        },
        rollupOptions: {
            external: [
                'react',
                'react-redux',
                'three',
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-redux': 'Redux',
                    'three': 'Three',
                },
            },
        },
    },
    plugins: [react(), dts()],
    server: {
        port: 2080,
    },
})
