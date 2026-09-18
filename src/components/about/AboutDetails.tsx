import Initial from '@/components/Initial'
import { aboutCards, aboutMarquee, aboutPortfolio } from '@/data/about'

const STICKY = ['deets_card_sticky-first', 'deets_card_sticky-second', 'deets_card_sticky-third']

/** Enough copies that the band never runs short of the screen's width mid-loop. */
const PANELS = 4

/**
 * The marquee, the three stacking cards and the portfolio band.
 *
 * No script here. The marquee is a CSS loop — identical panels, each
 * travelling a full width every 20s — so it never restarts on re-entry. Each
 * card is `position: sticky` at a deeper top offset than the one before, so they
 * come to rest as a staircase, each leaving a band of the last showing above
 * it. The portfolio band sits on a higher layer and scrolls up over the stack.
 */
export default function AboutDetails() {
  return (
    <section data-theme="inherit" className="deets_wrap">
      <div className="u-container deets_contain" data-padding-top="main" data-padding-bottom="main">
        <div className="deets_marquee_wrap" aria-label={aboutMarquee}>
          {Array.from({ length: PANELS }, (_, panel) => (
            <div key={panel} className="deets_marquee_panel" aria-hidden="true">
              <h2 className="deets_marquee_txt">{aboutMarquee}</h2>
            </div>
          ))}
        </div>

        <div className="deets_layout">
          {aboutCards.map((card, i) => (
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

          <div data-theme="inherit" className="press_wrap">
            <div className="deets_press-_layout">
              <div className="deets_press-_img_wrap">
                <img src={aboutPortfolio.left.src} alt={aboutPortfolio.left.alt} loading="lazy" className="deets_press-_img" />
              </div>
              <div className="featured-in_layout u-vflex-center-center u-gap-main">
                {/* Wrapped: .kicker grows to fill a flex column on its own. */}
                <div>
                  <div className="kicker">{aboutPortfolio.kicker}</div>
                </div>
                {aboutPortfolio.lines.map((line) => (
                  <div key={line} className="featured-in_line">
                    {line}
                  </div>
                ))}
                <p className="featured-in_note">{aboutPortfolio.note}</p>
              </div>
              <div className="deets_press-_img_wrap">
                <img src={aboutPortfolio.right.src} alt={aboutPortfolio.right.alt} loading="lazy" className="deets_press-_img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
