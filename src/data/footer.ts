export type FooterLink = { href: string; label: string; className?: string }
export type FooterColumn = { heading: string; modifier: string; links: FooterLink[] }

export const footerColumns: FooterColumn[] = [
  {
    heading: 'Explore',
    modifier: '',
    links: [
      { href: '/about', label: 'About' },
      { href: '/celebrations', label: 'Celebrations' },
      { href: '/disciplines', label: 'Disciplines' },
      { href: '/gallery', label: 'Gallery' },
    ],
  },
  {
    heading: 'Disciplines',
    modifier: 'center',
    links: [
      { href: '/disciplines#decor', label: 'Decor' },
      { href: '/disciplines#guest-experience', label: 'Guest Experience' },
      { href: '/disciplines#invites', label: 'Invites' },
      { href: '/disciplines#food-beverage', label: 'Food & Beverage' },
      { href: '/disciplines#entertainment', label: 'Entertainment' },
    ],
  },
  {
    heading: 'Connect',
    modifier: 'right',
    links: [
      { href: 'mailto:enquiries@woweventsandweddings.com', label: 'Enquiries' },
      { href: 'https://www.instagram.com/', label: 'Instagram' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Legal Notice' },
    ],
  },
]

export const copyright = '©2025 WOW WEDDINGS & EVENTS'

/**
 * The destination photographs are openly-licensed Wikimedia images; CC BY and
 * CC BY-SA require the credit to accompany the site, so it is linked, not buried.
 */
export const credit = {
  href: '/images/CITY-CREDITS.md',
  label: 'Destination photography credits',
}
