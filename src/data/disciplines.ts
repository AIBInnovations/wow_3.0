/** Service copy: Weddings_Preview Deck (1).pdf, pp. 5–19 and 22;
 * design philosophy: Wow events Website Content.pdf, Design Ideology.
 * Short card explanations are faithful condensations, not verbatim quotations.
 * Existing five-service navigation and supplied photographs are retained.
 */

import { lib, type LibraryName } from './library'

export type Photo = { src: string; src800: string; w: number; h: number; alt: string }
export type Card = { title: string; text: string }
export type List = { title: string; items: string[] }

export type Discipline = {
  /** The anchor the footer links to: /disciplines#<slug>. */
  slug: string
  number: string
  name: string
  caption: string
  /** Three lines, broken as the studio breaks them. */
  statement: string[]
  intro: string
  feature: { title: string; text: string }
  lists: List[]
  cards: Card[]
  /** The closing line, in the studio's breaks. */
  closing: string[]
  /** Discipline color drawn from the preview deck. */
  background: string
  photos: { index: Photo; open: Photo; wide: Photo; narrow: Photo }
}

export const disciplinesHero = {
  label: 'Five disciplines, composed as one',
  title: ['Five Disciplines', 'Never In Isolation'],
  statement:
    'Each celebration is conceived as a living composition, where architecture, florals, '
    + 'light, texture and music are brought together with deliberate harmony. '
    + 'Nothing is incidental. Everything is intentional.',
}

export const disciplinesIndex = {
  label: 'The index',
  lead: 'Decor, guest experience, invitations, cuisine and entertainment — conceived together, never in isolation.',
}

/** A photograph from the library, with the words that describe it. */
const photo = (name: LibraryName, alt: string): Photo => {
  const { src, src800, w, h } = lib(name)
  return { src, src800, w, h, alt }
}

export const disciplines: Discipline[] = [
  {
    slug: 'decor',
    number: '01',
    name: 'Decor',
    caption: "Décor & spatial styling",
    statement: ['Luxury is', 'a thousand', 'small things'],
    intro: "Environments layered with texture, mood, scale, and visual precision.",
    feature: {
      "title": "Considered elegance",
      "text": "Each celebration is conceived as a living composition, where architecture, florals, light, texture and music are brought together with deliberate harmony."
    },
    lists: [
      {
        "title": "Spatial styling",
        "items": [
          "Texture and mood",
          "Scale and visual precision",
          "Architecture, florals and light"
        ]
      },
      {
        "title": "Execution framework",
        "items": [
          "Vendor alignment",
          "Timelines and production",
          "Production and guest management"
        ]
      }
    ],
    cards: [
      {
        "title": "Architecture",
        "text": "A living composition shaped through space and atmosphere."
      },
      {
        "title": "Florals",
        "text": "Florals brought together with light and texture in deliberate harmony."
      },
      {
        "title": "Light",
        "text": "Light that contributes to the emotional landscape of the celebration."
      },
      {
        "title": "Texture",
        "text": "Environments layered with texture, mood and visual precision."
      },
      {
        "title": "Atmosphere",
        "text": "Rather than spectacle, we pursue atmosphere. Rather than excess, we pursue refinement."
      },
      {
        "title": "Intention",
        "text": "Nothing is incidental. Everything is intentional."
      }
    ],
    closing: [
      "Nothing is incidental.",
      "Everything is",
      "intentional."
    ],
    background: '#262d20',
    photos: {
      index: photo('pastel-canopy', 'A pastel canopy over a floral welcome display'),
      open: photo('fireworks-aisle', 'The couple at the end of their aisle as the fireworks rise'),
      wide: photo('palm-walk', 'A floral walkway beneath palms'),
      narrow: photo('floral-corridor', 'Florals and lanterns lining the ceremony aisle'),
    },
  },
  {
    slug: 'guest-experience',
    number: '02',
    name: 'Guest Experience',
    caption: "Welcome & guest experience",
    statement: ['The welcome,', 'composed'],
    intro: "Because how your guests feel matters just as much as how the wedding looks.",
    feature: {
      "title": "Thoughtful. Personal. Invisible.",
      "text": "Thoughtfully curated keepsakes and gifting experiences designed to elevate every guest touchpoint."
    },
    lists: [
      {
        "title": "Arrivals that feel cinematic",
        "items": [
          "Traditional welcome rituals",
          "Floral welcomes",
          "Live instrumental performances",
          "Thematic arrival experiences"
        ]
      },
      {
        "title": "Keepsakes",
        "items": [
          "Curated keepsakes",
          "Gifting experiences",
          "Personalised arrival branding"
        ]
      }
    ],
    cards: [
      {
        "title": "Welcome rituals",
        "text": "Traditional welcome rituals and floral welcomes, set at the threshold."
      },
      {
        "title": "Welcome experiences",
        "text": "Live instrumental performances, curated entertainment moments and thematic arrival experiences."
      },
      {
        "title": "Arrival branding",
        "text": "Personalised arrival branding that carries the celebration's own identity."
      },
      {
        "title": "Hampers & gifting",
        "text": "Thoughtfully curated keepsakes and gifting experiences designed to elevate every guest touchpoint."
      }
    ],
    closing: [
      "Thoughtful.",
      "Personal.",
      "Invisible."
    ],
    background: '#10264a',
    photos: {
      index: photo('drummers', 'A band of drummers lined up to welcome the celebration'),
      open: photo('welcome-procession', 'A welcome procession waiting along the palace drive'),
      wide: photo('red-canopy', 'Low seating beneath a red canopy on the lawn'),
      narrow: photo('blue-arch', 'A floral arch at the entrance to the celebration'),
    },
  },
  {
    slug: 'invites',
    number: '03',
    name: 'Invites & Gifting',
    caption: "Wedding branding & stationery",
    statement: ["Every celebration", "carries its own", "visual language"],
    intro: "Timeless monograms, invitation suites, and visual identities designed with sophistication and restraint.",
    feature: {
      "title": "Wedding branding",
      "text": "The wedding begins long before the first event. Every celebration carries its own visual language."
    },
    lists: [
      {
        "title": "Crafted across",
        "items": [
          "Bespoke monograms",
          "Invitation suites",
          "Save The Date concepts",
          "Wedding collateral"
        ]
      },
      {
        "title": "Guest touchpoints",
        "items": [
          "Countdown creatives",
          "Guest communication systems",
          "Technology-led experiences",
          "Hampers & gifting"
        ]
      }
    ],
    cards: [
      {
        "title": "Monograms",
        "text": "Bespoke monograms within the celebration’s own visual language."
      },
      {
        "title": "Invitation suites",
        "text": "Invitation suites designed with sophistication and restraint."
      },
      {
        "title": "Save the date",
        "text": "Save The Date concepts and countdown creatives."
      },
      {
        "title": "Wedding collateral",
        "text": "Wedding collateral that carries the celebration’s visual identity."
      },
      {
        "title": "Guest communication",
        "text": "Guest communication systems and technology-led experiences."
      },
      {
        "title": "Gifting",
        "text": "Thoughtfully curated keepsakes and gifting experiences."
      }
    ],
    closing: [
      "The wedding begins",
      "long before",
      "the first event."
    ],
    background: '#49262d',
    photos: {
      index: photo('gift-boxes', 'Wedding gifts arranged in presentation trays'),
      open: photo('carnival-entrance', 'A hand-lettered welcome board at the carnival entrance'),
      wide: photo('mandala-pavilion', 'A pavilion of hanging strands beside a patterned screen'),
      narrow: photo('glass-tags', 'Personalised monogram details at the celebration'),
    },
  },
  {
    slug: 'food-beverage',
    number: '04',
    name: 'Food & Beverage',
    caption: "Culinary experiences",
    statement: ['Food', 'is never just', 'food'],
    intro: "Dining concepts curated not only for taste, but for memory, theatre, and conversation.",
    feature: {
      "title": "Food is never just food",
      "text": "It’s memory, mood, and conversation."
    },
    lists: [
      {
        "title": "F&B curation",
        "items": [
          "Culinary concept planning",
          "Menu engineering",
          "Buffet styling"
        ]
      },
      {
        "title": "The dining experience",
        "items": [
          "Service experience design",
          "Luxury dining enhancements",
          "Bespoke presentation concepts"
        ]
      }
    ],
    cards: [
      {
        "title": "Culinary concepts",
        "text": "Culinary concept planning for memory, theatre and conversation."
      },
      {
        "title": "Menus",
        "text": "Menu engineering as part of the F&B curation."
      },
      {
        "title": "Buffet styling",
        "text": "Buffet styling within the celebration’s visual language."
      },
      {
        "title": "Service",
        "text": "Service experience design as part of the dining experience."
      },
      {
        "title": "Dining enhancements",
        "text": "Luxury dining enhancements and luxury bar experiences."
      },
      {
        "title": "Presentation",
        "text": "Bespoke presentation concepts."
      }
    ],
    closing: [
      "Memory,",
      "mood, and",
      "conversation."
    ],
    background: '#842522',
    photos: {
      index: photo('dessert-tent', 'A dessert counter beneath a tent of lights, the sea behind it'),
      open: photo('counter-day', 'A live food counter beneath a pink and orange canopy'),
      wide: photo('bar-night', 'A lit bar counter on the lawn at night'),
      narrow: photo('banquet-florals', 'A banquet table under a floral canopy, the counters behind it'),
    },
  },
  {
    slug: 'entertainment',
    number: '05',
    name: 'Entertainment',
    caption: "Entertainment direction",
    statement: ['Entertainment', 'with', 'presence'],
    intro: "From celebrated performers to immersive cultural showcases, every act is curated to match the scale and spirit of the celebration.",
    feature: {
      "title": "Entertainment with presence",
      "text": "Artists, performances, entries, and immersive showcases designed to complement the emotional rhythm of the celebration."
    },
    lists: [
      {
        "title": "Artists & performances",
        "items": [
          "Bollywood & international artists",
          "DJs & live performers",
          "Folk & cultural acts"
        ]
      },
      {
        "title": "Signature moments",
        "items": [
          "Celebrity appearances",
          "Baraat entertainment concepts",
          "Grand bridal & groom entries"
        ]
      }
    ],
    cards: [
      {
        "title": "Artists",
        "text": "Bollywood and international artists."
      },
      {
        "title": "Live performances",
        "text": "DJs and live performers."
      },
      {
        "title": "Cultural showcases",
        "text": "Folk and cultural acts curated to match the celebration’s spirit."
      },
      {
        "title": "Appearances",
        "text": "Celebrity appearances."
      },
      {
        "title": "Baraat",
        "text": "Baraat entertainment concepts."
      },
      {
        "title": "Signature enhancements",
        "text": "Grand bridal and groom entries, fireworks and special effects."
      }
    ],
    closing: [
      "Entertainment",
      "with",
      "presence."
    ],
    background: '#a44818',
    photos: {
      index: photo('stage-magenta', 'A singer and band on a magenta-lit stage'),
      open: photo('stage-dancers', 'Two dancers on stage under crossing beams of light'),
      wide: photo('stage-ensemble', 'An ensemble performing on the sangeet stage'),
      narrow: photo('singer', 'A singer performing on stage'),
    },
  },
]
