export type Media = { src: string; alt: string }

/**
 * Hero marquee track — one panel, rendered twice for a seamless loop.
 *
 * Photos alternate colour and black-and-white. The count must stay even: the loop
 * slides the second panel into the first one's place, so an odd count would put
 * two frames of the same kind side by side at the seam.
 *
 * Order matters for that alternation: even positions render in colour, odd ones
 * in black-and-white, so fireworks and lit palaces sit on even positions where
 * their colour carries, and portraits on odd ones where monochrome suits them.
 * All eight are free of studio watermarks — several frames in the source
 * library carry one in a corner, which the tall crop would put on show.
 */
export const heroMarquee: Media[] = [
  { src: '/images/hero-fireworks-mandap.jpg', alt: 'Fireworks and cold pyro over a floral mandap as the couple meet beneath it' },
  { src: '/images/hero-couple-sparklers.jpg', alt: 'The bride marks the groom’s forehead under a sky of sparklers' },
  { src: '/images/hero-couple-pyro.jpg', alt: 'The couple at the mandap between pyro fountains, fireworks above' },
  { src: '/images/hero-couple-arches.jpg', alt: 'The couple walking hand in hand beneath palace arches' },
  { src: '/images/hero-palace-day.jpg', alt: 'A lakeside palace and its gardens by day' },
  { src: '/images/hero-couple-aisle.jpg', alt: 'The couple in a chandelier-lit floral aisle' },
  { src: '/images/hero-palace-night.jpg', alt: 'A palace illuminated at night, guests arriving below' },
  { src: '/images/hero-couple-haldi.jpg', alt: 'The couple laughing through the haldi, petals in the air' },
]

/** Three scroll-gallery columns; className preserves the original column modifiers. */
export const galleryColumns: { className: string; images: Media[] }[] = [
  {
    "className": "_3-col-wrapper col-1-s hide-mob",
    "images": [
      {
        "src": "/images/grid-0-0.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-0-1.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-0-2.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-0-3.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-0-4.jpg",
        "alt": ""
      }
    ]
  },
  {
    "className": "_3-col-wrapper col-s-2",
    "images": [
      {
        "src": "/images/grid-1-0.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-1-1.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-1-2.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-1-3.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-1-4.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-1-5.jpg",
        "alt": ""
      }
    ]
  },
  {
    "className": "_3-col-wrapper col-1-s off-set",
    "images": [
      {
        "src": "/images/grid-2-0.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-2-1.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-2-2.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-2-3.jpg",
        "alt": ""
      },
      {
        "src": "/images/grid-2-4.jpg",
        "alt": ""
      }
    ]
  }
]

/** Full-bleed ground behind the "five disciplines" statement. */
export const atelierBackground = '/images/atelier-bg.jpg'

/** Closing enquiry band: the 2:1 card image and the full-bleed ground behind it. */
export const closing = {
  "card": "/images/cta-card.jpg",
  "bg": "/images/cta-bg.jpg"
}

/** "Four days, one celebration" — one wide frame and two tilted cards. */
export const celebrationImages = {
  "bg": "/images/celebration-bg.jpg",
  "a": "/images/celebration-a.jpg",
  "b": "/images/celebration-b.jpg"
}
