import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parserOptions: {
                project: true,
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "no-console": "off"
        }
    },
    {
        files: ["src/cli/**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ["src/hmr/**/*.ts"],
        languageOptions: {
            globals: {
                ...globals.browser,
                Ext: "readonly",
            },
        },
        rules: {
            "no-restricted-globals": ["error", "process"],
        }
    }
);