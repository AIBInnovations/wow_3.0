'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineAnimation } from '@/hooks/useSplitText'
import { useSmoothScroll } from '@/providers/SmoothScrollProvider'
import Initial from '@/components/Initial'
import { homeFilms, type WallItem } from '@/data/home'

/** Where every film starts: its first three seconds are titles and black. */
const START = 3

/**
 * The films, as a wall that opens where you look.
 *
 * Six frames in two rows — the five films and one photograph. Pointing at one
 * opens it out on both axes at once while the others give way (the layout is all
 * in the stylesheet), and a film hosted here starts playing in its own frame,
 * three seconds in. The trailer lives on Vimeo, whose player will not start on
 * hover, so its frame holds a still. Any film opens over the page on a click.
 *
 * Nothing loads until it is asked for, and under reduced motion nothing plays
 * of its own accord.
 */
export default function HomeFilms() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()
  const [open, setOpen] = useState<WallItem | null>(null)

  useLineAnimation(headingRef)

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

  const { still, items } = homeFilms
  // Two rows of three: the films in order, the photograph closing the second.
  const rows = [items.slice(0, 3), items.slice(3)]

  return (
    <section ref={sectionRef} data-theme="inherit" className="home-films_wrap">
      {/* No top padding of its own: the Four Days section above is the same dark
          ground and already ends on a full section's padding, so this band's own
          on top of it read as one empty stretch of about 275px before anything. */}
      <div className="u-container home-films_contain" data-padding-top="none" data-padding-bottom="main">
        <div className="home-films_head">
          <h2 ref={headingRef} className="home-films_title" js-line-animation="">
            <Initial>{homeFilms.heading}</Initial>
          </h2>
        </div>

        <div className="films-wall">
          {rows.map((row, r) => (
            <div key={r} className={`films-wall_row${r === 1 ? ' films-wall_row-offset' : ''}`}>
              {row.map((item) => (
                <Tile key={item.id} item={item} reduced={reduced} onOpen={() => setOpen(item)} />
              ))}
              {r === 1 ? (
                <figure className="films-wall_cell films-wall_cell-still">
                  <img src={still.src} alt={still.alt} loading="lazy" className="films-wall_media" />
                  <figcaption className="films-wall_caption">{still.caption}</figcaption>
                </figure>
              ) : null}
            </div>
          ))}

          <span className="films-wall_dot films-wall_dot-a" aria-hidden="true" />
          <span className="films-wall_dot films-wall_dot-b" aria-hidden="true" />
          <span className="films-wall_dot films-wall_dot-c" aria-hidden="true" />
        </div>

        <div className="films-wall_more">
          <Link className="films-wall_link" href="/gallery">
            Explore the gallery <ArrowRight />
          </Link>
        </div>
      </div>

      {open ? <Player item={open} onClose={() => setOpen(null)} /> : null}
    </section>
  )
}

/** One film. It plays here if it is hosted here; otherwise it opens over the page. */
function Tile({ item, reduced, onOpen }: { item: WallItem; reduced: boolean; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  /** A film hosted elsewhere mounts its muted preview only while pointed at. */
  const [previewing, setPreviewing] = useState(false)

  const play = () => {
    if (reduced) return
    if (item.preview) {
      setPreviewing(true)
      return
    }
    const video = videoRef.current
    if (!video) return
    if (video.currentTime < START) video.currentTime = START
    video.play().catch(() => {})
  }

  const stop = () => {
    if (item.preview) {
      setPreviewing(false)
      return
    }
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = START
  }

  return (
    <button
      type="button"
      className={`films-wall_cell${item.vertical ? ' is-vertical' : ''}`}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      onClick={onOpen}
      aria-label={`Play ${item.title}`}
    >
      {item.video ? (
        <video
          ref={videoRef}
          className="films-wall_media"
          src={`${item.video}#t=${START}`}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          aria-hidden="true"
        />
      ) : (
        <img src={item.poster} alt={item.alt} loading="lazy" className="films-wall_media" />
      )}

      {/* The host's own muted player, over the still. It takes no pointer
          events, so the tile keeps the hover and the click, and the page keeps
          the wheel. */}
      {previewing && item.preview ? (
        <iframe
          className="films-wall_media films-wall_preview"
          src={`${item.preview}#t=${START}s`}
          title=""
          aria-hidden="true"
          tabIndex={-1}
          allow="autoplay"
        />
      ) : null}

      <span className="films-wall_caption">
        {item.title}
        {item.duration ? <span className="films-wall_time">{item.duration}</span> : null}
      </span>
    </button>
  )
}

/**
 * A film, over the page.
 *
 * A cross-origin player owns every wheel event inside it, so smooth scrolling is
 * stopped for as long as this is open and started again on the way out — the
 * page can never be left unable to scroll.
 */
function Player({ item, onClose }: { item: WallItem; onClose: () => void }) {
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
    <div className="films-player" role="dialog" aria-modal="true" aria-label={item.title}>
      <button type="button" className="films-player_scrim" aria-label="Close" onClick={close} />
      <div className={`films-player_frame${item.vertical ? ' is-vertical' : ''}`}>
        {item.video ? (
          <video
            className="films-player_media"
            src={`${item.video}#t=${START}`}
            poster={item.poster}
            controls
            autoPlay
            playsInline
          />
        ) : (
          <iframe
            className="films-player_media"
            src={`${item.embed}#t=${START}s`}
            title={item.title}
            allow={item.allow}
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
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
      width="16"
      height="16"
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
