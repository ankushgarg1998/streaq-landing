# Streaq landing — developer notes

Standalone static marketing site for **Streaq** (a habit tracker). It is fully
independent of the main app — its own Astro project, deployed on its own to
GitHub Pages at the custom domain **streaq.club**.

> The public `README.md` is intentionally product-facing. Keep dev/ops details
> here and in code comments / `.env.example` / the workflow, **not** in the README.

## Stack

- **Astro** `^5.14` — static output, zero JS by default; the only client JS is a
  few small inline `<script>` blocks (theme toggle, signup fetch, confirmed-page
  personalization).
- **pnpm** 10 · **Node 22** (`.nvmrc` = `lts/jod`; `engines.node` = `>=22 <23`).

## Commands

```bash
pnpm install
pnpm dev      # local dev server
pnpm build    # static build → dist/
pnpm preview  # serve the built dist/ locally
pnpm check    # astro check (type/diagnostics)
```

## Structure

- `src/pages/index.astro` — the landing page. Two layouts (`.layout-desktop`
  centered-editorial, `.layout-mobile` stacked) toggled at `@media (max-width: 720px)`.
- `src/pages/confirmed.astro` — post-confirmation landing (see Kit below).
- `src/components/` — `BrandLockup`, `ThemeToggle`, `Eyebrow`, `Signup`, `DotGrid`.
- `src/styles/tokens.css` — design tokens for `:root` (light) and
  `[data-theme='dark']`.
- `public/` — `CNAME`, `favicon.svg`, `og.png` (copied verbatim into `dist/`).

## Theming

Theme is a `data-theme` attribute on `<html>` + CSS custom properties. An inline
script in `<head>` sets it before paint (defaults to light) from
`localStorage['streaq-theme']`; `ThemeToggle` flips it and persists.

## Email waitlist (Kit / ConvertKit)

- `Signup.astro` POSTs to Kit's public, browser-safe endpoint
  `https://app.convertkit.com/forms/{id}/subscriptions` with `{ email_address }`.
  **No API key is used or shipped** — only the numeric **form id**, which is a
  public identifier (it appears in the page HTML). Never commit a Kit API
  key/secret.
- Form id default `9503947`, lives in `Signup.astro`; override with
  `PUBLIC_KIT_FORM_ID` (see `.env.example`).
- The form uses **double opt-in**: submitting only sends a confirmation email;
  the user must click its link to actually join. On-page copy reflects this
  ("Almost there — check your inbox.").
- **Post-confirmation redirect** (set in the Kit dashboard) →
  `https://streaq.club/confirmed`.
- Kit's "Send subscriber data to thank you page" appends `first_name`,
  `email_address`, `id` to that URL. `confirmed.astro` reads them client-side
  and personalizes the copy — rendered via `textContent` only (params are
  user-controllable) and length-capped; falls back to generic copy when absent.

## Deploy — GitHub Pages

- Repo: `ankushgarg1998/streaq-landing` (personal account), branch `master`.
- `.github/workflows/deploy.yml` builds and publishes on every push to `master`.
  Requires repo **Settings → Pages → Source = "GitHub Actions"**.

### Custom domain (streaq.club)

- `public/CNAME` = `streaq.club`; `astro.config.mjs` has `site: 'https://streaq.club'`
  and **no `base`** (assets resolve at the domain root).
- DNS records at the registrar:
  - **apex `@`** — A → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`;
    AAAA → `2606:50c0:8000::153` … `8003::153`.
  - **`www`** (optional) — CNAME → `ankushgarg1998.github.io`.
- After DNS resolves: set the custom domain in Settings → Pages, then enable
  **Enforce HTTPS**.
- **To revert to the project URL** (`ankushgarg1998.github.io/streaq-landing`):
  set `base: '/streaq-landing'` + `site: 'https://ankushgarg1998.github.io'`,
  delete `public/CNAME`, clear the custom domain in Settings. (A `base` is
  required there so `/_astro/…` asset URLs resolve under the sub-path.)

## Favicon

`public/favicon.svg` is the brand mark (ink tile + checkmark) and inverts via
`prefers-color-scheme`. Linked from both pages. SVG-only (no `.ico`/PNG set).

## Link previews (Open Graph)

`public/og.png` is a 2400×1260 (1.91:1) card; `og:*` + `twitter:*` tags in
`index.astro` reference it with **absolute** URLs (scrapers require absolute).
Previews only work once `streaq.club` is publicly serving; scrapers cache hard
(refresh via the Facebook debugger / X Card Validator / LinkedIn Post Inspector).

To regenerate the card, edit `/tmp/og-card.html` (or recreate it) and render with
headless Chrome:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=1200,630 --virtual-time-budget=5000 \
  --default-background-color=ffffffff \
  --screenshot=public/og.png /tmp/og-card.html
```

If the image dimensions change, update `og:image:width`/`height` in `index.astro`.
