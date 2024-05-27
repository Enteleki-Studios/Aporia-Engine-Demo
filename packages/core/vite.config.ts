import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import tsconfigPaths from 'vite-tsconfig-paths'

import react from '@vitejs/plugin-react'

export default defineConfig({
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
    plugins: [
        tsconfigPaths(),
        react(),
        dts({ entryRoot: './src/' }),
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
