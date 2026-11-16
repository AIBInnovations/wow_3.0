'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineAnimation } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import { MainButton } from '@/components/HeroMarquee'
import { homeAtelier, homeAtelierCards as chapters } from '@/data/home'

/*
 * The scroll is measured in "beats". A chapter holds for HOLD beats, then the
 * next photograph takes SLIDE beats to come up over it; the text changes once
 * that photograph is half way.
 */
const HOLD = 0.6
const SLIDE = 1
/** How far up each covered print steps, in % of its height, and how much smaller. */
const PEEK = 4
const SHRINK = 0.05
/** Only this many earlier prints show their edges; deeper ones sit behind them. */
const PEEKS = 3
/** How dark a print goes for each print laid over it, up to the most. */
const VEIL_STEP = 0.3
const VEIL_MAX = 0.8

const slideStart = (i: number) => HOLD + (i - 1) * (HOLD + SLIDE)
const TOTAL = HOLD + (chapters.length - 1) * (HOLD + SLIDE) + HOLD

/**
 * The document's sections as a split screen, pinned while it is read.
 *
 * Left, the words: one chapter at a time, the outgoing lines lifting away and
 * the next rising in behind them, over a ground that turns to each section's
 * colour. Right, the photographs, laid one over another like prints on a desk:
 * each comes up from below over the last, which steps back, a little higher,
 * smaller and darker, so the edges of the earlier prints show above it.
 *
 * The track is several screens tall and the stage sticks within it; one scrubbed
 * timeline moves the prints, and its position decides the chapter shown. Under
 * reduced motion the prints simply change with the words.
 */
export default function HomeAtelier() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  useLineAnimation(headingRef)

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    registerGsap()

    // The chapter whose photograph is more than half way up.
    const chapterAt = (beat: number) => {
      let n = 0
      for (let i = 1; i < chapters.length; i++) if (beat >= slideStart(i) + SLIDE / 2) n = i
      return n
    }

    const ctx = gsap.context(() => {
      const trigger = {
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self: ScrollTrigger) => setActive(chapterAt(self.progress * TOTAL)),
      }
      if (reduced) {
        ScrollTrigger.create(trigger)
        return
      }

      const prints = gsap.utils.toArray<HTMLElement>('.split_print')
      const imgs = prints.map((p) => p.querySelector('img'))
      const veils = prints.map((p) => p.querySelector('.split_veil'))
      const tl = gsap.timeline({ scrollTrigger: { ...trigger, scrub: 0.8 } })
      tl.set({}, {}, TOTAL) // the timeline spans every beat, holds included

      prints.forEach((print, i) => {
        if (i === 0) return
        const at = slideStart(i)
        // y: 0 clears the stylesheet's waiting offset, which GSAP would otherwise
        // read as pixels and keep under the percentage.
        tl.fromTo(print, { y: 0, yPercent: 112 }, { y: 0, yPercent: 0, ease: 'power1.inOut', duration: SLIDE }, at)
        tl.fromTo(imgs[i], { scale: 1.3, yPercent: -10 }, { scale: 1.08, yPercent: 0, ease: 'none', duration: SLIDE }, at)
        // Every print already down steps back once more.
        for (let j = 0; j < i; j++) {
          const depth = i - j
          const step = Math.min(depth, PEEKS)
          tl.to(prints[j], {
            yPercent: -PEEK * step,
            scale: 1 - SHRINK * step,
            ease: 'power1.inOut',
            duration: SLIDE,
          }, at)
          tl.to(veils[j], { opacity: Math.min(VEIL_MAX, VEIL_STEP * depth), ease: 'none', duration: SLIDE }, at)
        }
      })
    }, track)

    return () => ctx.revert()
  }, [reduced])

  const count = String(chapters.length).padStart(2, '0')
  const last = chapters.length - 1

  return (
    <section data-theme="inherit" className="home-atelier_wrap">
      <div className="u-container home-atelier_contain" data-padding-top="main">
        <div className="home-atelier_head">
          {/* Wrapped: .kicker grows to fill a flex column on its own. */}
          <div>
            <div className="kicker home-atelier_kicker">{homeAtelier.kicker}</div>
          </div>
          <h2 ref={headingRef} className="home-atelier_title" js-line-animation="">
            <Initial>{homeAtelier.heading}</Initial>
          </h2>
        </div>
      </div>

      <div
        ref={trackRef}
        className={`split_track${reduced ? ' is-still' : ''}`}
        style={{ '--n': chapters.length } as React.CSSProperties}
      >
        <div className="split_stage" style={{ '--ground': chapters[active].background } as React.CSSProperties}>
          <div className="split_grid">
            <div className="split_words">
              <div className="split_count" aria-hidden="true">
                <span className="split_count_now">{chapters[active].number}</span>
                <span className="split_count_line">
                  <span style={{ transform: `scaleX(${(active + 1) / chapters.length})` }} />
                </span>
                <span className="split_count_all">{count}</span>
              </div>

              <div className="split_texts">
                {chapters.map((chapter, i) => (
                  <article
                    key={chapter.number}
                    className="split_text"
                    data-state={i === active ? 'on' : i < active ? 'past' : 'next'}
                    aria-hidden={i !== active}
                    inert={i !== active}
                  >
                    <h3 className="split_title">
                      <Link href={chapter.href} className="split_title_link">
                        <Initial>{chapter.title}</Initial>
                      </Link>
                    </h3>
                    <p className="split_lead">{chapter.lead}</p>
                    <p className="split_p">{chapter.text}</p>
                    {chapter.closing ? <p className="split_closing">{chapter.closing}</p> : null}
                    <div className="split_foot">
                      {i === last ? (
                        <div className="btn-wrap split_cta">
                          <MainButton href={homeAtelier.cta.href} label={homeAtelier.cta.label} />
                        </div>
                      ) : (
                        <Link href={chapter.href} className="split_more">
                          Continue reading <span aria-hidden="true">→</span>
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="split_prints" aria-hidden="true">
              <div className="split_desk">
                {chapters.map((chapter, i) => (
                  <figure
                    key={chapter.number}
                    className="split_print"
                    data-on={i === active || undefined}
                    style={{ zIndex: i + 1 }}
                  >
                    <img
                      src={chapter.image}
                      srcSet={`${chapter.image} 800w, ${chapter.imageLarge} ${chapter.imageWidth}w`}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="split_veil" />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
