'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import Initial from '@/components/Initial'
import { MainButton } from '@/components/HeroMarquee'
import { useLineAnimation } from '@/hooks/useSplitText'
import { homeAtelier, homeAtelierCards } from '@/data/home'

/**
 * Five sticky cards, each with a dedicated number strip. Their pin offsets match
 * the strip height so every earlier number remains visible beneath navigation.
 * The closing band stays outside the stack so the last card can scroll away.
 */
export default function HomeAtelier() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  useLineAnimation(headingRef)

  useIsomorphicLayoutEffect(() => {
    const stack = stackRef.current
    if (!stack) return
    const cards = Array.from(stack.querySelectorAll<HTMLElement>('.home-atelier_card'))
    let frame = 0
    const measure = () => {
      const strip = parseFloat(getComputedStyle(stack).getPropertyValue('--card-strip'))
      // Equal pinned bottom edges make every card release at the same scroll
      // position. Measuring the content, not the stretched card, avoids feedback.
      const bottom = Math.ceil(Math.max(...cards.map((card, i) => {
        const content = card.querySelector<HTMLElement>('.deets_card_wrap')!
        return strip + content.getBoundingClientRect().height + i * strip
      })))
      stack.style.setProperty('--stack-height', `${bottom}px`)
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    const observer = new ResizeObserver(schedule)
    cards.forEach(card => observer.observe(card.querySelector('.deets_card_wrap')!))
    window.addEventListener('resize', schedule)
    measure()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', schedule)
      stack.style.removeProperty('--stack-height')
    }
  }, [])

  return (
    <section data-theme="inherit" className="home-atelier_wrap">
      <div className="u-container home-atelier_contain" data-padding-top="main" data-padding-bottom="main">
        <div className="home-atelier_head">
          {/* Wrapped: .kicker grows to fill a flex column on its own. */}
          <div>
            <div className="kicker home-atelier_kicker">{homeAtelier.kicker}</div>
          </div>
          <h2 ref={headingRef} className="home-atelier_title" js-line-animation="">
            <Initial>{homeAtelier.heading}</Initial>
          </h2>
        </div>

        <div ref={stackRef} className="deets_layout home-atelier_cards">
          {homeAtelierCards.map((card, i) => (
            <div
              key={card.href}
              className="home-atelier_card"
              /* The depth this card comes to rest at, counted down the stack. */
              style={{ '--i': i, background: card.background } as React.CSSProperties}
            >
              <div className="home-atelier_card_header">
                <span className="home-atelier_card_num kicker">{card.number}</span>
              </div>
              <div className="deets_card_wrap u-grid-custom">
                <div className="deets_card_text-wrap u-column u-vflex-left-top u-gap-large">
                  <h2 className="deets_card_title u-text-display home-atelier_card_title">
                    <Link href={card.href} className="home-atelier_card_link">
                      <Initial>{card.title}</Initial>
                    </Link>
                  </h2>
                  <p className="deets_card_p u-text-large">{card.body}</p>
                </div>
                <div className="deets_card_img_wrap u-column">
                  <img src={card.image} alt={card.alt} loading="lazy" className="deets_card_img" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Outside the stack so the final card is never trapped underneath it. */}
        <div data-theme="inherit" className="press_wrap home-atelier_close">
          <div className="btn-wrap home-atelier_cta">
            <MainButton href={homeAtelier.cta.href} label={homeAtelier.cta.label} />
          </div>
        </div>
      </div>
    </section>
  )
}
