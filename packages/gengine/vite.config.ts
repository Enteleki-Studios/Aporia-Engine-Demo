import { defineConfig } from 'vite'
import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    resolve: {
        alias: {
            components: '/src/components/',
            ecs: '/src/ecs/',
            Inspector: '/src/Inspector/',
            managers: '/src/managers/',
            reactjs: '/src/reactjs/',
            systems: '/src/systems/',
            threejs: '/src/threejs/',
            utils: '/src/utils/',
            definitions: '/src/definitions',
            World: '/src/World',
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
