export type Media = { src: string; alt: string }

/**
 * Hero marquee track — one panel, rendered twice for a seamless loop.
 *
 * Three frames: the fireworks over the mandap, the couple's entrance through
 * bubbles and low fog, and the singer on stage. The run repeats twice: tiles
 * are 61.4vh wide and the loop slides a whole panel across, so a panel has to
 * be wider than the viewport or the band runs out at the right edge on wide
 * screens.
 */
const heroFrames: Media[] = [
  { src: '/images/hero-fireworks-mandap.jpg', alt: 'Fireworks and cold pyro over a floral mandap as the couple meet beneath it' },
  { src: '/images/hero-couple-bubbles.jpg', alt: 'The couple entering beneath a glass arch through falling bubbles and low fog' },
  { src: '/images/hero-singer-stage.jpg', alt: 'A singer in a sequinned jacket performing on a smoke-lit stage' },
]

export const heroMarquee: Media[] = [...heroFrames, ...heroFrames]

/**
 * Three scroll-gallery columns; className preserves the original column modifiers.
 *
 * The work only: the stages, the arches, the light and the details. No guest is
 * in any of these, and where a couple appears they are small within the scene —
 * the client's condition for every photograph on the site.
 *
 * Three to a column, and none that appears anywhere else on the home page.
 * The columns crop every frame to the same portrait, so they read as a single
 * run rather than a mix of shapes. The grain and the wash over them are in
 * styles/home.css.
 */
export type GalleryImage = Media & {
  /** Shown in black and white. */
  mono?: boolean
}

export const galleryColumns: { className: string; images: GalleryImage[] }[] = [
  {
    className: '_3-col-wrapper col-1-s hide-mob',
    images: [
      { src: '/wow/lib-red-archway.jpg', alt: 'A carved archway washed in red light' },
      { src: '/wow/lib-mehendi-detail.jpg', alt: 'Mehendi and embroidery, hand in hand' },
      { src: '/wow/lib-palace-day.jpg', alt: 'The palace above its gardens' },
    ],
  },
  {
    className: '_3-col-wrapper col-s-2',
    images: [
      { src: '/wow/lib-arch-night.jpg', alt: 'A floral arch lit at night' },
      { src: '/wow/lib-floral-corridor.jpg', alt: 'A corridor of florals and hanging lanterns' },
      { src: '/wow/lib-entry-fog.jpg', alt: 'An entrance through low fog beneath a chandelier' },
    ],
  },
  {
    className: '_3-col-wrapper col-1-s off-set',
    images: [
      { src: '/wow/lib-blue-arch.jpg', alt: 'A floral arch at the entrance to the celebration' },
      { src: '/wow/lib-red-ballroom.jpg', alt: 'A ballroom lit red, candles on every table' },
      { src: '/wow/lib-night-garden.jpg', alt: 'A garden lit violet at night' },
    ],
  },
]

/** Full-bleed ground behind the "five disciplines" statement. */
export const atelierBackground = '/wow/lib-night-mandap.jpg'

/** Closing enquiry band: the 2:1 card image and the full-bleed ground behind it. */
export const closing = {
  "card": "/images/cta-card.jpg",
  "bg": "/images/cta-bg.jpg"
}

/** "Four days, one celebration" — one wide frame. */
export const celebrationImages = {
  "bg": "/wow/lib-rose-arch.jpg"
}
