import { defineConfig } from 'vite'
import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    resolve: {
        alias: {
            components: resolve(__dirname, 'src/components/'),
            ecs: resolve(__dirname, 'src/ecs/'),
            Inspector: resolve(__dirname, 'src/Inspector/'),
            managers: resolve(__dirname, 'src/managers/'),
            reactjs: resolve(__dirname, 'src/reactjs/'),
            systems: resolve(__dirname, 'src/systems/'),
            threejs: resolve(__dirname, 'src/threejs/'),
            utils: resolve(__dirname, 'src/utils/'),
            definitions: resolve(__dirname, 'src/definitions'),
            World: resolve(__dirname, 'src/World'),
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
