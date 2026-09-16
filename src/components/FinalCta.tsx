'use client'

import { useRef } from 'react'
import { gsap, registerGsap, scrubFor } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineAnimation } from '@/hooks/useSplitText'
import CircleTextButton from './CircleTextButton'
import Initial from './Initial'
import { closing } from '@/data/content'
import { closing as closingImages } from '@/data/media'

/**
 * The closing beat.
 *
 * The heading rises line by line. Behind the card, the full-bleed photograph
 * drifts from -27% to rest as the section crosses the viewport, on a heavier
 * lag than the other parallaxes.
 */
export default function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()

  useLineAnimation(headingRef)

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta24_bg_img',
        { yPercent: -27 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: scrubFor(81) },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="dark" className="cta24_wrap">
      <div className="u-container cta" data-padding-top="large" data-padding-bottom="large">
        <div className="cta24_card_contain">
          <div className="cta24_card_wrap">
            <div className="cta24_card_bg_wrap">
              <img src={closingImages.card} alt="" loading="lazy" className="cta24_card_bg_img" />
            </div>

            <div className="cta24_card_content">
              <div className="div-hide">
                <h2 ref={headingRef} className="cta24_card_h2 u-text-h2" js-line-animation="">
                  <Initial>{closing.heading}</Initial>
                </h2>
              </div>

              <p className="cta24_card_p">{closing.note}</p>

              <div className="div-block-32">
                <CircleTextButton href={closing.cta.href} text={closing.circleText} label={closing.cta.label} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta24_bg_wrap">
        <img src={closingImages.bg} alt="" loading="lazy" className="cta24_bg_img" />
      </div>
    </section>
  )
}
