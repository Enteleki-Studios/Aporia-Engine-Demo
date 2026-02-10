import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
    // stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-vitest',
        '@storybook/addon-a11y',
        '@storybook/addon-docs',
        '@storybook/addon-onboarding',
    ],
    framework: '@storybook/react-vite',
    core: {
        disableTelemetry: true,
    },
}

export default config
