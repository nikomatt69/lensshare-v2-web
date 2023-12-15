module.exports = {
  extends: [require.resolve('@lensshare/config/eslint/base.js')],
  rules: {
    'import/no-anonymous-default-export': 'off',
    'no-use-before-define': 'off'
  }
};
