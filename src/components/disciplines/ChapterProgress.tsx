'use client'

import { useState } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { disciplines } from '@/data/disciplines'
import { scrollToChapter } from './scrollToChapter'

/**
 * Chapter progress, fixed to the right edge on desktop.
 *
 * Five numerals, one per chapter; the one whose chapter holds the viewport's
 * centre is lit. The column shows itself only while the chapters are on screen
 * and hides again for the closing band. Each numeral scrolls to its chapter.
 *
 * Rendered directly under <main>: `.u-container` carries layout containment,
 * which would pin a fixed element to it.
 */
export default function ChapterProgress() {
  const [active, setActive] = useState<number | null>(null)
  const [shown, setShown] = useState(false)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    registerGsap()
    const chapters = disciplines
      .map((d) => document.getElementById(d.slug))
      .filter((el): el is HTMLElement => el !== null)
    if (!chapters.length) return

    const ctx = gsap.context(() => {
      chapters.forEach((chapter, i) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) setActive(i)
          },
        })
      })
      ScrollTrigger.create({
        trigger: chapters[0],
        endTrigger: chapters[chapters.length - 1],
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => setShown(self.isActive),
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <nav className={`disc-progress${shown ? ' is-shown' : ''}`} aria-label="Chapters">
      {disciplines.map((d, i) => (
        <button
          key={d.slug}
          type="button"
          className={`disc-progress_btn${active === i ? ' is-active' : ''}`}
          onClick={() => scrollToChapter(d.slug, !reduced)}
          aria-label={`${d.number} ${d.name}`}
          aria-current={active === i ? 'true' : undefined}
        >
          <span className="disc-progress_num">{d.number}</span>
          <span className="disc-progress_rule" aria-hidden="true" />
        </button>
      ))}
    </nav>
  )
}
