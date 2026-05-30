// @ts-check
import { defineConfig } from 'astro/config';

// Standalone static marketing site for Streaq.
// No integrations needed — plain HTML/CSS with a sprinkle of vanilla JS.
//
// Served from the GitHub project page:
//   https://ankushgarg1998.github.io/streaq-landing
// so `base` must match the repo name for asset URLs (/_astro/…) to resolve.
//
// To switch to the custom domain streaq.club later (one-line flip + DNS):
//   1. set `base: '/'` (or remove the line) and `site: 'https://streaq.club'`
//   2. re-add `public/CNAME` containing `streaq.club`
//   3. point streaq.club DNS at GitHub Pages, then set the domain in repo settings
export default defineConfig({
  site: 'https://ankushgarg1998.github.io',
  base: '/streaq-landing',
});
