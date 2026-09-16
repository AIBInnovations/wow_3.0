import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider'
import { site } from '@/data/content'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body data-theme="dark">
        <SmoothScrollProvider>
          <div className="page_wrap">{children}</div>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
