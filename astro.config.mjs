import { defineConfig } from 'astro/config';

// Pure static output (ADR-0001), served by Cloudflare Pages through its Git
// integration (ADR-0002). No adapter: Pages serves dist/ as built.
export default defineConfig({
  site: 'https://uruni.kerti.dev',
  // One page: inlined CSS saves a render-blocking request, and the fonts it
  // names are found as soon as the HTML is read.
  build: {
    inlineStylesheets: 'always',
  },
  // No code blocks on the site; Shiki's inline styles would also fight the CSP.
  markdown: {
    syntaxHighlight: false,
  },
  // Content Security Policy as a <meta>: Astro hashes every inline script and
  // style it emits, so nothing inline runs unless the build put it there.
  // Directives a <meta> CSP can't carry (frame-ancestors) live in
  // public/_headers.
  security: {
    csp: {
      directives: ["default-src 'self'"],
      styleDirective: {
        // Per-element custom properties (`style="--i: 0"`) for staggered
        // motion can't be hashed one by one.
        resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
});
