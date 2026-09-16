'use client'

import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useCharScrub } from '@/hooks/useSplitText'
import CircleTextButton from './CircleTextButton'
import { atelier } from '@/data/content'
import { atelierBackground } from '@/data/media'

/**
 * The atelier statement — a full-bleed ceremony frame that drifts behind copy
 * whose characters brighten as the section scrolls past. The background image is
 * styled at 110% height precisely so it has room to move.
 */
export default function TallImage() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLImageElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()

  useCharScrub(headingRef, triggerRef)

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    const bg = bgRef.current
    if (!section || !bg || reduced) return
    registerGsap()

    // Disabled below 768px — the original drops this parallax on small screens.
    const ctx = gsap.context(() => {
      ScrollTriggerMatchMedia(section, bg)
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="dark" className="tall-img_wrap">
      <div className="tall-img_bg_wrap">
        <img
          ref={bgRef}
          src={atelierBackground}
          alt=""
          loading="lazy"
          className="tall-img_bg_img"
        />
        <div className="tall-img_bg_overlay" />
      </div>

      <div className="u-container tall-img_contain" data-padding-top="main" data-padding-bottom="main">
        <div className="tall-img_kicker_wrap">
          <h2 className="kicker home-meet-kicker">{atelier.kicker}</h2>
        </div>

        <div className="tall-img_title_flex">
          <div className="tall-img_title_wrap">
            <div ref={triggerRef} className="trigger">
              <h2 ref={headingRef} className="u-text-h2 scrub-txt">
                {atelier.statement}
              </h2>
              <div className="tall-img_title_space-top" />
              <div className="tall-img_title_p_wrap" />
            </div>
          </div>
        </div>

        <div className="tall-img_btn-wrap">
          <CircleTextButton href={atelier.cta.href} text={atelier.circleText} label={atelier.cta.label} />
        </div>
      </div>
    </section>
  )
}

/** Parallax drift on the portrait, desktop only. */
function ScrollTriggerMatchMedia(section: HTMLElement, bg: HTMLElement) {
  gsap.matchMedia().add('(min-width: 768px)', () => {
    gsap.fromTo(
      bg,
      { yPercent: 0 },
      {
        yPercent: -9,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    )
  })
}
