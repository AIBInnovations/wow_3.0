'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { ScrollTrigger, registerGsap, gsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import Initial from './Initial'
import { stories } from '@/data/stories'

/**
 * Featured wedding stories. A sticky 100vh frame holds every background
 * photograph stacked on top of one another; as each title scrolls through the
 * centre of the viewport its item gains `.active`, and the stylesheet handles
 * the rest — the photo fades up from scale(1.1), the title goes from 0.3 to
 * full opacity, and only the active title accepts clicks.
 */
export default function StickyStories() {
  const wrapRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    registerGsap()

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.sticky-gallery_item')

      items.forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top center',
          end: 'bottom center',
          // onEnterBack makes the sequence run correctly in reverse too.
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        })
      })
    }, wrap)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={wrapRef} className="sticky-gallery_wrap u-vflex-center-center">
      <div className="sticky-gallery_wrapper w-dyn-list">
        <div role="list" className="sticky-gallery_list w-dyn-items">
          {stories.map((story, i) => (
            <div
              key={story.title}
              role="listitem"
              className={`sticky-gallery_item u-vflex-center-center w-dyn-item${
                i === active ? ' active' : ''
              }`}
            >
              <div className="sticky-gallery_bg_contain">
                <div className="sticky-gallery_bg_wrap">
                  <div className="div-block-29">
                    <img
                      src={story.img}
                      alt={story.alt}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className={`sticky-gallery_bg_img${i === active ? ' active' : ''}`}
                    />
                  </div>
                  {/* The destination photographs are daylight exteriors, far
                      brighter than the ceremony frames this layout was built
                      for, so the titles need the stylesheet's own scrim to sit
                      over them. Rendered for the active item only — six stacked
                      overlays would black the section out. */}
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
