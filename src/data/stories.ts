export type Story = {
  img: string
  alt: string
  href: string
  /** The place, as the studio names it. */
  title: string
  /** Region and country. */
  location: string
  /** One geographic line about the place — never a venue, count or client claim. */
  line: string
}

/**
 * Where the studio works — the seven destinations the main site lists, in the
 * same order and with the same labels.
 *
 * Emirates Palace is in Abu Dhabi, not Dubai, and is labelled so. Its frame is the
 * studio's own. The other six are openly-licensed Wikimedia photographs (CC BY /
 * CC BY-SA), which require the credit in public/images/CITY-CREDITS.md to travel
 * with the site; the footer links to it.
 */
export const stories: Story[] = [
  {
    title: 'Emirates Palace',
    location: 'Abu Dhabi, U.A.E.',
    line: 'On the Gulf. Marble, gold and a celebration at international scale.',
    img: '/images/city-emirates-palace.jpg',
    alt: 'Emirates Palace, Abu Dhabi, from the air',
    href: '/celebrations',
  },
  {
    title: 'Udaipur',
    location: 'Rajasthan, India',
    line: 'The lake city. Palaces on the water, and light that lasts all evening.',
    img: '/images/city-udaipur.jpg',
    alt: 'City Palace, Udaipur',
    href: '/celebrations',
  },
  {
    title: 'Jaipur',
    location: 'Rajasthan, India',
    line: 'The pink city. Forts, courtyards and gardens built for procession.',
    img: '/images/city-jaipur.jpg',
    alt: 'Amber Fort, Jaipur',
    href: '/celebrations',
  },
  {
    title: 'Goa',
    location: 'West coast, India',
    line: 'Sea air and sand. Ceremonies at the edge of the water.',
    img: '/images/city-goa.jpg',
    alt: 'Palm trees at Vagator, Goa',
    href: '/celebrations',
  },
  {
    title: 'Indore',
    location: 'Madhya Pradesh, India',
    line: 'Central India. Grand halls and long, unhurried celebrations.',
    img: '/images/city-indore.jpg',
    alt: 'Rajwada Palace, Indore',
    href: '/celebrations',
  },
  {
    title: 'Bangalore',
    location: 'Karnataka, India',
    line: 'The garden city. Green estates and open-air evenings.',
    img: '/images/city-bangalore.jpg',
    alt: 'Bangalore Palace',
    href: '/celebrations',
  },
  {
    title: 'The Khyber',
    location: 'Gulmarg, Kashmir',
    line: 'Above the tree line. Pine, snow and mountain air.',
    img: '/images/city-khyber.jpg',
    alt: 'The Gulmarg gondola above the pines',
    href: '/celebrations',
  },
]
