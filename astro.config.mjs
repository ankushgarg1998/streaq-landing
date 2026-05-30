// @ts-check
import { defineConfig } from 'astro/config';

// Standalone static marketing site for Streaq.
// No integrations needed — plain HTML/CSS with a sprinkle of vanilla JS.
//
// Served from the custom apex domain streaq.club (GitHub Pages).
// `public/CNAME` holds the domain; assets resolve at the root (/_astro/…),
// so no `base` is needed.
//
// To revert to the GitHub project page (https://ankushgarg1998.github.io/streaq-landing):
//   1. set `site: 'https://ankushgarg1998.github.io'` and `base: '/streaq-landing'`
//   2. remove `public/CNAME`
//   3. clear the custom domain in repo Settings → Pages
export default defineConfig({
  site: 'https://streaq.club',
});
