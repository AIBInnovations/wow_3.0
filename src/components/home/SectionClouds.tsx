'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** How fast the clouds rise, against the page, while they linger. */
const LINGER = 0.75

/**
 * Clouds over the join between Our Approach and the destinations.
 *
 * The join is hidden by colour, not covered: Our Approach's foot deepens to
 * one dark tone and the first destination rises out of the same tone, so the
 * two meet without an edge. Over it float real cumulus, cut whole from
 * photographs (free under the Unsplash License) and laid out in three layers
 * that take no height in the page; no crown rises more than a few pixels
 * above the join, into the room beneath that section's words.
 *
 * Each layer drifts sideways on its own (the middle one slowly left to right,
 * a fainter, hazed row behind and a nearer row in front right to left, the
 * nearer the faster), and the back and front rise at their own speeds as the
 * join passes up the screen. Once the join has gone past the top, the clouds
 * lag only a little behind the page and thin away within a third of a
 * screen, before they can settle over the photograph.
 *
 * Images: public/wow/clouds-core|back|front.webp, each a tile that wraps.
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
      gsap.fromTo('.clouds_front', { yPercent: 14 }, { yPercent: -30, ease: 'none', scrollTrigger: rising })

      // Lingering: from the join at the top of the screen, for about a screen.
      ScrollTrigger.create({
        trigger: band,
        start: 'top top',
        // Until the first destination has risen away: about half a screen.
        end: () => `+=${Math.round(window.innerHeight * 0.35)}`,
        onUpdate: (self) => {
          const travelled = self.progress * (self.end - self.start)
          const fade = Math.min(1, Math.max(0, self.progress))
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
    <>
      {/* The join itself: the photograph rises out of the same deep tone
          Our Approach ends in, so there is no line to see. It stays on the
          join; only the clouds linger. */}
      <div className="clouds_join" aria-hidden="true" />
    <div ref={ref} className="clouds" aria-hidden="true">
      <div className="clouds_layer clouds_back"><div className="clouds_strip" /></div>
      <div className="clouds_layer clouds_core"><div className="clouds_strip" /></div>
      <div className="clouds_layer clouds_front"><div className="clouds_strip" /></div>
    </div>
    </>
  )
}
