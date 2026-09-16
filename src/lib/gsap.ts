'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { CustomEase } from 'gsap/CustomEase'

let registered = false

/**
 * Registered once, lazily, and on the client only — these plugins touch window
 * on import, so they must never run during a server render.
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
