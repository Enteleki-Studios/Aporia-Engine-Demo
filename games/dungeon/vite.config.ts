import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    build: {
        outDir: './dist',
    },
    resolve: {
        alias: {
            systems: '/src/systems/',
            components: '/src/components/',
            models: '/src/models/',
            Renderer: '/src/Renderer/',
            utils: '/src/utils/',
            modelDB: '/src/modelDB',
            dungeon: '/src/dungeon',
        },
    },
    plugins: [react()],
    server: {
        port: 2080,
    },
})
