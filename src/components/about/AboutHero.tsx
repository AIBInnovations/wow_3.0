'use client'

import SplitType from 'split-type'
import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useFontsReady } from '@/hooks/useFontsReady'
import { unwrapInitials } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import { aboutHero, type HeroPhrase } from '@/data/about'

/**
 * About hero: an oversized photograph behind a headline broken across a
 * twelve-column grid, with the founder's statement set in two columns.
 *
 * The load sequence, on one timeline:
 *
 *   0.30s  first headline row rises word by word from beneath its line clip,
 *          its script initial fading up in place
 *   0.60s  second row, then 0.90s the third
 *   1.60s  kicker rises out of its clip
 *   1.80s  paragraph lines rise, fading in, a short stagger apart
 *
 * Scrolling out, the photograph — 120% of the hero's height — travels upward
 * more slowly than the page, and never far enough to expose an edge.
 */
export default function AboutHero() {
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
    const paras = q('.about-hero_p') as HTMLElement[]

    const rowSplits = rows.map(
      (row) => new SplitType(row, { types: 'lines,words', tagName: 'span', lineClass: 'line', wordClass: 'word' })
    )
    const paraSplits = paras.map((p) => new SplitType(p, { types: 'lines', tagName: 'span', lineClass: 'line' }))

    // Each paragraph line gets an inner block that does the moving.
    for (const split of paraSplits) {
      for (const line of (split.lines ?? []) as HTMLElement[]) {
        const inner = document.createElement('span')
        inner.className = 'p-line-inner'
        while (line.firstChild) inner.appendChild(line.firstChild)
        line.appendChild(inner)
      }
    }

    // The script initial leaves the word masks; it fades in with its row.
    rows.forEach((row) => unwrapInitials(row))

    // Deep descenders would otherwise be cut by the line clip mid-rise.
    for (const split of rowSplits) {
      for (const word of (split.words ?? []) as HTMLElement[]) {
        word.style.paddingBottom = '3vw'
        word.style.marginBottom = '-3vw'
      }
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.set('.hw', { autoAlpha: 1 })

      // Rows reveal as groups: row one, then both halves of row two, then row three.
      const groups = [
        ['one'],
        ['two-left', 'two-right'],
        ['three-left', 'three-right'],
      ]
      groups.forEach((names, i) => {
        const words = names.flatMap((name) => gsap.utils.toArray<HTMLElement>(`[data-hero-row="${name}"] .word`))
        tl.from(words, { yPercent: 100, stagger: 0.1, ease: 'power3.out', duration: 2 }, 0.3 + i * 0.3)
      })
      tl.from('.about-hero_top-row_text .initial', { opacity: 0, yPercent: 12, ease: 'power3.out', duration: 2 }, 0.3)

      tl.from('.about-hero_kicker_txt', { yPercent: 100, ease: 'power3.out', duration: 1.5 }, 1.6)
      tl.from('.p-line-inner', { yPercent: 100, opacity: 0, stagger: 0.05, ease: 'power3.out', duration: 1.5 }, 1.8)

      gsap.to('.about-hero_bg_img', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, section)

    // Line breaks are measured; a width change after the reveal would leave the
    // columns broken on stale lines, so drop back to plain text.
    let width = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === width) return
      width = window.innerWidth
      paraSplits.forEach((s) => s.revert())
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
      paraSplits.forEach((s) => s.revert())
      rowSplits.forEach((s) => s.revert())
    }
  }, [reduced, fontsReady])

  const { image, mobileImage } = aboutHero

  return (
    <section ref={sectionRef} data-theme="inherit" className="about-hero_wrap">
      <div className="about-hero_bg_wrap">
        <img src={mobileImage.src} alt={mobileImage.alt} className="about-hero_bg_mobile" />
        <img src={image.src} alt={image.alt} className="about-hero_bg_img" />
        <div className="about-hero_bg_overlay" />
      </div>

      <div className="u-container about-hero_contain">
        <div className="hw">
          <div className="about-hero_layout top">
            <div className="about-hero_top-row_wrap">
              <Phrase row="one" phrase={aboutHero.rowOne} extra="row-one" initial />
            </div>
            <div className="about-hero_row-two_wrap first">
              <Phrase row="two-left" phrase={aboutHero.rowTwoLeft} />
            </div>
            <div className="about-hero_row-two_wrap second">
              <Phrase row="two-right" phrase={aboutHero.rowTwoRight} />
            </div>
            <div className="about-hero_bottom-row_wrap left-side">
              <Phrase row="three-left" phrase={aboutHero.rowThreeLeft} />
            </div>
            <div className="about-hero_bottom-row_wrap right-side">
              <Phrase row="three-right" phrase={aboutHero.rowThreeRight} />
            </div>
          </div>
        </div>

        <div className="about-hero_bottom-content_wrap">
          <div className="hw">
            <div className="about-hero_layout margin-bottom">
              <div className="about-hero_kicker_wrap">
                <div className="div-hide">
                  <h1 className="about-hero_kicker_txt kicker">
                    {aboutHero.kicker[0]}
                    <br />
                    {aboutHero.kicker[1]}
                  </h1>
                </div>
              </div>
              {aboutHero.paragraphs.map((text, i) => (
                <div key={i} className="about-hero_p-wrap">
                  <p className="about-hero_p">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** One phrase of the headline. Only the opening phrase carries the script initial. */
function Phrase({ row, phrase, extra, initial }: { row: string; phrase: HeroPhrase; extra?: string; initial?: boolean }) {
  const className = ['about-hero_top-row_text', extra ?? ''].filter(Boolean).join(' ')
  return (
    <p data-hero-row={row} className={className}>
      {initial ? <Initial>{phrase.text}</Initial> : phrase.text}
    </p>
  )
}
