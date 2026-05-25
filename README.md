# Rescue Rush: Country Clash

A lightweight mobile-first H5 puzzle MVP for testing overseas web mini-game mechanics:

- Daily solvable rescue puzzle
- Country rescue leaderboard theme
- Share modal with Wordle-style grid
- Yang-style rescue tools: Move Out, Undo, Shuffle
- World/Country/Friends leaderboard tabs with local simulated heat
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

## DeepSeek Draft Workflow

Use this when you want to save GPT/Codex usage:

1. GPT/Codex breaks the task into a clear prompt.
2. DeepSeek produces a draft plan or code.
3. GPT/Codex reviews, fixes, tests, and deploys.

Create a local `.env` file from `.env.example` and put a fresh DeepSeek key there:

```bash
cp .env.example .env
```

Then run:

```bash
node scripts/deepseek-draft.mjs
```

The draft is written to:

```text
deepseek-draft.md
```

Never commit `.env` or API keys.

## Deploy

This is a static site. Deploy the whole folder to Vercel, Netlify, Cloudflare Pages, or any static host.

### Vercel Drag-and-Drop

1. Open Vercel and create a new project.
2. Choose manual upload or drag-and-drop deployment.
3. Upload this whole folder or your project zip.
4. After deployment, copy the real production domain.
5. Update `og:image` and `og:url` in `index.html` if the domain differs.

After deployment, update these values in `index.html` if your real domain differs:

- `og:image`
- `og:url`

The Open Graph image is expected at:

```text
assets/og-preview.png
```
