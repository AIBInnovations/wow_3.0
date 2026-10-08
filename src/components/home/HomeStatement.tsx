'use client'

import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import CircleTextButton from '../CircleTextButton'
import { atelier } from '@/data/content'

/** The statement, as the four lines it is set in: two words held large, two said quietly. */
const LINES = [
  { text: 'Nothing', big: true },
  { text: 'is incidental.', big: false },
  { text: 'Everything', big: true },
  { text: 'is intentional.', big: false },
]

/** A compass ring of 48 ticks, every sixth one long. */
function Ring() {
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2
    const long = i % 6 === 0
    const r1 = long ? 86 : 91
    const r2 = 96
    return (
      <line
        key={i}
        x1={100 + Math.cos(a) * r1}
        y1={100 + Math.sin(a) * r1}
        x2={100 + Math.cos(a) * r2}
        y2={100 + Math.sin(a) * r2}
      />
    )
  })
  return (
    <svg className="statement_ring" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="98" />
      <circle cx="100" cy="100" r="70" className="statement_ring_inner" />
      {ticks}
    </svg>
  )
}

/**
 * The atelier statement, without a photograph.
 *
 * Set as type alone on the dark ground. The two large words arrive as gold
 * outlines and fill in solid from the left as the section scrolls up the
 * screen; the quiet lines between them rise into place; a compass ring behind
 * them turns with the scroll and the hairlines either side of the kicker draw
 * outward. Nothing pins — it all runs while the section passes.
 */
export default function HomeStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      const read = { trigger: section, start: 'top 75%', end: 'center 45%', scrub: 0.6 }

      gsap.fromTo('.statement_rule', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { ...read, end: 'top 35%' } })

      gsap.utils.toArray<HTMLElement>('.statement_fill').forEach((fill, i) => {
        gsap.fromTo(
          fill,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'none',
            scrollTrigger: { ...read, start: `top ${70 - i * 18}%`, end: `top ${20 - i * 18}%` },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>('.statement_quiet span').forEach((line) => {
        gsap.fromTo(
          line,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: { trigger: line, start: 'top 88%', once: true },
          }
        )
      })

      gsap.fromTo(
        '.statement_ring',
        { rotate: -40, scale: 0.85 },
        { rotate: 80, scale: 1.05, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } }
      )
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="dark" className="statement_wrap" aria-label={atelier.statement}>
      <Ring />

      <div className="u-container statement_contain">
        <p className="statement_kicker">
          <span className="statement_rule statement_rule--left" aria-hidden="true" />
          <span className="kicker">{atelier.kicker}</span>
          <span className="statement_rule statement_rule--right" aria-hidden="true" />
        </p>

        <h2 className="statement_lines">
          {LINES.map((line) =>
            line.big ? (
              <span key={line.text} className="statement_big">
                <span className="statement_outline" aria-hidden="true">{line.text}</span>
                <span className="statement_fill">{line.text}</span>
              </span>
            ) : (
              <span key={line.text} className="statement_quiet">
                <span>{line.text}</span>
              </span>
            )
          )}
        </h2>

        <div className="statement_btn">
          <CircleTextButton href={atelier.cta.href} text={atelier.circleText} label={atelier.cta.label} />
        </div>
      </div>
    </section>
  )
}
