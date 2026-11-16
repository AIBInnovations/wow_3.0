import { lib, type LibraryName } from './library'

/**
 * The home page, section by section, exactly as the Website Content PDF sets
 * it out: its headings, in its order, with its words. Nothing on the home page
 * comes from anywhere else (the hero, the scrolling gallery and the statement
 * band carry the document's banners, home-page line and Design Ideology close;
 * see app/page.tsx; its sections fill the home page’s card stack, see data/home.ts).
 *
 * Each section: the document's heading, its opening sentence as the lead, the
 * paragraphs that follow, and its closing short lines set apart. The
 * photographs are rooms, flowers and light: the document keeps the clientele's
 * identities and imagery private.
 */

export type DocPhoto = { src: string; src800: string; w: number; h: number; alt: string }

export type DocSectionData = {
  id: string
  heading: string
  lead: string
  body: string[]
  closing?: string[]
  photo: DocPhoto
  /** The section's ground, one of the preview deck's section colours. */
  ground: string
  cta?: { href: string; label: string }
}

const photo = (name: LibraryName, alt: string): DocPhoto => {
  const { src, src800, w, h } = lib(name)
  return { src, src800, w, h, alt }
}

export const founderPhilosophy: DocSectionData = {
  id: 'philosophy',
  heading: 'Founder’s Philosophy',
  lead: 'A wedding, when approached with true artistry, becomes far more than a ceremony.',
  body: [
    'It evolves into an expression of identity, culture and emotion, articulated through space, '
      + 'atmosphere and carefully composed moments.',
    'At our atelier, every celebration begins as a study of the couple it honours. Through thoughtful '
      + 'dialogue and intuitive interpretation, we uncover the nuances that make each story distinct. '
      + 'From this understanding emerges a celebration that is deeply personal, quietly extraordinary '
      + 'and impossible to replicate.',
    'Our role is not simply to orchestrate, but to curate. To shape experiences with discernment, '
      + 'sensitivity and artistic discipline.',
  ],
  closing: ['For us, celebration is not produced.', 'It is authored.', 'And every wedding becomes a singular work of art.'],
  photo: photo('floral-corridor', 'A corridor of blue florals and woven lanterns'),
  ground: '#4a161b',
}

/** Its close, "Nothing is incidental. Everything is intentional.", is the statement band after it. */
export const designIdeology: DocSectionData = {
  id: 'ideology',
  heading: 'Design Ideology',
  lead: 'Our design philosophy rests upon a belief in considered elegance.',
  body: [
    'Rather than spectacle, we pursue atmosphere. Rather than excess, we pursue refinement.',
    'Each celebration is conceived as a living composition, where architecture, florals, light, texture '
      + 'and music are brought together with deliberate harmony. Every detail is measured not by its '
      + 'grandeur alone, but by its ability to contribute to the emotional landscape of the celebration.',
    'Guided by the discipline of an atelier and the sensibility of a cultural curator, we create '
      + 'environments that feel timeless, immersive and deeply evocative.',
  ],
  photo: photo('ice-florals', 'Florals rising from a carved ice sculpture'),
  ground: '#262d20',
}

export const whatDistinguishes: DocSectionData = {
  id: 'distinguishes',
  heading: 'What Distinguishes Our Celebrations',
  lead: 'We curate weddings as immersive experiences.',
  body: [
    'From the first arrival to the final farewell, every movement of the celebration is orchestrated with '
      + 'narrative precision. Spaces evolve, atmospheres shift and moments unfold with a quiet sense of theatre.',
    'Guests do not merely attend our celebrations. They inhabit them.',
    'Our approach transcends traditional planning. Instead, we conceive weddings as cultural and artistic '
      + 'compositions that engage the senses and create enduring memory.',
  ],
  closing: ['Every celebration is singular.', 'Never repeated. Never replicated.'],
  photo: photo('aisle-dusk', 'An aisle at dusk leading to the mandap by the sea'),
  ground: '#10264a',
}

/** Website Content PDF, Banners: the fourth, run as a band. */
export const coutureBanner = 'A Wedding, Rendered Like Couture'

export const artisticInfluences: DocSectionData = {
  id: 'influences',
  heading: 'Artistic Influences',
  lead: 'Our aesthetic language is shaped by a dialogue with European art, architecture and couture.',
  body: [
    'The romanticism of Parisian salons, the grandeur of Italian palazzos, the sun-washed elegance of '
      + 'Spanish villas and the quiet dignity of historic estates all inform our sensibilities.',
    'We draw inspiration from the worlds of art, fashion, music and design, translating these influences '
      + 'into celebrations that feel cultivated rather than constructed.',
  ],
  closing: ['The result is a visual language defined by refinement, balance and enduring beauty.'],
  photo: photo('banquet-florals', 'A banquet table under a canopy of florals'),
  ground: '#6b2433',
}

export const signaturePortfolio: DocSectionData = {
  id: 'portfolio',
  heading: 'Signature Portfolio',
  lead: 'Our portfolio represents a discreet anthology of our most distinguished celebrations.',
  body: [
    'The privacy of our clientele remains paramount, and as such, identities and imagery are not '
      + 'publicly disclosed. What remains visible is the artistry, the scale and the nuanced craftsmanship '
      + 'that define our work.',
  ],
  closing: ['Each celebration within our portfolio reflects a narrative interpreted with depth, sensitivity and aesthetic clarity.'],
  photo: photo('red-archway', 'A carved archway lit red'),
  ground: '#163a38',
  cta: { href: '/gallery', label: 'View the gallery' },
}

export const theExperience: DocSectionData = {
  id: 'experience',
  heading: 'The Experience',
  lead: 'The experience of working with our atelier is both personal and assured.',
  body: [
    'From the earliest conversations to the final moments of celebration, our process is guided by '
      + 'thoughtful collaboration and meticulous orchestration.',
    'We approach every detail with calm precision, allowing our clients to remain present within the joy '
      + 'of their celebration while we quietly shape the world around them.',
  ],
  closing: ['The journey is intimate.', 'The execution is seamless.'],
  photo: photo('tented-lounge', 'A tented lounge dressed in blue and gold'),
  ground: '#7a3214',
}

export const destinationsScale: DocSectionData = {
  id: 'destinations',
  heading: 'Destinations & Scale',
  lead: 'Our celebrations unfold across some of the world’s most remarkable destinations.',
  body: [
    'From historic European estates to Mediterranean coastlines, private villas and architecturally '
      + 'significant venues, each setting becomes an extension of the celebration’s narrative.',
    'Whether an intimate gathering of close family or a multi-day celebration of considerable scale, '
      + 'every occasion is approached with the same devotion to artistry and discretion.',
  ],
  photo: photo('city-night', 'A palace on the lake at night'),
  ground: '#3d1430',
}
