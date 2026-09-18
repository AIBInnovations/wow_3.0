'use client'

import SplitType from 'split-type'
import { useRef, type RefObject } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useFontsReady } from '@/hooks/useFontsReady'
import Initial from '@/components/Initial'
import Frame from './Frame'
import type { CelebrationChapter } from '@/data/celebrations'

/**
 * Line reveal for the sticky statement, in the same vocabulary as
 * `useLineAnimation`: each line rises from beneath its own clip, 2s power3.out,
 * 0.2s apart, and reverses when the chapter is left. The trigger is the chapter
 * rather than the statement itself, because the statement is sticky — measured
 * on its own it would "leave" the viewport at its natural position and reverse
 * out while still on screen.
 */
function useStickyLineReveal(ref: RefObject<HTMLElement | null>, sectionRef: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion()
  const fontsReady = useFontsReady()

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    const section = sectionRef.current
    if (!el || !section) return
    registerGsap()

    if (reduced) {
      el.style.visibility = 'visible'
      return
    }
    if (!fontsReady) return

    const build = () => {
      gsap.set(el, { autoAlpha: 1 })
      const split = new SplitType(el, { types: 'lines', tagName: 'span', lineClass: 'line' })
      const inners = ((split.lines ?? []) as HTMLElement[]).map((line) => {
        const inner = document.createElement('span')
        inner.className = 'line-inner'
        while (line.firstChild) inner.appendChild(line.firstChild)
        line.appendChild(inner)
        return inner
      })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          end: 'bottom top',
          toggleActions: 'play reverse play reverse',
        },
      })
      tl.fromTo(inners, { yPercent: 100 }, { yPercent: 0, duration: 2, delay: 0.1, ease: 'power3.out', stagger: 0.2 })
      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
        split.revert()
      }
    }

    // Lines are measured, so a width change rebuilds the split; height-only
    // resizes (mobile URL bars) are ignored.
    let teardown: (() => void) | null = null
    let width = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === width) return
      width = window.innerWidth
      teardown?.()
      teardown = build()
      ScrollTrigger.refresh()
    }
    const timer = window.setTimeout(() => {
      teardown = build()
      window.addEventListener('resize', onResize)
    }, 1000)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      teardown?.()
    }
  }, [ref, sectionRef, reduced, fontsReady])
}

/**
 * One day of the celebration.
 *
 * The left column is sticky for the length of the chapter: the numeral, the
 * chapter name and the three-line statement, which rises line by line as the
 * chapter arrives. The right column scrolls past it — the opening photograph,
 * the prose beside a tall frame, the line that sits between the wide and the
 * narrow photograph, the lists or the cards, and the closing line.
 *
 * Every frame wipes up out of a bottom clip as it enters. The narrow frame of
 * the pair is oversized and drifts slowly against the scroll. On a phone the
 * columns stack and nothing sticks.
 */
export default function Chapter({ chapter, index }: { chapter: CelebrationChapter; index: number }) {
  const sectionRef = useRef<HTMLElement>(null)
  const linesRef = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()

  useStickyLineReveal(linesRef, sectionRef)

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    registerGsap()

    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>('.cel-frame')
      if (reduced) {
        gsap.set(frames, { clipPath: 'inset(0% 0 0 0)' })
        return
      }

      frames.forEach((frame) => {
        gsap.fromTo(
          frame,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: frame, start: 'top 85%' },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>('.cel-frame.is-parallax img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  const { slug, numeral, name, lines, cols, middle, close, lists, cards, photos } = chapter
  const tone = index % 2 === 0 ? 'is-wine' : 'is-dark'

  return (
    <section ref={sectionRef} id={slug} data-theme="inherit" className={`cel-chapter ${tone}`}>
      <div className="u-container cel-chapter_contain" data-padding-top="main" data-padding-bottom="main">
        <div className="cel-chapter_grid">
          <div className="cel-chapter_aside">
            <div className="cel-chapter_sticky">
              <p className="cel-chapter_num" aria-hidden="true">
                {numeral}
              </p>
              <h2 className="cel-chapter_name">
                <Initial>{name}</Initial>
              </h2>
              <p ref={linesRef} className="cel-chapter_lines">
                {lines[0]}
                <br />
                {lines[1]}
                <br />
                {lines[2]}
              </p>
            </div>
          </div>

          <div className="cel-chapter_flow">
            <Frame photo={photos.open} alt={name} className="cel-chapter_open" sizes="(max-width: 767px) 100vw, 55vw" />

            <div className="cel-chapter_cols">
              <div className="cel-chapter_cols_text">
                <p className="cel-label cel-chapter_pretitle">{cols.pretitle}</p>
                {cols.paragraphs.map((text, i) => (
                  <p key={i} className="cel-p">
                    {text}
                  </p>
                ))}
              </div>
              <Frame photo={photos.cols} className="cel-chapter_cols_frame" sizes="(max-width: 767px) 60vw, 22vw" />
            </div>

            <div className="cel-chapter_pair">
              <div className="cel-chapter_pair_left">
                <Frame photo={photos.wide} sizes="(max-width: 767px) 100vw, 32vw" />
                <h3 className="cel-chapter_middle u-text-h4">{middle}</h3>
              </div>
              <Frame photo={photos.narrow} className="cel-chapter_pair_narrow" parallax sizes="(max-width: 767px) 70vw, 22vw" />
            </div>

            {lists ? (
              <div className="cel-lists">
                {lists.map((list) => (
                  <div key={list.title} className="cel-list">
                    <p className="cel-label cel-list_title">{list.title}</p>
                    <ul className="cel-list_items">
                      {list.items.map((item) => (
                        <li key={item} className="cel-list_item">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}

            {cards ? (
              <div className="cel-cards">
                {cards.map((card) => (
                  <div key={card.title} className="cel-card">
                    <h4 className="cel-card_title u-text-h4">{card.title}</h4>
                    <p className="cel-card_text">{card.text}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <p className="cel-chapter_close">{close}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
