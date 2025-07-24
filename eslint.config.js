import functional from "eslint-plugin-functional";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.turbo/**", "**/build/**"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "functional": functional
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Disable rules that require type information for now
      "functional/prefer-immutable-types": "off",
      "functional/prefer-readonly-type": "off",
      "functional/no-return-void": "off",
      "functional/functional-parameters": "off",
      "functional/no-conditional-statements": "off",
      "functional/no-expression-statements": "off",
      "functional/no-throw-statements": "off",
      // TypeScript rules
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    },
  }
];