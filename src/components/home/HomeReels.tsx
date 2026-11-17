'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSmoothScroll } from '@/providers/SmoothScrollProvider'
import Initial from '@/components/Initial'
import { homeReels, type Reel } from '@/data/home'
import { instagramUrl } from '@/data/footer'

/**
 * Where each card stands, as a share of the section, and how far it travels
 * against the page as the section passes (in % of its own height; more is
 * faster, negative rises). Every reel appears once.
 */
const PLACES = [
  { top: 34, speed: 18 },
  { top: 12, speed: -14 },
  { top: 28, speed: 26 },
  { top: 6, speed: -22 },
  { top: 30, speed: 10 },
  { top: 14, speed: -18 },
]

/**
 * The reels, as a grid to connect on.
 *
 * A small line at the head; the six reels as rounded cards at their own
 * heights, each with a pill to watch it, each drifting at its own speed as the
 * page scrolls; a ring to the Instagram profile over the first; and the
 * heading set huge along the foot, the cards over its top. A card opens the
 * reel itself over the page, in Instagram's player.
 *
 * Under reduced motion the cards stand still.
 */
export default function HomeReels() {
  const sectionRef = useRef<HTMLElement>(null)
  const { items } = homeReels
  const [playing, setPlaying] = useState<Reel | null>(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || reduced) return
    registerGsap()
    const ctx = gsap.context(() => {
      const scrollTrigger = { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.utils.toArray<HTMLElement>('.reelgrid_card').forEach((card, i) => {
        const v = PLACES[i % PLACES.length].speed
        gsap.fromTo(card, { yPercent: v }, { yPercent: -v, ease: 'none', scrollTrigger })
      })
    }, section)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="inherit" className="reelgrid" aria-labelledby="reelgrid-title">
      <p className="reelgrid_eyebrow">{homeReels.eyebrow}</p>
      <p className="reelgrid_lead">{homeReels.lead}</p>

      <div className="reelgrid_field">
        <a className="reelgrid_ring" href={instagramUrl} target="_blank" rel="noopener noreferrer">
          <span>Go to</span>
          <span>Instagram</span>
        </a>

        {items.map((item, i) => (
          <div
            key={item.id}
            className="reelgrid_card"
            style={{ '--i': i, '--top': `${PLACES[i % PLACES.length].top}%` } as React.CSSProperties}
          >
            <button
              type="button"
              className="reelgrid_card_btn"
              onClick={() => setPlaying(item)}
              aria-label={`Watch reel ${i + 1}`}
            >
              <img src={item.cover} alt="" loading="lazy" decoding="async" draggable={false} />
              <span className={`reelgrid_pill${i % 2 ? ' is-top' : ''}`}>View reel</span>
            </button>
          </div>
        ))}
      </div>

      <h2 id="reelgrid-title" className="reelgrid_word">
        <Initial>{homeReels.heading}</Initial>
      </h2>

      {playing ? <ReelPlayer reel={playing} onClose={() => setPlaying(null)} /> : null}
    </section>
  )
}

/**
 * The reel itself, over the page, in Instagram's own player. A cross-origin
 * player takes every wheel event inside it, so smooth scrolling stops while it
 * is open and starts again on the way out.
 */
function ReelPlayer({ reel, onClose }: { reel: Reel; onClose: () => void }) {
  const { start, stop } = useSmoothScroll()
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const close = useCallback(() => onCloseRef.current(), [])

  useEffect(() => {
    stop()
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      start()
    }
  }, [start, stop, close])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="reelplayer" role="dialog" aria-modal="true" aria-label="Reel">
      <button type="button" className="reelplayer_scrim" aria-label="Close" onClick={close} />
      <div className="reelplayer_frame">
        <iframe
          src={`https://www.instagram.com/reel/${reel.instagram}/embed/`}
          title="Reel on Instagram"
          allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
          allowFullScreen
          loading="eager"
        />
      </div>
      <div className="reelplayer_bar">
        <a
          className="reelplayer_link"
          href={`https://www.instagram.com/reel/${reel.instagram}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open on Instagram
        </a>
        <button ref={closeRef} type="button" className="reelplayer_close" onClick={close}>
          Close
        </button>
      </div>
    </div>,
    document.body,
  )
}
