import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider'
import { site } from '@/data/content'
import EnquiryForm from '@/components/EnquiryForm'

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    locale: 'en',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

/**
 * Locks the page's viewport units on touch devices (see styles/viewport.css).
 *
 * Runs before the first paint. It measures the screen as the page opens — the
 * browser's bars are showing then — and again only when the width changes, so
 * the bars sliding in and out during a scroll never resizes a section.
 *
 * --vh-s is the screen with the bars showing: the window height now.
 * --vh-l is the screen with the bars hidden. The window cannot report that
 * while the bars are showing, so it is the height now plus the most the bars
 * take up, never more than the device's screen; a backdrop sized from it
 * always covers.
 */
const stableViewport = `(function () {
  var root = document.documentElement;
  if (!window.matchMedia || !matchMedia('(hover: none), (pointer: coarse)').matches) return;
  var width = 0;
  function measure() {
    if (window.innerWidth === width) return;
    width = window.innerWidth;
    var small = window.innerHeight;
    var landscape = window.innerWidth > window.innerHeight;
    var a = screen.width, b = screen.height;
    var screenH = landscape ? Math.min(a, b) : Math.max(a, b);
    // The bars are at most about 120px (Safari's two bars; Brave and Chrome less).
    var large = Math.max(small, Math.min(screenH, small + 120));
    root.style.setProperty('--vh-s', small / 100 + 'px');
    root.style.setProperty('--vh-l', large / 100 + 'px');
  }
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('orientationchange', function () { width = 0; setTimeout(measure, 300); });
})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: stableViewport }} />
      </head>
      <body data-theme="dark">
        <SmoothScrollProvider>
          <div className="page_wrap">{children}</div>
          <EnquiryForm />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
