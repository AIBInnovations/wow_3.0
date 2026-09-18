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
 * Plays `tl` the first time `el` rises past `ratio` of the viewport, then stops
 * listening.
 *
 * A reveal only ever runs forwards. Reversing it on the way past — which is what
 * the source site did — takes a heading back out while its section is still on
 * screen, so scrolling through the page reads as each section deleting itself
 * and drawing itself again.
 *
 * Anything already above that mark when the trigger is built is put straight to
 * its finished state. The split waits on webfonts and then a further second, so
 * on a slow connection an element can be scrolled past before its trigger
 * exists, and a play-once trigger would otherwise leave it hidden for good.
 */
function revealOnce(el: HTMLElement, tl: gsap.core.Timeline, ratio: number) {
  if (el.getBoundingClientRect().top < window.innerHeight * ratio) {
    tl.progress(1)
    return null
  }
  return ScrollTrigger.create({
    trigger: el,
    start: `top ${ratio * 100}%`,
    once: true,
    onEnter: () => tl.play(),
  })
}

/**
 * Line reveal for elements carrying `js-line-animation`.
 *
 * Each line rises from beneath its own clip, once, when the element comes up
 * into the lower fifth of the screen. It stays put from then on.
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

        const tl = gsap.timeline({ paused: true })
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
        const st = revealOnce(el, tl, 0.8)

        return () => {
          st?.kill()
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
 * rises. Like the line reveal it runs once, as the element first comes into view.
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

        const tl = gsap.timeline({ paused: true })
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
        // Its own trigger sat at `top bottom`, so the flip ran the moment any of
        // it touched the screen; kept here so the reveal is not already over by
        // the time the element is readable.
        const st = revealOnce(el, tl, 0.95)

        return () => {
          st?.kill()
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
