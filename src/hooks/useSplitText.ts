'use client'

import SplitType from 'split-type'
import type { RefObject } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import { useReducedMotion } from './useReducedMotion'
import { useFontsReady } from './useFontsReady'

/** Wraps each split piece's contents in a block span that does the moving. */
function wrapInner(pieces: HTMLElement[], className: string) {
  return pieces.map((piece) => {
    const inner = document.createElement('span')
    inner.className = className
    inner.style.display = 'block'
    while (piece.firstChild) inner.appendChild(piece.firstChild)
    piece.appendChild(inner)
    return inner
  })
}

/**
 * Returns a heading's script initials to plain text and lifts them out of any
 * word or character wrapper the splitter put them in.
 *
 * A script capital's loops reach well past a normal letter's box — above, below
 * and sideways. Left inside a character or word clip they are cut at rest, and
 * mid-reveal they show as a sliver of loop before the letter arrives. Outside the
 * clips they are whole, and they fade in with their heading instead of rising
 * through a mask. Everything else in the heading keeps its exact reveal.
 */
export function unwrapInitials(root: HTMLElement) {
  const initials = [...root.querySelectorAll<HTMLElement>('.initial')]
  for (const initial of initials) {
    initial.textContent = initial.dataset.letter ?? initial.textContent ?? ''
    let wrapper = initial.parentElement
    while (wrapper && wrapper !== root && wrapper.matches('.char, .char-inner, .word')) {
      wrapper.parentElement?.insertBefore(initial, wrapper)
      if (!wrapper.textContent?.trim()) wrapper.remove()
      wrapper = initial.parentElement
    }
  }
  return initials
}

/**
 * Re-runs `build` whenever the viewport width changes, tearing down the previous
 * split first. Height-only resizes (mobile URL bars) are ignored, because
 * re-splitting mid-scroll would visibly restart the animation.
 */
function rebuildOnWidthChange(build: () => () => void) {
  let teardown = build()
  let width = window.innerWidth
  const onResize = () => {
    if (window.innerWidth === width) return
    width = window.innerWidth
    teardown()
    teardown = build()
    ScrollTrigger.refresh()
  }
  window.addEventListener('resize', onResize)
  return () => {
    window.removeEventListener('resize', onResize)
    teardown()
  }
}

/** Both reveal types start a beat after load, once layout and images settle. */
const SETTLE_MS = 1000

/**
 * Line reveal for elements carrying `js-line-animation`.
 *
 * Each line rises from beneath its own clip. It plays on the way in, reverses
 * when the element scrolls back out, and plays again on return — so the reveal
 * is repeatable in both directions rather than a one-off.
 */
export function useLineAnimation(ref: RefObject<HTMLElement | null>) {
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
    if (!fontsReady) return

    let teardown: (() => void) | null = null
    const timer = window.setTimeout(() => {
      teardown = rebuildOnWidthChange(() => {
        gsap.set(el, { autoAlpha: 1 })
        const split = new SplitType(el, { types: 'lines', tagName: 'span', lineClass: 'line' })
        const inners = wrapInner((split.lines ?? []) as HTMLElement[], 'line-inner')
        const initials = unwrapInitials(el)

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse',
          },
        })
        tl.fromTo(
          inners,
          { yPercent: 100 },
          { yPercent: 0, duration: 2, delay: 0.1, ease: 'power3.out', stagger: 0.2 }
        )
        if (initials.length) {
          tl.fromTo(
            initials,
            { opacity: 0, yPercent: 12 },
            { opacity: 1, yPercent: 0, duration: 2, delay: 0.1, ease: 'power3.out' },
            0
          )
        }

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
          split.revert()
        }
      })
    }, SETTLE_MS)

    return () => {
      window.clearTimeout(timer)
      teardown?.()
    }
  }, [ref, reduced, fontsReady])
}

/**
 * Letter flip for elements carrying `js-letter-animation`.
 *
 * Every character turns up from beneath its clip, rotating 180° on X as it
 * rises. Like the line reveal it replays in both directions.
 */
export function useLetterAnimation(ref: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion()
  const fontsReady = useFontsReady()

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    registerGsap()

    if (reduced || !fontsReady) return

    let teardown: (() => void) | null = null
    const timer = window.setTimeout(() => {
      teardown = rebuildOnWidthChange(() => {
        gsap.set(el, { autoAlpha: 1 })
        const split = new SplitType(el, {
          types: 'words,chars',
          tagName: 'span',
          wordClass: 'word',
          charClass: 'char',
        })
        const initials = unwrapInitials(el)
        const inners = wrapInner([...el.querySelectorAll<HTMLElement>('.char')], 'char-inner')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse',
          },
        })
        tl.fromTo(
          inners,
          { yPercent: 100, rotateX: 180 },
          { yPercent: 0, rotateX: 0, duration: 1.05, ease: 'power3.out', stagger: 0.04 }
        )
        if (initials.length) {
          tl.fromTo(
            initials,
            { opacity: 0, yPercent: 12 },
            { opacity: 1, yPercent: 0, duration: 1.05, ease: 'power3.out' },
            0
          )
        }

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
          split.revert()
        }
      })
    }, SETTLE_MS)

    return () => {
      window.clearTimeout(timer)
      teardown?.()
    }
  }, [ref, reduced, fontsReady])
}

/**
 * Character-by-character brightening for `.scrub-txt`, tied to scroll.
 *
 * Each character snaps (steps(1)) rather than fades, one after another, so the
 * statement appears to be typed out as the section passes.
 */
export function useScrubText(ref: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion()
  const fontsReady = useFontsReady()

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    registerGsap()

    const lit = getComputedStyle(document.documentElement)
      .getPropertyValue('--theme--text')
      .trim()

    if (reduced) {
      el.style.color = lit
      return
    }
    if (!fontsReady) return

    return rebuildOnWidthChange(() => {
      const split = new SplitType(el, {
        types: 'lines,words,chars',
        tagName: 'span',
        lineClass: 'line',
        wordClass: 'word',
        charClass: 'char',
      })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 80%', scrub: true },
      })
      for (const char of (split.chars ?? []) as HTMLElement[]) {
        tl.to(char, { color: lit, ease: 'steps(1)' })
      }

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
        split.revert()
      }
    })
  }, [ref, reduced, fontsReady])
}
