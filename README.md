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

| Behaviour | Where | Notes |
| --- | --- | --- |
| Smooth scroll | `providers/SmoothScrollProvider` | Lenis, `lerp: 0.1`, `wheelMultiplier: 0.7` — the export's own values |
| Hero intro | `HeroMarquee` | Fades `.dim` and `.hw` up from 0; see below |
| Hero image band | `HeroMarquee` | Two identical panels shifted one full width, looped |
| Scroll gallery | `GalleryScroll` | 200vh section, sticky frame, columns at different rates + progress bar |
| Line reveals | `hooks/useSplitText` | SplitType lines, inner span rises from `translateY(110%)` |
| Character scrub | `TallImage` | Characters brighten on scrub across the section |
| Circular CTA | `svg/CircleText` | Type set live on a `textPath`, so the wording is data |
| Destinations | `StickyStories` | ScrollTrigger toggles `.active`; the stylesheet does the fade/scale |
| Statements marquee | stylesheet | Pure CSS, `move-text` 20s linear |
| Statements slider | `Voices` | Manual, fade, wraps, arrow-key navigable |

GSAP drives Lenis through a single ticker so ScrollTrigger and the smoothed scroll
position share one clock. The export ships that wiring commented out, which leaves
ScrollTrigger reading stale positions; it is enabled here.

Every animated component checks `prefers-reduced-motion` and degrades to a static,
fully readable page. Every GSAP setup runs inside a `gsap.context()` that is
reverted on unmount, and SplitType splits are reverted with it.

Split-text waits on `document.fonts.ready` (`hooks/useFontsReady`). Splitting
before the display face arrives measures the fallback and bakes in the wrong line
breaks, which the split boxes then keep.

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
