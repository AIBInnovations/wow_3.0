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
  background: string
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
  background: discipline.background,
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

/** Preview deck pp. 2 and 7; five is the site's service grouping. */
export const homeStats = {
  kicker: 'In numbers',
  statement: 'Based in Indore and celebrated across India and international destinations.',
  stats: [
    { value: 50, suffix: '+', label: 'Weddings & milestone celebrations' },
    { value: 8, suffix: '+', label: 'Years of experience' },
    { value: 90, suffix: '+', label: 'Operational & hospitality checkpoints' },
    { value: 5, label: 'Disciplines, as one' },
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

export type WallItem = {
  id: string
  title: string
  /** Shown beside the title where the source states a running time. */
  duration?: string
  /**
   * A film hosted with the site plays in its own tile as soon as it is pointed
   * at. One that lives on Vimeo or Drive cannot — a cross-origin player will not
   * start on hover — so its tile holds a still and opens the player on a click.
   */
  video?: string
  embed?: string
  allow?: string
  /**
   * For a film that is not hosted here: the muted, chrome-free version its host
   * offers, mounted in the tile only while it is pointed at.
   */
  preview?: string
  poster: string
  alt: string
  /** Shot upright (9:16); the player gives it a tall frame rather than bars. */
  vertical?: boolean
}

/**
 * The films.
 *
 * All five are the client's own. The four from Drive and the one from the
 * client's machine are re-encoded for the web and hosted here, so each plays in
 * its tile; the trailer stays on Vimeo and opens over the page.
 */
export const homeFilms = {
  heading: 'The Celebration, In Motion',
  items: [
    {
      id: 'geet-heena-highlight',
      title: 'Geet & Heena | Highlight',
      duration: '2:01',
      // HIGHLIGHT.m4v from the client's "GEET & HEENA" Drive folder: 295 MB at
      // 4K, re-encoded at 720p to 26 MB.
      video: '/videos/highlight.mp4',
      poster: '/videos/highlight-poster.jpg',
      alt: 'Geet and Heena, from their highlight film',
    },
    {
      id: 'geet-heena-reel',
      title: 'Geet & Heena | Reel',
      duration: '0:34',
      // REEL.m4v from the same folder, shot upright at 4K; 76 MB became 6 MB.
      video: '/videos/reel.mp4',
      poster: '/videos/reel-poster.jpg',
      alt: 'Geet and Heena, from their reel',
      vertical: true,
    },
    {
      id: 'show-reel',
      title: 'Show Reel',
      duration: '1:35',
      // The Drive file "SHOW REEL.mp4" (587 MB at 4K) re-encoded for the web at
      // 720p, 19 MB, so it is hosted here and plays in its tile.
      video: '/videos/show-reel.mp4',
      poster: '/videos/show-reel-poster.jpg',
      alt: 'The studio’s show reel',
    },
    {
      id: 'rajvi-karan-trailer',
      // Vimeo 1154719831 (unlisted, hash 594f4a3343). Title, running time and
      // still are its own oEmbed record's.
      title: 'Rajvi & Karan | Trailer',
      duration: '5:41',
      embed:
        'https://player.vimeo.com/video/1154719831?h=594f4a3343&autoplay=1&title=0&byline=0&portrait=0&dnt=1',
      allow: 'autoplay; fullscreen; picture-in-picture',
      // Vimeo's background mode: muted, looping, no controls — so the trailer
      // plays in its tile on hover like the films hosted here.
      preview:
        'https://player.vimeo.com/video/1154719831?h=594f4a3343&background=1&autoplay=1&loop=1&muted=1&dnt=1',
      poster: '/videos/rajvi-karan-poster.jpg',
      alt: 'Rajvi and Karan, from the trailer',
    },
    {
      id: 'sangeet',
      title: 'Sangeet',
      duration: '2:21',
      // The client's own file, re-encoded for the web: 356 MB at 1080p became
      // 32 MB at 720p, so it can be hosted here and play in its tile.
      video: '/videos/sangeet.mp4',
      poster: '/videos/sangeet-poster.jpg',
      alt: 'The sangeet, from the studio’s film',
    },
  ] as WallItem[],
  /** The still that closes the wall. */
  still: {
    src: '/images/wow-films-still.jpg',
    alt: 'The couple beneath a glasshouse mandap, low mist at their feet',
    caption: 'The glasshouse mandap',
  },
}
