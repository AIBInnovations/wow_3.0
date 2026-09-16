'use client'

import Lenis from 'lenis'
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type SmoothScrollApi = {
  /** Resume scrolling — called when the fullscreen menu closes. */
  start: () => void
  /** Lock scrolling — called when the fullscreen menu opens. */
  stop: () => void
}

const SmoothScrollContext = createContext<SmoothScrollApi>({
  start: () => {},
  stop: () => {},
})

export const useSmoothScroll = () => useContext(SmoothScrollContext)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const reduced = useReducedMotion()
  const [api, setApi] = useState<SmoothScrollApi>({ start: () => {}, stop: () => {} })

  useEffect(() => {
    registerGsap()

    if (reduced) {
      // No smoothing at all; still expose a working scroll lock for the menu.
      setApi({
        start: () => {
          document.documentElement.style.overflow = ''
        },
        stop: () => {
          document.documentElement.style.overflow = 'hidden'
        },
      })
      return
    }

    // Values taken verbatim from the export's inline Lenis config.
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.7,
      infinite: false,
      gestureOrientation: 'vertical',
      syncTouch: false,
    })
    lenisRef.current = lenis

    // Drive Lenis from GSAP's ticker so ScrollTrigger and Lenis share one clock.
    // The export ships this wiring commented out, which leaves ScrollTrigger
    // reading stale positions; enabling it is what keeps the scroll-driven
    // sections in sync with the smoothed scroll position.
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    setApi({
      start: () => lenis.start(),
      stop: () => lenis.stop(),
    })

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>
}
