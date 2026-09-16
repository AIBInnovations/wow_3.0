'use client'

import { useRef } from 'react'
import { useLetterAnimation } from '@/hooks/useSplitText'
import { MainButton } from './HeroMarquee'
import { GRID } from '@/data/gridNodes'
import Initial from './Initial'
import { celebration } from '@/data/content'
import { celebrationImages } from '@/data/media'

/**
 * "Four Days / One Celebration".
 *
 * The heading flips in character by character. Everything else here is static:
 * the two frames are tilted by the stylesheet and do not move on scroll.
 */
export default function CelebrationSection() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useLetterAnimation(headingRef)

  return (
    <section data-theme="inherit" className="content-lo1_wrap">
      <div className="content-lo1_contain u-container" data-padding-top="main" data-padding-bottom="main">
        <div className="content-lo1_heading_wrap">
          <div className="content-lo1_heading_contain">
            <h2 ref={headingRef} className="content-lo1_heading_txt" js-letter-animation="">
              <Initial>{celebration.headingLead}</Initial>
              <br />
              {celebration.headingOutline}
            </h2>
          </div>
        </div>

        <div className="content-lo1_content_layout">
          <div id={GRID.albumLeft} className="content-lo1_content_left">
            <div className="content-lo1_content_bg_wrap">
              <img src={celebrationImages.bg} alt="" loading="lazy" className="content-lo1_content_bg_img" />
            </div>
          </div>

          <div id={GRID.albumRight} className="content-lo1_content_right_wrap">
            <p className="content-lo1_content_right_text u-text-main">
              <span className="drop-cap">{celebration.paragraph.charAt(0)}</span>
              {celebration.paragraph.slice(1)}
            </p>

            <div className="btn-wrap content-lo1_content_right">
              <MainButton href={celebration.cta.href} label={celebration.cta.label} />
            </div>

            <div className="content-lo1_imgs_flex">
              <div className="content-lo1_imgs_wrapper first-img">
                <img src={celebrationImages.a} alt="" loading="lazy" className="content-lo1_imgs_img" />
              </div>
              <div className="content-lo1_imgs_wrapper second-img">
                <img src={celebrationImages.b} alt="" loading="lazy" className="content-lo1_imgs_img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
