import localFont from 'next/font/local'

/**
 * The brand faces, self-hosted through next/font so every device draws the
 * same letters.
 *
 * Playfair Display sets the headings, the wordmark and the italic capital that
 * opens a heading (see Initial). EB Garamond sets statements, body copy and
 * labels. Both are SIL Open Font Licence; the notices sit beside the files.
 *
 * next/font serves the files from /_next/static/media under content-hashed
 * names, preloads them in the document head, and declares a metric-matched
 * fallback, so a slow connection shows a fallback of the same width and the
 * swap does not move the layout. Each file is a latin subset; every character
 * the site sets (including é, &, ’, — and ·) is present in all four.
 *
 * The families reach the stylesheets as CSS variables on <html>; fonts.css
 * maps them onto the site's family tokens.
 */
export const playfair = localFont({
  src: [
    { path: './playfairdisplay-latin.woff2', weight: '400 900', style: 'normal' },
    { path: './playfairdisplay-italic-latin.woff2', weight: '400 900', style: 'italic' },
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
