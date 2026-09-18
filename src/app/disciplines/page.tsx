import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import DisciplinesHero from '@/components/disciplines/DisciplinesHero'
import DisciplinesIndex from '@/components/disciplines/DisciplinesIndex'
import DisciplineChapter from '@/components/disciplines/DisciplineChapter'
import ChapterProgress from '@/components/disciplines/ChapterProgress'
import DisciplinesAnchor from '@/components/disciplines/DisciplinesAnchor'
import FinalCta from '@/components/FinalCta'
import Footer from '@/components/Footer'
import { site } from '@/data/content'
import { disciplines } from '@/data/disciplines'

export const metadata: Metadata = {
  title: `Disciplines — ${site.name}`,
  description:
    'Decor, guest experience, invitations, food and beverage, and entertainment — '
    + 'five disciplines, composed as one by WOW Weddings & Events.',
}

/**
 * An index that opens: five rows, then five chapters, one per discipline. The
 * chapters carry the ids the footer links to (#decor, #guest-experience,
 * #invites, #food-beverage, #entertainment).
 */
export default function Disciplines() {
  return (
    <>
      <Navigation />
      <main className="page_main">
        <DisciplinesHero />
        <DisciplinesIndex />
        {disciplines.map((discipline, i) => (
          <DisciplineChapter key={discipline.slug} discipline={discipline} next={disciplines[i + 1]} />
        ))}
        <ChapterProgress />
        <DisciplinesAnchor />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
