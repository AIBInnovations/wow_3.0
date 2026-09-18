'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineAnimation } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import { aboutDestinations } from '@/data/about'

const PANELS = 3

/**
 * Three depths over one photograph.
 *
 *   back    the photograph under a deep green scrim
 *   middle  two rows of oversized, faint lettering drifting in opposite
 *           directions, both turning around when the scroll direction does
 *   front   the heading and three tall destination cards
 *
 * Each card's photograph wipes up out of a bottom clip as the grid arrives, and
 * drifts inside its frame (the image is 110% tall) while the section scrolls.
 */
export default function AboutDestinations() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()

  useLineAnimation(headingRef)

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    registerGsap()

    const ctx = gsap.context(() => {
      if (reduced) return

      const forward = gsap.fromTo(
        '.marquee-text_panel.is-1',
        { xPercent: 0 },
        { xPercent: -100, duration: 30, ease: 'none', repeat: -1 }
      )
      const backward = gsap.fromTo(
        '.marquee-text_panel.is-2',
        { xPercent: -100 },
        { xPercent: 0, duration: 30, ease: 'none', repeat: -1 }
      )

      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const scale = self.direction
          if (Math.sign(forward.timeScale()) === scale) return
          gsap.to([forward, backward], { timeScale: scale, duration: 0.6, ease: 'power1.out', overwrite: true })
        },
      })

      gsap.fromTo(
        '.marquee_grid_card_img_wrap',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.5,
          stagger: 0.15,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: '.marquee_grid_list--gd1-ct3', start: 'top 85%' },
        }
      )

      gsap.fromTo(
        '.marquee_grid_card_img',
        { yPercent: -9 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="dark" className="marquee_grid_wrap dark full-in">
      <div className="marquee_grid_marquee_wrapper" aria-hidden="true">
        {[1, 2].map((track) => (
          <div key={track} className={`marquee-text_component${track === 2 ? ' is-2' : ''}`}>
            <div className={`marquee-text_wrapper${track === 2 ? ' is-2' : ''}`}>
              {Array.from({ length: PANELS }, (_, i) => (
                <div key={i} className={`marquee-text_panel is-${track}`}>
                  <div className="marquee-text_text">{aboutDestinations.marquee}</div>
                  <div className="marquee-text_icon">/</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="u-container smaller" data-padding-top="main" data-padding-bottom="main">
        <div className="marquee_grid_layout">
          <h2 ref={headingRef} className="u-text-h2" js-line-animation="">
            <Initial>{aboutDestinations.heading}</Initial>
          </h2>
          <div className="marquee_grid_wrapper">
            <div className="marquee_grid_list--gd1-ct3">
              {aboutDestinations.items.map((item) => (
                <Link key={item.lead} href={item.href} className="marquee_grid_item w-inline-block">
                  <div className="marquee_grid_card_wrap">
                    <div className="marquee_grid_card_img_wrap">
                      <img src={item.image} alt="" loading="lazy" className="marquee_grid_card_img" />
                    </div>
                    <div className="marquee_grid_card_content_wrap">
                      <h3 className="u-text-h4 u-text-balance">
                        {item.lead}
                        <br />
                        {item.tail}
                      </h3>
                      <div className="marquee_grid_card_content_btn_wrap hov-text">
                        <div className="marquee_grid_card_content_venue">{aboutDestinations.cta}</div>
                        <div className="marquee_grid_card_content_venue arrow">→</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
