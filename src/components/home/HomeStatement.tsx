'use client'

import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import CircleTextButton from '../CircleTextButton'
import Mandala from './Mandala'
import { atelier } from '@/data/content'

/** The statement's two sentences, set filled and in outline in turn. */
const PHRASES = ['Nothing is incidental.', 'Everything is intentional.']

/**
 * The atelier statement, without a photograph.
 *
 * Type alone on the dark ground, over a lotus mandala. The statement runs as
 * two lines against each other without end: "Nothing is incidental." filled,
 * right to left, and "Everything is intentional." in gold outline, left to
 * right. The mandala draws itself in from the centre outward
 * the first time the section is reached, and its three rings then turn
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

        {/* Two lines running against each other without end: the first
            sentence right to left, the second left to right. Each track is
            two identical sets, moved by exactly one, so it never jumps. */}
        <h2 className="statement_marquee" aria-label={atelier.statement}>
          {PHRASES.map((phrase, row) => (
            <span key={phrase} className="statement_marquee_row" aria-hidden="true">
              <span className={`statement_marquee_track${row ? ' is-reverse' : ''}`}>
                {[0, 1].map((copy) => (
                  <span key={copy} className="statement_marquee_set">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="statement_marquee_item">
                        <span className={row ? 'statement_phrase is-outline' : 'statement_phrase'}>{phrase}</span>
                        <span className="statement_sep">✦</span>
                      </span>
                    ))}
                  </span>
                ))}
              </span>
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
