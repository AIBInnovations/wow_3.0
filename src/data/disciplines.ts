/** Service copy: Weddings_Preview Deck (1).pdf, pp. 5–19 and 22;
 * design philosophy: Wow events Website Content.pdf, Design Ideology.
 * Short card explanations are faithful condensations, not verbatim quotations.
 * Existing five-service navigation and supplied photographs are retained.
 */

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

const photo = (file: string, w: number, h: number, alt: string): Photo => ({
  src: `/wow/${file}.jpg`,
  src800: `/wow/${file}-800.jpg`,
  w,
  h,
  alt,
})

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
          "Timelines and logistics",
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
      index: photo('decor-index', 710, 1066, 'The couple beneath a glasshouse mandap'),
      open: photo('decor-open', 1600, 1066, 'The couple entering their ceremony between fireworks'),
      wide: photo('decor-wide', 1600, 1067, 'A floral pavilion beneath palms'),
      narrow: photo('decor-narrow', 1066, 1599, 'Florals and lanterns lining the ceremony aisle'),
    },
  },
  {
    slug: 'guest-experience',
    number: '02',
    name: 'Guest Experience',
    caption: "Hospitality & guest experience",
    statement: ['Hospitality,', 'redefined'],
    intro: "Because how your guests feel matters just as much as how the wedding looks.",
    feature: {
      "title": "Thoughtful. Personal. Invisible.",
      "text": "Thoughtfully curated keepsakes and gifting experiences designed to elevate every guest touchpoint."
    },
    lists: [
      {
        "title": "Arrivals that feel cinematic",
        "items": [
          "Airport hospitality & logistics",
          "Curated luxury transport",
          "Porter & baggage coordination",
          "Traditional welcome rituals"
        ]
      },
      {
        "title": "After check-in",
        "items": [
          "Concierge assistance",
          "Personalised communication",
          "Room coordination",
          "Real-time guest support"
        ]
      }
    ],
    cards: [
      {
        "title": "Arrival assistance",
        "text": "Dedicated arrival assistance, floral welcomes and escorts."
      },
      {
        "title": "Guest movement",
        "text": "Guest movement management and hotel arrival experiences."
      },
      {
        "title": "Welcome experiences",
        "text": "Live instrumental performances, curated entertainment moments and thematic arrival experiences."
      },
      {
        "title": "Hospitality desks",
        "text": "Signature hospitality desks and personalised arrival branding."
      },
      {
        "title": "During the stay",
        "text": "Post check-in experiences, concierge assistance and experience updates."
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
      index: photo('guest-experience-index', 1600, 1066, 'Family and guests celebrating beneath a floral arch'),
      open: photo('guest-experience-open', 1600, 1066, 'Drummers welcoming wedding guests'),
      wide: photo('guest-experience-wide', 1600, 1067, 'Family gathered on the wedding lawn'),
      narrow: photo('guest-experience-narrow', 710, 1066, 'A mother and daughter sharing a quiet moment'),
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
      index: photo('invites-index', 1600, 1066, 'Wedding gifts arranged in presentation trays'),
      open: photo('invites-open', 1600, 1189, 'A ceremonial tray presented to the family'),
      wide: photo('invites-wide', 1600, 1066, 'Family sharing gifts and wedding rituals'),
      narrow: photo('invites-narrow', 1000, 1500, 'Personalised monogram details at the celebration'),
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
      index: photo('food-beverage-index', 1067, 1600, 'A floral wedding table set for guests'),
      open: photo('food-beverage-open', 1066, 1600, 'A sculpted ice bar at the evening celebration'),
      wide: photo('food-beverage-wide', 1600, 1066, 'Wedding dining beneath a floral canopy'),
      narrow: photo('food-beverage-narrow', 1500, 1001, 'The couple beside their celebration cake'),
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
      index: photo('entertainment-index', 1600, 1066, 'The couple and guests dancing at the sangeet'),
      open: photo('entertainment-open', 1067, 1600, 'Live performers on the sangeet stage'),
      wide: photo('entertainment-wide', 1600, 1067, 'The wedding party dancing in the palace hall'),
      narrow: photo('entertainment-narrow', 853, 1280, 'A singer performing on stage'),
    },
  },
]
