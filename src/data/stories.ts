export type Story = {
  img: string
  alt: string
  href: string
  title: string
  location: string
}

/**
 * Where the studio works, shown behind the sticky full-viewport frame.
 *
 * The photographs are openly-licensed Wikimedia images carried over from the
 * main site with their attribution — see `public/images/CITY-CREDITS.md`. CC BY
 * and CC BY-SA both require that credit to travel with the site, so the footer
 * links to it.
 */
export const stories: Story[] = [
  {
    "img": "/images/city-udaipur.jpg",
    "alt": "Udaipur — Rajasthan",
    "href": "/celebrations",
    "title": "Udaipur",
    "location": "Rajasthan"
  },
  {
    "img": "/images/city-jaipur.jpg",
    "alt": "Jaipur — Rajasthan",
    "href": "/celebrations",
    "title": "Jaipur",
    "location": "Rajasthan"
  },
  {
    "img": "/images/city-goa.jpg",
    "alt": "Goa — The west coast",
    "href": "/celebrations",
    "title": "Goa",
    "location": "The west coast"
  },
  {
    "img": "/images/city-indore.jpg",
    "alt": "Indore — Madhya Pradesh",
    "href": "/celebrations",
    "title": "Indore",
    "location": "Madhya Pradesh"
  },
  {
    "img": "/images/city-bangalore.jpg",
    "alt": "Bangalore — Karnataka",
    "href": "/celebrations",
    "title": "Bangalore",
    "location": "Karnataka"
  },
  {
    "img": "/images/city-khyber.jpg",
    "alt": "Khyber — Gulmarg, Kashmir",
    "href": "/celebrations",
    "title": "Khyber",
    "location": "Gulmarg, Kashmir"
  }
]
