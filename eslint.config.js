import { defineConfig, globalIgnores } from 'eslint/config'
import astroParser from 'astro-eslint-parser'
import configPrettier from 'eslint-config-prettier'
import globals from 'globals'
import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import pluginAstro from 'eslint-plugin-astro'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'
import reactRefresh from 'eslint-plugin-react-refresh'
import ts from 'typescript-eslint'

export default defineConfig(
  globalIgnores([
    'dist',
    '.astro',
    'apps/backend/dist',
    'node_modules',
    'pnpm-lock.yaml',
    'yarn.lock',
    'bun.lock',
    'package-lock.json',
    '.trash',
    '_trash',
  ]),
  js.configs.recommended,
  ...ts.configs.strictTypeChecked,
  ...ts.configs.stylisticTypeChecked,
  configPrettier,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  // --- CONFIGURACIÓN PARA ARCHIVOS ASTRO ---
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser, // Procesa el archivo .astro
      parserOptions: {
        parser: ts.parser, // Procesa el TypeScript dentro del frontmatter
        extraFileExtensions: ['.astro'],
        project: ['./apps/frontend/tsconfig.json'],
      },
    },
    ...pluginAstro.configs['flat/recommended'],
    ...pluginAstro.configs['flat/jsx-a11y-recommended'],
    rules: {},
  },
  // --- CONFIGURACIÓN PARA COMPONENTES REACT (TSX) ---
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        project: ['./apps/backend/tsconfig.json'],
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks.meta,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...jsxA11y.configs.recommended.rules,

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
)
