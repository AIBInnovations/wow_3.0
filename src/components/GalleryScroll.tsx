'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { galleryColumns } from '@/data/media'

/**
 * A 200vh section whose inner frame is sticky for its full height. While it is
 * pinned the three photo columns travel vertically at different rates — the
 * outer pair rise, the middle column falls — and a progress bar tracks how far
 * through the section the viewer is.
 */
export default function GalleryScroll() {
  const wrapRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      const columns = gsap.utils.toArray<HTMLElement>('._3-col-wrapper')

      // Each column overflows its 100vh frame; this is how far it can travel.
      const travel = (col: HTMLElement) => Math.max(col.scrollHeight - window.innerHeight, 0)

      columns.forEach((col, i) => {
        const middle = i === 1
        gsap.fromTo(
          col,
          { y: middle ? () => -travel(col) : 0 },
          {
            y: middle ? 0 : () => -travel(col),
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        )
      })

      // Progress bar: visible only while the section is on screen.
      ScrollTrigger.create({
        trigger: wrap,
        start: 'top top',
        end: 'bottom bottom',
        onToggle: ({ isActive }) => barRef.current?.classList.toggle('show', isActive),
        onUpdate: ({ progress }) => {
          if (indicatorRef.current) {
            indicatorRef.current.style.width = `${progress * 100}%`
          }
        },
      })
    }, wrap)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={wrapRef} data-theme="inherit" className="home-gal_wrap">
      <div className="home-gal_fade-trigger">
        <div className="div-block-31">
          <div className="u-container home-gal_contain" data-padding-top="main" data-padding-bottom="main">
            <div className="home-gal_grid u-gap-main">
              {galleryColumns.map((col, i) => (
                <div key={i} className={col.className}>
                  {col.images.map((img, j) => (
                    <div key={j} className="grid-child">
                      <img src={img.src} alt={img.alt} loading="lazy" className="grid-img" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div ref={barRef} className="home-gal_scroll-bar" aria-hidden="true">
        <div className="home-gal_scroll-progress-wrap">
          <div ref={indicatorRef} className="home-gal_scroll-indicator" />
        </div>
      </div>
    </section>
  )
}
