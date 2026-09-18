import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import LegalPage from '@/components/legal/LegalPage'
import Footer from '@/components/Footer'
import { privacy } from '@/data/legal'
import { site } from '@/data/content'

export const metadata: Metadata = {
  title: `${privacy.title} — ${site.name}`,
  description: privacy.standfirst,
}

export default function Privacy() {
  return (
    <>
      <Navigation />
      <main className="page_main">
        <LegalPage page={privacy} />
      </main>
      <Footer />
    </>
  )
}
