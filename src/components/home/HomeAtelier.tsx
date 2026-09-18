'use client'

import { useRef } from 'react'
import Initial from '@/components/Initial'
import { MainButton } from '@/components/HeroMarquee'
import { useLineAnimation } from '@/hooks/useSplitText'
import { aboutCards } from '@/data/about'
import { homeAtelier } from '@/data/home'

/** The About page's first two cards, in its own sticky offsets. */
const STICKY = ['deets_card_sticky-first', 'deets_card_sticky-second']
const cards = aboutCards.slice(0, STICKY.length)

/**
 * The atelier on the home page: a label, a heading that rises line by line,
 * then the About page's Ideology and Influence cards — the same markup and
 * classes, so about.css's sticky staircase carries over untouched.
 *
 * A sticky card only stays pinned while its parent still has content beneath
 * it, which is why the button row sits inside the cards' wrapper as a band of
 * its own: the second card comes to rest at its deeper offset, the first
 * showing above it, and the band scrolls up over both — exactly as the
 * portfolio band does on /about.
 */
export default function HomeAtelier() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useLineAnimation(headingRef)

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

        <div className="deets_layout home-atelier_cards">
          {cards.map((card, i) => (
            <div key={card.title} className={STICKY[i]}>
              <div className="deets_card_wrap u-grid-custom">
                <div className="deets_card_text-wrap u-column u-vflex-left-top u-gap-large">
                  <h2 className="deets_card_title u-text-display">
                    <Initial>{card.title}</Initial>
                  </h2>
                  <p className="deets_card_p u-text-large">{card.body}</p>
                </div>
                <div className="deets_card_img_wrap u-column">
                  <img src={card.image} alt={card.alt} loading="lazy" className="deets_card_img" />
                </div>
              </div>
            </div>
          ))}

          <div className="btn-wrap home-atelier_cta">
            <MainButton href={homeAtelier.cta.href} label={homeAtelier.cta.label} />
          </div>
        </div>
      </div>
    </section>
  )
}
