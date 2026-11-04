import js from '@eslint/js'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'

const legacyHeavyFiles = [
  'src/pages/admin/pages/SEODashboardPage.tsx',
  'src/pages/admin/pages/PermissionsPage.tsx',
  'src/pages/admin/pages/SettingsPage.tsx',
  'src/components/seo/SEOSettings.tsx',
  'src/components/blocks/BlockComponents.tsx',
  'src/context/ServiceContext.tsx',
  'src/context/LanguageContext.tsx',
]

const relaxedTypeCheckedRules = {
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-unnecessary-type-assertion': 'off',
  '@typescript-eslint/no-misused-promises': 'off',
  '@typescript-eslint/require-await': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/await-thenable': 'off',
}

export default tseslint.config(
  { ignores: ['dist', 'server', 'eslint.config.js', 'postcss.config.js', 'tailwind.config.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/prop-types': 'off',
    },
  },
  {
    files: legacyHeavyFiles,
    rules: relaxedTypeCheckedRules,
  },
)
