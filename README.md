# shoreyaww

Personal site, served by GitHub Pages at https://shaurya-m002.github.io. Plain HTML/CSS/JS, no build step.

- `index.html` — home: hero, projects, work, writing, contact
- `blog.html`, `reading.html`, `posts/` — writing
- `site.css`, `site.js` — shared by every page
- `media/` — project clips, the reel, posters, and the `og.png` share card
- `cv.pdf`

## Clips and the reel

Every clip is an HTML scene in `tools/reel/scenes/`, rendered frame by frame with Playwright and encoded with ffmpeg.

```bash
cd tools/reel
npm install
node render.mjs                  # all scenes -> build/*.mp4 (1920x1080 masters)
node render.mjs forge            # one scene
node render.mjs --still 5 forge  # build/forge@5.png, for checking a frame
node render.mjs --still 1 og && cp build/og@1.png ../../media/og.png
./encode.sh                      # masters -> media/*.mp4, posters, media/reel.mp4
```

Scene motion must be a pure function of `t` (see `scene.js`) so every render is identical.

## Preview

Use a server that supports range requests, or video seeking breaks: `npx http-server -s`.
