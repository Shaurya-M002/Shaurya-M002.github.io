# shoreyaww — personal site

A minimalist personal website (plain HTML/CSS, no build step), styled like a
Bear Blog. Hosted for free on GitHub Pages.

## Pages
- `index.html` — home
- `about.html` — about me
- `blog.html` — posts
- `reading.html` — reading list
- `style.css` — all styling (720px, light/dark auto)

CV link (Overleaf, read-only) is in the nav on every page:
`https://www.overleaf.com/read/hxrttfggsmtk#41d189`

## Preview locally
Just open `index.html` in a browser. That's it.

## Deploy free on GitHub Pages

1. Create a GitHub account (pick a username — that becomes your URL).
2. Create a **new public repo** named exactly:
   `<your-username>.github.io`
   (e.g. `shaurya.github.io` if your username is `shaurya`).
3. Push these files:
   ```
   cd /Users/madukuri.shaurya/Codes/Projects/Personal/shoreyaww
   git init
   git add .
   git commit -m "initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
   git push -u origin main
   ```
4. In the repo: **Settings → Pages** → Source = `main` branch, `/ (root)` → Save.
5. Wait ~1 minute. Your site is live at:
   `https://<your-username>.github.io`

## Notes
- The URL is always `<your-username>.github.io`. If `shaurya` is taken, try
  `shoreyaww`, `sureya`, etc.
- To rename the brand, change "shoreyaww" in each `.html` file and the
  `<title>` tags.
- Later you can attach a custom domain (e.g. `shoreyaww.xyz`, ~$1/yr) under
  Settings → Pages → Custom domain.
