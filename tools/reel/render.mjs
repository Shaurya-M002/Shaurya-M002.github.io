// node render.mjs [scene ...]          render scenes to build/<scene>.mp4 (1920x1080, 30fps)
// node render.mjs --still 3.5 forge    write build/forge@3.5.png for a quick look
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(new URL(import.meta.url).pathname);
const build = path.join(here, 'build');
fs.mkdirSync(build, { recursive: true });

const FPS = 30;
const ALL = ['intro', 'forge', 'pact', 'noctis', 'flyloom', 'septa', 'harness', 'outro'];
const SIZES = { og: { width: 1200, height: 630 } };

let args = process.argv.slice(2);
let still = null;
if (args[0] === '--still') { still = parseFloat(args[1]); args = args.slice(2); }
const scenes = args.length ? args : ALL;

async function open(browser, name, size = { width: 1920, height: 1080 }) {
  const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(here, 'scenes', name + '.html'));
  await page.evaluate(() => window.render(0));
  await page.evaluate(() => window.fontsReady);
  return page;
}

async function renderVideo(browser, name) {
  const page = await open(browser, name);
  const dur = await page.evaluate(() => window.DURATION);
  const frames = Math.round(dur * FPS);
  const out = path.join(build, name + '.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS),
    '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((r) => ff.on('close', r));
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.render(t), i / FPS);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  await page.close();
  console.log(`${name}: ${frames} frames -> ${path.relative(here, out)}`);
}

const browser = await chromium.launch();
for (const name of scenes) {
  if (still !== null) {
    const page = await open(browser, name, SIZES[name]);
    await page.evaluate((t) => window.render(t), still);
    const out = path.join(build, `${name}@${still}.png`);
    await page.screenshot({ path: out });
    await page.close();
    console.log(out);
  } else {
    await renderVideo(browser, name);
  }
}
await browser.close();
