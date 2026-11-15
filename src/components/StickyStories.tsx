'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import Initial from './Initial'
import { stories } from '@/data/stories'

/** Destinations crossfade over a shared sticky frame as their titles reach center. */
export default function StickyStories() {
  const wrapRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  // Load and decode every photograph ahead of the crossfades, so each one has
  // a ready image beneath it — but only once the section is about two screens
  // away, not with the page, and at the size each image will actually show
  // (its srcset picks 960px on a phone).
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        wrap.querySelectorAll<HTMLImageElement>('.sticky-gallery_bg_img').forEach((img) => {
          img.loading = 'eager'
          img.decode?.().catch(() => {})
        })
      },
      { rootMargin: '200% 0px' }
    )
    io.observe(wrap)
    return () => io.disconnect()
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
                    {/* Lazy: the section sits far down the home page, and the
                        browser still fetches each photograph well before it
                        scrolls into view. Phones take the 960px file. */}
                    <img
                      src={story.img}
                      srcSet={`${story.img.replace(/\.webp$/, '-960.webp')} 960w, ${story.img} 1920w`}
                      sizes="100vw"
                      alt={story.alt}
                      loading="lazy"
                      decoding="async"
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
