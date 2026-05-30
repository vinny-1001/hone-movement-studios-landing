# Hone Movement Studios — Design System (MASTER)

Source of truth for every component. Brand tokens are FIXED — design
system generator suggestions are overridden by the brand below.

---

## Brand Tokens (FIXED — never override)

```css
:root {
  --brand-blue: #004369;
  --dark-charcoal: #44414F;
  --light-grey: #EEEDED;
  --white: #FFFFFF;

  /* Semantic mappings */
  --color-bg-dark: var(--brand-blue);
  --color-bg-dark-alt: var(--dark-charcoal);
  --color-bg-light: var(--light-grey);
  --color-bg-white: var(--white);
  --color-text-on-dark: var(--white);
  --color-text-on-light: var(--dark-charcoal);
  --color-cta-bg: var(--brand-blue);
  --color-cta-text: var(--white);
  --color-border-light: rgba(68, 65, 79, 0.15);
  --color-focus-ring: #4DA3D9; /* Lightened brand blue for visible focus on dark bg */
}
```

Contrast check:
- White (#FFFFFF) on Brand Blue (#004369) → 11.4:1 ✓ AAA
- White on Dark Charcoal (#44414F) → 8.8:1 ✓ AAA
- Dark Charcoal on White → 8.8:1 ✓ AAA
- Dark Charcoal on Light Grey (#EEEDED) → 8.0:1 ✓ AAA
- CTA (white on brand blue) → 11.4:1 ✓ exceeds 7:1 requirement

---

## Typography

```css
--font-primary: 'Gill Sans MT', 'Gill Sans', Calibri, 'Trebuchet MS', sans-serif;
--font-body-size: 1rem;           /* 16px min */
--font-body-line-height: 1.6;
--font-h1: clamp(2rem, 5vw, 3rem);    /* 32 → 48px */
--font-h2: clamp(1.75rem, 4vw, 2.5rem); /* 28 → 40px */
--font-h3: 1.5rem;
--font-weight-heading: 700;
--font-weight-body: 400;
```

- Never load Google Fonts. Never use DM Sans, Inter, Roboto.
- Body min 16px. Headings bold.
- Paragraphs max 3 lines before break.

---

## Spacing Scale (4/8 system)

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-24: 6rem;    /* 96px */
```

Section vertical padding: mobile 48px, desktop 96px.

---

## Layout

- Mobile-first. Breakpoints: 375 / 640 / 768 / 1024 / 1280
- Container max-width: 1200px, padding 16px mobile / 24px tablet / 48px desktop
- Single column ≤ 767px throughout
- Touch targets ≥ 44×44px, 8px gap min

---

## Motion

- Duration: 150–300ms. Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Animate transform/opacity only
- One element per section on scroll-reveal
- Respect prefers-reduced-motion → disable all motion

---

## Voice (v6 brand guidelines)

Tone: **warm, joyful, real, direct, personal**. Talks like a human who loves
the work and would love to share the room with you. British English.

- USE: practice, rehearsal, work, play, light-filled, sprung floor, big mirrors,
  lovely room, welcome, open, here for you, from £13/hr, self-serve booking,
  private studio, Limehouse, East London, our corner of E14.
- AVOID: journey, wellness, transformation, immersive, curated, experience,
  stunning, magical, breathtaking, vibrant community, hidden gem, tribe,
  wellness warriors, affordable luxury, elevated practice, premium members.
- Contractions are good. "We" and "you". Sound like a person wrote it.
- Exclamation marks only when you really mean it (rare).
- Strapline: **"A space for the work you love."**
- Prices in £.

---

## Section Pattern (Landing — Pattern 2: Hero + Testimonials + CTA)

1. Hero (dark, CTA above fold)
2. Social proof strip (light grey)
3. Studios (two dark cards)
4. Pricing table (light)
5. Testimonials (charcoal)
6. About (light grey)
7. Inquiry form (brand blue) ← conversion
8. Footer (charcoal)
9. Sticky mobile CTA (≤767px only)

---

## Anti-patterns

- Raw hex in components — always use CSS vars / Tailwind tokens
- Emojis as icons — SVG only (Heroicons/Lucide)
- Placeholder-only labels
- Hover-only interactions
- More than one accent colour for CTAs
- Horizontal scroll at any breakpoint
- Animations that block content visibility
