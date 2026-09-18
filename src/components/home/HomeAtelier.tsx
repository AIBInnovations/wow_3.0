'use client'

import Link from 'next/link'
import { useRef } from 'react'
import Initial from '@/components/Initial'
import { MainButton } from '@/components/HeroMarquee'
import { useLineAnimation } from '@/hooks/useSplitText'
import { homeAtelier, homeAtelierCards } from '@/data/home'

/**
 * The atelier on the home page: a label, a heading that rises line by line,
 * then the five disciplines as a staircase of cards.
 *
 * The markup and classes are the ones the About page's staircase was built on,
 * so about.css carries most of it untouched. The sticky offsets are not shared:
 * About stacks three cards at 7, 11 and 15rem, and five need their own ramp
 * across the same span, so `.home-atelier_cards` sets its own from `--i`.
 *
 * A sticky card only stays pinned while its parent still has content beneath it.
 * That is what the closing band under the stack is for — a solid layer carrying
 * the button, which scrolls up over all five and releases them in turn.
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
          {homeAtelierCards.map((card, i) => (
            <div
              key={card.href}
              className="home-atelier_card"
              /* The depth this card comes to rest at, counted down the stack. */
              style={{ '--i': i } as React.CSSProperties}
            >
              <div className="deets_card_wrap u-grid-custom">
                <div className="deets_card_text-wrap u-column u-vflex-left-top u-gap-large">
                  <div className="home-atelier_card_num kicker">{card.number}</div>
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

          {/* Solid, on its own layer: what the stack rests under, and releases against. */}
          <div data-theme="inherit" className="press_wrap home-atelier_close">
            <div className="btn-wrap home-atelier_cta">
              <MainButton href={homeAtelier.cta.href} label={homeAtelier.cta.label} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
