import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import InfiniteGallery from '@/components/gallery/InfiniteGallery'
import { site } from '@/data/content'

export const metadata: Metadata = {
  title: `Gallery — ${site.name}`,
  description:
    'Photographs from the studio\'s celebrations — the rooms, the installations and '
    + 'the details, by event: arrival, sufi night, mehendi, haldi, sangeet, wedding '
    + 'and the rest.',
}

/**
 * The gallery: an endless, evenly aligned grid of photographs the reader pans
 * through in any direction, filtered by event from the bar at the top (see
 * InfiniteGallery).
 *
 * Deliberately without the closing band and the footer. The plane is fixed to
 * the viewport and owns the wheel — this page has no vertical scroll to give
 * them — so, as on the main site, the gallery is the whole screen. The site
 * header stays on top of it.
 */
export default function Gallery() {
  return (
    <>
      <Navigation />
      <main className="page_main">
        <h1 className="gal__title">Gallery</h1>
        <InfiniteGallery />
      </main>
    </>
  )
}
