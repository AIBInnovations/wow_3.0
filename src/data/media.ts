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

/**
 * Three scroll-gallery columns; className preserves the original column modifiers.
 *
 * The studio's own frames, chosen to sit together: palace architecture, cream
 * and white florals, and candlelit night rooms, so the three columns read as one
 * body of work rather than a contact sheet.
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
        "alt": "A singer on a darkened stage",
        "mono": true
      },
      {
        "src": "/images/wow-gal-white-florals.jpg",
        "alt": "A table beneath a chandelier of white blooms"
      },
      {
        "src": "/images/wow-gal-floral-corridor.jpg",
        "alt": "A corridor of florals and hanging lanterns",
        "mono": true
      },
      {
        "src": "/images/wow-gal-palace-entrance.jpg",
        "alt": "The bride at the palace entrance"
      },
      {
        "src": "/images/wow-gal-mehendi-detail.jpg",
        "alt": "Mehendi and embroidery, hand in hand",
        "mono": true
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
        "alt": "The couple at a lantern-lit gate",
        "mono": true
      },
      {
        "src": "/images/wow-gal-floral-arch.jpg",
        "alt": "An arch banked with blue and white flowers"
      },
      {
        "src": "/images/wow-gal-palace-dance.jpg",
        "alt": "A dancer turning in the palace hall",
        "mono": true
      },
      {
        "src": "/images/wow-gal-chandelier-tables.jpg",
        "alt": "A chandelier of white blooms over a dressed table"
      },
      {
        "src": "/images/wow-gal-haldi-joy.jpg",
        "alt": "Haldi, and the laughter through it",
        "mono": true
      }
    ]
  },
  {
    "className": "_3-col-wrapper col-1-s off-set",
    "images": [
      {
        "src": "/images/wow-gal-couple-portrait.jpg",
        "alt": "The couple, close, in black and white",
        "mono": true
      },
      {
        "src": "/images/wow-gal-celebration.jpg",
        "alt": "Napkins in the air as the celebration breaks"
      },
      {
        "src": "/images/wow-gal-family-portrait.jpg",
        "alt": "The groom seated, family either side",
        "mono": true
      },
      {
        "src": "/images/wow-gal-aisle-dusk.jpg",
        "alt": "An aisle of chandeliers to the water at dusk"
      },
      {
        "src": "/images/wow-gal-mother-daughter.jpg",
        "alt": "A mother and daughter, cheek to cheek",
        "mono": true
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
