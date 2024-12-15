import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import'; // For import/export linting
import prettier from 'eslint-plugin-prettier'; // For Prettier integration
import prettierConfig from 'eslint-config-prettier'; // Disables conflicting rules with Prettier

export default [
  { ignores: ['dist', 'node_modules', 'build'] }, // Exclude common build folders
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' }, // Automatically detects the React version
      'import/resolver': {
        node: { extensions: ['.js', '.jsx', '.json'] }, // Resolve imports properly
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      prettier,
    },
    rules: {
      // Core Rules
      ...js.configs.recommended.rules,

      // React Rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,

      // React Hooks Rules
      ...reactHooks.configs.recommended.rules,

      // Import Rules
      'import/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'warn',
      'import/no-named-as-default': 'warn',

      // React-specific Tweaks
      'react/jsx-no-target-blank': 'off', // Disable for convenience
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/prop-types': 'off', // Disable prop-types if using TypeScript

      // Prettier Integration
      'prettier/prettier': 'error', // Enforce Prettier formatting
    },
  },
];
