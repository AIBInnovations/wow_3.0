import Navigation from '@/components/Navigation'
import HeroMarquee from '@/components/HeroMarquee'
import GalleryScroll from '@/components/GalleryScroll'
import TallImage from '@/components/TallImage'
import Voices from '@/components/Voices'
import StickyStories from '@/components/StickyStories'
import CelebrationSection from '@/components/CelebrationSection'
import FinalCta from '@/components/FinalCta'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="page_main">
        <HeroMarquee />
        <GalleryScroll />
        <TallImage />
        <Voices />
        <StickyStories />
        <CelebrationSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
