'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** How fast the clouds rise, against the page, while they linger. */
const LINGER = 0.45

/**
 * A bank of cloud along the top of the destinations, so the first of them
 * rises out of it instead of starting at a line.
 *
 * It takes no height in the page: a zero-height band on the join between the
 * sections. The bank's body is opaque from the join down and rides on the
 * page with it, pushing Our Approach up and away; only its crowns rise above
 * the join, into the space beneath that section's words. Below the join the
 * cloud thins into the photograph.
 *
 * Three layers, each drifting sideways on its own (the body slowly left to
 * right, a softer bank behind and loose wisps in front right to left, the
 * nearer the faster); as the join rises through the screen the two loose
 * layers move up at their own speeds over the photograph. Once the join has
 * gone past the top of the screen the bank stops keeping pace with the page:
 * it rises at under half speed, thinning as it goes, and is gone as the
 * first destination rises away beneath it.
 *
 * The clouds are original images made for the site from thousands of lit soft
 * puffs (public/wow/clouds-core|back|front.webp); each tiles left to right.
 */
export default function SectionClouds() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const band = ref.current
    if (!band || reduced) return
    registerGsap()
    const ctx = gsap.context(() => {
      const rising = { trigger: band, start: 'top bottom', end: 'top top', scrub: true }
      gsap.fromTo('.clouds_back', { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: rising })
      gsap.fromTo('.clouds_front', { yPercent: 22 }, { yPercent: -22, ease: 'none', scrollTrigger: rising })

      // Lingering: from the join at the top of the screen, for about a screen.
      ScrollTrigger.create({
        trigger: band,
        start: 'top top',
        // Until the first destination has risen away: about half a screen.
        end: () => `+=${Math.round(window.innerHeight * 0.5)}`,
        onUpdate: (self) => {
          const travelled = self.progress * (self.end - self.start)
          const fade = Math.min(1, Math.max(0, (self.progress - 0.15) / 0.85))
          band.style.transform = `translate3d(0, ${(travelled * (1 - LINGER)).toFixed(1)}px, 0)`
          band.style.opacity = String(1 - fade * fade * (3 - 2 * fade))
        },
        onLeaveBack: () => {
          band.style.transform = ''
          band.style.opacity = ''
        },
      })
    }, band)
    return () => {
      ctx.revert()
      band.style.transform = ''
      band.style.opacity = ''
    }
  }, [reduced])

  return (
    <div ref={ref} className="clouds" aria-hidden="true">
      <div className="clouds_layer clouds_back"><div className="clouds_strip" /></div>
      <div className="clouds_layer clouds_core"><div className="clouds_strip" /></div>
      <div className="clouds_layer clouds_front"><div className="clouds_strip" /></div>
    </div>
  )
}
