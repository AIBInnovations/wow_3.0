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
 * The film behind "Immersive celebrations", after the hero: twenty-odd shots
 * of venues, décor, stages and fireworks cut from the show reel — no close
 * faces — into a 19-second silent loop, 4.5 MB.
 */
export const ambience = {
  video: '/videos/ambience.mp4',
  poster: '/videos/ambience-poster.jpg',
}

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
