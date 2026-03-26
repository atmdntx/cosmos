import { defineConfig } from "vite-plus";
export default defineConfig({
  staged: {
    "*": "vp check --fix",
    "commit-msg": "devmoji --commit",
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      "eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
});
