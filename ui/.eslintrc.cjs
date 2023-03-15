/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-strongly-recommended',
  ],
 rules: {
  "vue/max-attributes-per-line": ["error", {
    "singleline": {
      "max": 1
    },      
    "multiline": {
      "max": 1
    }
  }]
 },
  parserOptions: {
    ecmaVersion: 'latest',
  },
};
