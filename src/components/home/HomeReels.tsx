'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useLineAnimation } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import { homeReels, type Reel } from '@/data/home'

/** How far a drag has to travel, in px, before it counts as a swipe. */
const SWIPE = 40

/** How far a pointer has to travel, in px, before it is read as a drag or as the page scrolling. */
const SLOP = 8

/** The distance between two neighbouring reels, in px, as the stylesheet has set it. */
function strideOf(track: HTMLElement | null) {
  const card = track?.querySelector('.reels_card.is-active')
  const next = card?.nextElementSibling ?? card?.previousElementSibling
  if (!card || !next) return 240
  const a = card.getBoundingClientRect()
  const b = next.getBoundingClientRect()
  return Math.abs(b.left + b.width / 2 - (a.left + a.width / 2)) || 240
}

/**
 * The reels, as a carousel that never ends in either direction.
 *
 * Each reel is Instagram's own embed, framed so only the upright video shows:
 * the embed sets the reel in a 4:5 box under a 54px header, with the 9:16 video
 * centred in it, so the frame is scaled and shifted until that 9:16 strip fills
 * the card and the header, footer and side bars fall outside it.
 *
 * The embeds take no pointer events. A click on the centred reel opens it on
 * Instagram in a new tab; a click on a side reel centres it. Drag or swipe
 * either way to bring the next one in, or use the arrow keys. A swipe that
 * starts sideways belongs to the carousel and one that starts up or down
 * belongs to the page, never both.
 */
export default function HomeReels() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { items } = homeReels
  const count = items.length

  const [active, setActive] = useState(0)
  const [drag, setDrag] = useState(0)
  const dragRef = useRef<{ x: number; y: number; id: number; dx: number; moved: boolean } | null>(null)
  /** Set by a drag, so the click that ends it does not open or centre a reel. */
  const draggedRef = useRef(false)

  useLineAnimation(headingRef)

  const go = useCallback((step: number) => setActive((a) => (((a + step) % count) + count) % count), [count])

  /** A reel's place relative to the centre, wrapped so the ring has no ends. */
  const offsetOf = (i: number) => {
    let d = (((i - active) % count) + count) % count
    if (d > count / 2) d -= count
    return d
  }

  const begin = useCallback((x: number, y: number, id: number) => {
    dragRef.current = { x, y, id, dx: 0, moved: false }
    draggedRef.current = false
  }, [])

  /** Follows the pointer; true once its move has been claimed as a sideways drag. */
  const follow = useCallback((x: number, y: number) => {
    const d = dragRef.current
    if (!d) return false
    const dx = x - d.x
    const dy = y - d.y
    if (!d.moved) {
      if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return false
      // A mostly vertical move is the page scrolling, not a swipe.
      if (Math.abs(dy) > Math.abs(dx)) {
        dragRef.current = null
        return false
      }
      d.moved = true
      draggedRef.current = true
    }
    d.dx = dx
    setDrag(dx)
    return true
  }, [])

  /**
   * Ends a drag. One that was let go of moves the ring on by as far as it
   * travelled; one the browser took away puts the reels back where they were.
   * The travel is the last the pointer reported, since a cancel carries none.
   */
  const release = useCallback(
    (commit: boolean) => {
      const d = dragRef.current
      dragRef.current = null
      if (!d?.moved) return
      setDrag(0)
      if (!commit || Math.abs(d.dx) < SWIPE) return
      go(-Math.sign(d.dx) * Math.max(1, Math.round(Math.abs(d.dx) / strideOf(trackRef.current))))
    },
    [go],
  )

  // The mouse and the pen. Touch has its own listeners, below.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    begin(e.clientX, e.clientY, e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (e.pointerType === 'touch' || !d || d.id !== e.pointerId) return
    const claimed = d.moved
    if (follow(e.clientX, e.clientY) && !claimed) trackRef.current?.setPointerCapture(e.pointerId)
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || dragRef.current?.id !== e.pointerId) return
    release(e.type !== 'pointercancel')
  }

  /*
   * Touch is bound natively, because the move has to be cancellable: once a
   * swipe is claimed the page is held still under it, so a thumb that drifts
   * up or down on its way across does not also scroll the page away. A touch
   * the browser is already scrolling with is left to it.
   */
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const touchOf = (e: TouchEvent) =>
      Array.from(e.changedTouches).find((t) => t.identifier === dragRef.current?.id)

    const onStart = (e: TouchEvent) => {
      // A second finger makes it a pinch.
      if (e.touches.length > 1) return release(false)
      const t = e.changedTouches[0]
      begin(t.clientX, t.clientY, t.identifier)
    }

    const onMove = (e: TouchEvent) => {
      const t = touchOf(e)
      if (!t) return
      if (!e.cancelable) return release(false)
      if (follow(t.clientX, t.clientY)) e.preventDefault()
    }

    const onEnd = (e: TouchEvent) => {
      if (touchOf(e)) release(true)
    }

    const onCancel = () => release(false)

    track.addEventListener('touchstart', onStart, { passive: true })
    track.addEventListener('touchmove', onMove, { passive: false })
    track.addEventListener('touchend', onEnd)
    track.addEventListener('touchcancel', onCancel)
    return () => {
      track.removeEventListener('touchstart', onStart)
      track.removeEventListener('touchmove', onMove)
      track.removeEventListener('touchend', onEnd)
      track.removeEventListener('touchcancel', onCancel)
    }
  }, [begin, follow, release])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(-1)
    if (e.key === 'ArrowRight') go(1)
  }

  return (
    <section ref={sectionRef} data-theme="inherit" className="home-reels_wrap">
      <div className="u-container home-reels_contain" data-padding-top="main" data-padding-bottom="none">
        <div className="home-reels_head">
          <p className="kicker">{homeReels.kicker}</p>
          <h2 ref={headingRef} className="home-reels_title" js-line-animation="">
            <Initial>{homeReels.heading}</Initial>
          </h2>
        </div>
      </div>

      <div
        ref={trackRef}
        className={`reels_track${drag ? ' is-dragging' : ''}`}
        style={{ '--drag': `${drag}px` } as React.CSSProperties}
        role="region"
        aria-roledescription="carousel"
        aria-label={homeReels.heading}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => {
          if (!draggedRef.current) return
          draggedRef.current = false
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {items.map((item, i) => {
          const offset = offsetOf(i)
          return (
            <ReelCard
              key={item.id}
              item={item}
              offset={offset}
              onSelect={() => {
                if (offset !== 0) go(offset)
              }}
            />
          )
        })}
      </div>

    </section>
  )
}

function ReelCard({ item, offset, onSelect }: { item: Reel; offset: number; onSelect: () => void }) {
  return (
    <div
      className={`reels_card${offset === 0 ? ' is-active' : ''}`}
      style={{ '--offset': offset, '--abs': Math.abs(offset) } as React.CSSProperties}
      aria-hidden={offset !== 0 || undefined}
      data-far={Math.abs(offset) > 2 || undefined}
      onClick={onSelect}
    >
      {/* Every reel that can be seen loads its player: the centre, its
          neighbours and the two at the edges. Only the hidden one waits. */}
      {Math.abs(offset) <= 2 ? (
        <iframe
          className="reels_embed"
          src={`https://www.instagram.com/reel/${item.instagram}/embed/`}
          title=""
          aria-hidden="true"
          tabIndex={-1}
          loading="lazy"
          scrolling="no"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        />
      ) : null}

      {offset === 0 ? (
        <a
          className="reels_link"
          href={`https://www.instagram.com/reel/${item.instagram}/`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch this reel on Instagram"
          draggable={false}
        />
      ) : null}
    </div>
  )
}
