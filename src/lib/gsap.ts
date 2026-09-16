'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

let registered = false

/**
 * Registered once, lazily, and on the client only — these plugins touch window
 * on import, so they must never run during a server render.
 */
export function registerGsap() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger, CustomEase)

  // Frames are never dropped to catch up, and transforms always go to the GPU.
  gsap.ticker.lagSmoothing(0)
  gsap.config({ force3D: true })

  // CSS `ease`, which the hover and slider interactions are timed against.
  CustomEase.create('cssEase', '0.25, 0.1, 0.25, 1')

  registered = true
}

export { gsap, ScrollTrigger, CustomEase }

/**
 * Interaction-builder easing names, mapped to their GSAP equivalents so the
 * timings below read the same way they were authored.
 */
export const EASE = {
  linear: 'none',
  ease: 'cssEase',
  outBack: 'back.out(1.70158)',
  outExpo: 'expo.out',
  outQuad: 'power1.out',
  inOutQuad: 'power1.inOut',
} as const

/**
 * Scroll-linked interactions are authored with a 0–100 "smoothing" value: each
 * frame closes that share of the gap to the target. GSAP expresses the same lag
 * as scrub seconds. At 60fps, smoothing 50 reaches 95% in ~70ms and 81 in
 * ~240ms, which is what these return.
 */
export function scrubFor(smoothing: number) {
  if (smoothing >= 81) return 0.25
  if (smoothing >= 50) return 0.1
  return true
}

/** Desktop and tablet breakpoints the hover interactions are gated to. */
export const MQ = {
  desktop: '(min-width: 992px)',
  tabletUp: '(min-width: 768px)',
} as const
