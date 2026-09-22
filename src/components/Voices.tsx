'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerGsap, EASE } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { voices } from '@/data/voices'
import { voicesMarquee } from '@/data/content'
import { ArrowSlider } from './svg'

/**
 * The celebrations band.
 *
 * - Desktop retains the side-by-side composition and running headline.
 * - Mobile layers the arch over the large photograph, with upward portrait
 *   drift and oversized type moving left to right as the section scrolls.
 * - Slides change instantly — no crossfade. What reads as the transition is the
 *   incoming slide's own entrance: its portrait fades in while settling from 1.1
 *   to 1, its name rises from below, and the large photograph settles from 1.1.
 * - The arch sits centred in the column; the couple's name lives in the controls
 *   row at the foot, between the two arrows.
 * - The first slide's photograph is wiped in from the right, over 2s, the first
 *   time the band reaches mid-viewport, and wiped back out if you scroll above.
 * - Arrows, arrow keys and horizontal swipes all change slide; it loops.
 */
export default function Voices() {
  const [index, setIndex] = useState(0)
  const rootRef = useRef<HTMLElement>(null)
  const slidesRef = useRef<HTMLDivElement[]>([])
  const firstRun = useRef(true)
  const reduced = useReducedMotion()
  const count = voices.length

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count])

  // Incoming slide's entrance.
  useEffect(() => {
    registerGsap()
    const slide = slidesRef.current[index]
    if (!slide || reduced) return

    const q = gsap.utils.selector(slide)
    const portrait = q('.testimonial1_slider_img')
    const names = q('.testimonial1_slider_name')
    const photo = q('.testimonial1_slider_right_image')

    // The page opens on slide one already composed; only a real change animates.
    if (firstRun.current) {
      firstRun.current = false
      gsap.set(photo, { scale: 1.1 })
      gsap.to(photo, { scale: 1, duration: 1, ease: EASE.outQuad })
      return
    }

    const tl = gsap.timeline()
    tl.fromTo(portrait, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'none' }, 0)
    tl.fromTo(portrait, { scale: 1.1 }, { scale: 1, duration: 1, ease: EASE.outQuad }, 0)
    tl.fromTo(names, { yPercent: 107 }, { yPercent: 0, duration: 1, ease: EASE.inOutQuad }, 0)
    tl.fromTo(names, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'none' }, 0)
    tl.fromTo(photo, { scale: 1.1 }, { scale: 1, duration: 1, ease: EASE.outQuad }, 0)

    return () => {
      tl.kill()
    }
  }, [index, reduced])

  // Desktop photo reveal; mobile overlapping portrait and scroll-driven type.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    registerGsap()

    const media = gsap.matchMedia()
    const ctx = gsap.context(() => {
      media.add('(min-width: 768px)', () => {
        const wrap = root.querySelector('.testimonial1_slider_wrap')
        const visual = root.querySelector('.testimonial1_slider_right_visual_wrap')
        if (wrap && visual) {
          gsap.set(visual, { clipPath: 'inset(0 0 0 100%)' })
          const wipe = gsap.timeline({ paused: true, defaults: { duration: 2, ease: 'power2.out' } })
          wipe.to(visual, { clipPath: 'inset(0 0 0 0%)' })
          ScrollTrigger.create({
            trigger: wrap,
            start: 'top 50%',
            onEnter: () => wipe.play(),
            onLeaveBack: () => wipe.reverse(),
          })
        }
      })
      media.add('(max-width: 767px)', () => {
        gsap.fromTo('.voices-scroll-text', { xPercent: -35 }, {
          xPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        gsap.fromTo('.testimonial1_slider_img_wrap', { y: 32 }, {
          y: -24,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    }, root)

    return () => {
      media.revert()
      ctx.revert()
    }
  }, [reduced])

  // Horizontal swipe on touch and pen.
  const swipeX = useRef<number | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') swipeX.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeX.current === null) return
    const dx = e.clientX - swipeX.current
    swipeX.current = null
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  }

  return (
    <section ref={rootRef} data-theme="inherit" className="testimonial1_wrap">
      <div className="kind-words_wrap" aria-hidden="true">
        {[0, 1].map((panel) => (
          <div key={panel} className="kind-words_panel">
            <h3 className="testimonial1_slider_left_text">{voicesMarquee}</h3>
          </div>
        ))}
      </div>

      <div className="u-container testimonial1_contain" data-padding-top="main" data-padding-bottom="main">
        <div className="testimonial1_slider_wrap">
          <div
            className="testimonial1_slider_component w-slider"
            role="region"
            aria-roledescription="carousel"
            aria-label="WOW celebrations"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') go(-1)
              if (e.key === 'ArrowRight') go(1)
            }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <div className="testimonial1_slider_mask w-slider-mask">
              {voices.map((t, i) => {
                const current = i === index
                return (
                  <div
                    key={t.portrait}
                    ref={(el) => {
                      if (el) slidesRef.current[i] = el
                    }}
                    className="testimonial1_slider_slide w-slide"
                    role="group"
                    aria-label={`${i + 1} of ${count}`}
                    aria-hidden={!current}
                    style={{
                      // Instant change: the entrance above is the only transition.
                      visibility: current ? 'visible' : 'hidden',
                      position: current ? 'relative' : 'absolute',
                      inset: current ? 'auto' : 0,
                      pointerEvents: current ? 'auto' : 'none',
                    }}
                  >
                    <div className="testimonial1_slider_layout u-hflex-center-stretch">
                      <div className="voices-scroll-text" aria-hidden="true">
                        <span>{voicesMarquee}&nbsp; {voicesMarquee}&nbsp;</span>
                      </div>
                      <div className="testimonial1_slider_left_wrap">
                        <div className="testimonial1_slider_left_contain u-container">
                          <div className="testimonial1_slider_left_content_layout u-vflex-center-center u-gap-main">
                            {t.portrait && (
                              <div className="testimonial1_slider_img_wrap">
                                <img src={t.portrait} alt={`${t.credit ?? 'A WOW couple'}, wedding portrait`} loading="lazy" className="testimonial1_slider_img" />
                              </div>
                            )}

                          </div>

                          <div className="testimonial1_slider_controls">
                            <div className="testimonial1_slider_control_layout u-hflex-between-center">
                              <button
                                type="button"
                                onClick={() => go(-1)}
                                aria-label="Previous celebration"
                                className="testimonial1_slider_control_btn left w-inline-block"
                              >
                                <ArrowSlider />
                              </button>
                              <div className="testimonial1_slider_name_wrap">
                                <h3 className="testimonial1_slider_name">–</h3>
                                <h3 className="testimonial1_slider_name">{t.credit ?? ''}</h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => go(1)}
                                aria-label="Next celebration"
                                className="testimonial1_slider_control_btn right w-inline-block"
                              >
                                <ArrowSlider />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="testimonial1_slider_right_wrap">
                        <div className="testimonial1_slider_right_visual_wrap">
                          {t.right && (
                            <img src={t.right} alt={`${t.credit ?? 'WOW'}, celebration setting`} loading="lazy" className="testimonial1_slider_right_image" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
