'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineAnimation } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import { ArrowSlider } from '@/components/svg'
import { homeFilms } from '@/data/home'

/**
 * The films, over the celebration reel.
 *
 * The reel plays silently behind everything, under a neutral scrim, and only
 * while the section is on screen — an IntersectionObserver pauses it the moment
 * the section leaves and resumes it on return. Under reduced motion it never
 * plays at all and its poster stands in.
 *
 * One film at a time, in a frame the width of the band: the arrows, the arrow
 * keys and a swipe move to the next, and the dots say where you are. Each is a
 * facade — a poster with a play ring, and no player in the page until it is
 * clicked. Moving on stops whatever was playing, so two films can never run at
 * once. The frame wipes up out of a bottom clip as the band arrives.
 */
export default function HomeFilms() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()

  const films = homeFilms.films
  const count = films.length
  const [index, setIndex] = useState(0)
  /** The film currently playing, if any — cleared whenever the frame changes. */
  const [playing, setPlaying] = useState<string | null>(null)
  /**
   * Whether the reader has handed the pointer to the player.
   *
   * A film plays in a cross-origin iframe, and an iframe owns every wheel event
   * over it — they never reach the window, so Lenis never sees them and the page
   * simply stops scrolling at this band. While this is false a transparent
   * shield sits over the player and takes those events instead, so the page
   * scrolls normally with a film running underneath. Clicking the shield hands
   * the pointer to the player for its own controls; leaving the frame puts it
   * back.
   */
  const [engaged, setEngaged] = useState(false)

  const go = useCallback(
    (delta: number) => {
      setPlaying(null)
      setEngaged(false)
      setIndex((i) => (i + delta + count) % count)
    },
    [count]
  )

  useLineAnimation(headingRef)

  // The ambient reel: on while in view, off otherwise, never under reduced motion.
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return

    // useReducedMotion reports one effect cycle late; the query is read here
    // too so the pause lands before the first paint rather than after it.
    if (reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.removeAttribute('autoplay')
      video.pause()
      return
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {})
      } else {
        video.pause()
        // Scrolling away puts the frame back to its poster. A film left running
        // in an iframe off screen keeps playing sound and keeps hold of the
        // wheel if the reader ever comes back to it.
        setPlaying(null)
        setEngaged(false)
      }
    })
    io.observe(section)

    return () => {
      io.disconnect()
    }
  }, [reduced])

  // The frame wipes up as the carousel reaches 80% of the viewport.
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.home-films_frame',
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.home-films_carousel', start: 'top 80%', once: true },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [reduced])

  // The incoming film's poster fades up; a playing film is never animated.
  const firstRun = useRef(true)
  useEffect(() => {
    if (reduced) return
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    registerGsap()
    const tween = gsap.fromTo(
      '.home-films_slide',
      { opacity: 0, xPercent: 2 },
      { opacity: 1, xPercent: 0, duration: 0.6, ease: 'power3.out' }
    )
    return () => {
      tween.kill()
    }
  }, [index, reduced])

  // Horizontal swipe on touch and pen.
  const swipeX = useRef<number | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') swipeX.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeX.current === null) return
    const dx = e.clientX - swipeX.current
    swipeX.current = null
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
  }

  const { ambient } = homeFilms
  const film = films[index]

  return (
    <section ref={sectionRef} data-theme="inherit" className="home-films_wrap">
      <div className="home-films_bg_wrap" aria-hidden="true">
        <video
          ref={videoRef}
          className="home-films_bg_video"
          src={ambient.src}
          poster={ambient.poster}
          width={ambient.w}
          height={ambient.h}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
        <div className="home-films_bg_scrim" />
      </div>

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

        <div
          className="home-films_carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label={homeFilms.kicker}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') go(-1)
            if (e.key === 'ArrowRight') go(1)
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className="home-films_frame" onMouseLeave={() => setEngaged(false)}>
            <div
              key={film.id}
              className="home-films_slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}: ${film.title}`}
            >
              {playing === film.id ? (
                <>
                  <iframe
                    className="home-films_player"
                    src={film.embed}
                    title={film.title}
                    allow={film.allow}
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                  {/* Takes the wheel so the page still scrolls; see `engaged`. */}
                  {!engaged ? (
                    <button
                      type="button"
                      className="home-films_shield"
                      onClick={() => setEngaged(true)}
                      aria-label={`Use the player controls for ${film.title}`}
                    />
                  ) : null}
                </>
              ) : (
                <button
                  type="button"
                  className="home-films_poster_btn"
                  onClick={() => setPlaying(film.id)}
                  aria-label={`Play ${film.title}`}
                >
                  <img
                    src={film.poster.src}
                    width={film.poster.w}
                    height={film.poster.h}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="home-films_poster"
                  />
                  <span className="home-films_play" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M8.5 6v12l10-6z" fill="currentColor" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="home-films_controls">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous film"
              className="home-films_arrow left"
            >
              <ArrowSlider />
            </button>

            <div className="home-films_meta">
              <h3 className="u-text-h4 home-films_name">{film.title}</h3>
              {film.duration ? <span className="home-films_duration">{film.duration}</span> : null}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next film"
              className="home-films_arrow right"
            >
              <ArrowSlider />
            </button>
          </div>

          <div className="home-films_dots">
            {films.map((f, i) => (
              <button
                key={f.id}
                type="button"
                className={`home-films_dot${i === index ? ' is-active' : ''}`}
                aria-label={f.title}
                aria-current={i === index}
                onClick={() => {
                  setPlaying(null)
                  setIndex(i)
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
