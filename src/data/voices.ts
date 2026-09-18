export type Voice = {
  /**
   * Whose celebration this is. Shown on its own between the arrows — the band
   * carries the studio's photographs and the couple's name, and no words: the
   * studio's statements are its own, and are never signed by a couple who did
   * not say them. Null until a name is to hand.
   */
  credit: string | null
  /** The arch, in its tall crop. */
  portrait: string
  /** The full-height photograph beside it. */
  right: string
}

/**
 * The celebrations band: three celebrations, each an arch and a photograph, the
 * couple's name beneath.
 *
 * The photographs are the studio's own, supplied for these three weddings.
 */
export const voices: Voice[] = [
  {
    credit: 'Anvita & Vishal',
    portrait: '/images/wow-anvita-vishal-800.jpg',
    right: '/images/wow-fireworks-aisle.jpg',
  },
  {
    credit: 'Ronak & Sanya',
    portrait: '/images/wow-ronak-sanya-800.jpg',
    right: '/images/wow-haldi-stage.jpg',
  },
  {
    credit: null,
    portrait: '/images/wow-green-couple-800.jpg',
    right: '/images/wow-sangeet-floor.jpg',
  },
]
