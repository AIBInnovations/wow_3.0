'use client'

import { useRef } from 'react'
import { useLineReveal } from '@/hooks/useSplitText'
import CircleTextButton from './CircleTextButton'
import { closing } from '@/data/content'
import { closing as closingImages } from '@/data/media'

/** The closing beat: one photograph, one question, one way forward. */
export default function FinalCta() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useLineReveal(headingRef)

  return (
    <section data-theme="dark" className="cta24_wrap">
      <div className="u-container cta" data-padding-top="large" data-padding-bottom="large">
        <div className="cta24_card_contain">
          <div className="cta24_card_wrap">
            <div className="cta24_card_bg_wrap">
              <img src={closingImages.card} alt="" loading="lazy" className="cta24_card_bg_img" />
            </div>

            <div className="cta24_card_content">
              <div className="div-hide">
                <h2 ref={headingRef} className="cta24_card_h2 u-text-h2" js-line-animation="">
                  {closing.heading}
                </h2>
              </div>

              <p className="cta24_card_p">{closing.note}</p>

              <div className="div-block-32">
                <CircleTextButton
                  href={closing.cta.href}
                  text={closing.circleText}
                  label={closing.cta.label}
                />
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
