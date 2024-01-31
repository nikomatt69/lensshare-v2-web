/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    require.resolve('./base.js'),
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-unknown-property': 'off',
    'react/jsx-no-useless-fragment':'warn',
    'react/self-closing-comp': 'warn',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/role-supports-aria-props': 'off',
    "react-hooks/exhaustive-deps": [
      "error",
      {
        "additionalHooks": "(useAnimatedStyle|useDerivedValue|useAnimatedProps)"
      }
    ]
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
