/**
 * Gallery page: the plane.
 *
 * The photographs used on the site's own pages (home, About, Celebrations
 * and Disciplines), and the studio's portfolio as the client sent it (the
 * "WOW Images" Drive folder: ids drive-*, its duplicates left out and its
 * photographs already on the pages kept once), on one plane, each once: a
 * photograph used in more than one place appears once, from its largest copy. The stills behind the films
 * and the reel covers are included; nothing appears here that is not on a page.
 * Left out: one reel cover with Instagram's caption sticker burned into it,
 * and the six destination photographs (Udaipur, Jaipur, Goa, Indore,
 * Bangalore, Gulmarg) by outside photographers, which are not the studio's
 * work and are used on the pages under CC BY / CC BY-SA licences whose credit
 * (public/images/CITY-CREDITS.md, linked from the footer) must travel with
 * them; this page has no footer.
 *
 * Shots with an rs-/av- id are page photographs that already had gallery
 * files under their photo-library id.
 *
 * The shots are listed by category. `ar` is the real width / height of the
 * file: the grid crops every photograph to one 4:5 cell, and the lightbox uses
 * the ratio to size its frame before the file arrives, so nothing shifts on
 * load. Files are /gallery/<id>-s.webp (650px on the long side) for the grid and
 * /gallery/<id>-l.webp (1400px, or the source's own size where it is smaller)
 * for the lightbox. The site-page photographs' ids are their source paths.
 *
 * The page shows every photograph on one plane: no filter tabs. Each shot keeps
 * its category, which orders the plane (see ALL_SHOTS) and captions the
 * lightbox.
 *
 * The bar's strings: the page's title and the hint.
 */

export type GalleryCategory = { slug: string; label: string }
export type GalleryShot = { id: string; ar: number; cat: string }

export const galleryCopy = {
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
  { id: 'av-11819641472', ar: 1.501, cat: 'decor' },
  { id: 'rs-10847849650', ar: 0.666, cat: 'decor' },
  { id: 'rs-10470734086', ar: 1.501, cat: 'decor' },
  { id: 'rs-10847849719', ar: 0.667, cat: 'decor' },
  { id: 'av-11819640789', ar: 1.499, cat: 'stage' },
  { id: 'rs-10847849436', ar: 1.501, cat: 'stage' },
  { id: 'rs-10847849704', ar: 1.499, cat: 'stage' },
  { id: 'av-11819638715', ar: 1.501, cat: 'moments' },
  { id: 'rs-10847849393', ar: 0.667, cat: 'details' },
  { id: 'rs-10847849754', ar: 1.501, cat: 'venues' },
  // The rest of the pages' photographs, by category.
  { id: 'home-feather-welcome-800', ar: 1.501, cat: 'decor' },
  { id: 'home-glasshouse-entry', ar: 1.501, cat: 'decor' },
  { id: 'images-wow-aisle-dusk', ar: 1.5, cat: 'decor' },
  { id: 'images-wow-arch-night', ar: 0.667, cat: 'decor' },
  { id: 'images-wow-red-ballroom', ar: 0.667, cat: 'decor' },
  { id: 'images-wow-tented-lounge', ar: 1.5, cat: 'decor' },
  { id: 'reels-dn98clyamha', ar: 0.563, cat: 'decor' },
  { id: 'reels-dw-kql2gllj', ar: 0.563, cat: 'decor' },
  { id: 'reels-dxlembjaoqx', ar: 0.563, cat: 'decor' },
  { id: 'videos-ambience-poster', ar: 1.778, cat: 'decor' },
  { id: 'videos-highlight-poster', ar: 1.778, cat: 'decor' },
  { id: 'videos-show-reel-poster', ar: 1.778, cat: 'decor' },
  { id: 'wow-lib-banquet-florals-800', ar: 0.72, cat: 'decor' },
  { id: 'wow-lib-bar-night', ar: 1.501, cat: 'decor' },
  { id: 'wow-lib-blue-arch', ar: 0.667, cat: 'decor' },
  { id: 'wow-lib-counter-day', ar: 1.501, cat: 'decor' },
  { id: 'wow-lib-floral-corridor', ar: 0.667, cat: 'decor' },
  { id: 'wow-lib-night-mandap-800', ar: 1.501, cat: 'decor' },
  { id: 'wow-lib-palm-walk', ar: 1.5, cat: 'decor' },
  { id: 'wow-lib-pastel-canopy', ar: 0.666, cat: 'decor' },
  { id: 'home-band-trellis', ar: 1.5, cat: 'stage' },
  { id: 'home-singer-mono', ar: 0.667, cat: 'stage' },
  { id: 'home-stage-duet-800', ar: 1.501, cat: 'stage' },
  { id: 'home-stage-red', ar: 1.5, cat: 'stage' },
  { id: 'wow-lib-palace-dance', ar: 0.667, cat: 'stage' },
  { id: 'wow-lib-palace-lit', ar: 1.5, cat: 'stage' },
  { id: 'wow-lib-stage-magenta', ar: 1.778, cat: 'stage' },
  { id: 'home-fireworks-groom', ar: 1.501, cat: 'moments' },
  { id: 'home-fireworks-mandap', ar: 0.667, cat: 'moments' },
  { id: 'home-mandap-night', ar: 1.501, cat: 'moments' },
  { id: 'images-wow-fireworks-couple', ar: 0.667, cat: 'moments' },
  { id: 'videos-rajvi-karan-poster', ar: 1.778, cat: 'moments' },
  { id: 'wow-lib-drummers', ar: 1.501, cat: 'moments' },
  { id: 'wow-lib-fireworks-aisle', ar: 1.501, cat: 'moments' },
  { id: 'wow-lib-stage-crowd', ar: 1.778, cat: 'moments' },
  { id: 'reels-dxj23uuaspo', ar: 0.563, cat: 'details' },
  { id: 'reels-dxrlgynglrb', ar: 0.563, cat: 'details' },
  { id: 'wow-lib-gift-boxes', ar: 1.501, cat: 'details' },
  { id: 'wow-lib-glass-tags', ar: 0.667, cat: 'details' },
  { id: 'wow-lib-marigold-pots', ar: 0.666, cat: 'details' },
  { id: 'celebrations-11819642308', ar: 1.778, cat: 'venues' },
  { id: 'images-city-emirates-palace', ar: 1.501, cat: 'venues' },
  { id: 'images-wow-palace-facade', ar: 1.5, cat: 'venues' },
  { id: 'videos-sangeet-poster', ar: 1.778, cat: 'venues' },
  // The studio's portfolio, from the client's "WOW Images" folder (Drive), November 2026.
  { id: 'drive-mehendi-0123', ar: 0.666, cat: 'decor' },
  { id: 'drive-welcome-dinner-0322', ar: 1.501, cat: 'decor' },
  { id: 'drive-2026-01-14-00-00-13', ar: 1.5, cat: 'decor' },
  { id: 'drive-mehendi-0134', ar: 0.666, cat: 'decor' },
  { id: 'drive-roka-0048', ar: 1.501, cat: 'decor' },
  { id: 'drive-dsc00391', ar: 1.497, cat: 'decor' },
  { id: 'drive-ishh0347', ar: 0.667, cat: 'decor' },
  { id: 'drive-mehendi-0059', ar: 0.667, cat: 'decor' },
  { id: 'drive-mehendi-0028', ar: 1.501, cat: 'decor' },
  { id: 'drive-ishh6465', ar: 0.667, cat: 'decor' },
  { id: 'drive-ishh6468', ar: 1.499, cat: 'decor' },
  { id: 'drive-114a6966', ar: 0.667, cat: 'decor' },
  { id: 'drive-sufi-night-0059', ar: 1.501, cat: 'decor' },
  { id: 'drive-ishh0360', ar: 0.667, cat: 'decor' },
  { id: 'drive-mehendi-0085', ar: 0.667, cat: 'decor' },
  { id: 'drive-ishh6433', ar: 1.499, cat: 'decor' },
  { id: 'drive-mehendi-0047', ar: 1.78, cat: 'decor' },
  { id: 'drive-114a6977', ar: 0.667, cat: 'decor' },
  { id: 'drive-carnival-0036', ar: 0.666, cat: 'decor' },
  { id: 'drive-dsc00387', ar: 0.668, cat: 'decor' },
  { id: 'drive-roka-0081', ar: 1.501, cat: 'decor' },
  { id: 'drive-sufi-night-0890', ar: 1.501, cat: 'decor' },
  { id: 'drive-dsc00389', ar: 0.668, cat: 'decor' },
  { id: 'drive-2026-01-14-00-00-04', ar: 0.667, cat: 'decor' },
  { id: 'drive-carnival-0040', ar: 0.666, cat: 'decor' },
  { id: 'drive-2026-01-13-08-59-58', ar: 0.667, cat: 'decor' },
  { id: 'drive-roka-0066', ar: 0.666, cat: 'decor' },
  { id: 'drive-welcome-dinner-0259', ar: 0.666, cat: 'decor' },
  { id: 'drive-ishh0355', ar: 0.667, cat: 'decor' },
  { id: 'drive-roka-0099', ar: 1.501, cat: 'decor' },
  { id: 'drive-2026-01-14-00-00-03', ar: 0.667, cat: 'decor' },
  { id: 'drive-roka-0116', ar: 1.501, cat: 'decor' },
  { id: 'drive-carnival-0136', ar: 0.666, cat: 'decor' },
  { id: 'drive-roka-4555', ar: 1.501, cat: 'stage' },
  { id: 'drive-ishh6445', ar: 0.667, cat: 'stage' },
  { id: 'drive-roka-3892', ar: 1.78, cat: 'stage' },
  { id: 'drive-2026-01-13-12-25-54', ar: 1.5, cat: 'stage' },
  { id: 'drive-ishh6700', ar: 1.499, cat: 'stage' },
  { id: 'drive-sufi-night-0005', ar: 1.78, cat: 'stage' },
  { id: 'drive-roka-4205', ar: 1.501, cat: 'stage' },
  { id: 'drive-sufi-night-1460', ar: 0.666, cat: 'stage' },
  { id: 'drive-roka-5752', ar: 1.501, cat: 'stage' },
  { id: 'drive-roka-3923', ar: 1.501, cat: 'stage' },
  { id: 'drive-2026-01-14-11-54-05', ar: 1.5, cat: 'stage' },
  { id: 'drive-ishh6443', ar: 1.499, cat: 'stage' },
  { id: 'drive-roka-3975', ar: 1.54, cat: 'moments' },
  { id: 'drive-sufi-night-1604', ar: 1.501, cat: 'moments' },
  { id: 'drive-roka-2290', ar: 0.667, cat: 'moments' },
  { id: 'drive-roka-2265', ar: 1.501, cat: 'moments' },
  { id: 'drive-roka-4340', ar: 0.667, cat: 'moments' },
  { id: 'drive-roka-2134', ar: 1.501, cat: 'moments' },
  { id: 'drive-roka-3427', ar: 0.666, cat: 'moments' },
  { id: 'drive-roka-3912', ar: 0.667, cat: 'moments' },
  { id: 'drive-roka-3169', ar: 0.666, cat: 'moments' },
  { id: 'drive-roka-2148', ar: 1.5, cat: 'moments' },
  { id: 'drive-2026-01-14-08-35-37', ar: 0.667, cat: 'moments' },
  { id: 'drive-roka-3633', ar: 0.666, cat: 'moments' },
  { id: 'drive-mehendi-0066', ar: 0.666, cat: 'details' },
  { id: 'drive-mehendi-0080', ar: 0.666, cat: 'details' },
  { id: 'drive-mehendi-0120', ar: 0.666, cat: 'details' },
  { id: 'drive-2026-01-12-23-40-02', ar: 0.667, cat: 'details' },
  { id: 'drive-2026-01-13-09-11-40', ar: 0.667, cat: 'details' },
  { id: 'drive-2026-01-12-23-40-50', ar: 0.667, cat: 'details' },
  { id: 'drive-ishh0372', ar: 1.499, cat: 'details' },
  { id: 'drive-114a5838', ar: 1.5, cat: 'details' },
  { id: 'drive-2026-01-12-23-40-52', ar: 0.667, cat: 'details' },
  { id: 'drive-2026-01-12-23-40-17', ar: 1.5, cat: 'details' },
  { id: 'drive-114a6979', ar: 1.5, cat: 'details' },
  { id: 'drive-2026-01-12-23-40-16', ar: 1.5, cat: 'venues' },
  { id: 'drive-2026-01-14-06-53-06', ar: 1.5, cat: 'venues' },
  { id: 'drive-sufi-night-0160', ar: 1.78, cat: 'venues' },
  { id: 'drive-roka-0014', ar: 1.78, cat: 'venues' },
  { id: 'drive-2026-01-14-06-53-28', ar: 1.5, cat: 'venues' },
  { id: 'drive-2026-01-14-06-53-19', ar: 0.667, cat: 'venues' },
  { id: 'drive-whatsapp-image-2026-09-14-at-6-45-06-pm', ar: 1.499, cat: 'venues' },
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
