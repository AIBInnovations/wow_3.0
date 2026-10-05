/**
 * The photograph library the Disciplines and Celebrations pages draw on.
 *
 * Every frame here is of the work itself — décor, stages, counters, venues and
 * artists — or of a couple small within a wide scene. None shows a guest, and
 * none shows a client close enough to be recognised: that is the client's own
 * condition for the site. A photograph that does not meet it does not go in.
 *
 * Files are /wow/lib-<name>.jpg, with an 800px-wide /wow/lib-<name>-800.jpg.
 * Each entry is [width, height, width of the 800 file].
 */
const SIZES = {
  'pastel-canopy': [1066, 1600, 800],
  'night-mandap': [1600, 1066, 800],
  'palace-lit': [1600, 1067, 800],
  'stage-magenta': [1600, 900, 800],
  'counter-day': [1600, 1066, 800],
  'bar-night': [1600, 1066, 800],
  'marigold-pots': [1066, 1600, 800],
  'welcome-procession': [1400, 933, 800],
  'mehendi-lounge': [1400, 934, 800],
  'ice-florals': [934, 1400, 800],
  'stage-dancers': [1400, 934, 800],
  'stage-ensemble': [1400, 933, 800],
  'stage-mono': [1400, 933, 800],
  'rose-arch': [1400, 933, 800],
  'varmala-pyro': [1400, 865, 800],
  'mandala-pavilion': [1400, 933, 800],
  'entry-fog': [933, 1400, 800],
  'carnival-entrance': [1400, 933, 800],
  'floral-arch-lawn': [933, 1400, 800],
  'night-lounge': [1400, 933, 800],
  'red-canopy': [1400, 933, 800],
  'palace-garden': [1400, 933, 800],
  'red-archway': [933, 1400, 800],
  'red-wall': [934, 1400, 800],
  'ice-sculpture': [1400, 934, 800],
  'city-night': [1400, 933, 800],
  'night-garden': [933, 1400, 800],
  'tented-lounge': [1600, 1067, 800],
  'palm-walk': [1600, 1067, 800],
  'fireworks-aisle': [1600, 1066, 800],
  'fireworks-couple': [1067, 1600, 800],
  'floral-corridor': [1066, 1599, 800],
  'palace-dance': [1066, 1599, 800],
  'aisle-dusk': [1600, 1067, 800],
  'arch-night': [1067, 1600, 800],
  'blue-arch': [1066, 1599, 800],
  'feather-stage': [710, 1066, 710],
  'stage-crowd': [1600, 900, 800],
  'red-ballroom': [1067, 1600, 800],
  'palace-day': [1066, 1600, 800],
  'singer': [853, 1280, 800],
  'mehendi-detail': [1066, 1599, 800],
  'drummers': [1600, 1066, 800],
  'gift-boxes': [1600, 1066, 800],
  'glass-tags': [1000, 1500, 800],
  'dessert-tent': [1122, 1402, 800],
  'banquet-florals': [768, 1067, 768],
} as const

export type LibraryName = keyof typeof SIZES

export const lib = (name: LibraryName) => {
  const [w, h, w800] = SIZES[name]
  return { src: `/wow/lib-${name}.jpg`, src800: `/wow/lib-${name}-800.jpg`, w, h, w800 }
}
