export type Media = { src: string; alt: string }

/**
 * Every photograph on the home page is one of the thirteen the client chose
 * for it, in public/home/. The destinations band keeps its own photographs
 * of the places it names.
 */

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
  { src: '/home/fireworks-mandap.jpg', alt: 'Fireworks and cold pyro over a floral mandap as the couple meet beneath it' },
  { src: '/home/glasshouse-entry.jpg', alt: 'The couple entering beneath a glass arch through falling bubbles and low fog' },
  { src: '/home/singer-mono.jpg', alt: 'A singer in a velvet jacket performing on a smoke-lit stage' },
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

/** Closing enquiry band: the 2:1 card image and the full-bleed ground behind it. */
export const closing = {
  "card": "/home/stage-red.jpg",
  "bg": "/home/fireworks-groom.jpg"
}

/** "Four days, one celebration" — one wide frame. */
export const celebrationImages = {
  "bg": "/home/mandap-night.jpg"
}
