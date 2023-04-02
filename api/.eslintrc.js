module.exports = {
   env: {
      node: true,
      es2021: true,
   },
   extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
   ],
   parser: "@typescript-eslint/parser",
   parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
   },
   plugins: ["pretty-imports", "@typescript-eslint"],
   rules: {
      "no-empty-pattern": 0,
      "no-unused-vars": 0,
      "pretty-imports/sorted": 0,
   },
};
