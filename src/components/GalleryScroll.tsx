'use client'

import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ambience } from '@/data/media'
import { scrollGallery } from '@/data/content'

/**
 * One silent film behind the left and right copy: the venues, the décor and
 * the light, cut from the show reel. It scrolls with the page; the words rise
 * through it in parallax.
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
          invalidateOnRefresh: true,
          onEnter: () => show(true),
          onLeave: () => show(false),
          onEnterBack: () => show(true),
          onLeaveBack: () => show(false),
        },
      })
      const frame = wrap.querySelector<HTMLElement>('.div-block-31')!
      // The film drifts a little slower than the page, under the words.
      tl.fromTo('.home-gal_video', { yPercent: -6 }, { yPercent: 6, ease: 'none' }, 0)
      // Parallax: the words rise through the frame faster than the page, for
      // as long as any of the band is on screen. Nothing pins.
      gsap.fromTo(['.home-gal_copy-left', '.home-gal_copy-right'],
        { y: () => frame.clientHeight * 0.25 },
        {
          y: () => -frame.clientHeight * 0.25,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top bottom',
            end: 'bottom top',
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
          <div className="home-gal_media">
            <video
              className="home-gal_video"
              src={ambience.video}
              poster={ambience.poster}
              autoPlay={!reduced}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
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
