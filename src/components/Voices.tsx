'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerGsap, EASE, scrubFor } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { voices } from '@/data/voices'
import { voicesMarquee } from '@/data/content'
import { ArrowSlider, QuoteMark } from './svg'

/**
 * The statements band.
 *
 * - The headline runs endlessly on the `move-text` keyframes in site.css.
 * - Slides change instantly — no crossfade. What reads as the transition is the
 *   incoming slide's own entrance: its portrait fades in while settling from 1.1
 *   to 1, its quote fades in, its attribution rises from below, and the large
 *   photograph settles from 1.1.
 * - The arch portrait and quote sit centred in the column; the attribution lives
 *   in the controls row at the foot, between the two arrows.
 * - The first slide's photograph is wiped in from the right, over 2s, the first
 *   time the band reaches mid-viewport, and wiped back out if you scroll above.
 * - The quote mark behind the first statement drifts from -20% to +10% as it
 *   crosses the viewport.
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
    const quote = q('.testimonial1_slider_rtb.text-align-center')

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
    tl.fromTo(quote, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'none' }, 0)

    return () => {
      tl.kill()
    }
  }, [index, reduced])

  // Scroll-driven pieces: the first photograph's wipe and the quote mark's drift.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
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

      const mark = root.querySelector('.image-22')
      if (mark) {
        gsap.fromTo(
          mark,
          { yPercent: -20 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: { trigger: mark, start: 'top bottom', end: 'bottom top', scrub: scrubFor(50) },
          }
        )
      }
    }, root)

    return () => ctx.revert()
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
            aria-label="What the studio works to"
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
                    key={t.name}
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
                      <div className="testimonial1_slider_left_wrap">
                        <div className="testimonial1_slider_left_contain u-container">
                          <div className="testimonial1_slider_left_content_layout u-vflex-center-center u-gap-main">
                            {i === 0 && <QuoteMark />}
                            {t.portrait && (
                              <div className="testimonial1_slider_img_wrap">
                                <img src={t.portrait} alt="" loading="lazy" className="testimonial1_slider_img" />
                              </div>
                            )}
                            <div className="testimonial1_slider_rtb text-align-center w-richtext">
                              <p>{t.quote}</p>
                            </div>
                          </div>

                          <div className="testimonial1_slider_controls">
                            <div className="testimonial1_slider_control_layout u-hflex-between-center">
                              <button
                                type="button"
                                onClick={() => go(-1)}
                                aria-label="Previous statement"
                                className="testimonial1_slider_control_btn left w-inline-block"
                              >
                                <ArrowSlider />
                              </button>
                              <div className="testimonial1_slider_name_wrap">
                                <h3 className="testimonial1_slider_name">–</h3>
                                <h3 className="testimonial1_slider_name">{t.name}</h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => go(1)}
                                aria-label="Next statement"
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
                            <img src={t.right} alt="" loading="lazy" className="testimonial1_slider_right_image" />
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
