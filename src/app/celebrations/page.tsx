import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import CelebrationsHero from '@/components/celebrations/CelebrationsHero'
import DayRail from '@/components/celebrations/DayRail'
import Chapter from '@/components/celebrations/Chapter'
import AlsoCompose from '@/components/celebrations/AlsoCompose'
import FinalCta from '@/components/FinalCta'
import Footer from '@/components/Footer'
import { site } from '@/data/content'
import { CHAPTERS, INTRO } from '@/data/celebrations'

export const metadata: Metadata = {
  title: `Celebrations — ${site.name}`,
  description: `${INTRO.caption}. ${INTRO.text}`,
}

export default function Celebrations() {
  return (
    <>
      <Navigation />
      <main className="page_main">
        <CelebrationsHero />
        <DayRail />
        {CHAPTERS.map((chapter, i) => (
          <Chapter key={chapter.slug} chapter={chapter} index={i} />
        ))}
        <AlsoCompose />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
