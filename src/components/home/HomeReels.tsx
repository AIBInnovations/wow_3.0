'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineAnimation } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import { homeReels, type Reel } from '@/data/home'

/** How long the backdrop holds each reel's colours before moving to the next, in ms. */
const CYCLE = 5000

/**
 * Each column's reels, in its own order, and which way and how fast it runs.
 * Every column holds all six, so none is ever missing from view for long.
 */
const COLUMNS: { order: number[]; dir: 'up' | 'down'; seconds: number }[] = [
  { order: [0, 1, 2, 3, 4, 5], dir: 'up', seconds: 46 },
  { order: [3, 5, 1, 4, 0, 2], dir: 'down', seconds: 58 },
  { order: [4, 2, 5, 0, 3, 1], dir: 'up', seconds: 52 },
]

/**
 * The reels, as a wall in constant motion.
 *
 * The heading stands on the left; on the right, three columns of the reels'
 * cover frames run endlessly, the middle one against the others, and drift a
 * little further apart as the page scrolls past. Pointing at the wall stops
 * it; the reel under the pointer comes forward, the rest dim, and the backdrop
 * takes on its colours (otherwise it moves through them all, slowly). Every
 * frame opens its reel on Instagram.
 *
 * Each column's run is its reels twice over, moved by exactly one set, so it
 * never jumps; the second set is hidden from assistive technology and from
 * the keyboard. A phone shows two columns under the heading. Under reduced
 * motion the wall stands still.
 */
export default function HomeReels() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { items } = homeReels
  const [shown, setShown] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const reduced = useReducedMotion()
  useLineAnimation(headingRef)

  // The backdrop moves through the reels' colours while nothing is pointed at.
  useEffect(() => {
    if (hovered !== null || reduced) return
    const t = window.setInterval(() => setShown((s) => (s + 1) % items.length), CYCLE)
    return () => window.clearInterval(t)
  }, [hovered, reduced, items.length])

  // The columns part a little as the section passes: outer ones up, middle down.
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || reduced) return
    registerGsap()
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reelwall_col').forEach((col, i) => {
        const shift = i === 1 ? 10 : -10
        gsap.fromTo(
          col,
          { yPercent: -shift / 2 },
          {
            yPercent: shift / 2,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    }, section)
    return () => ctx.revert()
  }, [reduced])

  const lit = hovered ?? shown

  return (
    <section ref={sectionRef} data-theme="inherit" className="reelwall">
      <div className="reelwall_backdrop" aria-hidden="true">
        {items.map((item, i) => (
          <img key={item.id} src={item.cover} alt="" className={i === lit ? 'is-on' : undefined} />
        ))}
      </div>

      <div className="u-container reelwall_grid">
        <div className="reelwall_head">
          <p className="kicker reelwall_kicker">{homeReels.kicker}</p>
          <h2 ref={headingRef} className="reelwall_title" js-line-animation="">
            <Initial>{homeReels.heading}</Initial>
          </h2>
          <div className="reelwall_meta">
            <span className="reelwall_count">{String(items.length).padStart(2, '0')}</span>
            <span className="reelwall_rule" aria-hidden="true" />
            <span className="reelwall_note">{homeReels.note}</span>
          </div>
        </div>

        <div
          className={`reelwall_wall${hovered !== null ? ' is-held' : ''}`}
          onPointerLeave={() => setHovered(null)}
        >
          {COLUMNS.map((col, c) => (
            <div key={c} className="reelwall_col" data-col={c}>
              <div
                className="reelwall_run"
                data-dir={col.dir}
                style={{ '--seconds': `${col.seconds}s` } as React.CSSProperties}
              >
                {[0, 1].map((copy) =>
                  col.order.map((index) => (
                    <ReelFrame
                      key={`${copy}-${index}`}
                      item={items[index]}
                      number={index + 1}
                      echo={copy === 1}
                      // Only the first column's first set is reachable from the
                      // keyboard and read out: one link per reel.
                      primary={c === 0 && copy === 0}
                      onEnter={() => setHovered(index)}
                    />
                  )),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReelFrame({
  item,
  number,
  echo,
  primary,
  onEnter,
}: {
  item: Reel
  number: number
  echo: boolean
  primary: boolean
  onEnter: () => void
}) {
  return (
    <a
      className="reelwall_frame"
      href={`https://www.instagram.com/reel/${item.instagram}/`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={primary ? `Watch reel ${number} on Instagram` : undefined}
      aria-hidden={primary ? undefined : true}
      tabIndex={primary ? undefined : -1}
      onPointerEnter={onEnter}
      onFocus={onEnter}
      draggable={false}
    >
      <img src={item.cover} alt="" loading={echo ? 'lazy' : 'eager'} decoding="async" draggable={false} />
      <span className="reelwall_tag" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M9 7v10l8-5z" /></svg>
        Watch on Instagram
      </span>
    </a>
  )
}
