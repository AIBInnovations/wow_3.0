import {
  artisticInfluences,
  designIdeology,
  destinationsScale,
  founderPhilosophy,
  signaturePortfolio,
  theExperience,
} from './homeDoc'

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
  cta: { label: 'Get to know the atelier', href: '/about' },
}

export type AtelierCard = {
  number: string
  background: string
  title: string
  /** The section's opening sentence, verbatim. */
  lead: string
  /** The paragraph after it, verbatim. */
  text: string
  /** The section's closing line, where the document gives one. */
  closing?: string
  /** The photograph: 800px for phones, the full file for the desktop's half-screen print. */
  image: string
  imageLarge: string
  imageWidth: number
  alt: string
  href: string
}

/**
 * The split-screen chapters carry the Website Content PDF's sections, in its
 * order: each the section's heading, its opening sentence, first paragraph and
 * closing line in the document's words, a photograph, and one of the preview
 * deck's section colours. (What Distinguishes Our Celebrations has its own
 * section further down; the full text of every section is on the About page,
 * where each chapter leads.) Photographs are rooms, flowers and light.
 *
 * Design Ideology's own ground is the olive the home page's section sits on, so
 * it takes the deck's navy instead (the colour of What Distinguishes).
 */
const cardGround: Record<string, string> = { ideology: '#10264a' }

export const homeAtelierCards: AtelierCard[] = [
  founderPhilosophy,
  designIdeology,
  artisticInfluences,
  signaturePortfolio,
  theExperience,
  destinationsScale,
].map((section, i) => ({
  number: String(i + 1).padStart(2, '0'),
  background: cardGround[section.id] ?? section.ground,
  title: section.heading,
  lead: section.lead,
  text: section.body[0],
  closing: section.closing?.join(' '),
  image: section.photo.src800,
  imageLarge: section.photo.src,
  imageWidth: section.photo.w,
  alt: section.photo.alt,
  href: '/about',
}))

export type Stat = {
  value: number
  /** Set as a small gold superscript after the numeral. */
  suffix?: string
  label: string
}

/** Preview deck p. 2; seven services, as the deck lists them on p. 5. */
export const homeStats = {
  kicker: 'In numbers',
  /** Preview deck p. 2. */
  statement: 'Social landmarks, remembered for years.',
  body: [
    'Based in Indore and celebrated across India and international destinations, the company '
      + 'has curated over 50 bespoke weddings and milestone celebrations for families who value '
      + 'discretion, detail, and experience over excess.',
    'For over eight years, Ishaan Vyas and Manish Baherwani have approached weddings not as '
      + 'events, but as immersive environments — where hospitality, emotion, movement, design, '
      + 'and timing come together seamlessly.',
    'Because true luxury is never about doing more. It is about making everything feel '
      + 'beautifully natural.',
  ],
  stats: [
    { value: 50, suffix: '+', label: 'Weddings & milestone celebrations' },
    { value: 8, suffix: '+', label: 'Years of experience' },
    { value: 7, label: 'Disciplines, as one' },
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
 * All four are the client's own. The three from Drive are re-encoded for the
 * web and hosted here, so each plays in its tile; the trailer stays on Vimeo
 * and opens over the page.
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
      poster: '/videos/highlight-poster.webp',
      alt: 'Geet and Heena, from their highlight film',
    },
    {
      id: 'show-reel',
      title: 'Show Reel',
      duration: '1:35',
      // The Drive file "SHOW REEL.mp4" (587 MB at 4K) re-encoded for the web at
      // 720p, 19 MB, so it is hosted here and plays in its tile.
      video: '/videos/show-reel.mp4',
      poster: '/videos/show-reel-poster.webp',
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
      poster: '/videos/rajvi-karan-poster.webp',
      alt: 'Rajvi and Karan, from the trailer',
    },
    {
      id: 'sangeet',
      title: 'Sangeet',
      duration: '2:21',
      // The client's own file, re-encoded for the web: 356 MB at 1080p became
      // 32 MB at 720p, so it can be hosted here and play in its tile.
      video: '/videos/sangeet.mp4',
      poster: '/videos/sangeet-poster.webp',
      alt: 'The sangeet, from the studio’s film',
    },
  ] as WallItem[],
  /** The still that closes the wall. */
  still: {
    src: '/home/band-trellis.webp',
    alt: 'A band playing beneath a white trellis and turquoise arches',
    caption: 'The live set',
  },
}

export type Reel = {
  id: string
  /** The Instagram reel's shortcode (instagram.com/reel/<code>). */
  instagram: string
  /** The reel's own cover frame, saved from Instagram into public/reels/. */
  cover: string
}

/** The client's Instagram reels, by shortcode. */
const reelCodes = ['DXRlgyNglRb', 'DXLemBjAoqx', 'DXJ23uuAsPo', 'DW-kql2gllj', 'DQjifJVjVgj', 'DN98CLyAmhA']

/** The reels carousel, after the disciplines. */
export const homeReels = {
  kicker: 'In Motion',
  heading: 'The Reels',
  note: 'Tap a reel to watch it on Instagram',
  items: reelCodes.map((code) => ({ id: code, instagram: code, cover: `/reels/${code}.webp` })) as Reel[],
}
