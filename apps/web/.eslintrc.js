/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve('@lensshare/config/eslint/react.js')],
  ignorePatterns: ['sw.js']
};
