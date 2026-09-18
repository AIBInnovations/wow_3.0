'use client'

import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import Initial from '@/components/Initial'
import { aboutLetters } from '@/data/about'

/** Resting tilt of each card in the stack, front to back. */
const TILT = [0, 3, 6, 9]

/**
 * A pinned stack of cards beneath the section heading.
 *
 * The section is 300vh; its content is a 100vh sticky frame, so the extra 200vh
 * of scroll is what drives the stack. Across that distance each front card is
 * lifted up and away with a slight counter-turn, and every card behind it
 * settles one step straighter — the next card squares up to 0° as it becomes
 * the front. The last card stays. The stack fades in as the section arrives.
 */
export default function AboutLetters() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    registerGsap()

    const ctx = gsap.context(() => {
      const list = section.querySelector('.layout417_list')
      if (reduced) {
        gsap.set(list, { opacity: 1 })
        return
      }

      gsap.to(list, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'play none none reverse' },
      })

      const cards = gsap.utils.toArray<HTMLElement>('.layout417_card')
      gsap.set(cards, { rotation: (i) => TILT[i] ?? 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'power1.inOut' },
        scrollTrigger: {
          trigger: '.layout417_component',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })

      // A short hold on the full stack before the first card moves.
      tl.to({}, { duration: 0.25 })
      cards.slice(0, -1).forEach((card, i) => {
        const at = tl.duration()
        tl.to(card, { y: '-105vh', rotation: -8, duration: 1, ease: 'power1.in' }, at)
        cards.slice(i + 1).forEach((behind, j) => {
          tl.to(behind, { rotation: TILT[j] ?? 0, duration: 0.9 }, at + 0.1)
        })
      })
      tl.to({}, { duration: 0.35 })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="dark" className="loveletters_wrap">
      <div className="container">
        <div className="section_layout417">
          <div className="container-large">
            <div className="layout417_component">
              <div className="layout417_content">
                <div className="layout417_title-wrapper">
                  <h2 className="layout417_title edit">
                    <Initial>{aboutLetters.title}</Initial>
                  </h2>
                </div>
                <div className="layout417_list">
                  {aboutLetters.letters.map((letter, i) => (
                    <figure key={i} className={`layout417_card card-${i + 1}`}>
                      <div className="layout417_card-content">
                        <blockquote className="layout417_space">
                          <p>{letter.body}</p>
                        </blockquote>
                        <figcaption className="heading">{letter.from}</figcaption>
                      </div>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
