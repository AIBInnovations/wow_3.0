/**
 * The two legal pages.
 *
 * The copy is placeholder, and each page says so: it is a structure to hold the
 * studio's own policy wording and does not yet state it. Every section describes
 * what belongs there rather than asserting a policy — nothing here is legal
 * advice or a usable policy. Carried over from the main site as it stands.
 */

export type LegalSection = { heading: string; body: string[] }

export type LegalPage = {
  /** The label above the title. */
  kicker: string
  title: string
  standfirst: string
  /** The note that marks the copy as placeholder, shown on the page. */
  notice: string
  updated: string
  sections: LegalSection[]
}

const NOTICE =
  'This page is a structure to hold the studio’s own policy wording and does not '
  + 'yet state it.'

export const privacy: LegalPage = {
  kicker: 'Legal',
  title: 'Privacy Policy',
  standfirst: 'How the studio handles what you share when you enquire.',
  notice: NOTICE,
  updated: 'Last revised September 2026',
  sections: [
    {
      heading: 'What we collect',
      body: [
        'Describe the information an enquiry provides — name, contact details, the '
        + 'date and place of the celebration, and anything shared in conversation.',
      ],
    },
    {
      heading: 'How it is used',
      body: [
        'Describe what the studio does with an enquiry: answering it, preparing a '
        + 'proposal, and planning the celebration it concerns.',
      ],
    },
    {
      heading: 'Who it is shared with',
      body: [
        'Name the parties an enquiry may reach — venues, suppliers and partners '
        + 'engaged for a celebration — and on what terms.',
      ],
    },
    {
      heading: 'Keeping and removing it',
      body: [
        'State how long enquiry records are kept, and how someone asks for theirs '
        + 'to be corrected or removed.',
      ],
    },
    {
      heading: 'Cookies',
      body: [
        'State which cookies the site sets, what each is for, and how a reader '
        + 'changes their choice.',
      ],
    },
    {
      heading: 'Contact',
      body: ['Privacy questions reach the studio at enquiries@woweventsandweddings.com.'],
    },
  ],
}

export const terms: LegalPage = {
  kicker: 'Legal',
  title: 'Legal Notice',
  standfirst: 'Who runs this studio and this site, and on what terms.',
  notice: NOTICE,
  updated: 'Last revised September 2026',
  sections: [
    {
      heading: 'The studio',
      body: [
        'Give the registered name of the business, its address, registration number '
        + 'and tax identifier.',
      ],
    },
    {
      heading: 'This site',
      body: ['State who operates the site and how to reach them about it.'],
    },
    {
      heading: 'Photographs and text',
      body: [
        'State who owns the photography and writing on the site, and on what terms '
        + 'it may be used.',
      ],
    },
    {
      heading: 'Enquiries and proposals',
      body: [
        'State what an enquiry is and is not — that a proposal is not a contract '
        + 'until signed, and what happens next.',
      ],
    },
    {
      heading: 'Governing law',
      body: ['Name the jurisdiction whose law applies and where disputes are heard.'],
    },
  ],
}
