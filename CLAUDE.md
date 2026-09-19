# Streaq landing — developer notes

Standalone static marketing site for **Streaq** (a habit tracker). It is fully
independent of the main app — its own Astro project, deployed on its own to
GitHub Pages at the custom domain **streaq.club**.

> The public `README.md` is intentionally product-facing. Keep dev/ops details
> here and in code comments / `.env.example` / the workflow, **not** in the README.

## Stack

- **Astro** `^5.14` — static output, zero JS by default; the only client JS is a
  couple of small inline `<script>` blocks (theme toggle).
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
- `src/pages/privacy.astro`, `src/pages/delete-account.astro` — policy pages.
- `src/components/` — `BrandLockup`, `ThemeToggle`, `Eyebrow`, `AppCta`, `DotGrid`.
- `src/styles/tokens.css` — design tokens for `:root` (light) and
  `[data-theme='dark']`.
- `public/` — `CNAME`, `favicon.svg`, `og.png` (copied verbatim into `dist/`).

## Theming

Theme is a `data-theme` attribute on `<html>` + CSS custom properties. An inline
script in `<head>` sets it before paint (defaults to light) from
`localStorage['streaq-theme']`; `ThemeToggle` flips it and persists.

## Call to action

Streaq is generally available. The single CTA (`AppCta.astro`) is a plain link to
**https://app.streaq.club** — no form, no client JS, no third-party request. The
app URL and the CTA/kicker/note strings live as consts at the top of
`index.astro`.

The pre-launch email waitlist (Kit / ConvertKit double opt-in, `Signup.astro`,
`/confirmed`, `PUBLIC_KIT_FORM_ID`) was removed when the app went GA. Kit form
`9503947` still holds the addresses collected then; its post-confirmation
redirect pointed at `https://streaq.club/confirmed`, which no longer exists —
repoint it (to `https://app.streaq.club`) or archive the form in the Kit
dashboard. `privacy.astro` still describes that data in the past tense.

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
