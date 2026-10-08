'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineAnimation } from '@/hooks/useSplitText'
import Initial from '../Initial'
import { drawings, type DrawingName } from '../VoiceDrawings'
import { CHAPTERS, INTRO } from '@/data/celebrations'

/** Which drawing stands for which day. */
const DRAWING: Record<string, DrawingName> = {
  haldi: 'marigold',
  sangeet: 'paisley',
  wedding: 'mandap',
  beyond: 'night',
}

/**
 * The four days of a celebration, as a line that runs through them.
 *
 * No photographs: each day is a gold line drawing, its number, its name and
 * the three lines the Celebrations page opens it with. On a phone the days
 * stack and the line runs down beside them; from 992px they sit in a row and
 * the line runs across above them. The line draws itself as the section
 * scrolls; each day's drawing traces itself in, stroke by stroke, and its
 * words rise as the day reaches the screen. Each day links to its chapter.
 */
export default function HomeDays() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()

  useLineAnimation(headingRef)

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      const list = section.querySelector('.days_list')
      gsap.fromTo(
        '.days_track_fill',
        { scale: 0 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 75%', end: 'bottom 60%', scrub: 0.5 } }
      )

      gsap.utils.toArray<HTMLElement>('.days_item').forEach((item) => {
        const strokes = Array.from(item.querySelectorAll<SVGGeometryElement>('.voices-draw path, .voices-draw circle, .voices-draw ellipse'))
        strokes.forEach((el) => {
          const length = el.getTotalLength()
          gsap.set(el, { strokeDasharray: length, strokeDashoffset: length })
        })
        const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 80%', once: true } })
        tl.fromTo(item.querySelector('.days_dot'), { scale: 0 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' }, 0)
        tl.to(strokes, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.04 }, 0)
        tl.fromTo(item.querySelectorAll('.days_rise'), { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: 'power3.out', stagger: 0.08 }, 0.2)
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="dark" className="days_wrap">
      <div className="u-container days_contain">
        <div className="days_head">
          <p className="kicker">{INTRO.caption}</p>
          <h2 ref={headingRef} className="days_title" js-line-animation="">
            <Initial>Day By Day</Initial>
          </h2>
        </div>

        <ol className="days_list">
          <li className="days_track" aria-hidden="true">
            <span className="days_track_fill" />
          </li>
          {CHAPTERS.map((day) => {
            const Drawing = drawings[DRAWING[day.slug] ?? 'mandap']
            return (
              <li key={day.slug} className="days_item">
                <span className="days_dot" aria-hidden="true" />
                <Link href={`/celebrations#${day.slug}`} className="days_link">
                  <Drawing />
                  <span className="days_clip">
                    <span className="days_num days_rise">{day.numeral}</span>
                  </span>
                  <span className="days_clip">
                    <span className="days_name days_rise">{day.name}</span>
                  </span>
                  <span className="days_clip">
                    <span className="days_lines days_rise">{day.lines.join(' ')}</span>
                  </span>
                  <span className="days_clip">
                    <span className="days_more days_rise">{day.discover} →</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
