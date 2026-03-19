/// <reference types='vitest/config' />
import path from 'path'
import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'

// import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'

// import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
    build: {
        outDir: './dist',
    },
    plugins: [wasm(), react()],
    server: {
        port: 2080,
    },
    resolve: {
        tsconfigPaths: true,
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
        // projects: [
        //     {
        //         extends: true,
        //         plugins: [
        //             // The plugin will run tests for the stories defined in your Storybook config
        //             // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        //             storybookTest({
        //                 configDir: path.join(__dirname, '.storybook'),
        //             }),
        //         ],
        //         test: {
        //             name: 'storybook',
        //             browser: {
        //                 enabled: true,
        //                 headless: true,
        //                 provider: playwright({}),
        //                 instances: [
        //                     {
        //                         browser: 'chromium',
        //                     },
        //                 ],
        //             },
        //             setupFiles: ['.storybook/vitest.setup.ts'],
        //         },
        //     },
        // ],
    },
})
