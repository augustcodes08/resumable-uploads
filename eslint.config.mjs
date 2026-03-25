import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  // Ignore config and setup files
  {
    ignores: [
      "*.config.{js,mjs,cjs}",
      "jest.setup.js", // arguably this one could be linted
      "coverage/**",
      "node_modules/**",
      "dist/**",
      "build/**"
    ]
  },
  
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  
  // Need browser globals to not throw 'is not defined' errors
  {
    files: ["resumable-uploads.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.browser,
        define: "readonly", 
        module: "readonly", 
        exports: "readonly",
      }
    },
    rules: {
      "@typescript-eslint/no-this-alias": ["error", {
        allowDestructuring: true,
        allowedNames: ["$", "$opt", "self", "that"]
      }]
    }
  },
  
  // Tests can be a little less strict
  {
    files: ["__tests__/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }]
    }
  }
];