'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineAnimation } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import { MainButton } from '@/components/HeroMarquee'
import { homeAtelier, homeAtelierCards as chapters } from '@/data/home'

/*
 * The pinned scroll, as fractions of the track. The frame opens on the row
 * already laid out, the centre card largest, so it is never empty; then:
 *   0 → BEND     the row bends into a snake
 *   BEND → END   the cards travel along the snake, each section's photograph
 *                passing through the centre in turn; then a short hold
 */
const BEND = 0.08
const END = 0.95

/** The cards: every section's photograph, then every section's second one. */
const cards = [
  ...chapters.map((c) => ({ image: c.image, large: c.imageLarge, w: c.imageWidth })),
  ...chapters.map((c) => ({ image: c.second.image, large: c.second.imageLarge, w: c.second.imageWidth })),
]
const N = cards.length

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (v: number) => {
  const t = clamp01(v)
  return t * t * (3 - 2 * t)
}
/** A card's place along the snake from the centre, wrapped so the run has no ends. */
const wrap = (s: number) => ((((s + N / 2) % N) + N) % N) - N / 2

/**
 * Our Approach: the document's six sections as a run of photographs.
 *
 * A pinned frame, ruled with dashed lines like a contact sheet: the heading in
 * its top corner, the section in view at its foot. The photographs are laid
 * out in a row from the first, the centre card largest; as the page scrolls
 * the row bends into a snake and the cards travel along it, each section's photograph coming through the
 * centre, largest there and in its own colours, the others smaller and washed
 * in wine. When a section's photograph reaches the centre its heading and
 * opening line roll up into place: they slide out of a mask, never fade.
 *
 * One scrubbed value drives everything; each frame places every card from it.
 */
export default function HomeAtelier() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const bandRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(false)
  const reduced = useReducedMotion()
  useLineAnimation(headingRef)

  // The words roll in once the frame is on screen, not before.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true)
        io.disconnect()
      }
    }, { threshold: 0.1 })
    io.observe(track)
    return () => io.disconnect()
  }, [])

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current
    const band = bandRef.current
    if (!track || !band) return
    registerGsap()

    const els = Array.from(band.querySelectorAll<HTMLElement>('.snake_card'))
    const tints = els.map((el) => el.querySelector<HTMLElement>('.snake_tint')!)
    let W = 0
    let phone = false

    const size = () => {
      const r = band.getBoundingClientRect()
      phone = window.innerWidth < 768
      const bandH = r.height
      // Sized so the snake's highest and lowest cards stay within the band.
      W = phone ? Math.min(r.width * 0.48, bandH * 0.55) : Math.min(r.width * 0.2, bandH * 0.55)
      band.style.setProperty('--w', `${Math.round(W)}px`)
    }

    const state = { p: 0 }
    const render = () => {
      const p = state.p
      const bend = reduced ? 0 : smooth(p / BEND)
      const c = clamp01((p - BEND) / (END - BEND)) * (chapters.length - 1)
      setActive(Math.round(c))

      els.forEach((el, k) => {
        const s = wrap(k - c)
        const a = Math.abs(s)
        // The row: cards closer together the further out they are.
        const rowX = Math.sign(s) * W * (0.7 * a - 0.06 * a * a) * (phone ? 0.9 : 1)
        const rowScale = Math.max(0.3, 1 - 0.17 * a)
        // The snake: an S through the centre.
        const snakeY = W * 0.36 * Math.sin(s * 0.9)
        const x = rowX
        const y = snakeY * bend
        const scale = rowScale
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`
        // Only where the run wraps round, out past the fourth card, does a card go.
        el.style.opacity = String(1 - clamp01((a - 4.2) / 0.5))
        el.style.zIndex = String(100 - Math.round(a * 10))
        tints[k].style.opacity = String(Math.min(1, a) * 0.85)
      })
    }

    size()
    render()
    const ctx = gsap.context(() => {
      gsap.to(state, {
        p: 1,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: 0.9 },
      })
    }, track)
    const onResize = () => {
      size()
      render()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [reduced])

  const count = String(chapters.length).padStart(2, '0')
  const last = chapters.length - 1
  const stateOf = (i: number) => (!shown ? 'next' : i === active ? 'on' : i < active ? 'past' : 'next')

  return (
    <section data-theme="inherit" className="home-atelier_wrap">
      <div ref={trackRef} className="snake_track" style={{ '--n': chapters.length } as React.CSSProperties}>
        <div className="snake_stage">
          {/* The contact sheet's rules, and a dot where they cross. */}
          <div className="snake_rules" aria-hidden="true">
            <span className="snake_rule is-x1" />
            <span className="snake_rule is-x2" />
            <span className="snake_rule is-y1" />
            <span className="snake_rule is-y2" />
            <span className="snake_dot is-a" />
            <span className="snake_dot is-b" />
            <span className="snake_dot is-c" />
            <span className="snake_dot is-d" />
          </div>

          <div className="snake_label" aria-hidden="true">
            <span>{homeAtelier.kicker}</span>
            <span>Six chapters</span>
            <span>From the atelier</span>
          </div>

          <h2 ref={headingRef} className="snake_heading" js-line-animation="">
            <Initial>{homeAtelier.heading}</Initial>
          </h2>

          <div ref={bandRef} className="snake_band" aria-hidden="true">
            {cards.map((card) => (
              <figure key={card.image} className="snake_card">
                <img
                  src={card.image}
                  srcSet={`${card.image} 800w, ${card.large} ${card.w}w`}
                  sizes="(min-width: 768px) 24vw, 52vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
                <span className="snake_tint" />
              </figure>
            ))}
          </div>

          {/* The section at the centre: its heading and opening line. */}
          <div className="snake_words">
            {chapters.map((chapter, i) => (
              <article
                key={chapter.number}
                className="snake_chapter"
                data-state={stateOf(i)}
                aria-hidden={i !== active}
                inert={i !== active}
              >
                <div className="snake_mask">
                  <h3 className="snake_title">
                    <Link href={chapter.href} className="snake_title_link">
                      <Initial>{chapter.title}</Initial>
                    </Link>
                  </h3>
                </div>
                <div className="snake_mask">
                  <p className="snake_lead">{chapter.lead}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Its number, and the way on. */}
          <div className="snake_side">
            <div className="snake_count" aria-hidden="true">
              <span className="snake_count_now">
                {chapters.map((chapter, i) => (
                  <span key={chapter.number} className="snake_mask snake_digit" data-state={stateOf(i)}>
                    <span>{chapter.number}</span>
                  </span>
                ))}
              </span>
              <span className="snake_count_line">
                <span style={{ transform: `scaleX(${(active + 1) / chapters.length})` }} />
              </span>
              <span className="snake_count_all">{count}</span>
            </div>
            <div className="snake_ways">
              {chapters.map((chapter, i) => (
                <div
                  key={chapter.number}
                  className="snake_way snake_mask"
                  data-state={stateOf(i)}
                  aria-hidden={i !== active}
                  inert={i !== active}
                >
                  {i === last ? (
                    <div className="btn-wrap snake_cta">
                      <MainButton href={homeAtelier.cta.href} label={homeAtelier.cta.label} />
                    </div>
                  ) : (
                    <Link href={chapter.href} className="snake_more">
                      Continue reading <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
