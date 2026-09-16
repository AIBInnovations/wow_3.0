export type Media = { src: string; alt: string }

/** Hero marquee track — one panel; the component renders it twice for a seamless loop. */
export const heroMarquee: Media[] = [
  {
    "src": "/images/hero-0.jpg",
    "alt": "WOW Weddings & Events celebration"
  },
  {
    "src": "/images/hero-1.jpg",
    "alt": "WOW Weddings & Events celebration"
  },
  {
    "src": "/images/hero-2.jpg",
    "alt": "WOW Weddings & Events celebration"
  },
  {
    "src": "/images/hero-3.jpg",
    "alt": "WOW Weddings & Events celebration"
  },
  {
    "src": "/images/hero-4.jpg",
    "alt": "WOW Weddings & Events celebration"
  },
  {
    "src": "/images/hero-5.jpg",
    "alt": "WOW Weddings & Events celebration"
  },
  {
    "src": "/images/hero-6.jpg",
    "alt": "WOW Weddings & Events celebration"
  }
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
