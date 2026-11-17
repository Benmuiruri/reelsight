import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { makeFixture } from "./fixtures.js";

const exec = promisify(execFile);

async function probe(path: string) {
  const { stdout } = await exec("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration:stream=codec_type,width,height",
    "-of",
    "json",
    path,
  ]);
  return JSON.parse(stdout) as {
    format: { duration: string };
    streams: { codec_type: string; width?: number; height?: number }[];
  };
}

describe("makeFixture", () => {
  it("red-square is 3 s, 320x180, with one video and one audio stream", async () => {
    const info = await probe(await makeFixture("red-square"));

    expect(Number(info.format.duration)).toBeCloseTo(3, 1);
    expect(info.streams.map((s) => s.codec_type).sort()).toEqual([
      "audio",
      "video",
    ]);
    expect(info.streams.find((s) => s.codec_type === "video")).toMatchObject({
      width: 320,
      height: 180,
    });
  });
});
