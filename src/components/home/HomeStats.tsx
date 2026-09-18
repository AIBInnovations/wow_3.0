'use client'

import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineAnimation } from '@/hooks/useSplitText'
import { homeStats } from '@/data/home'

/** How long a numeral takes to rise and to count to its value. */
const COUNT_S = 1.6

/**
 * The stats band: a label and the studio's own statement on the left, four
 * figures across on the right, hairlines between them.
 *
 * The first time the band's top crosses 70% of the viewport, each numeral rises
 * out of its clip while counting up from 0 to its value — 1.6s, power3.out,
 * snapped to whole numbers — and the labels fade in beneath. The markup carries
 * the final values, so reduced motion, and no script at all, show them as they
 * are.
 */
export default function HomeStats() {
  const sectionRef = useRef<HTMLElement>(null)
  const statementRef = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()

  useLineAnimation(statementRef)

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || reduced) return
    registerGsap()

    const q = gsap.utils.selector(section)
    const values = q('.home-stats_value') as HTMLElement[]

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 70%', once: true },
      })

      tl.fromTo(
        '.home-stats_num',
        { yPercent: 100 },
        { yPercent: 0, duration: COUNT_S, ease: 'power3.out', stagger: 0.1 },
        0
      )

      values.forEach((el, i) => {
        const target = Number(el.dataset.value)
        const counter = { value: 0 }
        el.textContent = '0'
        tl.to(
          counter,
          {
            value: target,
            duration: COUNT_S,
            ease: 'power3.out',
            snap: { value: 1 },
            onUpdate: () => {
              el.textContent = String(Math.round(counter.value))
            },
          },
          i * 0.1
        )
      })

      // `from`, so each label settles at the opacity the stylesheet gives it.
      tl.from('.home-stats_label', { opacity: 0, duration: 1.5, ease: 'power3.out', stagger: 0.1 }, 0.3)
    }, section)

    return () => {
      ctx.revert()
      // Text is not a tweened style, so the context cannot put it back.
      for (const el of values) el.textContent = el.dataset.value ?? ''
    }
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="inherit" className="home-stats_wrap">
      <div className="u-container home-stats_contain" data-padding-top="main" data-padding-bottom="main">
        <div className="home-stats_layout">
          <div className="home-stats_lead">
            {/* Wrapped: .kicker grows to fill a flex column on its own. */}
            <div>
              <div className="kicker home-stats_kicker">{homeStats.kicker}</div>
            </div>
            <p ref={statementRef} className="home-stats_statement" js-line-animation="">
              {homeStats.statement}
            </p>
          </div>

          <ul className="home-stats_grid" role="list">
            {homeStats.stats.map((stat) => (
              <li key={stat.label} className="home-stats_item">
                <div className="home-stats_clip">
                  <span className="home-stats_num">
                    <span className="home-stats_value" data-value={stat.value}>
                      {stat.value}
                    </span>
                    {stat.suffix ? <sup className="home-stats_suffix">{stat.suffix}</sup> : null}
                  </span>
                </div>
                <div className="home-stats_label">{stat.label}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
