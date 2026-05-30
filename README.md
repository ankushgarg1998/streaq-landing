# streaq-landing

Standalone static landing / "coming soon" page for **Streaq** ([streaq.club](https://streaq.club)).
Built with [Astro](https://astro.build); ships as static HTML/CSS with a sprinkle of
vanilla JS (theme toggle + email signup). Independent of the main app.

## Develop

```sh
nvm use            # Node 22 (lts/jod)
pnpm install
pnpm dev           # http://localhost:4321
pnpm build         # static output → dist/
pnpm preview       # serve the built dist/
```

## Email waitlist (Kit)

The signup form posts to a [Kit](https://kit.com) (formerly ConvertKit) form via its
public, browser-safe subscription endpoint
(`https://app.convertkit.com/forms/<ID>/subscriptions`). **No API key is used or shipped
to the browser** — only the form's numeric id, which is public anyway.

Setup:

1. In Kit: **Grow → Landing Pages & Forms → New → Form** (the form's opt-in / double
   opt-in / success settings are managed in Kit, not here).
2. Grab the form's **numeric id** (in the editor URL, or the `/forms/<ID>/subscriptions`
   action URL of its embed code).
3. Set it as `PUBLIC_KIT_FORM_ID` — copy `.env.example` to `.env` for local dev, and
   set the same variable in your deploy/CI environment for production builds.

If `PUBLIC_KIT_FORM_ID` is unset, the form shows a visual-only confirmation (no network
call) so local dev and previews still work.

## Deploy (GitHub Pages)

The build is fully static, so it hosts on GitHub Pages as-is. Two things to know:

- **Form id at build time:** GitHub Pages serves prebuilt files, so `PUBLIC_KIT_FORM_ID`
  must be present when the site is built (e.g. as a repository variable consumed by the
  Pages build workflow). It is public, so committing it in CI config is fine.
- **Base path:** with a custom domain (`streaq.club`) the default `base: '/'` is correct.
  For a project page (`<user>.github.io/streaq-landing`), set `base: '/streaq-landing'`
  in `astro.config.mjs`.
