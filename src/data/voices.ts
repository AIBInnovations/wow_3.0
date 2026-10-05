export type Voice = {
  /**
   * The day this frame is from, shown between the arrows. The band names the
   * days of a celebration rather than couples: its photographs show the work
   * and no client's face, so there is no couple to sign them.
   */
  title: string
  /** The line beneath the arch: that day's own statement on the Celebrations page. */
  line: string
  /** The arch, in its tall crop. */
  portrait: string
  /** The full-height photograph beside it. */
  right: string
}

/**
 * The celebrations band: three days of a celebration, each an arch, a
 * photograph and a line. Titles and lines are the Celebrations page's own, so
 * the two never say different things.
 */
export const voices: Voice[] = [
  {
    title: 'The Wedding',
    line: 'The mandap, the procession, the vows.',
    portrait: '/wow/lib-fireworks-couple-800.jpg',
    right: '/wow/lib-fireworks-aisle.jpg',
  },
  {
    title: 'Haldi & Phoolon ki Holi',
    line: 'Turmeric, marigold and the morning that begins it.',
    portrait: '/wow/lib-floral-arch-lawn-800.jpg',
    right: '/wow/lib-tented-lounge.jpg',
  },
  {
    title: 'Mehendi & Sangeet',
    line: 'Henna, rehearsal and an evening that runs long.',
    portrait: '/wow/lib-feather-stage.jpg',
    right: '/wow/lib-stage-crowd.jpg',
  },
]
