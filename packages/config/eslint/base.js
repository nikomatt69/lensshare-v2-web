/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'simple-import-sort',
    'prettier',
    'unicorn',
    'import'
  ],
  rules: {
    curly: 'warn',
    'no-unused-vars': 'off',
    'prettier/prettier': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'prefer-destructuring': ['warn', { VariableDeclarator: { object: true } }],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off', // turn warn
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/consistent-type-imports': 'warn',
    'no-use-before-define': 'warn',
    'no-unexpected-multiline': 'warn',
    'unicorn/better-regex': 'warn',
    'unicorn/catch-error-name': 'warn',
    'unicorn/no-array-for-each': 'warn',
    'unicorn/no-for-loop': 'warn',
    'unicorn/no-lonely-if': 'warn',
    'unicorn/no-useless-undefined': 'warn',
    'unicorn/prefer-array-find':'warn'
  },
  ignorePatterns: ['generated.ts', 'node_modules']
};
