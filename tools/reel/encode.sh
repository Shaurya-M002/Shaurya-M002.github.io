#!/usr/bin/env bash
# Turns build/<scene>.mp4 masters into the web clips, posters, and the shareable reel in ../../media.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../../media
mkdir -p "$OUT"

for s in forge pact noctis flyloom septa harness; do
  ffmpeg -y -loglevel error -i "build/$s.mp4" -vf scale=1280:720:flags=lanczos \
    -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart -an "$OUT/$s.mp4"
  ffmpeg -y -loglevel error -sseof -1.2 -i "build/$s.mp4" -frames:v 1 -vf scale=1280:720:flags=lanczos \
    -q:v 3 "$OUT/$s.jpg"
done

printf "file '%s.mp4'\n" intro forge pact noctis flyloom septa harness outro > build/reel.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i build/reel.txt \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart -an "$OUT/reel.mp4"
ffmpeg -y -loglevel error -ss 1.8 -i build/intro.mp4 -frames:v 1 -vf scale=1280:720:flags=lanczos -q:v 3 "$OUT/reel.jpg"

ls -lh "$OUT"
