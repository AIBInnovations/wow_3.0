/**
 * Webflow emits grid placement as per-element `#w-node-…` / `.w-node-…`
 * selectors rather than as named classes, so these opaque identifiers are load
 * bearing: drop them and the grid children collapse to auto placement. They are
 * named here so the markup reads as intent rather than as noise.
 */
export const GRID = {
  /** justify-self: start — left-hand CONTACT link in the top bar. */
  navLeft: 'w-node-_26f128ae-4a2e-cd3a-0483-0f2f02d35a4a-02d35a48',
  /** justify-self: end — the MENU button (applied as a class, not an id). */
  navRight: 'w-node-_26f128ae-4a2e-cd3a-0483-0f2f02d35a4f-02d35a48',
  /** grid-area: span 1 / span 6 — the large album photograph. */
  albumLeft: 'w-node-_8148aaf4-e667-254b-2d1f-345b48602e0c-48602e05',
  /** grid-area: 1 / 8 / 2 / 12 — the copy column beside it. */
  albumRight: 'w-node-_8148aaf4-e667-254b-2d1f-345b48602e0f-48602e05',
  /** justify-self: center — the middle footer column. */
  footerCenter: 'w-node-d178ff86-cec9-a102-a53a-36f47123925a-71239245',
} as const
