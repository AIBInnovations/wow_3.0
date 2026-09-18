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
  image: { src: '/images/wow-aisle-dusk.jpg', alt: 'An aisle of chandeliers leading to a seaside mandap at dusk' },
  mobileImage: { src: '/images/wow-arch-night.jpg', alt: 'A floral arch lit at night' },
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
      + 'is not produced. It is authored.',
  ],
}

export const aboutMarquee = 'Get To Know The Atelier'

export type AboutCard = { title: string; body: string; image: string; alt: string }

/** Three sticky cards, stacking as a staircase. */
export const aboutCards: AboutCard[] = [
  {
    title: 'Ideology',
    body:
      'Rather than spectacle, we pursue atmosphere. Rather than excess, we pursue '
      + 'refinement. Each celebration is conceived as a living composition, where '
      + 'architecture, florals, light, texture and music are brought together with '
      + 'deliberate harmony.',
    image: '/images/wow-tented-lounge.jpg',
    alt: 'A tented lounge in pastel drapes',
  },
  {
    title: 'Influence',
    body:
      'Our aesthetic language is shaped by a dialogue with European art, '
      + 'architecture and couture — the romanticism of Parisian salons, the grandeur '
      + 'of Italian palazzos and the quiet dignity of historic estates.',
    image: '/images/wow-palace-facade.jpg',
    alt: 'A palace facade',
  },
  {
    title: 'Journey',
    body:
      'From the earliest conversations to the final moments of celebration, our '
      + 'process is guided by thoughtful collaboration and meticulous orchestration. '
      + 'The journey is intimate. The execution is seamless.',
    image: '/images/wow-palm-walk.jpg',
    alt: 'A palm-lined walk to a floral pavilion',
  },
]

/** The press band, carrying the portfolio statement rather than invented press. */
export const aboutPortfolio = {
  kicker: 'Signature Portfolio',
  lines: ['A Discreet Anthology', 'Never Repeated'],
  note: 'Identities and imagery are not publicly disclosed.',
  left: { src: '/images/wow-fireworks-couple.jpg', alt: 'Fireworks over the mandap' },
  right: { src: '/images/wow-red-ballroom.jpg', alt: 'A ballroom lit red, candles on every table' },
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
        + 'nuances that make each story distinct.',
      from: '— Founder’s Philosophy',
    },
    {
      body:
        'Every detail is measured not by its grandeur alone, but by its ability to '
        + 'contribute to the emotional landscape of the celebration. Nothing is '
        + 'incidental. Everything is intentional.',
      from: '— Design Ideology',
    },
    {
      body:
        'From the first arrival to the final farewell, every movement of the '
        + 'celebration is orchestrated with narrative precision. Guests do not merely '
        + 'attend our celebrations. They inhabit them.',
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
  background: '/images/wow-palm-tents.jpg',
  marquee: 'Remarkable Destinations',
  heading: 'Destinations & Scale',
  cta: 'Explore',
  items: [
    { lead: 'Udaipur', tail: 'Rajasthan', image: '/images/city-udaipur.jpg', href: '/celebrations' },
    { lead: 'Jaipur', tail: 'Rajasthan', image: '/images/city-jaipur.jpg', href: '/celebrations' },
    { lead: 'Goa', tail: 'The West Coast', image: '/images/city-goa.jpg', href: '/celebrations' },
  ] as Destination[],
}
