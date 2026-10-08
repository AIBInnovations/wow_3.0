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
 * The four days of a celebration, joined by a gold line.
 *
 * No photographs: each day is a line drawing, its number, its name and the
 * three lines the Celebrations page opens it with, all centred. On a phone the
 * days stack and a short line runs down from each to the next; from 992px they
 * sit four across, the line runs between their dots, and their rows line up
 * whatever the length of each name. Each day links to its chapter.
 *
 * As a day reaches the screen its dot appears, its drawing traces itself in
 * and its words rise. On a phone each joining line draws as it is scrolled
 * past; on a wide screen the four days arrive one after another, the line
 * reaching each in turn.
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

    const mm = gsap.matchMedia(section)
    mm.add({ wide: '(min-width: 992px)', narrow: '(max-width: 991px)' }, (context) => {
      const wide = Boolean(context.conditions?.wide)
      const days = gsap.utils.toArray<HTMLElement>('.days_item').map((item) => {
        const strokes = Array.from(item.querySelectorAll<SVGGeometryElement>('.day-draw path, .day-draw circle, .day-draw ellipse'))
        strokes.forEach((el) => {
          const length = el.getTotalLength()
          gsap.set(el, { strokeDasharray: length, strokeDashoffset: length })
        })
        const rise = item.querySelectorAll('.days_rise')
        const dot = item.querySelector('.days_dot')
        const seg = item.querySelector('.days_seg_fill')
        gsap.set(rise, { yPercent: 110 })
        gsap.set(dot, { scale: 0 })
        if (seg) gsap.set(seg, wide ? { scaleX: 0 } : { scaleY: 0 })
        return { item, strokes, rise, dot, seg }
      })

      const reveal = (tl: gsap.core.Timeline, day: (typeof days)[number], at: number) => {
        tl.to(day.dot, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, at)
        tl.to(day.strokes, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.03 }, at)
        tl.to(day.rise, { yPercent: 0, duration: 1.1, ease: 'power3.out', stagger: 0.07 }, at + 0.2)
      }

      if (wide) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: '.days_list', start: 'top 78%', once: true } })
        days.forEach((day, i) => {
          reveal(tl, day, i * 0.45)
          if (day.seg) tl.to(day.seg, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, i * 0.45 + 0.3)
        })
      } else {
        days.forEach((day) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: day.item, start: 'top 82%', once: true } })
          reveal(tl, day, 0)
          if (day.seg) {
            gsap.to(day.seg, {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: day.seg, start: 'top 88%', end: 'bottom 62%', scrub: 0.4 },
            })
          }
        })
      }
    })

    return () => mm.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="dark" className="days_wrap">
      <div className="u-container days_contain" data-padding-top="none" data-padding-bottom="none">
        <div className="days_head">
          <h2 ref={headingRef} className="days_title" js-line-animation="">
            <Initial>Day By Day</Initial>
          </h2>
          <p className="days_intro">{INTRO.caption}.</p>
        </div>

        <ol className="days_list">
          {CHAPTERS.map((day, i) => {
            const Drawing = drawings[DRAWING[day.slug] ?? 'mandap']
            return (
              <li key={day.slug} className="days_item">
                <span className="days_dot" aria-hidden="true" />
                <Link href={`/celebrations#${day.slug}`} className="days_link">
                  <span className="days_art">
                    <Drawing />
                  </span>
                  <span className="days_clip">
                    <span className="days_rise days_num">{day.numeral}</span>
                  </span>
                  <span className="days_clip">
                    <span className="days_rise days_name">{day.name}</span>
                  </span>
                  <span className="days_clip">
                    <span className="days_rise days_lines">{day.lines.join(' ')}</span>
                  </span>
                  <span className="days_clip">
                    <span className="days_rise days_more">
                      {day.discover} <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </Link>
                {i < CHAPTERS.length - 1 ? (
                  <span className="days_seg" aria-hidden="true">
                    <span className="days_seg_fill" />
                  </span>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
