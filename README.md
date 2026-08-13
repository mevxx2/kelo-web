# Kelo Care — marketing site

Animated landing page and signup funnel for Kelo Care, a caregiving app.

**Live Site:** https://kelo-care-web.vercel.app/

Next.js 14 (App Router) · TypeScript · Tailwind CSS 3.4 · framer-motion 11. Light theme only.

## Status: reviewed, but never run

This project was written without Node.js available on the build machine, so it
has **never been installed, compiled, or rendered**. It has had a line-by-line
static review, which found and fixed five defects — but static review is not a
build. Treat the first `npm run dev` as the real smoke test.

```bash
npm install
npm run typecheck   # do this first — it is the check that was never run
npm run dev
```

Fixed during review, listed here because they are the kind of thing that tends
to come back:

- **Card-stack hover.** Each card wrapper is `absolute inset-0` and fills the
  whole stack, so the highest-`z` wrapper swallowed every pointer event and
  only the centre card could be hovered. Wrappers are now
  `pointer-events-none`, with `pointer-events-auto` on the frame itself.
- **Hamburger morph.** framer-motion mixes `d` strings by interpolating their
  numbers pairwise and snaps instantly if the counts differ. `"M4 7h16"` (three
  numbers) against `"M6 6l12 12"` (four) did exactly that. Both endpoints of
  each bar now carry four numbers, absolute commands only.
- **Hydration under reduced motion** — see the `useMotionSafe` note below.
- **Signup validation** re-validated stale state on `onChange`, so an error
  cleared one keystroke after the field was fixed. `validate()` now takes the
  values explicitly.
- **Hero seam** gradient painted over the pricing line under the CTAs; the
  content wrapper now carries `z-10`.

Two things a build would still catch that a read cannot: exact framer-motion 11
type compatibility, and anything version-specific in the Next internal import
described below.

## What was built from scratch vs. extended

The brief described extending an existing hero and `CardStack`. No such project
was found on this machine, so **both were written new**:

- `components/landing/card-stack.tsx` — fanned app screens with a
  collapse-then-deal entrance
- `components/landing/hero.tsx` — orchestrated reveal + scroll parallax

If the real Kelo repo exists elsewhere, delete those two files, copy everything
else over, and point `app/page.tsx` at the existing hero. Nothing else depends
on their internals.

The `CardStack` screens are **rendered markup, not screenshots** — no image
assets required. Swap `PhoneFrame`'s children for real `<Image>` captures when
they exist.

## Brand colour

Kelo blue lives in exactly one place: the `--kelo-*` custom properties at the
top of `app/globals.css`, as space-separated RGB channels.

```css
--kelo-600: 37 96 235;   /* the primary */
--kelo-brand: var(--kelo-600);
```

`tailwind.config.ts` maps these into a `kelo` colour scale (so `bg-kelo-600/40`
alpha modifiers work), and `SpaceBackground` reads `--kelo-brand` off `:root` at
runtime. **The current values are a placeholder blue.** Replace those ten lines
with the real palette and the whole site — particles included — follows.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Landing page, all ten sections |
| `/get-started` | Funnel step 1 — role selection |
| `/get-started/signup` | Funnel step 2 — name + email |
| `/get-started/confirmation` | Funnel step 3 — thank you |

Every landing-page CTA routes to `/get-started`.

The funnel has **no backend**. `handleSubmit` in
`app/get-started/signup/page.tsx` logs to the console, waits 900ms, and
navigates. Replace the delay with the real API call; nothing else on the page
needs to change.

## Motion system

All shared variants and the reduced-motion hook live in `lib/motion.ts`. Use
them rather than hand-rolling per component.

```tsx
const { safe, dist, time } = useMotion();
// safe  — false when the user prefers reduced motion
// dist  — scales travel distance: 0 when reduced, 60% on small screens
// time  — scales duration: near-instant when reduced, 85% on small screens
```

Every variant factory (`fadeUp`, `cardIn`, `scaleIn`, `drawLine`, `drawPath`,
`slideIn`, `staggerContainer`) takes `safe` and collapses to a plain opacity
fade when it is false. `SpaceBackground` checks `useReducedMotion()` itself and
paints one static frame instead of looping.

Scroll reveals use `whileInView` with the shared `viewportOnce` config
(`{ once: true, amount: 0.25 }`).

### Don't "simplify" `useMotionSafe`

It looks like it could just be `return !useReducedMotion()`. It can't.

framer-motion reads `matchMedia` synchronously in the browser but returns
`false` during SSR. Several components gate **real DOM nodes** on this value
(the confirmation pulse ring, the feature-card spotlight, the CTA aurora
blobs), so for a visitor with `prefers-reduced-motion: reduce` the server would
send one tree and hydration would produce another — a structural mismatch that
makes React 18 discard the server HTML and re-render the whole root.

So the hook reports `true` on the server and on the first client render, then
flips after mount. The correction lands within a frame, well before the hero's
0.45s entrance delay elapses.

## Two things to know before you edit

**The header is deliberately outside the page-transition wrapper.**
`PageTransition` animates `transform`, and a transformed ancestor turns
`position: fixed` into position-relative-to-that-ancestor — which would break
the sticky nav. `app/layout.tsx` renders `<SiteHeader />` as a sibling of
`<PageTransition>`, and `SiteHeader` switches between the landing nav and the
funnel header by pathname. Do not move it inside.

**`components/page-transition.tsx` imports a Next internal.** `FrozenRouter`
pulls `LayoutRouterContext` from
`next/dist/shared/lib/app-router-context.shared-runtime`. This is the standard
workaround for App Router exit animations — without it the outgoing page
re-renders as the incoming one before it can animate out. The path is stable
across Next 13.4–14.x. **If a Next upgrade moves it, the build will fail here.**
The fallback is one deletion: remove `FrozenRouter` and the `exit` prop, and you
lose exit animations only.

## Structure

```
app/
  layout.tsx                        root shell, header, page transitions
  page.tsx                          landing page composition
  globals.css                       brand tokens + base styles
  get-started/
    layout.tsx                      funnel shell + step indicator
    page.tsx                        role selection
    signup/page.tsx                 form (useSearchParams, Suspense-wrapped)
    confirmation/page.tsx           checkmark draw-in + next steps
components/
  page-transition.tsx               AnimatePresence + FrozenRouter
  site-header.tsx                   route-aware header switch
  landing/                          the ten landing sections
  ui/
    button.tsx                      magnetic CTA + animated arrow
    space-background.tsx            ambient particle canvas
lib/
  motion.ts                         variants, useMotion, useMotionSafe
  utils.ts                          cn()
```

## Placeholder content to replace

- **Testimonials** (`components/landing/testimonials.tsx`) — three placeholder
  quotes. Keep the `{ quote, name, role, org }` shape and no layout changes are
  needed.
- **Problem-section statistics** (`components/landing/problem.tsx`) — "1 in 4",
  "6+", "0" are illustrative, not sourced. Replace or remove before launch.
- **Logo** — `LogoMark` in `nav.tsx` and the duplicate in `site-header.tsx` are
  placeholder marks.
- **App Store / Google Play badges** on the confirmation page are inert
  placeholders, not the official artwork.
- **Footer links** mostly point at `/#`.
