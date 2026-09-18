'use client'

import { useEffect } from 'react'
import { ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useFontsReady } from '@/hooks/useFontsReady'
import { scrollToChapter } from './scrollToChapter'

/**
 * Lands an anchor link — /disciplines#invites and its four siblings — on its
 * chapter.
 *
 * The browser jumps to the hash before the faces have loaded, and the type
 * above the target reflows once they do, so the first landing is off by however
 * much the reflow moved things. Once the fonts are ready the jump is made
 * again, instantly, and ScrollTrigger re-measures from the new position.
 */
export default function DisciplinesAnchor() {
  const fontsReady = useFontsReady()

  useEffect(() => {
    if (!fontsReady) return
    const slug = window.location.hash.slice(1)
    if (!slug || !document.getElementById(slug)) return

    registerGsap()
    // One frame for the re-measured layout to paint before the jump.
    const timer = window.setTimeout(() => {
      scrollToChapter(slug, false)
      ScrollTrigger.refresh()
    }, 50)
    return () => window.clearTimeout(timer)
  }, [fontsReady])

  return null
}
