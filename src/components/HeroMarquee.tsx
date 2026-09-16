'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineReveal } from '@/hooks/useSplitText'
import { heroMarquee } from '@/data/media'
import { hero } from '@/data/content'

/**
 * Full-viewport hero: a continuously drifting horizontal band of photographs
 * behind the display headline. The export gives `.cta-marquee_panel.top` a
 * `will-change: transform` but no CSS animation — the movement is JS-driven.
 */
export default function HeroMarquee() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dimRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const paraRef = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()

  useLineReveal(titleRef, { immediate: true, delay: 0.75 })
  useLineReveal(paraRef, { immediate: true, delay: 1.1, innerClass: 'p-line-inner' })

  // The stylesheet parks `.dim` and `.hw` at opacity 0 — in the original a
  // separate runtime faded them in once the page was ready. Without that the
  // hero simply never appears, so the opening reveal is rebuilt here.
  useIsomorphicLayoutEffect(() => {
    const dim = dimRef.current
    const content = contentRef.current
    if (!dim || !content) return
    registerGsap()

    if (reduced) {
      gsap.set([dim, content], { opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(dim, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.8, ease: 'composedOut' })
        .fromTo(content, { opacity: 0 }, { opacity: 1, duration: 1.1, ease: 'composedOut' }, 0.45)
    })

    return () => ctx.revert()
  }, [reduced])

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current
    if (!track || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      // Two identical panels sit side by side; shifting the pair by exactly one
      // panel width and looping lands the second panel where the first began,
      // so the seam never shows.
      gsap.to('.cta-marquee_panel', {
        xPercent: -100,
        duration: 60,
        ease: 'none',
        repeat: -1,
      })
    }, track)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="inherit" className="home-marquee_wrap">
      <div ref={dimRef} className="cta-marquee_contain dim">
        <div ref={trackRef} className="cta-marquee_componenet">
          {[0, 1].map((panel) => (
            <div
              key={panel}
              className={`cta-marquee_panel top${panel === 0 ? ' first-bg' : ''}`}
              aria-hidden={panel === 1}
            >
              {heroMarquee.map((img, i) => (
                <div key={i} className="cta-marquee_bg_wrap">
                  <img
                    src={img.src}
                    alt={panel === 0 ? img.alt : ''}
                    loading={panel === 0 && i < 3 ? 'eager' : 'lazy'}
                    className="cta-marquee_bg_img"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="cta-marquee_overlay" />
      </div>

      <div ref={contentRef} className="u-container hw home" data-padding-top="main" data-padding-bottom="main">
        <div className="home-hero_content u-vflex-center-center">
          <div className="div-block-30">
            <h1 className="kicker hk">{hero.kicker}</h1>
          </div>

          <h2 ref={titleRef} className="u-text-display home-hero_title" js-line-animation="">
            <span className="outline until-mobile">{hero.title}</span>
          </h2>

          <p ref={paraRef} className="home-hero_p" js-line-animation="">
            {hero.paragraph}
          </p>

          <div className="home-hero_btn_wrap">
            <MainButton href={hero.cta.href} label={hero.cta.label} />
          </div>
        </div>
      </div>
    </section>
  )
}

/** The export's `.btn_main_wrap` pattern: a styled shell with a full-bleed link on top. */
export function MainButton({ href, label }: { href: string; label: string }) {
  const external = href.startsWith('mailto:') || href.startsWith('http')

  return (
    <div className="btn_main_wrap" data-button-style="primary">
      <div className="btn_main_layout u-gap-xsmall u-hflex-center-center">
        <div className="btn_main_text">{label}</div>
      </div>
      {external ? (
        <a href={href} className="g_clickable_wrap u-cover-absolute w-inline-block" aria-label={label} />
      ) : (
        <Link href={href} className="g_clickable_wrap u-cover-absolute w-inline-block" aria-label={label} />
      )}
    </div>
  )
}
