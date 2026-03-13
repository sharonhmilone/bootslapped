# Bootslapped — Astro Project

A fast, affiliate-first marketing resource site for bootstrapped solo founders.

## Stack
- **Framework:** Astro
- **Hosting:** Vercel
- **Repo:** GitHub

## Local Development

```bash
# Install dependencies
npm install

# Run dev server (localhost:4321)
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
  layouts/     # Base layout (nav, footer, shared styles)
  pages/       # Every .astro file = one URL
    index.astro          → bootslapped.com/
    compare/             → bootslapped.com/compare/[page]
    tools/               → bootslapped.com/tools/[category]
    guides/              → bootslapped.com/guides/[slug]
    diagnostic.astro     → bootslapped.com/diagnostic
  components/  # Reusable UI pieces
  styles/      # Global CSS (if needed)
public/        # Static assets (images, favicon)
```

## Adding a New Page

1. Create a new `.astro` file in the right folder under `src/pages/`
2. Import the Base layout at the top
3. Push to GitHub → Vercel deploys automatically

## Deployment

Connected to Vercel via GitHub. Every push to `main` auto-deploys.
