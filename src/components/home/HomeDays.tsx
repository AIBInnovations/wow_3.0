'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineAnimation } from '@/hooks/useSplitText'
import Initial from '../Initial'
import { CHAPTERS, INTRO } from '@/data/celebrations'
import { lib, type LibraryName } from '@/data/library'

/**
 * Day by day: the four days of a celebration as one editorial spread.
 *
 * A page from the studio's own deck: a wine ground with a giant script D
 * faint behind it, the head at the top left, then the
 * four days as photographic plates of different sizes, set off the grid's
 * centre line and overlapping, each with a numbered card laid over the foot of
 * its photograph. One gold thread runs from the head through the four numbers
 * in order, so the spread reads as four days composed as one celebration; it
 * draws itself as the section is scrolled.
 *
 * The photographs are the rooms and the light, not the couple: the studio
 * keeps its clients' identities private.
 *
 * Wide screens set the plates on a 12-column grid (see styles: .dbd). Below
 * 1100px it recomposes into one column, the plates alternating left and right
 * with each card over its photograph's foot, and the thread snakes between
 * them. Each plate links to its chapter on the Celebrations page.
 */

type Plate = { photo: LibraryName; alt: string }

/** One photograph for each day, in chapter order. */
const PLATES: Record<string, Plate> = {
  haldi: { photo: 'marigold-pots', alt: 'Terracotta urns of yellow flowers against a sandstone wall' },
  sangeet: { photo: 'stage-dancers', alt: 'The sangeet stage under crossing beams of light' },
  wedding: { photo: 'rose-arch', alt: 'An arch of red roses over the aisle to the palace' },
  beyond: { photo: 'red-archway', alt: 'A carved archway lit red for the night' },
}

/**
 * A smooth path through the points, arriving at each from above. It leaves
 * each point downward, except the first when the next lies to its right: the
 * thread then runs on from the head's rule, sideways, so it never cuts back
 * across the title beneath it.
 */
function threadPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const pull = Math.max(60, Math.abs(b.y - a.y) * 0.55)
    const sideways = i === 1 && b.x - a.x > 40
    const c1 = sideways ? `${a.x + (b.x - a.x) * 0.85} ${a.y}` : `${a.x} ${a.y + pull}`
    d += ` C ${c1}, ${b.x} ${b.y - pull}, ${b.x} ${b.y}`
  }
  return d
}

export default function HomeDays() {
  const sectionRef = useRef<HTMLElement>(null)
  const spreadRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()

  useLineAnimation(headingRef)

  // The thread: measured from where the head's rule ends and where each
  // number's mark sits, and redrawn whenever the spread changes size.
  useIsomorphicLayoutEffect(() => {
    const spread = spreadRef.current
    const path = pathRef.current
    const svg = svgRef.current
    if (!spread || !path || !svg) return

    const draw = () => {
      const box = spread.getBoundingClientRect()
      const at = (el: Element, edge: 'right' | 'centre') => {
        const r = el.getBoundingClientRect()
        return { x: (edge === 'right' ? r.right : r.left + r.width / 2) - box.left, y: r.top + r.height / 2 - box.top }
      }
      const start = spread.querySelector('.dbd_rule')
      const head = spread.querySelector('.dbd_head')
      const marks = Array.from(spread.querySelectorAll('.dbd_mark'))
      const points = [...(start ? [at(start, 'right')] : []), ...marks.map((m) => at(m, 'centre'))]
      // Where the first day sits below the head rather than beside it (one
      // column, or two), the thread would fall straight through the intro.
      // It runs out along the rule to the margin first, down past the head
      // there, and only then across to the first day.
      if (start && head && marks[0] && points.length > 1 && points[1].x < points[0].x + 40) {
        const pad = parseFloat(getComputedStyle(spread).paddingRight) || 16
        const below = head.getBoundingClientRect().bottom - box.top + 12
        points.splice(1, 0, { x: box.width - pad / 2, y: below })
      }
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`)
      path.setAttribute('d', threadPath(points))
      const length = path.getTotalLength()
      path.style.strokeDasharray = `${length}`
      path.dataset.length = `${length}`
      if (reduced) path.style.strokeDashoffset = '0'
    }

    draw()
    const ro = new ResizeObserver(() => {
      draw()
      ScrollTrigger.refresh()
    })
    ro.observe(spread)
    return () => ro.disconnect()
  }, [reduced])

  // The reveal.
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    const path = pathRef.current
    if (!section || !path || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      gsap.from('.dbd_eyebrow, .dbd_lede', {
        y: 24,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.dbd_head', start: 'top 80%', once: true },
      })

      // The thread follows the scroll from the head to the last number.
      gsap.fromTo(
        path,
        { strokeDashoffset: () => Number(path.dataset.length ?? 0) },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.dbd_spread',
            start: 'top 65%',
            end: 'bottom 85%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      )

      gsap.utils.toArray<HTMLElement>('.dbd_plate').forEach((plate) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: plate, start: 'top 85%', once: true } })
        // The photograph wipes up out of its frame while the image settles.
        tl.fromTo(
          plate.querySelector('.dbd_photo'),
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.inOut' },
          0
        )
        tl.from(plate.querySelector('.dbd_img'), { scale: 1.18, duration: 1.9, ease: 'power3.out' }, 0)
        tl.from(plate.querySelector('.dbd_card'), { y: 48, autoAlpha: 0, duration: 1.1, ease: 'power3.out' }, 0.45)
        tl.from(plate.querySelector('.dbd_mark'), { scale: 0, duration: 0.6, ease: 'back.out(3)' }, 0.7)
      })

      // On a wide screen each photograph drifts a little against its frame.
      gsap.matchMedia().add('(min-width: 1100px)', () => {
        gsap.utils.toArray<HTMLElement>('.dbd_drift').forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
        })
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="dark" className="dbd" aria-labelledby="dbd-title">
      <div ref={spreadRef} className="dbd_spread">
        <span className="dbd_mono" aria-hidden="true">
          D
        </span>
        <svg ref={svgRef} className="dbd_thread" aria-hidden="true" preserveAspectRatio="none">
          <path ref={pathRef} className="dbd_thread_path" />
        </svg>

        <header className="dbd_head">
          <p className="dbd_eyebrow">
            The celebration · Four days
            <span className="dbd_rule" aria-hidden="true" />
          </p>
          <h2 id="dbd-title" ref={headingRef} className="dbd_title" js-line-animation="">
            <Initial>Day By Day</Initial>
          </h2>
          <p className="dbd_lede">{INTRO.text}</p>
        </header>

        <ol className="dbd_plates">
          {CHAPTERS.map((day) => {
            const plate = PLATES[day.slug]
            const photo = lib(plate.photo)
            const portrait = photo.h > photo.w
            return (
              <li key={day.slug} className={`dbd_plate dbd_plate--${day.slug}`}>
                <Link href={`/celebrations#${day.slug}`} className="dbd_link">
                  <span className={`dbd_photo${portrait ? ' is-portrait' : ''}`}>
                    <span className="dbd_drift">
                      <img
                        className="dbd_img"
                        src={photo.src800}
                        srcSet={`${photo.src800} ${photo.w800}w, ${photo.src} ${photo.w}w`}
                        sizes="(min-width: 1100px) 45vw, 86vw"
                        width={photo.w}
                        height={photo.h}
                        alt={plate.alt}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                  </span>
                  <span className="dbd_card">
                    <span className="dbd_num">
                      <span className="dbd_mark" aria-hidden="true" />
                      {day.numeral}
                    </span>
                    <h3 className="dbd_name">{day.name}</h3>
                    <span className="dbd_lines">{day.lines.join(' ')}</span>
                    <span className="dbd_more">
                      {day.discover}{'\u00a0'}<span aria-hidden="true">→</span>
                    </span>
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
