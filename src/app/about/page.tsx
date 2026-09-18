import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import AboutHero from '@/components/about/AboutHero'
import AboutDetails from '@/components/about/AboutDetails'
import AboutLetters from '@/components/about/AboutLetters'
import AboutDestinations from '@/components/about/AboutDestinations'
import FinalCta from '@/components/FinalCta'
import Footer from '@/components/Footer'
import { site } from '@/data/content'

export const metadata: Metadata = {
  title: `About — ${site.name}`,
  description:
    'The atelier behind WOW Weddings & Events: a founder’s philosophy, a design '
    + 'ideology of atmosphere over spectacle, and celebrations composed with intention.',
}

export default function About() {
  return (
    <>
      <Navigation />
      <main className="page_main">
        <AboutHero />
        <AboutDetails />
        <AboutLetters />
        <AboutDestinations />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
