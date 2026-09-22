/** Marketing copy follows the supplied Website Content PDF and preview deck.
 * Navigation, contact details and short interface labels remain site metadata.
 */

export const site = {
  name: 'WOW Weddings & Events',
  title: 'WOW Weddings & Events — Celebrations, Composed With Intention',
  description:
    'WOW Weddings & Events creates carefully composed luxury celebrations through '
    + 'design, hospitality, cuisine, invitations and entertainment.',
  email: 'enquiries@woweventsandweddings.com',
}

/** The studio name as the wordmark sets it. */
export const wordmark = { lead: 'WOW', middle: 'Weddings', tail: '& Events' }

export const hero = {
  kicker: 'Weddings, ceremonies and events',
  /** The oversized display line. */
  title: 'celebrations composed with intention',
  paragraph:
    'We curate weddings as immersive experiences, where every gesture, detail and moment is '
    + 'composed with artistic precision, allowing each celebration to unfold as a singular work of art.',
  cta: { label: 'Make an enquiry', href: 'mailto:enquiries@woweventsandweddings.com' },
}

export const atelier = {
  kicker: 'The Atelier',
  /** Brightens character by character as the section scrubs past. */
  /**
   * Set at 16cqw across a 13ch measure, so it has to stay short — the longer
   * form of this line from /disciplines runs well past the fold.
   */
  statement: 'Nothing is incidental. Everything is intentional.',
  cta: { href: '/about', label: 'The Atelier' },
  circleText: 'THE ATELIER · INTENTION WITHOUT EXCESS · ',
}

/** Runs endlessly across the top of the statements band. */
export const voicesMarquee = 'Composed With Intention &'

export const celebration = {
  headingLead: 'Every Moment',
  headingOutline: 'One Celebration',
  paragraph:
    'From the first arrival to the final farewell, every movement of the celebration is orchestrated with '
    + 'narrative precision. Spaces evolve, atmospheres shift and moments unfold with a quiet sense of theatre.',
  cta: { label: 'Explore Celebrations', href: '/celebrations' },
}

export const closing = {
  heading: 'Shall We Begin?',
  note:
    'Our atelier accepts a limited number of celebrations each year. '
    + 'For private enquiries, we invite you to begin a confidential conversation with our studio.',
  cta: { href: 'mailto:enquiries@woweventsandweddings.com', label: 'Start an enquiry' },
  circleText: 'START AN ENQUIRY · MAKE AN ENQUIRY · ',
}

/** Website Content PDF: What Distinguishes Our Celebrations. */
export const scrollGallery = {
  left: 'Immersive celebrations.',
  right: 'Artfully orchestrated.',
  note: 'Guests do not merely attend our celebrations. They inhabit them.',
}
