/**
 * Every string the page shows, in one place.
 *
 * All of it is WOW Weddings & Events' own copy, lifted from the main site in
 * `../../../wow` rather than rewritten — the hero statement and the disciplines
 * line come from /disciplines, the four-days paragraph from /celebrations, the
 * enquiry note from the atelier's contact band.
 */

export const site = {
  name: 'WOW Weddings & Events',
  title: 'WOW Weddings & Events — Celebrations, Composed With Intention',
  description:
    'WOW Weddings & Events creates carefully composed luxury celebrations through '
    + 'design, hospitality, cuisine, invitations and entertainment.',
  email: 'enquiries@woweventsandweddings.com',
}

/** Wordmark, split so the middle word can take the outlined treatment. */
export const wordmark = { lead: 'WOW', outline: 'Weddings', tail: '& Events' }

export const hero = {
  kicker: 'Weddings, ceremonies and events',
  /** Sits inside the display face; the clone renders it as one clipped line. */
  title: 'celebrations artfully composed',
  paragraph:
    'Rather than spectacle, atmosphere; rather than excess, refinement. '
    + 'Nothing is incidental. Everything is intentional.',
  cta: { label: 'Make an enquiry', href: 'mailto:enquiries@woweventsandweddings.com' },
}

export const atelier = {
  kicker: 'The Atelier',
  /** Brightens character by character as the section scrubs past. */
  /**
   * Set at 16cqw across a 13ch measure, so it has to stay short — the longer
   * form of this line from /disciplines runs well past the fold.
   */
  statement: 'Five disciplines, composed as one — never in isolation.',
  cta: { href: '/atelier', label: 'The Atelier' },
  circleText: 'THE ATELIER · INTENTION WITHOUT EXCESS · ',
}

/** Runs endlessly across the top of the statements band. */
export const voicesMarquee = 'Composed With Intention &'

export const celebration = {
  headingLead: 'Four Days',
  headingOutline: 'One Celebration',
  paragraph:
    'Haldi at first light, mehendi and sangeet through the evening, the ceremony '
    + "itself, and the night that follows — conceived together rather than as four "
    + 'separate days. The rituals are kept exactly as the family keeps them. '
    + 'Everything around them is composed.',
  cta: { label: 'Explore Celebrations', href: '/celebrations' },
}

export const closing = {
  heading: 'Shall We Begin?',
  note:
    'A limited number of celebrations each year. Private enquiries begin with a '
    + 'confidential conversation.',
  cta: { href: 'mailto:enquiries@woweventsandweddings.com', label: 'Start an enquiry' },
  circleText: 'START AN ENQUIRY · MAKE AN ENQUIRY · ',
}
