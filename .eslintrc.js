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
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],

        "@typescript-eslint/explicit-module-boundary-types": "off",

        "@typescript-eslint/no-explicit-any": "off",

        // Sorting imports (auto fix)
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",

        "no-async-promise-executor": "off",
        "@typescript-eslint/no-this-alias": "off",

        "jsx-a11y/alt-text": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "warn",
        "jsx-a11y/click-events-have-key-events": "warn",
        "jsx-a11y/no-static-element-interactions": "warn",
        "jsx-a11y/media-has-caption": "warn",

        "react/display-name": "off",
        "react/no-unescaped-entities": "off",
      },

      // Sorting imports (auto fix)
      plugins: ["simple-import-sort", "import"],
    },
  ],
};
