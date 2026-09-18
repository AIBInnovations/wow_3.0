import { disciplines } from './disciplines'

/**
 * Every string the three home-only sections show — the atelier band, the stats
 * band and the films.
 *
 * Nothing here is invented. Each number is one the studio itself states, and
 * the comment beside it names the source it was read from.
 */

export const homeAtelier = {
  kicker: 'Our Approach',
  heading: 'Composed With Intention',
  cta: { label: 'Explore the Disciplines', href: '/disciplines' },
}

export type AtelierCard = {
  number: string
  title: string
  body: string
  image: string
  alt: string
  href: string
}

/**
 * The five disciplines, as the staircase of cards.
 *
 * Read from `./disciplines` rather than copied, so the band and the Disciplines
 * page can never drift: each card takes a discipline's number, its name, the
 * paragraph that opens its chapter and its index photograph, and links to that
 * chapter's anchor.
 */
export const homeAtelierCards: AtelierCard[] = disciplines.map((discipline) => ({
  number: discipline.number,
  title: discipline.name,
  body: discipline.intro,
  image: discipline.photos.index.src,
  alt: discipline.photos.index.alt,
  href: `/disciplines#${discipline.slug}`,
}))

export type Stat = {
  value: number
  /** Set as a small gold superscript after the numeral. */
  suffix?: string
  label: string
}

export const homeStats = {
  kicker: 'In numbers',
  /**
   * The caption under the main site's "200+ weddings" pill, word for word —
   * ../../../wow/src/components/sections/Destinations/Destinations.tsx.
   */
  statement: 'More than two hundred weddings, across India and international destinations.',
  stats: [
    // Main site, src/components/sections/Destinations/Destinations.tsx: the
    // "200+ weddings" pill and its caption, "More than two hundred weddings…".
    { value: 200, suffix: '+', label: 'Weddings composed' },
    // The five discipline pages the main site publishes —
    // src/components/pages/DisciplinePage/content.ts: Decor, Guest Experience,
    // Invites & Gifting, Food & Beverage, Entertainment (the same five in this
    // project's src/data/disciplines.ts).
    { value: 5, label: 'Disciplines, as one' },
    // The seven the studio names — the destinations band in src/data/stories.ts,
    // and the figure the main site quotes: "across seven destinations".
    { value: 7, label: 'Destinations named' },
    // "Four Days / One Celebration" — `celebration` in src/data/content.ts.
    { value: 4, label: 'Days, one celebration' },
  ] as Stat[],
}

export type Film = {
  id: string
  title: string
  /** Shown beside the title only where the source states it. */
  duration?: string
  /** The player URL, loaded into an iframe only once the card is clicked. */
  embed: string
  /** The iframe's permission list, as the host requires it. */
  allow: string
  poster: { src: string; w: number; h: number }
}

export type WallClip = {
  /** File stem under /videos/wall — `<id>.mp4` and its poster `<id>.jpg`. */
  id: string
  caption: string
  alt: string
}

export const homeFilms = {
  kicker: 'Films',
  heading: 'The Celebration, In Motion',
  /**
   * Eight moments cut from the studio's own celebration film, five seconds each
   * and silent. A tile shows its still until it is hovered, and plays only then,
   * so the section costs a few posters until someone asks for more.
   */
  wall: [
    [
      { id: 'entrance', caption: 'The entrance', alt: 'The bride at the entrance' },
      { id: 'fountains', caption: 'Fountains at nightfall', alt: 'Lit fountains along the approach' },
      { id: 'firstlight', caption: 'The first light', alt: 'The groom at the lamps' },
      { id: 'walk', caption: 'The walk in', alt: 'The couple walking in' },
    ],
    [
      { id: 'together', caption: 'Side by side', alt: 'The couple, side by side' },
      { id: 'mandap', caption: 'The mandap, lit', alt: 'The mandap lit against the dark' },
      { id: 'mist', caption: 'Through the mist', alt: 'The couple through low mist' },
      { id: 'fireworks', caption: 'Fireworks over the arch', alt: 'Fireworks breaking over the arch' },
    ],
  ] as WallClip[][],
  /** The full films, opened over the page rather than played in the wall. */
  films: [
    {
      id: 'rajvi-karan-trailer',
      // Title, running time and thumbnail from Vimeo's oEmbed record for the
      // unlisted film 1154719831 (hash 594f4a3343): "Rajvi & Karan | Trailer", 341s.
      title: 'Rajvi & Karan | Trailer',
      duration: '5:41',
      embed:
        'https://player.vimeo.com/video/1154719831?h=594f4a3343&autoplay=1&title=0&byline=0&portrait=0&dnt=1',
      allow: 'autoplay; fullscreen; picture-in-picture',
      poster: {
        src: 'https://i.vimeocdn.com/video/2108166639-765618da5486e3f4676077b882d62cbb3688d361c0ccbedc27e2ccfc45bcf1da-d_1280x720',
        w: 1280,
        h: 720,
      },
    },
    {
      id: 'show-reel',
      // The Google Drive file 1s4aaZSslWXim8lqH-07v0ILBBMmpo7lo is named
      // "SHOW REEL.mp4" (the /view page's title).
      title: 'Show Reel',
      embed: 'https://drive.google.com/file/d/1s4aaZSslWXim8lqH-07v0ILBBMmpo7lo/preview',
      allow: 'autoplay; fullscreen',
      poster: { src: '/videos/show-reel-poster.jpg', w: 1280, h: 800 },
    },
  ] as Film[],
}
