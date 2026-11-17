import { ESLint } from "eslint";
import tseslint from "typescript-eslint";
import { describe, expect, it } from "vitest";

const eslint = new ESLint({
  overrideConfig: tseslint.configs.disableTypeChecked,
});

async function importErrors(file: string, code: string): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath: file });
  const fatal = result?.messages.find((m) => m.fatal);
  if (fatal) throw new Error(fatal.message);
  return (result?.messages ?? [])
    .filter((m) => m.ruleId === "@typescript-eslint/no-restricted-imports")
    .map((m) => m.message);
}

describe("import direction", () => {
  it.each([
    ["src/domain/x.ts", `import { a } from "../adapters/ffmpeg.js";`],
    ["src/domain/x.ts", `import { a } from "../core/watch.js";`],
    ["src/adapters/x.ts", `import { a } from "../core/watch.js";`],
    ["src/adapters/x.ts", `import { a } from "../compose.js";`],
    ["src/core/x.ts", `import { a } from "../adapters/ffmpeg.js";`],
    ["src/core/x.ts", `import { a } from "../cli/main.js";`],
    ["src/core/x.ts", `import { a } from "../compose.js";`],
    ["src/cli/x.ts", `import { a } from "../adapters/ffmpeg.js";`],
    ["src/cli/x.ts", `import { a } from "../domain/time.js";`],
    ["src/mcp/x.ts", `import { a } from "../cli/main.js";`],
    ["src/mcp/x.ts", `import { a } from "../domain/time.js";`],
  ])("%s rejects %s", async (file, code) => {
    expect(await importErrors(file, code)).toHaveLength(1);
  });

  it.each([
    ["src/domain/x.ts", `import { a } from "./time.js";`],
    ["src/adapters/x.ts", `import { a } from "../domain/time.js";`],
    ["src/core/x.ts", `import { a } from "../domain/time.js";`],
    ["src/core/x.ts", `import type { Ffmpeg } from "../adapters/ffmpeg.js";`],
    ["src/core/x.ts", `import { type Ffmpeg } from "../adapters/ffmpeg.js";`],
    ["src/compose.ts", `import { a } from "./adapters/ffmpeg.js";`],
    ["src/cli/x.ts", `import { a } from "../core/reelsight.js";`],
    ["src/mcp/x.ts", `import { a } from "../compose.js";`],
  ])("%s allows %s", async (file, code) => {
    expect(await importErrors(file, code)).toEqual([]);
  });
});
