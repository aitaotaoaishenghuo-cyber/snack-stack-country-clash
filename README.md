# Snack Stack: Country Clash

A lightweight mobile-first H5 puzzle MVP for testing overseas web mini-game mechanics:

- Daily solvable stack puzzle
- Country leaderboard theme
- Share modal with Wordle-style grid
- Simulated rewarded revive
- Local test metrics
- Open Graph preview support

## Local Preview

Open `index.html` directly, or run a static server:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then visit:

```text
http://127.0.0.1:4173/
```

## Deploy

This is a static site. Deploy the whole folder to Vercel, Netlify, Cloudflare Pages, or any static host.

### Vercel Drag-and-Drop

1. Open Vercel and create a new project.
2. Choose manual upload or drag-and-drop deployment.
3. Upload this whole folder or `snack-stack-country-clash.zip`.
4. After deployment, copy the real production domain.
5. Update `og:image` and `og:url` in `index.html` if the domain differs.

After deployment, update these values in `index.html` if your real domain differs:

- `og:image`
- `og:url`

The Open Graph image is expected at:

```text
assets/og-preview.png
```
