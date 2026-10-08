'use client'

import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import CircleTextButton from '../CircleTextButton'
import Mandala from './Mandala'
import { atelier } from '@/data/content'

/** The statement in the four lines it is set in, all one size. */
const LINES = ['Nothing', 'is incidental.', 'Everything', 'is intentional.']

/**
 * The atelier statement, without a photograph.
 *
 * Type alone on the dark ground, over a lotus mandala. Every line arrives as a
 * gold outline and fills in solid from the left, one after another, as the
 * section scrolls up the screen. The mandala draws itself in from the centre
 * outward the first time the section is reached, and its three rings then turn
 * against each other as the page scrolls. Nothing pins.
 */
export default function HomeStatement() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.statement_rule',
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 40%', scrub: 0.6 } }
      )

      // The four lines fill one after another across the read.
      const fill = gsap.timeline({
        scrollTrigger: { trigger: '.statement_lines', start: 'top 80%', end: 'bottom 40%', scrub: 0.6 },
      })
      gsap.utils.toArray<HTMLElement>('.statement_fill').forEach((line, i) => {
        fill.fromTo(line, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', duration: 1 }, i * 0.85)
      })

      // The mandala draws itself in, centre outward.
      const strokes = gsap.utils.toArray<SVGPathElement>('.mandala_line')
      strokes.forEach((path) => {
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      })
      const draw = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 70%', once: true } })
      draw.fromTo('.mandala_bindu', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.6, ease: 'back.out(3)' }, 0)
      draw.to(strokes, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', stagger: 0.14 }, 0.1)

      // Its rings turn against each other while the section passes.
      const turn = { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.fromTo('.mandala_inner', { rotate: -40 }, { rotate: 80, ease: 'none', scrollTrigger: turn })
      gsap.fromTo('.mandala_middle', { rotate: 30 }, { rotate: -50, ease: 'none', scrollTrigger: turn })
      gsap.fromTo('.mandala_outer', { rotate: -12 }, { rotate: 28, ease: 'none', scrollTrigger: turn })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="dark" className="statement_wrap" aria-label={atelier.statement}>
      <Mandala className="statement_mandala" />

      <div className="u-container statement_contain" data-padding-top="none" data-padding-bottom="none">
        <p className="statement_kicker">
          <span className="statement_rule statement_rule--left" aria-hidden="true" />
          <span className="kicker">{atelier.kicker}</span>
          <span className="statement_rule statement_rule--right" aria-hidden="true" />
        </p>

        <h2 className="statement_lines">
          {LINES.map((line) => (
            <span key={line} className="statement_line">
              <span className="statement_outline" aria-hidden="true">{line}</span>
              <span className="statement_fill">{line}</span>
            </span>
          ))}
        </h2>

        <div className="statement_btn">
          <CircleTextButton href={atelier.cta.href} text={atelier.circleText} label={atelier.cta.label} />
        </div>
      </div>
    </section>
  )
}
