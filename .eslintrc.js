module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  // to enable features such as async/await
  parserOptions: {
    ecmaVersion: 8,
  },
  ignorePatterns: [
    "node_modules/*",
    ".next/*",
    ".out/*",
    "!.prettierrc.js",
  ], // We don"t want to lint generated files nor node_modules, but we
  // want to lint .prettierrc.js (ignored by default by eslint)
  extends: ["eslint:recommended"],
  overrides: [
    // This configuration will apply only to TypeScript files
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      settings: { react: { version: "detect" } },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: [
        "eslint:recommended",
        "plugin:prettier/recommended", // Prettier plugin
        "plugin:@typescript-eslint/recommended", // TypeScript rules
        "plugin:react/recommended", // React rules
        "plugin:react-hooks/recommended", // React hooks rules
        "plugin:jsx-a11y/recommended", // Accessibility rules
      ],
      rules: {
        "no-case-declarations": "off",
        "no-fallthrough": "off",

        // We will use TypeScript"s types for component props instead
        "react/prop-types": "off",

        // No need to import React when using Next.js
        "react/react-in-jsx-scope": "off",

        // This rule is not compatible with Next.js"s <Link /> components
        "jsx-a11y/anchor-is-valid": "off",

        // Includes .prettierrc.js rules
        "prettier/prettier": ["error", {}, { usePrettierrc: true }],

        // Why would you want unused vars?
        "@typescript-eslint/no-unused-vars": ["error"],

        // I suggest this setting for requiring return types on functions
        // only where useful
        "@typescript-eslint/explicit-function-return-type": [
          "warn",
          {
            allowExpressions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          },
        ],

        "@typescript-eslint/no-explicit-any": "off",
        /*
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-for-in-array": "error",
        "no-implied-eval": "off",
        "@typescript-eslint/no-implied-eval": "error",
        "@typescript-eslint/no-misused-promises": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/no-unsafe-assignment": "error",
        "@typescript-eslint/no-unsafe-call": "error",
        "@typescript-eslint/no-unsafe-member-access": "error",
        "@typescript-eslint/no-unsafe-return": "error",
        "@typescript-eslint/prefer-regexp-exec": "error",
        "require-await": "off",
        "@typescript-eslint/require-await": "error",
        "@typescript-eslint/restrict-plus-operands": "error",
        "@typescript-eslint/restrict-template-expressions": "error",
        "@typescript-eslint/unbound-method": "error",
        */

        // Sorting on imports (autofix)
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",
      },
      // Sorting on imports (autofix)
      plugins: ["simple-import-sort", "import"],
    },
  ],
};
