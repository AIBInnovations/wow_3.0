'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
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
 * Which item is active, as the page scrolls:
 *   entering an item from either direction   → that item, alone
 *   leaving downward                          → cleared, unless it is the last
 *   leaving upward                            → the one before it
 *   scrolling back above the first            → the first, always
 *
 * Hovering the active title turns it brand-coloured and drains the photograph
 * behind it to half-brightness greyscale. The whole section fades out once its
 * bottom reaches 80% of the viewport, and back in on the way up.
 */
export default function StickyStories() {
  const wrapRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState<number | null>(0)

  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    registerGsap()

    const brand = getComputedStyle(document.documentElement).getPropertyValue('--swatch--brand').trim()
    const cleanups: Array<() => void> = []

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.sticky-gallery_item')
      const last = items.length - 1

      items.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
          onLeave: () => {
            if (i < last) setActive((cur) => (cur === i ? null : cur))
          },
          onLeaveBack: () => {
            if (i > 0) setActive(i - 1)
          },
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

      if (items[0]) {
        ScrollTrigger.create({
          trigger: items[0],
          start: 'top top',
          end: 'bottom center',
          onLeaveBack: () => setActive(0),
        })
      }

      ScrollTrigger.create({
        trigger: wrap,
        start: 'bottom 80%',
        end: 'bottom top',
        onEnter: () => wrap.classList.add('fadetrig'),
        onLeave: () => wrap.classList.remove('fadetrig'),
        onEnterBack: () => wrap.classList.add('fadetrig'),
        onLeaveBack: () => wrap.classList.remove('fadetrig'),
      })
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
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className="sticky-gallery_bg_img"
                    />
                  </div>
                  {/* The destination photographs are bright daylight exteriors;
                      at 0.7 opacity alone the titles wash out over them. The
                      stylesheet's own overlay restores contrast. Active item
                      only — six stacked overlays would black the section out.
                      This is a legibility layer and changes no timing. */}
                  {i === active && <div className="sticky-gallery_bg_overlay" />}
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
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
