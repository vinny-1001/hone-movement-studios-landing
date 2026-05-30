# Hone Movement Studios — Landing Page

Single-page Astro site for studio hire inquiries from Instagram traffic.
One CTA: submit the inquiry form. Team follows up manually.

## Local dev

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview
```

## Deploy (Cloudflare Pages)

Connect this repo in the Cloudflare Pages dashboard:

- Build command: `npm run build`
- Output dir: `dist`
- Functions are auto-deployed from `functions/` (Pages Functions)

Set these environment variables in the Pages project:

- `DESTINATION_EMAIL` — where to send inquiries
- `FROM_EMAIL` — sender address on a domain with MailChannels DNS records

See [Cloudflare MailChannels setup](https://developers.cloudflare.com/pages/functions/plugins/mailchannels/)
for the required SPF / DKIM / `_mailchannels` TXT records.

If you prefer CLI deploys, install wrangler globally (`npm i -g wrangler`)
and run `wrangler pages deploy dist` after `npm run build`. (Wrangler is
not in devDeps because workerd has no Windows ARM64 build.)

## Brand tokens

Defined once in `src/styles/global.css` and `design-system/MASTER.md`:

| Token | Hex |
|-------|-----|
| Brand Blue | `#004369` |
| Dark Charcoal | `#44414F` |
| Light Grey | `#EEEDED` |
| White | `#FFFFFF` |

Font: Gill Sans MT (system-installed). No Google Fonts.

## Structure

```
src/
  components/       Hero, SocialProof, Studios, Pricing,
                    Testimonials, About, InquiryForm, Footer, StickyCTA
  layouts/Layout.astro
  pages/index.astro
  styles/global.css
functions/api/inquiry.ts   Cloudflare Pages Function (POST /api/inquiry)
design-system/MASTER.md    Source of truth for tokens + rules
public/favicon.svg
```

## Skills used during build

- `ui-ux-pro-max-skill` — design system generation, UX priority rules
- `publishing-astro-websites-agentic-skill` — Astro SSG patterns
- `accesslint-skill` — WCAG 2.1 AA checklist
- `vercel-agent-skills` — web design guidelines

## A11y notes

- 4.5:1 min text contrast (CTA is 11.4:1)
- Skip-to-main link, visible focus rings (2px)
- Form labels above every input, error region with `role="alert"`
- Sequential heading hierarchy (h1 → h2 → h3)
- `prefers-reduced-motion` respected
- No emoji icons — SVG only
- 44px+ tap targets, 16px+ body text
