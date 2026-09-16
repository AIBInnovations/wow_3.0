# WOW Weddings & Events — wow 3.0

The Nicole Nero layout and motion system, rebuilt in React and rebranded to WOW
Weddings & Events.

Two separate things are going on, and it helps to keep them apart:

- **Structure and motion** come from the `index.html` + `styles.css` export one
  folder up — same markup, same stylesheet, rebuilt as components with the
  Webflow runtime replaced by real code.
- **Colour, photography and copy** come from the WOW site in `../../wow` —
  its brand palette, its photographs, its own words.

Typography is deliberately untouched: the display and mono faces are the
export's.

```bash
npm install
npm run dev      # http://localhost:3300
npm run build
```

Port 3300 is deliberate, so this never collides with the dev server on 3000.

## How the design stays identical

`src/styles/webflow.css` is the exported stylesheet, copied byte for byte. It is
the single source of the design — the `:root` tokens, the fluid `clamp()` type
scale, every component class, and the `move-text` marquee keyframes. Nothing was
re-authored from a screenshot, and the React tree reproduces the original class
names so those rules apply unchanged.

`src/app/globals.css` imports it, then `src/app/palette.css`, then adds only what
the export genuinely lacks. Every addition is commented with its reason; see
**Gaps in the export** below.

## Colour

`src/app/palette.css` repoints the export's colour tokens at WOW's brand values,
taken from the main site's own `src/styles/brand.scss`. It is an override on
`:root`, not an edit to `webflow.css` — so the exported stylesheet stays a
faithful copy and the whole rebrand is one file.

| Token | Export | WOW |
| --- | --- | --- |
| `--swatch--dark` | `#171616` | `#2b0d0f` wine-deep |
| `--swatch--light` | `white` | `#fbf4e9` cream |
| `--swatch--brand` | `#ec8383` pink | `#c9a24d` gold |
| `--theme--text` | `white` | `#fbf4e9` cream |

A handful of colours are written as literals in the export and never looked at a
token — the menu row ramp, the photo scrims, the progress bar, the button
hairline. Those are repointed individually in the same file.

## Type

`src/styles/fonts.css` carries the brand faces and the family tokens they fill.
They are taken from the brand deck in `public/`, and are the same files the main
site ships.

| Token | Face | Used for |
| --- | --- | --- |
| `--font--primary-family` | Playfair Display | headings, buttons, wordmark |
| `--font--body` | EB Garamond | statement copy, labels, links |
| `--font--inherit` | EB Garamond | small labels |
| `--font--initial` | Italianno | the opening letter of a heading |

Every size, weight, line-height and letter-spacing in `site.css` is untouched —
only the families changed.

The deck opens each statement with an ornate script capital and sets the rest of
the line in the display serif. `components/Initial.tsx` reproduces that: it
wraps the first character rather than using `::first-letter`, because the
headings are split into lines and words at runtime and `::first-letter` no
longer addresses the right character once a splitter has rewrapped the text. The
initial is always rendered as a capital — a lowercase script letter beside
upright text reads as a stray swash. Statement paragraphs are italic, as every
statement block in the deck is.

The deck shows no sans anywhere, so none is loaded. The brand stack names Lexend
Zetta for labels, but nothing in the deck sets a label in it.

All faces are SIL Open Font Licence, self-hosted under `public/fonts` with their
notices beside them. Each is a latin subset covering basic Latin — verify with
fontTools before swapping a file, because a subset missing the ASCII range fails
silently, one letter at a time.

## Structure

```
src/
├── app/            layout, page, globals.css
├── components/     one per section, plus svg/ (generated from the export)
├── data/           content extracted from the export, typed
├── hooks/          split-text reveals, reduced-motion, font-readiness
├── lib/gsap.ts     plugin registration + the two custom eases
├── providers/      Lenis smooth scroll + scroll-lock context
└── styles/         the untouched Webflow stylesheet
```

Content lives in `src/data/` rather than in JSX — `content.ts` holds every
string, and `media.ts`, `stories.ts`, `voices.ts`, `nav.ts`, `footer.ts` hold the
rest. The copy is WOW's own, lifted from `../../wow` rather than rewritten.

`src/data/gridNodes.ts` deserves a note. Webflow emits grid placement as opaque
per-element `#w-node-…` selectors rather than named classes. Five of them carry
real `grid-area` / `justify-self` rules, so they are load bearing: drop them and
the album section and top bar collapse to auto placement. They are named there so
the markup reads as intent.

## Motion

Every effect is a port of the reference site's own animation code — its GSAP
modules and its Webflow interaction definitions — with the timings, trigger
ranges, distances and eases carried over exactly. Each was verified in a real
browser by sampling values at points along its range, not by eye.

| Section | Behaviour |
| --- | --- |
| Hero, on load | 0s: photos fade in (0.5s) and the first panel wipes upward out of a bottom clip, 0.07s apart · 1s: headline rises word by word · 2s: paragraph rises line by line · 2.5s: kicker · 2.6s: button |
| Hero band | drifts one panel width every 60s, forever |
| Gallery | scroll-driven only, `top bottom → bottom top`: outer columns `-190vw → 70vw` linear, middle `0 → -170vw` sine; fixed progress bar shown only in range; frame fades out as it ends |
| Atelier photo | `-20em → +11em` across the viewport, smoothing 50 |
| Atelier statement | characters light up one at a time (`steps(1)`), `top 90% → bottom 80%` |
| Circle buttons | ring turns every 30s; **no disc at rest** — on hover the disc blooms to 1.1 (back-out) and the arrow swells to 1.5 and turns light |
| Statements band | headline runs on CSS; slides change **instantly** and the incoming slide makes its own entrance; first photo wipes in from the right at mid-viewport; quote mark drifts `-20% → +10%` |
| Destinations | active item follows the viewport centre in both directions; hovering the active title turns it brand-coloured and drains the photo to 50% greyscale; section fades out past its end |
| Four Days heading, footer wordmark | every character flips up 180° on X; replays when scrolled back to |
| Closing heading | lines rise; replays when scrolled back to |
| Closing background | `-27% → 0`, smoothing 81 |
| Menu | rows drop from −100vh over 1.5s, 0.05s apart; MENU again reverses it; the page is **not** scroll-locked; hover shows a text panel instantly (tablet up), which creeps left over 60s on desktop |

Two deliberate differences from the reference, both legibility rather than motion:

- **Destinations scrim.** The reference's photographs are dark ceremony frames,
  where its 0.7 opacity is enough. These are bright daylight exteriors, so the
  stylesheet's own overlay is rendered on the active item.
- **Reduced motion.** Everything above is skipped under
  `prefers-reduced-motion`, leaving a fully readable static page.

Lenis runs with `lerp: 0.1` and `wheelMultiplier: 0.7`, and GSAP drives it from
its own ticker so ScrollTrigger and the smoothed position share one clock.

## Gaps in the export, and what was done about them

The export is a saved page, not the running site. Three things it references were
never in the file, so they had to be rebuilt:

1. **The hero was invisible.** The stylesheet ships `.hw, .dim { opacity: 0 }` and
   nothing ever raises them — on the live site a remote script faded them in. The
   opening reveal is rebuilt in `HeroMarquee`.
2. **Menu row hover did nothing.** `.nav_drop_over-text_wrap` is parked at opacity
   0 with a transition defined but no rule that ever changes it; Webflow's IX2
   interaction engine did that, and IX2 is not in the export. Restored as a CSS
   rule in `globals.css`, which also makes it respond to keyboard focus.
3. **The circular CTA's arrow is invisible.** The export colours the arrow
   `--swatch--brand` and fills the disc behind it with the same
   `--swatch--brand`. Its real colour comes from the remote Slater stylesheet
   (`assets.slater.app/slater/6255/11857.css`), which is not included. `globals.css`
   sets it to `--swatch--dark`; delete that block if you ever obtain the original.

Worth knowing: `home-hero_bg_front_wrap` and `page_loader` have CSS but appear
**zero times** in the exported HTML. They are leftovers from other pages, so
there is no layered hero parallax and no page loader here to reproduce.

## Where the rebrand needed judgement

Three places where WOW has no direct equivalent to what the layout expects:

1. **No testimonials.** The layout carries five client quotes; WOW's site has
   none anywhere. Rather than invent them, `data/voices.ts` runs the studio's own
   statements through that band, attributed to the discipline each belongs to.
   Replace `quote`/`name` with real client quotes when there are some.
2. **Destinations needed a scrim.** The sticky section assumes moody ceremony
   photography. The city photographs are bright daylight exteriors, and the
   titles were unreadable over them, so the stylesheet's own
   `.sticky-gallery_bg_overlay` is rendered for the active item — active only,
   because six stacked overlays would black the section out.
3. **The atelier statement was shortened.** It is set at `16cqw` across a `13ch`
   measure; the full line from /disciplines ran well past the fold.

## Verified

Production build compiles clean and typechecks. Checked in Chrome at 1440×900,
1024×768, 768×1024 and 390×844: no horizontal overflow at any width, no console
or page errors, every image resolves. Menu opens, staggers, locks scroll, closes
on ESC and restores scroll. Slider advances and wraps. Reduced-motion renders the
whole page statically.

## Assets

45 photographs are cast from the WOW site and copied into `public/images/` — the
face-filtered `/gallery` set for the hero band and the scroll grid, the
`/celebrations` ceremony frames for the full-bleed sections, and `/city_images`
for the destinations. Only what the page uses was copied.

**The destination photographs are openly-licensed Wikimedia images under CC BY
and CC BY-SA.** Both licences require the credit to travel with the site, so
`public/images/CITY-CREDITS.md` is carried over and the footer links to it. Do
not remove that link without replacing the photographs.

Several `/gallery` and `/celebrations` frames carry a visible **BRC** watermark
(Badal Raja Company, the photographer). They are used here exactly as they exist
in the main site; clear the usage before publishing.

Two things the export supplied that WOW does not:

- **The wordmark.** The export had a drawn monogram. WOW's identity is
  typographic, so `Wordmark.tsx` sets the name in the display face with the
  middle word outlined. The monogram SVG was deleted.
- **The circular CTA lockups.** The export baked its two rings into vector
  outlines, so their wording could not change. `svg/CircleText.tsx` draws the
  ring live from a string instead, which is what lets WOW's words sit in it.

Everything is data-driven: changing the brand again means editing `src/data/`,
`src/app/palette.css` and `public/images/`. Nothing is hardcoded in components.
