'use client'

import { useRef } from 'react'
import { gsap, registerGsap, scrubFor } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useScrubText } from '@/hooks/useSplitText'
import CircleTextButton from './CircleTextButton'
import { atelier } from '@/data/content'
import { atelierBackground } from '@/data/media'

/**
 * The atelier statement over a full-bleed photograph.
 *
 * The photograph drifts from -20em to +11em as the section passes through the
 * viewport, measured in the image's own em so the travel scales with type. It is
 * styled at 110% height precisely so it has room to move without showing an edge.
 */
export default function TallImage() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()

  useScrubText(headingRef)

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      const img = section.querySelector<HTMLElement>('.tall-img_bg_img')
      if (!img) return
      const em = () => parseFloat(getComputedStyle(img).fontSize)

      gsap.fromTo(
        img,
        { y: () => -20 * em() },
        {
          y: () => 11 * em(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: scrubFor(50),
            invalidateOnRefresh: true,
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="dark" className="tall-img_wrap">
      <div className="tall-img_bg_wrap">
        <img src={atelierBackground} alt="" loading="lazy" className="tall-img_bg_img" />
        <div className="tall-img_bg_overlay" />
      </div>

      <div className="u-container tall-img_contain" data-padding-top="main" data-padding-bottom="main">
        <div className="tall-img_kicker_wrap">
          <h2 className="kicker home-meet-kicker">{atelier.kicker}</h2>
        </div>

        <div className="tall-img_title_flex">
          <div className="tall-img_title_wrap">
            <div className="trigger">
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
