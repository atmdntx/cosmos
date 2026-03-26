import { defineConfig } from "vite-plus";
export default defineConfig({
  staged: {
    "*": "vp check --fix",
    "commit-msg": "vp dlx devmoji --edit --lint",
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
