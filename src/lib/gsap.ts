'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { CustomEase } from 'gsap/CustomEase'

let registered = false

/**
 * The export loads gsap, ScrollTrigger, Flip and CustomEase from CDNs and relies on
 * them being global. Here they are registered once, lazily, on the client only.
 */
export function registerGsap() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger, Flip, CustomEase)

  // Slow, heavy, cinematic — no overshoot. Used for menu rows and headline reveals.
  CustomEase.create('composed', '0.62, 0.05, 0.01, 0.99')
  CustomEase.create('composedOut', '0.16, 1, 0.3, 1')

  registered = true
}

export { gsap, ScrollTrigger, Flip, CustomEase }

/** Matches the original's motion vocabulary: 0.6s–1.4s, never springy. */
export const DUR = {
  fast: 0.6,
  base: 0.9,
  slow: 1.2,
  marqueePanel: 20,
} as const
