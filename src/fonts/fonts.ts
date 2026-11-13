import localFont from 'next/font/local'

/**
 * The brand faces, self-hosted through next/font so every device draws the
 * same letters.
 *
 * Playfair Display sets the headings and the wordmark. EB Garamond sets
 * statements, body copy and labels. Imperial Script, a formal engraver's
 * script, sets only the capital that opens a heading (see Initial) and the
 * paragraph drop cap. All three are SIL Open Font Licence; the notices sit
 * beside the files.
 *
 * next/font serves the files from /_next/static/media under content-hashed
 * names, preloads them in the document head, and declares a metric-matched
 * fallback, so a slow connection shows a fallback of the same width and the
 * swap does not move the layout. Each file is a latin subset; every character
 * the site sets (including é, &, ’, — and ·) is present in the Playfair and
 * Garamond files, and all 26 capitals in the Imperial Script one.
 *
 * The families reach the stylesheets as CSS variables on <html>; fonts.css
 * maps them onto the site's family tokens.
 */
export const playfair = localFont({
  src: [
    // Roman only: no text on the site is set in Playfair's italic.
    { path: './playfairdisplay-latin.woff2', weight: '400 900', style: 'normal' },
  ],
  variable: '--font-playfair',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
})

export const garamond = localFont({
  src: [
    { path: './ebgaramond-latin.woff2', weight: '400', style: 'normal' },
    { path: './ebgaramond-italic-latin.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-garamond',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
})

// The script has a single upright style; its slant is drawn in. `block` keeps
// the capital invisible for the moment before the file arrives rather than
// showing each device's own cursive in its place.
export const imperial = localFont({
  src: [{ path: './imperialscript-latin.woff2', weight: '400', style: 'normal' }],
  variable: '--font-imperial',
  display: 'block',
  fallback: ['Georgia', 'serif'],
})
