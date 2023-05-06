import { defineConfig } from 'vite'
import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    resolve: {
        alias: {
            // ecs: 'src/ecs/',
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'gengine',
            fileName: 'gengine',
        },
        rollupOptions: {
            external: ['react', 'react-redux', 'three'],
            output: {
                globals: {
                    react: 'React',
                    'react-redux': 'Redux',
                    three: 'Three',
                },
            },
        },
    },
    esbuild: {
        minifyIdentifiers: false,
    },
    plugins: [
        react(),
        dts(),
        viteStaticCopy({
            targets: [
                {
                    src: 'src/types/*',
                    dest: 'types',
                },
            ],
        }),
    ],
    server: {
        port: 2080,
    },
})
