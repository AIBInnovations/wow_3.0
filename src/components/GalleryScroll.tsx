'use client'

import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { galleryColumns } from '@/data/media'

/**
 * A 200vh section with a sticky 100vh frame holding three photo columns.
 *
 * Nothing here moves on its own. The columns are driven entirely by scroll,
 * across the whole time the section is on screen — from its top entering at the
 * bottom of the viewport to its bottom leaving at the top:
 *
 *   outer columns   -190vw → 70vw    linear       (they travel down)
 *   middle column      0vw → -170vw  sine.inOut   (it travels up)
 *   progress bar        0% → 120%    linear
 *
 * Travelling in opposite directions at different rates is what makes the grid
 * read as depth. The bar is fixed to the viewport and only shown while the
 * section is in range, and the whole frame fades out as the section ends.
 */
export default function GalleryScroll() {
  const wrapRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      const bar = wrap.querySelector('.home-gal_scroll-bar')
      const show = (on: boolean) => bar?.classList.toggle('show', on)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onEnter: () => show(true),
          onLeave: () => show(false),
          onEnterBack: () => show(true),
          onLeaveBack: () => show(false),
        },
      })
      tl.fromTo('.col-1-s', { y: '-190vw' }, { y: '70vw', ease: 'none' }, 0)
      tl.fromTo('.col-s-2', { y: '0vw' }, { y: '-170vw', ease: 'sine.inOut' }, 0)
      tl.fromTo('.home-gal_scroll-indicator', { width: '0%' }, { width: '120%', ease: 'none' }, 0)

      gsap.to('.home-gal_fade-trigger', {
        opacity: 0,
        scrollTrigger: {
          trigger: '.home-gal_fade-trigger',
          start: 'bottom 80%',
          end: 'bottom 30%',
          scrub: true,
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

      <div className="home-gal_scroll-bar" aria-hidden="true">
        <div className="home-gal_scroll-progress-wrap">
          <div className="home-gal_scroll-indicator" />
        </div>
      </div>
    </section>
  )
}
