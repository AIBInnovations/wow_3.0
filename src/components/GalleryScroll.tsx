'use client'

import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { galleryColumns } from '@/data/media'
import { scrollGallery } from '@/data/content'

/** Opposing photo columns and left/right copy, driven by scroll on every screen. */
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
          invalidateOnRefresh: true,
          onEnter: () => show(true),
          onLeave: () => show(false),
          onEnterBack: () => show(true),
          onLeaveBack: () => show(false),
        },
      })
      const frame = wrap.querySelector<HTMLElement>('.div-block-31')!
      wrap.querySelectorAll<HTMLElement>('._3-col-wrapper').forEach((column) => {
        const travel = () => Math.max(0, column.scrollHeight - frame.clientHeight)
        const reverse = column.classList.contains('col-1-s')
        tl.fromTo(column,
          { y: () => reverse ? -travel() : 0 },
          { y: () => reverse ? 0 : -travel(), ease: 'none' }, 0)
      })
      // Start only once the frame pins. Both blocks travel straight upward.
      gsap.fromTo(['.home-gal_copy-left', '.home-gal_copy-right'],
        { y: () => frame.clientHeight * 0.12 },
        {
          y: () => -frame.clientHeight * 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      tl.fromTo('.home-gal_scroll-indicator', { width: '0%' },
        { width: '100%', ease: 'none' }, 0)
    }, wrap)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={wrapRef} data-theme="dark" className="home-gal_wrap" aria-label="Immersive celebrations">
      <div className="home-gal_fade-trigger">
        <div className="div-block-31">
          <div className="u-container home-gal_contain" data-padding-top="main" data-padding-bottom="main">
            <div className="home-gal_grid u-gap-main">
              {galleryColumns.map((col, i) => (
                <div key={i} className={col.className}>
                  {col.images.map((img, j) => (
                    <div key={j} className="grid-child">
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        className={`grid-img${img.mono ? ' is-mono' : ''}`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="home-gal_scrim" aria-hidden="true" />
          <div className="home-gal_copy">
            <h2 className="home-gal_copy-left">{scrollGallery.left}</h2>
            <div className="home-gal_copy-right">
              <p className="home-gal_copy-title">{scrollGallery.right}</p>
              <p className="home-gal_copy-note">{scrollGallery.note}</p>
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
