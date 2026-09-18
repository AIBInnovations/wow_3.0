import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import LegalPage from '@/components/legal/LegalPage'
import Footer from '@/components/Footer'
import { terms } from '@/data/legal'
import { site } from '@/data/content'

export const metadata: Metadata = {
  title: `${terms.title} — ${site.name}`,
  description: terms.standfirst,
}

export default function Terms() {
  return (
    <>
      <Navigation />
      <main className="page_main">
        <LegalPage page={terms} />
      </main>
      <Footer />
    </>
  )
}
