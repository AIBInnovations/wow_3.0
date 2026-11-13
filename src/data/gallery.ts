/**
 * Gallery page: the plane.
 *
 * A short set, chosen by eye: the rooms, the stages, the installations, the
 * lighting and the details, and three wide moments in which the couple are
 * small within the scene. No guest appears and no client is identifiable —
 * the client's own condition for the site, and the reason the set is kept to a
 * couple of dozen frames rather than every photograph from every event.
 *
 * The shots are listed by category. `ar` is the real width / height of the
 * file: the grid crops every photograph to one 4:5 cell, and the lightbox uses
 * the ratio to size its frame before the file arrives, so nothing shifts on
 * load. Files are /gallery/<id>-s.webp (650px on the long side) for the grid and
 * /gallery/<id>-l.webp (1400px) for the lightbox.
 *
 * The page shows every photograph on one plane: no filter tabs. Each shot keeps
 * its category, which orders the plane (see ALL_SHOTS) and captions the
 * lightbox.
 *
 * The bar's strings: the photographer's credit, the page's title and the
 * hint.
 */

export type GalleryCategory = { slug: string; label: string }
export type GalleryShot = { id: string; ar: number; cat: string }

export const galleryCopy = {
  /** Two lines: who took the photographs. */
  credit: ['Photos by', 'Badal Raja Company'],
  /** The page's title, in the bar. */
  title: 'Gallery',
  /** How to move through the plane. */
  hint: 'Drag to explore',
}

export const smallSrc = (id: string) => `/gallery/${id}-s.webp`
export const largeSrc = (id: string) => `/gallery/${id}-l.webp`

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  { slug: 'decor', label: 'Décor' },
  { slug: 'stage', label: 'Stage & Entertainment' },
  { slug: 'moments', label: 'Moments' },
  { slug: 'details', label: 'Details' },
  { slug: 'venues', label: 'Venues' },
]

export const GALLERY_SHOTS: GalleryShot[] = [
  { id: 'rs-10847848047', ar: 1.499, cat: 'decor' },
  { id: 'rs-10847851700', ar: 1.501, cat: 'decor' },
  { id: 'rs-10470734759', ar: 1.501, cat: 'decor' },
  { id: 'av-11819638839', ar: 0.666, cat: 'decor' },
  { id: 'rs-10847846401', ar: 1.501, cat: 'decor' },
  { id: 'av-11819641472', ar: 1.501, cat: 'decor' },
  { id: 'rs-10847849650', ar: 0.666, cat: 'decor' },
  { id: 'rs-10470734086', ar: 1.501, cat: 'decor' },
  { id: 'rs-10847849719', ar: 0.667, cat: 'decor' },
  { id: 'av-11819638546', ar: 0.666, cat: 'decor' },
  { id: 'rs-10847849681', ar: 0.667, cat: 'decor' },
  { id: 'av-11819640789', ar: 1.499, cat: 'stage' },
  { id: 'rs-10847849436', ar: 1.501, cat: 'stage' },
  { id: 'rs-10847848496', ar: 1.501, cat: 'stage' },
  { id: 'rs-10847849704', ar: 1.499, cat: 'stage' },
  { id: 'av-11819642261', ar: 1.618, cat: 'moments' },
  { id: 'rs-10474359682', ar: 0.666, cat: 'moments' },
  { id: 'av-11819638715', ar: 1.501, cat: 'moments' },
  { id: 'rs-10847849393', ar: 0.667, cat: 'details' },
  { id: 'rs-10847854224', ar: 1.499, cat: 'details' },
  { id: 'av-11819638663', ar: 1.501, cat: 'details' },
  { id: 'av-11819638656', ar: 1.501, cat: 'details' },
  { id: 'rs-10847855708', ar: 1.501, cat: 'venues' },
  { id: 'rs-10847849754', ar: 1.501, cat: 'venues' },
]

/**
 * The plane's order: every category spread evenly through the list, so no run
 * of neighbouring tiles comes from one room — the same principle the home
 * gallery follows.
 *
 * Each shot is placed at the middle of its share of the list — the k-th of a
 * category's n shots at (k + 0.5) / n — and the list is sorted by that place.
 * A plain round-robin ran out of the small categories first and left the large
 * one (Décor, 11 of 24) as a solid block at the end.
 */
export const ALL_SHOTS: GalleryShot[] = GALLERY_CATEGORIES.flatMap((c, ci) => {
  const own = GALLERY_SHOTS.filter((s) => s.cat === c.slug)
  return own.map((shot, k) => ({ shot, at: (k + 0.5) / own.length, ci }))
})
  .sort((x, y) => x.at - y.at || x.ci - y.ci)
  .map((e) => e.shot)

export const categoryLabel = (slug: string) =>
  GALLERY_CATEGORIES.find((c) => c.slug === slug)?.label ?? ''
