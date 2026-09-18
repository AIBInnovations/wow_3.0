/**
 * Every string and photograph the Celebrations page shows.
 *
 * The page is the celebration in the order it happens — the first morning, the
 * evening of song, the ceremony, and the night that follows — so the chapters
 * are the days rather than the services. The copy is the studio's own, carried
 * over from the main site's /celebrations content (`../../../wow/src/components/
 * pages/CelebrationsPage/content.ts`) and trimmed, never rewritten. Nothing here
 * claims a venue, a count, a client or a price the studio has not stated.
 *
 * Photographs are the main site's own casting for these slots, at the gallery's
 * 1600px rendition with its 800px companion. True sizes are recorded so every
 * frame takes its aspect ratio before the file arrives.
 */

export type Photo = {
  src: string
  src800: string
  w: number
  h: number
  w800: number
}

export type CelebrationList = { title: string; items: string[] }
export type CelebrationCard = { title: string; text: string }

export type CelebrationChapter = {
  slug: 'haldi' | 'sangeet' | 'wedding' | 'beyond'
  numeral: string
  name: string
  /** the short line that names the day on the rail */
  discover: string
  /** the three-line statement that opens the chapter */
  lines: [string, string, string]
  /** the column of prose */
  cols: { pretitle: string; paragraphs: string[] }
  /** the line that sits between the two photographs */
  middle: string
  /** the centred line that closes the chapter */
  close: string
  lists?: CelebrationList[]
  cards?: CelebrationCard[]
  photos: { rail: Photo; open: Photo; cols: Photo; wide: Photo; narrow: Photo }
}

const p = (id: number, w: number, h: number, w800: number): Photo => ({
  src: `/celebrations/${id}.jpg`,
  src800: `/celebrations/${id}-800.jpg`,
  w,
  h,
  w800,
})

export const INTRO = {
  caption: 'Four days, composed as one celebration',
  title: ['Four Days', 'One Celebration'] as const,
  text:
    'Haldi at first light, mehendi and sangeet through the evening, the ceremony itself, and the '
    + 'night that follows — conceived together rather than as four separate days. The rituals are '
    + 'kept exactly as the family keeps them. Everything around them is composed.',
  photo: p(11819642308, 1600, 900, 800),
}

export const CHAPTERS: CelebrationChapter[] = [
  {
    slug: 'haldi',
    numeral: '01',
    name: 'Haldi & Phoolon ki Holi',
    discover: 'The morning of colour',
    lines: ['Turmeric, marigold', 'and the morning', 'that begins it'],
    cols: {
      pretitle: '(The first morning)',
      paragraphs: [
        'The first morning is informal by design. Low seating in the shade, families within reach '
        + 'of each other, and nothing staged between them.',
        'Haldi is a ritual of hands, so the composition stays close: what is dressed is the ground '
        + 'the family sits on, not a set they perform in front of.',
      ],
    },
    middle: 'Petals by the basket, and a canopy that carries them.',
    close:
      'By the time the colour is thrown, everything the morning needs is already in place — and '
      + 'nothing that would interrupt it.',
    lists: [
      {
        title: 'Composed',
        items: [
          'Shaded seating and low lounges',
          'Marigold canopy and aisle',
          'Petal baskets and ritual trays',
          'Sound for dhol and live percussion',
          'Morning refreshments',
        ],
      },
      {
        title: 'Kept as it is',
        items: [
          'The order of the ritual',
          'Who performs it, and when',
          'The family’s own priest',
          'The music the family brings',
        ],
      },
    ],
    photos: {
      rail: p(10847851075, 1600, 1067, 800),
      open: p(11819641049, 1600, 1066, 800),
      cols: p(11819641550, 1067, 1600, 533),
      wide: p(10847851197, 1600, 1067, 800),
      narrow: p(10847851230, 1066, 1600, 533),
    },
  },
  {
    slug: 'sangeet',
    numeral: '02',
    name: 'Mehendi & Sangeet',
    discover: 'The evening of song',
    lines: ['Henna, rehearsal', 'and an evening', 'that runs long'],
    cols: {
      pretitle: '(The long evening)',
      paragraphs: [
        'Mehendi runs for hours and asks for shade, seating and patience — a room people can drift '
        + 'through rather than a schedule they are moved along.',
        'Sangeet is the opposite discipline: a stage, a running order, and rehearsal time held for '
        + 'the families who are performing on it.',
      ],
    },
    middle: 'Two moods in one evening, lit as two rooms rather than one.',
    close:
      'Choreography is rehearsed, technical cues are called, and the families who have practised '
      + 'for weeks are given the stage they practised for.',
    cards: [
      {
        title: 'The mehendi room',
        text: 'Shade, lounges and low tables, with artists seated where the light is good and the queue never becomes a line.',
      },
      {
        title: 'The stage',
        text: 'A running order held to the minute, with rehearsal time for every family act and cues called from the wings.',
      },
      {
        title: 'The floor',
        text: 'Lighting, sound and floor space designed for the hours after the programme, when the evening becomes its own.',
      },
      {
        title: 'Rehearsal',
        text: 'Stage time held before the evening, so families who have practised for weeks are not learning the floor on the night.',
      },
      {
        title: 'The quiet end',
        text: 'Seating away from the speakers, where a guest can sit a song out and still be in the room.',
      },
    ],
    photos: {
      rail: p(10847848190, 1600, 1280, 800),
      open: p(11819639779, 1600, 900, 800),
      cols: p(10847848035, 1188, 1600, 594),
      wide: p(11819639409, 1600, 1066, 800),
      narrow: p(10847847620, 1066, 1600, 533),
    },
  },
  {
    slug: 'wedding',
    numeral: '03',
    name: 'The Wedding',
    discover: 'The ceremony',
    lines: ['The mandap,', 'the procession,', 'the vows'],
    cols: {
      pretitle: '(The ceremony)',
      paragraphs: [
        'Mandap or altar design, florals and lighting, the processional and the guest choreography '
        + 'around it — indoors or open air, in India or abroad.',
        'The ceremony is the one hour of the celebration that cannot be moved, so everything else '
        + 'is planned backwards from it.',
      ],
    },
    middle: 'The baraat arrives when the baraat arrives. The rest is held ready.',
    close:
      'Photography works through the ceremony rather than around it: the ritual is never paused '
      + 'for a frame.',
    lists: [
      {
        title: 'The ceremony',
        items: [
          'Mandap and altar design',
          'Florals, drapery and lighting',
          'Processional and baraat route',
          'Seating and guest choreography',
          'Priest, sound and ritual provisions',
        ],
      },
      {
        title: 'Held ready',
        items: [
          'Weather cover, in season',
          'Timing against the muhurat',
          'Family entries and exits',
          'Photography through the ritual',
        ],
      },
    ],
    photos: {
      rail: p(11819641701, 1600, 1067, 800),
      open: p(11819642293, 1600, 1067, 800),
      cols: p(11819642012, 1067, 1600, 533),
      wide: p(10847852480, 1600, 1066, 800),
      narrow: p(10847851856, 1066, 1600, 533),
    },
  },
  {
    slug: 'beyond',
    numeral: '04',
    name: 'Beyond the Wedding',
    discover: 'The night that follows',
    lines: ['Dining, artists', 'and the last', 'hour of the night'],
    cols: {
      pretitle: '(After the ceremony)',
      paragraphs: [
        'Seating, tables and late dining. Food stations and refreshments through the small hours. '
        + 'Artists and technical production, through to the last hour of the night.',
        'What the night needs most is that nothing appears to be ending: the room changes around '
        + 'the guests rather than in front of them.',
      ],
    },
    middle: 'Production, lighting and sound, built for a room that empties slowly.',
    close:
      'The celebration closes the way it opened — with the family in the middle of it, and the '
      + 'work kept out of the frame.',
    cards: [
      {
        title: 'Late dining',
        text: 'Stations and service that run past midnight, replenished quietly and never cleared in front of the room.',
      },
      {
        title: 'Artists',
        text: 'Performers, DJs and live sets, with technical production and cues held by one team from soundcheck to close.',
      },
      {
        title: 'The last hour',
        text: 'Lighting, pyro and the send-off, timed so the night ends on a moment rather than on the lights coming up.',
      },
      {
        title: 'The floor',
        text: 'Room to dance without a stage between the guests and it, and sound built for a space that fills after midnight.',
      },
      {
        title: 'Getting home',
        text: 'Transport held through the night, so the celebration ends when the family decides rather than when the cars leave.',
      },
    ],
    photos: {
      rail: p(10847849656, 1600, 1280, 800),
      open: p(10847849666, 1600, 1066, 800),
      cols: p(10847849694, 1067, 1600, 533),
      wide: p(10847849738, 1600, 1520, 800),
      narrow: p(10847849719, 1067, 1600, 533),
    },
  },
]

/** The other work, named as the site already names it. */
export const ALSO = {
  pretitle: '(Beyond weddings)',
  title: ['We also', 'compose'] as const,
  lists: [
    {
      title: 'Corporate',
      items: ['Corporate events and conferences', 'Product launches and brand activations', 'Award shows'],
    },
    {
      title: 'Public',
      items: ['Concerts and festivals', 'Ticketed productions', 'Technical production and staging'],
    },
  ] as CelebrationList[],
}
