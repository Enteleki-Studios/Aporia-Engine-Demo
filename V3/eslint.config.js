import eslint from '@eslint/js'
import eslintComments from 'eslint-plugin-eslint-comments'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    {
        plugins: {
            'react-hooks': reactHooks,
            'eslint-comments': eslintComments,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            ...eslintComments.configs.recommended.rules,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            // Use type instead of interface
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            // No type assertions
            '@typescript-eslint/consistent-type-assertions': [
                'error',
                { assertionStyle: 'never' },
            ],
            // Disallow variable declarations from shadowing variables declared in the outer scope
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': 'error',

            // Disabled rules
            '@typescript-eslint/no-invalid-void-type': 0,
            '@typescript-eslint/unbound-method': 0,

            'eslint-comments/require-description': 'error',
        },
    },
)
