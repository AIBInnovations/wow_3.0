'use client'

import SplitType from 'split-type'
import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useFontsReady } from '@/hooks/useFontsReady'
import { unwrapInitials } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import { disciplinesHero } from '@/data/disciplines'

/**
 * Disciplines hero: no photograph, only type on the wine ground.
 *
 * The load sequence, on one timeline:
 *
 *   0.20s  the label rises out of its clip
 *   0.40s  the first headline row rises word by word, its script initial fading
 *          up in place; 0.65s the second row
 *   1.30s  the statement's lines rise, fading in, a short stagger apart
 */
export default function DisciplinesHero() {
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

    const rows = q('[data-hero-row]') as HTMLElement[]
    const statements = q('.disc-hero_statement') as HTMLElement[]

    const rowSplits = rows.map(
      (row) => new SplitType(row, { types: 'lines,words', tagName: 'span', lineClass: 'line', wordClass: 'word' })
    )
    const statementSplits = statements.map(
      (p) => new SplitType(p, { types: 'lines', tagName: 'span', lineClass: 'line' })
    )
    for (const split of statementSplits) {
      for (const line of (split.lines ?? []) as HTMLElement[]) {
        const inner = document.createElement('span')
        inner.className = 'p-line-inner'
        while (line.firstChild) inner.appendChild(line.firstChild)
        line.appendChild(inner)
      }
    }
    rows.forEach((row) => unwrapInitials(row))

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.set('.hw', { autoAlpha: 1 })
      tl.from('.disc-hero_label', { yPercent: 100, ease: 'power3.out', duration: 1.5 }, 0.2)
      rows.forEach((row, i) => {
        const words = row.querySelectorAll('.word')
        tl.from(words, { yPercent: 100, stagger: 0.08, ease: 'power3.out', duration: 2 }, 0.4 + i * 0.25)
      })
      tl.from('.disc-hero_title .initial', { opacity: 0, yPercent: 12, ease: 'power3.out', duration: 2 }, 0.4)
      tl.from('.p-line-inner', { yPercent: 100, opacity: 0, stagger: 0.06, ease: 'power3.out', duration: 1.5 }, 1.3)
    }, section)

    // Line breaks are measured; after a width change the statement drops back to
    // plain text rather than keeping stale lines.
    let width = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === width) return
      width = window.innerWidth
      statementSplits.forEach((s) => s.revert())
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
      statementSplits.forEach((s) => s.revert())
      rowSplits.forEach((s) => s.revert())
    }
  }, [reduced, fontsReady])

  const [rowOne, rowTwo] = disciplinesHero.title

  return (
    <section ref={sectionRef} data-theme="inherit" className="disc-hero">
      <div className="u-container disc-hero_contain">
        <div className="hw">
          <div className="div-hide">
            <p className="disc-hero_label">{disciplinesHero.label}</p>
          </div>
          <h1 className="disc-hero_title">
            <span data-hero-row="one" className="disc-hero_row">
              <Initial>{rowOne}</Initial>
            </span>
            <span data-hero-row="two" className="disc-hero_row">
              {rowTwo}
            </span>
          </h1>
          <p className="disc-hero_statement">{disciplinesHero.statement}</p>
        </div>
      </div>
    </section>
  )
}
