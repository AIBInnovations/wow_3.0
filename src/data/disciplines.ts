/**
 * Every string and image the Disciplines page shows.
 *
 * The copy is the studio's own, trimmed and never rewritten: the hero from the
 * website content brief's Design Ideology (`../../../wow/content`) and the main
 * site's disciplines framing; each chapter from the main site's discipline pages
 * (`../../../wow/src/components/pages/DisciplinePage/content.ts` — the opening
 * statement, intro, first feature, first lists, the highlight cards and the
 * closing line). Places are the ones the About page already names.
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
  /** The wine ramp step behind this chapter. */
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

const PLACES = 'Jaipur · Goa · Indore · Bangalore'

const photo = (file: string, w: number, h: number, alt: string): Photo => ({
  src: `/disciplines/${file}.jpg`,
  src800: `/disciplines/${file}-800.jpg`,
  w,
  h,
  alt,
})

export const disciplines: Discipline[] = [
  {
    slug: 'decor',
    number: '01',
    name: 'Decor',
    caption: 'Florals, staging, lighting and venue transformation',
    statement: ['Every space', 'holds a story', 'worth telling'],
    intro:
      'Decor is where a celebration first becomes visible. We compose florals, staging, lighting and the '
      + 'transformation of a venue as a single idea, so that every room, lawn and courtyard reads as part of the '
      + 'same story. Nothing is added for effect; every element is chosen for what it brings to the atmosphere '
      + 'of the day — from the first flower at the entrance to the last candle at night.',
    feature: {
      title: 'Designed around the place',
      text:
        'We begin with the venue as it is — its light, its architecture, its views — and design with it rather '
        + 'than over it. Palaces, lawns and lakesides each ask for something different.',
    },
    lists: [
      { title: 'Where we compose', items: [PLACES, 'In India and abroad'] },
      { title: 'What we transform', items: ['Lawns, courtyards and ballrooms', 'Terraces, lakesides and private estates', 'Day and night settings'] },
    ],
    cards: [
      { title: 'Florals', text: 'Seasonal flowers arranged in installations, canopies and table pieces — composed for colour and scent as much as for form.' },
      { title: 'Staging', text: 'Mandaps, stages and lounges built to the proportions of the space, so that every ceremony has a natural centre.' },
      { title: 'Lighting', text: 'Light designed from dusk to the last hour of the night, carrying a setting gently from day into evening.' },
      { title: 'Colour stories', text: 'A palette for every event — pastel mornings, marigold afternoons, deep jewel-toned nights.' },
      { title: 'Lounges', text: 'Soft seating and quiet corners where guests can pause between moments.' },
      { title: 'Transformation', text: 'Lawns, ballrooms and courtyards reimagined completely, and returned untouched.' },
    ],
    closing: ['Quiet luxury,', 'true to', 'the place'],
    background: '#5a1f24',
    photos: {
      index: photo('index-decor', 1122, 1402, 'Decor by WOW Weddings & Events'),
      open: photo('decor-open', 1600, 1066, 'A ceremony setting composed by WOW Weddings & Events'),
      wide: photo('decor-wide', 1600, 1067, 'Florals and staging by WOW Weddings & Events'),
      narrow: photo('decor-narrow', 1066, 1600, 'Lighting and florals by WOW Weddings & Events'),
    },
  },
  {
    slug: 'guest-experience',
    number: '02',
    name: 'Guest Experience',
    caption: 'Arrivals, accommodation, transport and concierge',
    statement: ['A warm welcome', 'and care in', 'every detail'],
    intro:
      'Guest experience is everything a guest feels between the invitation and the journey home. Arrivals, '
      + 'accommodation, transport and concierge are planned as one continuous hospitality, so that every guest — '
      + 'family, friends and those travelling furthest — feels expected, looked after and free to simply enjoy the '
      + 'celebration.',
    feature: {
      title: 'Received by name',
      text:
        'Guests are met at the airport and at the door, garlanded, welcomed with aarti and shown to their rooms '
        + 'without a queue or a question.',
    },
    lists: [
      { title: 'Where we host', items: [PLACES, 'In India and abroad'] },
      { title: 'From arrival to departure', items: ['Airport and station receptions', 'Transfers to the venue', 'Check-in handled in advance'] },
    ],
    cards: [
      { title: 'Airport receptions', text: 'Guests are met on arrival with flowers and a familiar welcome, and taken straight to the venue.' },
      { title: 'Welcome rituals', text: 'Aarti, tilak and garlands at the door — traditions kept exactly as the family keeps them.' },
      { title: 'Accommodation', text: 'Rooms allocated, prepared and checked before anyone arrives, with keys waiting at the door.' },
      { title: 'Transport', text: 'Cars, coaches and transfers scheduled around every event, so nobody waits and nobody is lost.' },
      { title: 'Concierge', text: 'A team on hand throughout the celebration for every request, large or small.' },
      { title: 'Welcome hampers', text: 'Personal notes, itineraries and gifts waiting in every room.' },
    ],
    closing: ['Quiet care,', 'at every', 'turn'],
    background: '#4a181d',
    photos: {
      index: photo('index-guest-experience', 1122, 1402, 'Guest experience by WOW Weddings & Events'),
      open: photo('guest-experience-open', 1600, 1066, 'Guests welcomed by WOW Weddings & Events'),
      wide: photo('guest-experience-wide', 1600, 1066, 'A welcome composed by WOW Weddings & Events'),
      narrow: photo('guest-experience-narrow', 1066, 1600, 'A guest arrival by WOW Weddings & Events'),
    },
  },
  {
    slug: 'invites',
    number: '03',
    name: 'Invites & Gifting',
    caption: 'Stationery, digital invitations and gifting',
    statement: ['The first', 'impression,', 'kept forever'],
    intro:
      'An invitation is the first moment of a celebration that a guest holds in their hands. We design stationery, '
      + 'digital invitations and gifting as one visual language — the same colours, monograms and materials carried '
      + 'from the first save-the-date to the welcome hamper in the room and the gift a guest takes home.',
    feature: {
      title: 'Written in the family’s hand',
      text:
        'Every suite begins with the family: their names, their story and the tone of the celebration, translated '
        + 'into paper, print and design.',
    },
    lists: [
      { title: 'Where we create', items: [PLACES, 'Delivered in India and abroad'] },
      { title: 'What we design', items: ['Save-the-dates and invitations', 'Digital invitations', 'Gifting and hampers'] },
    ],
    cards: [
      { title: 'Invitations', text: 'Printed suites designed around the family’s story, finished by hand.' },
      { title: 'Digital invitations', text: 'Invitations and itineraries for guests near and far, in the same visual language as print.' },
      { title: 'Monograms', text: 'A mark for the celebration, carried from paper to signage, cakes and lights.' },
      { title: 'Signage', text: 'Welcome boards, event signs and wayfinding designed to belong to the setting.' },
      { title: 'Gifting', text: 'Trays and gifts for family rituals, arranged and presented with ceremony.' },
      { title: 'Welcome hampers', text: 'Personal notes and keepsakes waiting for guests in every room.' },
    ],
    closing: ['Quiet luxury,', 'made', 'personal'],
    background: '#3b1215',
    photos: {
      index: photo('index-invites', 1122, 1402, 'Invitations and gifting by WOW Weddings & Events'),
      open: photo('invites-open', 1600, 1066, 'Gifting presented by WOW Weddings & Events'),
      wide: photo('invites-wide', 1600, 1066, 'Stationery and gifts by WOW Weddings & Events'),
      narrow: photo('invites-narrow', 1066, 1600, 'A ritual tray by WOW Weddings & Events'),
    },
  },
  {
    slug: 'food-beverage',
    number: '04',
    name: 'Food & Beverage',
    caption: 'Menus, live counters and beverage programmes',
    statement: ['Tables that', 'invite', 'conversation'],
    intro:
      'Food brings a celebration together more than anything else. We design menus, live counters and beverage '
      + 'programmes around the family, the occasion and the season — from long welcome lunches to late-night bars — '
      + 'so that every meal is a moment guests talk about long after the celebration is over.',
    feature: {
      title: 'Menus with a sense of place',
      text:
        'Every menu is written for its event: regional dishes for a family lunch, lighter plates for a morning '
        + 'ceremony, generous spreads for a night of celebration.',
    },
    lists: [
      { title: 'Where we serve', items: [PLACES, 'In India and abroad'] },
      { title: 'What we plan', items: ['Menus and tastings', 'Live counters', 'Beverage programmes'] },
    ],
    cards: [
      { title: 'Menus', text: 'Written for each event and tasted in advance with the family.' },
      { title: 'Live counters', text: 'Chefs cooking to order, turning a meal into something to watch and share.' },
      { title: 'Regional cuisine', text: 'Dishes from the family’s own traditions alongside flavours from further afield.' },
      { title: 'Beverage programmes', text: 'Bars, signature drinks and non-alcoholic menus designed for every event.' },
      { title: 'Table settings', text: 'Linen, tableware and florals chosen to belong to the setting.' },
      { title: 'Celebration cakes', text: 'Cakes and desserts designed around the occasion and its moments.' },
    ],
    closing: ['Generous,', 'gracious,', 'unhurried'],
    background: '#4a181d',
    photos: {
      index: photo('index-food-beverage', 1122, 1402, 'Food and beverage by WOW Weddings & Events'),
      open: photo('food-beverage-open', 1600, 1066, 'A table set by WOW Weddings & Events'),
      wide: photo('food-beverage-wide', 1600, 1066, 'Dining composed by WOW Weddings & Events'),
      narrow: photo('food-beverage-narrow', 1066, 1600, 'A live counter by WOW Weddings & Events'),
    },
  },
  {
    slug: 'entertainment',
    number: '05',
    name: 'Entertainment',
    caption: 'Artists, performances and technical production',
    statement: ['Music and', 'movement that', 'fill the room'],
    intro:
      'Entertainment gives a celebration its energy. We bring together artists, performances and technical '
      + 'production — sufi evenings, sangeet stages, carnival afternoons and late-night parties — and design each one '
      + 'around the family’s taste and the mood of the moment, so that every event has its own sound and its own rhythm.',
    feature: {
      title: 'Curated for the family',
      text:
        'Artists and performances are chosen with the family, so that every act feels personal — from a quiet sufi '
        + 'evening to a full sangeet production.',
    },
    lists: [
      { title: 'Where we perform', items: [PLACES, 'In India and abroad'] },
      { title: 'What we produce', items: ['Artists and performers', 'Choreography', 'Sound, light and staging'] },
    ],
    cards: [
      { title: 'Artists', text: 'Singers, musicians and performers chosen with the family for every event.' },
      { title: 'Sufi evenings', text: 'Intimate performances, qawwali and whirling dervishes under soft light.' },
      { title: 'Sangeet productions', text: 'Stages, choreography and rehearsals for family performances and professional acts.' },
      { title: 'Carnival afternoons', text: 'Colour, games, music and performers for daytime celebrations.' },
      { title: 'After-parties', text: 'DJs, lights and late nights that carry the celebration past midnight.' },
      { title: 'Technical production', text: 'Sound, lighting, screens and special effects designed and run by one team.' },
    ],
    closing: ['Energy,', 'timed to', 'perfection'],
    background: '#5a1f24',
    photos: {
      index: photo('index-entertainment', 1122, 1402, 'Entertainment by WOW Weddings & Events'),
      open: photo('entertainment-open', 1600, 900, 'A performance produced by WOW Weddings & Events'),
      wide: photo('entertainment-wide', 1600, 1067, 'A sangeet stage by WOW Weddings & Events'),
      narrow: photo('entertainment-narrow', 1066, 1600, 'An evening performance by WOW Weddings & Events'),
    },
  },
]
