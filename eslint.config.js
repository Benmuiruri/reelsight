import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const forbid = (files, ...patterns) => ({
  files,
  rules: {
    "@typescript-eslint/no-restricted-imports": ["error", { patterns }],
  },
});

export default tseslint.config(
  { ignores: ["node_modules/"] },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["src/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportExpression",
          message:
            "No dynamic import(): the import-direction rule cannot see it.",
        },
      ],
    },
  },
  {
    files: ["src/*/*/**/*"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program",
          message:
            "src/ folders stay flat: the import-direction rule only handles one level.",
        },
      ],
    },
  },
  forbid(["src/domain/**"], {
    regex: "^\\.\\./",
    message: "domain/ imports nothing outside domain/.",
  }),
  forbid(["src/adapters/**"], {
    regex: "^\\.\\./(?!domain/)",
    message: "adapters/ may import only domain/.",
  }),
  forbid(
    ["src/core/**"],
    {
      regex: "^\\.\\./(?!domain/|adapters/)",
      message: "core/ may import only domain/ and adapter types.",
    },
    {
      regex: "^\\.\\./adapters/",
      allowTypeImports: true,
      message:
        "core/ may import adapter types only; real adapters come in through Deps.",
    },
  ),
  forbid(["src/cli/**", "src/mcp/**"], {
    regex: "^\\.\\./(?!core/|compose\\.js$)",
    message: "Front ends may import only core/ and compose.ts.",
  }),
  {
    files: ["*.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
