import { execFile } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);

// Square still at x=20 until 1 s, slides to x=260 by 2 s, then still. Beep 1.5-1.7 s.
const recipes = {
  "red-square": [
    ["-f", "lavfi", "-i", "color=black:s=320x180:r=30:d=3"],
    ["-f", "lavfi", "-i", "color=red:s=40x40:r=30:d=3"],
    [
      "-f",
      "lavfi",
      "-i",
      "aevalsrc='if(between(t,1.5,1.7),0.5*sin(2*PI*1000*t),0)':s=48000:d=3",
    ],
    [
      "-filter_complex",
      "[0][1]overlay=x='if(lt(t,1),20,if(lt(t,2),20+240*(t-1),260))':y=70",
    ],
    ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac"],
  ].flat(),
};

export type FixtureName = keyof typeof recipes;

let dir: Promise<string> | undefined;
const made = new Map<FixtureName, Promise<string>>();

/** Generates a test video once per run and returns its path. */
export function makeFixture(name: FixtureName): Promise<string> {
  let path = made.get(name);
  if (!path) {
    path = build(name);
    made.set(name, path);
  }
  return path;
}

async function build(name: FixtureName): Promise<string> {
  dir ??= mkdtemp(join(tmpdir(), "reelsight-fixtures-"));
  const out = join(await dir, `${name}.mp4`);
  await exec("ffmpeg", ["-v", "error", "-y", ...recipes[name], out]);
  return out;
}
