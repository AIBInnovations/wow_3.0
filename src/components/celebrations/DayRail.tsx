'use client'

import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Frame from './Frame'
import { CHAPTERS } from '@/data/celebrations'

/**
 * The four days, side by side.
 *
 * Four wide frames sit in one overflowing row. From tablet up the section pins
 * for as long as the row is wider than the viewport, and the page's vertical
 * scroll carries the row sideways, so the celebration is read in the order it
 * happens. Each frame links to its chapter. On a phone the row is a plain
 * vertical stack and nothing pins.
 *
 * The frames wipe up out of a bottom clip as the rail arrives, a beat apart.
 */
export default function DayRail() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    registerGsap()

    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>('.cel-rail_day .cel-frame')
      if (reduced) {
        gsap.set(frames, { clipPath: 'inset(0% 0 0 0)' })
        return
      }

      frames.forEach((frame, i) => {
        gsap.fromTo(
          frame,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: frame, start: 'top 85%' },
          }
        )
      })

      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        const track = section.querySelector<HTMLElement>('.cel-rail_track')
        if (!track) return
        const overflow = () => Math.max(0, track.offsetWidth - window.innerWidth)
        gsap.to(track, {
          xPercent: () => (-100 * overflow()) / track.offsetWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${overflow()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="inherit" className="cel-rail" aria-label="The four days">
      <div className="cel-rail_track">
        {CHAPTERS.map((chapter) => (
          <a key={chapter.slug} href={`#${chapter.slug}`} className="cel-rail_day">
            <Frame
              photo={chapter.photos.rail}
              alt={chapter.name}
              className="cel-rail_frame"
              sizes="(max-width: 767px) 100vw, 105vh"
            />
            <div className="cel-rail_scrim" />
            <div className="cel-rail_caption">
              <span className="cel-rail_num">{chapter.numeral}</span>
              <span className="cel-rail_text">
                <span className="cel-rail_name">{chapter.name}</span>
                <span className="cel-label cel-rail_discover">{chapter.discover}</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
