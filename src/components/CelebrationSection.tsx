'use client'

import { useRef } from 'react'
import { useLetterAnimation } from '@/hooks/useSplitText'
import { MainButton } from './HeroMarquee'
import Initial from './Initial'
import { celebration } from '@/data/content'
import { celebrationImages } from '@/data/media'
import HomeStats from './home/HomeStats'

/**
 * What Distinguishes Our Celebrations: the Website Content PDF's heading, with
 * its paragraph and the way to the celebrations beside it; beneath, a
 * photograph beside the studio's account of itself in numbers.
 *
 * Two rows on a twelve-column grid, nothing left standing alone on half the
 * width. The heading flips in letter by letter; the rest is still.
 */
export default function CelebrationSection() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useLetterAnimation(headingRef)

  return (
    <section data-theme="inherit" className="content-lo1_wrap cel_wrap">
      <div className="u-container cel_contain" data-padding-top="main" data-padding-bottom="main">
        <div className="cel_top">
          <h2 ref={headingRef} className="content-lo1_heading_txt cel_title" js-letter-animation="">
            <Initial>{celebration.headingLead}</Initial>
            <br />
            {celebration.headingOutline}
          </h2>
          <div className="cel_intro">
            <p className="cel_text">
              <span className="drop-cap">{celebration.paragraph.charAt(0)}</span>
              {celebration.paragraph.slice(1)}
            </p>
            <div className="btn-wrap cel_btn">
              <MainButton href={celebration.cta.href} label={celebration.cta.label} />
            </div>
          </div>
        </div>

        <div className="cel_body">
          <figure className="cel_media">
            <img src={celebrationImages.bg} alt="" loading="lazy" decoding="async" />
          </figure>
          <div className="cel_numbers">
            <HomeStats />
          </div>
        </div>
      </div>
    </section>
  )
}
