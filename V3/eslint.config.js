import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
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
        },
    },
)
