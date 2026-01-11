import type { Decorator, Preview } from '@storybook/react-vite'

import './base.css'

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo',
        },
        backgrounds: {
            options: {
                dark: { name: 'Dark', value: '#212830' },
                // light: { name: 'Light', value: '#F7F9F2' },
            },
        },
    },
    initialGlobals: {
        backgrounds: { value: 'dark' },
    },
}

export const decorators: Decorator[] = [
    (Story) => (
        <div className="sb-scope">
            <Story />
        </div>
    ),
]

export default preview
