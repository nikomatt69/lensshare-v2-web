/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      "experimentalObjectRestSpread": true
    }
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
    'prettier/prettier': 'off',
    'unused-imports/no-unused-imports': 'off',
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'prefer-destructuring': ['warn', { VariableDeclarator: { object: true } }],
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'off', // turn warn
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    'no-use-before-define': 'warn',
    'no-unexpected-multiline': 'warn',
    'unicorn/better-regex': 'warn',
    'unicorn/catch-error-name': 'warn',
    'unicorn/no-array-for-each': 'warn',
    'unicorn/no-for-loop': 'warn',
    'unicorn/no-lonely-if': 'warn',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/prefer-array-find':'warn'
  },
  ignorePatterns: ['generated.ts', 'node_modules']
};
