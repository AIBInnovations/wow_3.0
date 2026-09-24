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
  { src: '/images/hero-couple-pyro.jpg', alt: 'The couple at the mandap between pyro fountains, fireworks above' },
  { src: '/images/hero-couple-arches.jpg', alt: 'The couple walking hand in hand beneath palace arches' },
  { src: '/images/hero-palace-day.jpg', alt: 'A lakeside palace and its gardens by day' },
  { src: '/images/hero-couple-aisle.jpg', alt: 'The couple in a chandelier-lit floral aisle' },
  { src: '/images/hero-palace-night.jpg', alt: 'A palace illuminated at night, guests arriving below' },
  { src: '/images/hero-couple-haldi.jpg', alt: 'The couple laughing through the haldi, petals in the air' },
]

/**
 * Three scroll-gallery columns; className preserves the original column modifiers.
 *
 * Candid frames only — the people and the moments, not the rooms: the entrance,
 * the dance floor, the mehendi, the applause. Nothing here is a photograph of an
 * empty set.
 *
 * Every one is cropped to the same 2:3 portrait, so the columns read as a
 * single run of frames rather than a mix of shapes. The grain and the wash over
 * them are in styles/home.css.
 */
export type GalleryImage = Media & {
  /** Shown in black and white, as the hero band alternates its own frames. */
  mono?: boolean
}

export const galleryColumns: { className: string; images: GalleryImage[] }[] = [
  {
    "className": "_3-col-wrapper col-1-s hide-mob",
    "images": [
      {
        "src": "/images/wow-gal-singer.jpg",
        "alt": "A singer on a darkened stage"
      },
      {
        "src": "/images/wow-gal-glass-mandap.jpg",
        "alt": "The couple beneath a glasshouse mandap"
      },
      {
        "src": "/images/wow-gal-palace-dance.jpg",
        "alt": "A dancer turning in the palace hall"
      },
      {
        "src": "/images/wow-gal-palace-entrance.jpg",
        "alt": "The bride at the palace entrance"
      },
      {
        "src": "/images/wow-gal-mehendi-detail.jpg",
        "alt": "Mehendi and embroidery, hand in hand"
      }
    ]
  },
  {
    "className": "_3-col-wrapper col-s-2",
    "images": [
      {
        "src": "/images/wow-gal-feather-stage.jpg",
        "alt": "A white stage dressed with feathered plumes"
      },
      {
        "src": "/images/wow-gal-couple-gate.jpg",
        "alt": "The couple at a lantern-lit gate"
      },
      {
        "src": "/images/wow-gal-arms-raised.jpg",
        "alt": "Arms up as the fireworks break"
      },
      {
        "src": "/images/wow-gal-applause.jpg",
        "alt": "Applause from the front row"
      },
      {
        "src": "/images/wow-gal-floral-corridor.jpg",
        "alt": "A corridor of florals and hanging lanterns"
      },
      {
        "src": "/images/wow-gal-haldi-joy.jpg",
        "alt": "Haldi, and the laughter through it"
      }
    ]
  },
  {
    "className": "_3-col-wrapper col-1-s off-set",
    "images": [
      {
        "src": "/images/wow-gal-couple-portrait.jpg",
        "alt": "The couple, close, in black and white"
      },
      {
        "src": "/images/wow-gal-celebration.jpg",
        "alt": "Napkins in the air as the celebration breaks"
      },
      {
        "src": "/images/wow-gal-family-portrait.jpg",
        "alt": "The groom seated, family either side"
      },
      {
        "src": "/images/wow-gal-group-portrait.jpg",
        "alt": "The party gathered under the arches"
      },
      {
        "src": "/images/wow-gal-mother-daughter.jpg",
        "alt": "A mother and daughter, cheek to cheek"
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
