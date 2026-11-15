/**
 * Every string and image the About page shows.
 *
 * The copy is the studio's own, taken from the website content brief in
 * `../../../wow/content` — Founder's Philosophy, Design Ideology, Artistic
 * Influences, The Experience, Signature Portfolio and Destinations & Scale.
 * Nothing here is invented: where the page layout was shaped for client
 * testimonials or press, it carries the studio's own statements instead, exactly
 * as the home page's statements band does.
 */

/** A phrase in the hero headline. */
export type HeroPhrase = { text: string }

export const aboutHero = {
  image: { src: '/images/wow-aisle-dusk.webp', alt: 'An aisle of chandeliers leading to a seaside mandap at dusk' },
  mobileImage: { src: '/images/wow-arch-night.webp', alt: 'A floral arch lit at night' },
  /**
   * Five phrases, placed across the grid row by row:
   *   row one   → right-aligned across nine columns
   *   row two   → one phrase left, one phrase right
   *   row three → one phrase left, one phrase right
   */
  rowOne: { text: 'Celebrations,' } as HeroPhrase,
  rowTwoLeft: { text: 'Artfully' } as HeroPhrase,
  rowTwoRight: { text: 'Composed' } as HeroPhrase,
  rowThreeLeft: { text: 'With' } as HeroPhrase,
  rowThreeRight: { text: 'Intention' } as HeroPhrase,
  kicker: ['Founder’s', 'Philosophy'],
  paragraphs: [
    'A wedding, when approached with true artistry, becomes far more than a '
      + 'ceremony. It evolves into an expression of identity, culture and emotion, '
      + 'articulated through space, atmosphere and carefully composed moments.',
    'Our role is not simply to orchestrate, but to curate — to shape experiences '
      + 'with discernment, sensitivity and artistic discipline. For us, celebration '
      + 'is not produced. It is authored. And every wedding becomes a singular work of art.',
  ],
}

/** Website Content PDF, Banners. */
export const aboutMarquee = 'A Wedding, Rendered Like Couture'

export type AboutCard = { title: string; body: string; image: string; alt: string }

/** Three sticky cards, stacking as a staircase. */
export const aboutCards: AboutCard[] = [
  {
    title: 'Ideology',
    body:
      'Our design philosophy rests upon a belief in considered elegance. '
      + 'Rather than spectacle, we pursue atmosphere. Rather than excess, we pursue '
      + 'refinement. Each celebration is conceived as a living composition, where '
      + 'architecture, florals, light, texture and music are brought together with '
      + 'deliberate harmony.',
    image: '/images/wow-tented-lounge.webp',
    alt: 'A tented lounge in pastel drapes',
  },
  {
    title: 'Influence',
    body:
      'Our aesthetic language is shaped by a dialogue with European art, '
      + 'architecture and couture — the romanticism of Parisian salons, the grandeur '
      + 'of Italian palazzos, the sun-washed elegance of Spanish villas and the quiet '
      + 'dignity of historic estates. We draw inspiration from the worlds of art, fashion, '
      + 'music and design, translating these influences into celebrations that feel '
      + 'cultivated rather than constructed.',
    image: '/images/wow-palace-facade.webp',
    alt: 'A palace facade',
  },
  {
    title: 'Journey',
    body:
      'The experience of working with our atelier is both personal and assured. '
      + 'From the earliest conversations to the final moments of celebration, our '
      + 'process is guided by thoughtful collaboration and meticulous orchestration. '
      + 'The journey is intimate. The execution is seamless.',
    image: '/images/wow-palm-walk.webp',
    alt: 'A palm-lined walk to a floral pavilion',
  },
]

/** The press band, carrying the portfolio statement rather than invented press. */
export const aboutPortfolio = {
  kicker: 'Signature Portfolio',
  lines: ['A Discreet Anthology', 'Never Repeated'],
  /** Website Content PDF, Signature Portfolio. */
  note:
    'Our portfolio represents a discreet anthology of our most distinguished celebrations. '
    + 'The privacy of our clientele remains paramount, and as such, identities and imagery are '
    + 'not publicly disclosed. What remains visible is the artistry, the scale and the nuanced '
    + 'craftsmanship that define our work.',
  left: { src: '/images/wow-fireworks-couple.webp', alt: 'Fireworks over the mandap' },
  right: { src: '/images/wow-red-ballroom.webp', alt: 'A ballroom lit red, candles on every table' },
}

export type Letter = { body: string; from: string }

/** The pinned card stack. Studio statements, attributed to where they come from. */
export const aboutLetters = {
  title: 'In Our Words',
  letters: [
    {
      body:
        'At our atelier, every celebration begins as a study of the couple it honours. '
        + 'Through thoughtful dialogue and intuitive interpretation, we uncover the '
        + 'nuances that make each story distinct. From this understanding emerges a '
        + 'celebration that is deeply personal, quietly extraordinary and impossible to replicate.',
      from: '— Founder’s Philosophy',
    },
    {
      body:
        'Every detail is measured not by its grandeur alone, but by its ability to '
        + 'contribute to the emotional landscape of the celebration. Guided by the '
        + 'discipline of an atelier and the sensibility of a cultural curator, we create '
        + 'environments that feel timeless, immersive and deeply evocative.',
      from: '— Design Ideology',
    },
    {
      body:
        'From the first arrival to the final farewell, every movement of the '
        + 'celebration is orchestrated with narrative precision. Our approach transcends '
        + 'traditional planning. Instead, we conceive weddings as cultural and artistic '
        + 'compositions that engage the senses and create enduring memory. Every '
        + 'celebration is singular. Never repeated. Never replicated.',
      from: '— What Distinguishes Us',
    },
    {
      body:
        'We approach every detail with calm precision, allowing our clients to remain '
        + 'present within the joy of their celebration while we quietly shape the '
        + 'world around them.',
      from: '— The Experience',
    },
  ] as Letter[],
}

export type Destination = { lead: string; tail: string; image: string; href: string }

export const aboutDestinations = {
  background: '/images/wow-palm-tents.webp',
  marquee: 'Remarkable Destinations',
  heading: 'Destinations & Scale',
  /** Website Content PDF, Destinations & Scale. */
  note: [
    'Our celebrations unfold across some of the world’s most remarkable destinations. '
      + 'From historic European estates to Mediterranean coastlines, private villas and '
      + 'architecturally significant venues, each setting becomes an extension of the '
      + 'celebration’s narrative.',
    'Whether an intimate gathering of close family or a multi-day celebration of considerable '
      + 'scale, every occasion is approached with the same devotion to artistry and discretion.',
  ],
  cta: 'Explore',
  items: [
    { lead: 'Udaipur', tail: 'Rajasthan', image: '/images/city-udaipur.webp', href: '/celebrations' },
    { lead: 'Jaipur', tail: 'Rajasthan', image: '/images/city-jaipur.webp', href: '/celebrations' },
    { lead: 'Goa', tail: 'The West Coast', image: '/images/city-goa.webp', href: '/celebrations' },
  ] as Destination[],
}
