'use client'

import SplitType from 'split-type'
import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useFontsReady } from '@/hooks/useFontsReady'
import { unwrapInitials } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import { INTRO } from '@/data/celebrations'

/** Wraps each split line's contents in a block that does the moving. */
function wrapLines(lines: HTMLElement[]) {
  return lines.map((line) => {
    const inner = document.createElement('span')
    inner.className = 'line-inner'
    while (line.firstChild) inner.appendChild(line.firstChild)
    line.appendChild(inner)
    return inner
  })
}

/**
 * Celebrations hero: one screen of photograph under a light neutral scrim, the
 * headline seated at the foot of it.
 *
 * The load sequence, on one timeline:
 *
 *   0.20s  caption rises out of its clip
 *   0.40s  "Four Days", then "One Celebration", rise line by line from beneath
 *          their line clips; the script F fades up in place
 *   1.40s  the statement's lines rise, fading in, a short stagger apart
 *
 * Scrolling out, the photograph — 120% of the hero's height — travels upward
 * more slowly than the page, never far enough to expose an edge.
 */
export default function CelebrationsHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const fontsReady = useFontsReady()

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    registerGsap()

    const q = gsap.utils.selector(section)

    if (reduced) {
      gsap.set(q('.hw'), { autoAlpha: 1 })
      return
    }
    // Lines are measured, so the split has to wait for the real faces.
    if (!fontsReady) return

    const rows = q('.cel-hero_row') as HTMLElement[]
    const para = q('.cel-hero_p')[0] as HTMLElement | undefined

    const rowSplits = rows.map((row) => new SplitType(row, { types: 'lines', tagName: 'span', lineClass: 'line' }))
    const paraSplit = para ? new SplitType(para, { types: 'lines', tagName: 'span', lineClass: 'line' }) : null

    const rowInners = rowSplits.flatMap((s) => wrapLines((s.lines ?? []) as HTMLElement[]))
    const paraInners = paraSplit ? wrapLines((paraSplit.lines ?? []) as HTMLElement[]) : []
    // The script initial leaves any word mask; it fades in with its row.
    const initials = rows.flatMap((row) => unwrapInitials(row))

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.set('.hw', { autoAlpha: 1 })
      tl.from('.cel-hero_label-inner', { yPercent: 100, duration: 1.5, ease: 'power3.out' }, 0.2)
      tl.from(rowInners, { yPercent: 100, duration: 2, ease: 'power3.out', stagger: 0.2 }, 0.4)
      if (initials.length) {
        tl.from(initials, { opacity: 0, yPercent: 12, duration: 2, ease: 'power3.out' }, 0.4)
      }
      if (paraInners.length) {
        tl.from(paraInners, { yPercent: 100, opacity: 0, duration: 1.5, ease: 'power3.out', stagger: 0.06 }, 1.4)
      }

      gsap.to('.cel-hero_bg_img', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, section)

    // Line breaks are measured; after a width change the split would hold stale
    // lines, so the text drops back to plain flow.
    let width = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === width) return
      width = window.innerWidth
      paraSplit?.revert()
      rowSplits.forEach((s) => s.revert())
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
      paraSplit?.revert()
      rowSplits.forEach((s) => s.revert())
    }
  }, [reduced, fontsReady])

  return (
    <section ref={sectionRef} data-theme="inherit" className="cel-hero">
      <div className="cel-hero_bg">
        <img
          src={INTRO.photo.src}
          srcSet={`${INTRO.photo.src800} ${INTRO.photo.w800}w, ${INTRO.photo.src} ${INTRO.photo.w}w`}
          sizes="100vw"
          width={INTRO.photo.w}
          height={INTRO.photo.h}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="cel-hero_bg_img"
        />
        <div className="cel-hero_scrim" />
      </div>

      <div className="u-container cel-hero_contain" data-padding-top="none" data-padding-bottom="none">
        <div className="hw cel-hero_layout">
          <div className="cel-hero_head">
            <p className="cel-label cel-hero_label">
              <span className="cel-hero_label-inner">{INTRO.caption}</span>
            </p>
            <h1 className="cel-hero_title">
              <span className="cel-hero_row">
                <Initial>{INTRO.title[0]}</Initial>
              </span>
              <span className="cel-hero_row">{INTRO.title[1]}</span>
            </h1>
          </div>
          <p className="cel-hero_p">{INTRO.text}</p>
        </div>
      </div>
    </section>
  )
}
