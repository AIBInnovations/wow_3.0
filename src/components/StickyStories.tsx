'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import Initial from './Initial'
import { stories } from '@/data/stories'

/**
 * Destinations over a sticky full-viewport frame.
 *
 * Only the item is ever marked active — never its image — so the stylesheet
 * shows the active photograph at 0.7 opacity, still at its resting 1.1 scale,
 * and lifts that item's title from 0.3 to full.
 *
 * There is always exactly one photograph on show. The first is active from the
 * moment the page renders, so it is already there when the band scrolls up —
 * nothing fades in under the reader. After that:
 *   entering an item from either direction   → that item
 *   leaving upward                            → the one before it
 * and nothing ever clears it. Clearing on the way out used to leave the frame
 * empty between two destinations, and blank again above the first.
 *
 * The change is a cut, not a fade: the stylesheet takes the photographs' opacity
 * transition away, so one destination simply replaces the next.
 *
 * Hovering the active title turns it brand-coloured and drains the photograph
 * behind it to half-brightness greyscale. The band itself holds full opacity
 * throughout — see the note where the source site's fade used to be.
 */
export default function StickyStories() {
  const wrapRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  // Fetch and decode every photograph up front. Lazily loaded, a photo only arrived
  // once its item was reached, so it appeared late — faded in by the opacity
  // transition rather than simply being there.
  useEffect(() => {
    for (const story of stories) {
      const img = new Image()
      img.src = story.img
      img.decode?.().catch(() => {})
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    registerGsap()

    const brand = getComputedStyle(document.documentElement).getPropertyValue('--swatch--brand').trim()
    const cleanups: Array<() => void> = []

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.sticky-gallery_item')

      items.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
          // Back past the top of the first, the first simply stays.
          onLeaveBack: () => setActive(Math.max(0, i - 1)),
        })

        const title = item.querySelector<HTMLElement>('.sticky-gallery_title_wrap')
        const bg = item.querySelector<HTMLElement>('.sticky-gallery_bg_wrap')
        if (title && bg) {
          const enter = () => {
            title.style.color = brand
            bg.style.filter = 'saturate(0) brightness(50%)'
          }
          const leave = () => {
            title.style.color = ''
            bg.style.filter = ''
          }
          title.addEventListener('mouseenter', enter)
          title.addEventListener('mouseleave', leave)
          cleanups.push(() => {
            title.removeEventListener('mouseenter', enter)
            title.removeEventListener('mouseleave', leave)
          })
        }
      })

      // The source site put `fadetrig` on this section over its last screen,
      // taking it to opacity 0 while four fifths of it were still in view. Left
      // off: a whole band of destinations dissolving under the reader is the
      // "sections disappearing" fault, not an effect.
    }, wrap)

    return () => {
      cleanups.forEach((fn) => fn())
      ctx.revert()
    }
  }, [])

  return (
    <section ref={wrapRef} id="stickygal" className="sticky-gallery_wrap u-vflex-center-center">
      <div className="sticky-gallery_wrapper w-dyn-list">
        <div role="list" className="sticky-gallery_list w-dyn-items">
          {stories.map((story, i) => (
            <div
              key={story.title}
              role="listitem"
              className={`sticky-gallery_item u-vflex-center-center w-dyn-item${i === active ? ' active' : ''}`}
            >
              <div className="sticky-gallery_bg_contain">
                <div className="sticky-gallery_bg_wrap">
                  <div className="div-block-29">
                    <img
                      src={story.img}
                      alt={story.alt}
                      loading="eager"
                      decoding="async"
                      fetchPriority={i === 0 ? 'high' : 'auto'}
                      className="sticky-gallery_bg_img"
                    />
                  </div>
                </div>
              </div>

              <Link
                href={story.href}
                className="sticky-gallery_title_wrap text-align-center w-inline-block"
                tabIndex={i === active ? 0 : -1}
              >
                <h2 className="sticky-gallery_title_name u-text-h1">
                  <Initial>{story.title}</Initial>
                </h2>
                <div className="sticky-gallery_title_name date kicker">{story.location}</div>
                <p className="sticky-gallery_title_name sticky-gallery_line">{story.line}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
