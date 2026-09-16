/**
 * Grid placement hooks.
 *
 * A handful of elements get their `grid-area` / `justify-self` from a
 * per-element selector rather than from a shared class, so these identifiers
 * are load bearing: drop one and its grid child falls back to auto placement.
 */
export const GRID = {
  /** justify-self: start — the enquiries link in the top bar. */
  navLeft: 'nav-bar-left',
  /** justify-self: end — the menu button (applied as a class, not an id). */
  navRight: 'nav-bar-right',
  /** grid-area: span 1 / span 6 — the large celebration photograph. */
  albumLeft: 'celebration-media',
  /** grid-area: 1 / 8 / 2 / 12 — the copy column beside it. */
  albumRight: 'celebration-copy',
  /** justify-self: center — the middle footer column. */
  footerCenter: 'footer-col-center',
} as const
