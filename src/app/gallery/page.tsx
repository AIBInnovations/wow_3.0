import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import InfiniteGallery from '@/components/gallery/InfiniteGallery'
import { site } from '@/data/content'

export const metadata: Metadata = {
  title: `Gallery — ${site.name}`,
  description:
    'Photographs from the studio\'s celebrations — the décor, the stages and '
    + 'entertainment, the moments, the details and the venues.',
}

/**
 * The gallery: an endless, evenly aligned grid of every photograph, which the
 * reader pans through in any direction (see InfiniteGallery). The page's h1 is
 * the title in the gallery's own bar.
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
        <InfiniteGallery />
      </main>
    </>
  )
}
