import Navigation from '@/components/Navigation'
import HeroMarquee from '@/components/HeroMarquee'
import GalleryScroll from '@/components/GalleryScroll'
import HomeStatement from '@/components/home/HomeStatement'
import HomeAtelier from '@/components/home/HomeAtelier'
import HomeReels from '@/components/home/HomeReels'
import StickyStories from '@/components/StickyStories'
import CelebrationSection from '@/components/CelebrationSection'
import HomeFilms from '@/components/home/HomeFilms'
import FinalCta from '@/components/FinalCta'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="page_main">
        <HeroMarquee />
        <GalleryScroll />
        <HomeStatement />
        <HomeAtelier />
        <HomeReels />
        <StickyStories />
        <CelebrationSection />
        <HomeFilms />
        <FinalCta lead={false} />
      </main>
      <Footer />
    </>
  )
}
