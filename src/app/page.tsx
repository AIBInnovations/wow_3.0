import Navigation from '@/components/Navigation'
import HeroMarquee from '@/components/HeroMarquee'
import GalleryScroll from '@/components/GalleryScroll'
import TallImage from '@/components/TallImage'
import HomeAtelier from '@/components/home/HomeAtelier'
import Voices from '@/components/Voices'
import HomeStats from '@/components/home/HomeStats'
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
        <TallImage />
        <HomeAtelier />
        <Voices />
        <StickyStories />
        <CelebrationSection />
        <HomeFilms />
        <HomeStats />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
