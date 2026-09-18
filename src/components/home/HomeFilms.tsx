'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineAnimation } from '@/hooks/useSplitText'
import { useSmoothScroll } from '@/providers/SmoothScrollProvider'
import Initial from '@/components/Initial'
import { homeFilms, type Film, type WallClip } from '@/data/home'

/**
 * The films, as a wall of moving frames.
 *
 * Eight silent clips from the studio's own celebration film, in two rows. A
 * frame holds its still until it is pointed at, and then plays and opens out in
 * both directions at once: it widens while its row-mates give way, and its row
 * deepens while the other row shrinks. Only one clip is ever playing, and each
 * rewinds as the pointer leaves, so the wall is always met from the same frame.
 *
 * Nothing loads until it is asked for — the clips are `preload="none"` behind
 * their posters — and under reduced motion none of them play at all.
 *
 * Beneath the wall are the two full films. Those are cross-origin players, so
 * they open over the page rather than in the wall, and while one is open the
 * page's smooth scrolling is stopped rather than fighting the iframe for the
 * wheel.
 */
export default function HomeFilms() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()
  const [open, setOpen] = useState<Film | null>(null)

  useLineAnimation(headingRef)

  // The wall rises as it arrives, one row after the other.
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.films-wall_row',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.films-wall', start: 'top 80%', once: true },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={sectionRef} data-theme="inherit" className="home-films_wrap">
      <div className="u-container home-films_contain" data-padding-top="main" data-padding-bottom="main">
        <div className="home-films_head">
          {/* Wrapped: .kicker grows to fill a flex column on its own. */}
          <div>
            <div className="kicker home-films_kicker">{homeFilms.kicker}</div>
          </div>
          <h2 ref={headingRef} className="home-films_title" js-line-animation="">
            <Initial>{homeFilms.heading}</Initial>
          </h2>
        </div>

        <div className="films-wall">
          {homeFilms.wall.map((row, i) => (
            <div key={i} className={`films-wall_row${i === 1 ? ' films-wall_row-offset' : ''}`}>
              {row.map((clip) => (
                <Tile key={clip.id} clip={clip} reduced={reduced} />
              ))}
            </div>
          ))}
        </div>

        <div className="films-wall_more">
          {homeFilms.films.map((film) => (
            <button key={film.id} type="button" className="films-wall_link" onClick={() => setOpen(film)}>
              <span className="films-wall_link_text">
                {film.title}
                {film.duration ? <span className="films-wall_link_time">{film.duration}</span> : null}
              </span>
              <ArrowRight />
            </button>
          ))}
        </div>
      </div>

      {open ? <Player film={open} onClose={() => setOpen(null)} /> : null}
    </section>
  )
}

/** One frame of the wall: its still until pointed at, then the clip. */
function Tile({ clip, reduced }: { clip: WallClip; reduced: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const play = () => {
    const video = videoRef.current
    if (!video || reduced) return
    video.play().catch(() => {})
  }

  const stop = () => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
  }

  return (
    <figure
      className="films-wall_tile"
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        className="films-wall_video"
        src={`/videos/wall/${clip.id}.mp4`}
        poster={`/videos/wall/${clip.id}.jpg`}
        muted
        loop
        playsInline
        preload="none"
        aria-label={clip.alt}
        tabIndex={-1}
      />
      <figcaption>{clip.caption}</figcaption>
    </figure>
  )
}

/**
 * A full film, over the page.
 *
 * The player is cross-origin and owns every wheel event inside it, so Lenis is
 * stopped for as long as this is open and started again on the way out — the
 * page cannot be left unable to scroll.
 */
function Player({ film, onClose }: { film: Film; onClose: () => void }) {
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
    <div className="films-player" role="dialog" aria-modal="true" aria-label={film.title}>
      <button type="button" className="films-player_scrim" aria-label="Close" onClick={close} />
      <div className="films-player_frame">
        <iframe
          className="films-player_iframe"
          src={film.embed}
          title={film.title}
          allow={film.allow}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <button ref={closeRef} type="button" className="films-player_close" onClick={close}>
        Close
      </button>
    </div>,
    document.body
  )
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12h15" />
      <path d="m13.5 6.5 5.5 5.5-5.5 5.5" />
    </svg>
  )
}
