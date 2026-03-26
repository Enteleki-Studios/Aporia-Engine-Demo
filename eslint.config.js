import eslintComments from 'eslint-plugin-eslint-comments'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

import eslint from '@eslint/js'

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    ...storybook.configs['flat/recommended'],
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
                tsconfigRootDir: import.meta.dirname,
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
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                { allowNumber: true },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            // Disallow variable declarations from shadowing variables declared in the outer scope
            'no-shadow': 'off',
            '@typescript-eslint/no-shadow': 'error',

            // Disabled rules
            '@typescript-eslint/no-invalid-void-type': 0,
            '@typescript-eslint/unbound-method': 0,

            'eslint-comments/require-description': 'error',

            // TURN ON WHEN TS-ESLINT IS UPDATED
            '@typescript-eslint/no-unnecessary-type-arguments': 0,
        },
    },
)
