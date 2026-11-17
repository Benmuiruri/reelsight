# reelsight

Lets AI agents watch videos on your own machine.

> **Status: In development.**

## What it will do

Give reelsight a video file or a URL. It gives back:

- **A transcript** with a time for every word.
- **Overview sheets**: a few images, each holding 16 small pictures spread evenly over the video.
- **A manifest**: one JSON file that describes everything, so programs never have to parse text.

Then an agent can ask for more, without transcribing again:

- **Frames**: full-size pictures at chosen times.
- **Scan sheets**: one picture at every scene change over a chosen stretch.
- **Motion**: pictures close together over a short stretch, plus a measure of how much the picture
  changes, so an agent can tell when movement starts, stops, speeds up and slows down.

It will run as a command-line tool and as an MCP server. Everything runs locally: no cloud models, no API keys.

## Why

Building this because the cost is no longer building, it's usage. Probably there are other CLIs that could do this but why not build my own.

I wanted Claude to "watch" some cool animations to get context of what I want to add in my personal website. Claude had to build a temp scratchpad and discard it after.

That got me thinking with all the cool AI explainer videos or motion graphic videos people are putting out it would be cool to build something I can reuse and here we are :)

## Requirements

- macOS (Apple Silicon or Intel) or Linux
- Node.js 24 or newer
- pnpm
- ffmpeg and ffprobe

## Development

```sh
pnpm install
pnpm check    # lint, then typecheck, then tests
pnpm format   # format all files with Prettier
```

The tests generate small videos with ffmpeg, so `ffmpeg` and `ffprobe` must be on your `PATH`.

## License

MIT. See [LICENSE](LICENSE).

## Credits

reelsight was influenced by vidscribe which did something similar but mainly for YouTube videos.
