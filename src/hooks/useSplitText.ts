'use client'

import SplitType from 'split-type'
import type { RefObject } from 'react'
import { gsap, ScrollTrigger, registerGsap, DUR } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import { useReducedMotion } from './useReducedMotion'
import { useFontsReady } from './useFontsReady'

/**
 * Wraps the contents of each SplitType line in an inner span so the line box
 * can clip (`overflow: hidden`) while the inner span translates. This is the
 * `.line > .line-inner` structure site.css already styles.
 */
function wrapLines(lines: HTMLElement[], innerClass: string) {
  return lines.map((line) => {
    const inner = document.createElement('span')
    inner.className = innerClass
    inner.style.display = 'block'
    inner.style.willChange = 'transform'
    while (line.firstChild) inner.appendChild(line.firstChild)
    line.appendChild(inner)
    return inner
  })
}

type LineRevealOptions = {
  /** Element that triggers the reveal. Defaults to the text element itself. */
  trigger?: RefObject<HTMLElement | null>
  /** Delay before the first line moves, in seconds. */
  delay?: number
  /** Play as soon as it mounts rather than waiting for scroll. */
  immediate?: boolean
  innerClass?: string
}

/**
 * Line-by-line rise. Each line starts at translateY(110%) inside a clipped box
 * and settles to 0 — the reveal used for every major headline in the original.
 */
export function useLineReveal(
  ref: RefObject<HTMLElement | null>,
  { trigger, delay = 0, immediate = false, innerClass = 'line-inner' }: LineRevealOptions = {}
) {
  const reduced = useReducedMotion()
  const fontsReady = useFontsReady()

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    registerGsap()

    if (reduced) {
      el.style.visibility = 'visible'
      return
    }

    // Measuring lines before the webfont lands bakes in the fallback's breaks.
    if (!fontsReady) return

    const split = new SplitType(el, { types: 'lines', lineClass: 'line' })
    const inners = wrapLines((split.lines ?? []) as HTMLElement[], innerClass)
    el.style.visibility = 'visible'

    const ctx = gsap.context(() => {
      gsap.set(inners, { yPercent: 110 })
      const tween = gsap.to(inners, {
        yPercent: 0,
        duration: DUR.slow,
        ease: 'composed',
        stagger: 0.09,
        delay,
        paused: !immediate,
      })

      if (!immediate) {
        ScrollTrigger.create({
          trigger: trigger?.current ?? el,
          start: 'top 85%',
          once: true,
          onEnter: () => tween.play(),
        })
      }
    }, el)

    return () => {
      ctx.revert()
      split.revert()
    }
  }, [ref, trigger, delay, immediate, innerClass, reduced, fontsReady])
}

/**
 * Per-character brightening tied to scroll position — the `.scrub-txt` block in
 * the atelier statement, where characters light up as the section passes.
 */
export function useCharScrub(
  ref: RefObject<HTMLElement | null>,
  trigger: RefObject<HTMLElement | null>
) {
  const reduced = useReducedMotion()
  const fontsReady = useFontsReady()

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    registerGsap()

    if (reduced) {
      el.style.color = 'var(--theme--text)'
      return
    }

    if (!fontsReady) return

    const split = new SplitType(el, {
      types: 'lines,words,chars',
      lineClass: 'line',
      wordClass: 'word',
      charClass: 'char',
    })

    const ctx = gsap.context(() => {
      gsap.fromTo(
        split.chars,
        { color: 'var(--light-fade-2)' },
        {
          color: 'var(--theme--text)',
          ease: 'none',
          stagger: 1,
          scrollTrigger: {
            trigger: trigger.current ?? el,
            start: 'top 75%',
            end: 'bottom 55%',
            scrub: true,
          },
        }
      )
    }, el)

    return () => {
      ctx.revert()
      split.revert()
    }
  }, [ref, trigger, reduced, fontsReady])
}

/**
 * Word-by-word rise for the oversized display headings that carry a
 * `js-letter-animation` attribute.
 */
export function useWordReveal(ref: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion()
  const fontsReady = useFontsReady()

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    registerGsap()
    if (reduced || !fontsReady) return

    const split = new SplitType(el, {
      types: 'lines,words',
      lineClass: 'line',
      wordClass: 'word',
    })

    const ctx = gsap.context(() => {
      // The line box clips; words ride up inside it.
      ;(split.lines ?? []).forEach((line) => {
        ;(line as HTMLElement).style.overflow = 'hidden'
      })
      gsap.from(split.words, {
        yPercent: 110,
        duration: DUR.slow,
        ease: 'composed',
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    }, el)

    return () => {
      ctx.revert()
      split.revert()
    }
  }, [ref, reduced, fontsReady])
}
