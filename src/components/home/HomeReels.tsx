'use client'

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useLineAnimation } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import { homeReels, type Reel } from '@/data/home'

/** How far a drag has to travel, in px, before it counts as a swipe. */
const SWIPE = 40

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
 * either way to bring the next one in, or use the arrow keys.
 */
export default function HomeReels() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { items } = homeReels
  const count = items.length

  const [active, setActive] = useState(0)
  const [drag, setDrag] = useState(0)
  const dragRef = useRef<{ x: number; y: number; id: number; moved: boolean } | null>(null)
  /** Set by a drag, so the click that ends it does not open or centre a reel. */
  const draggedRef = useRef(false)

  useLineAnimation(headingRef)

  const go = (step: number) => setActive((a) => (((a + step) % count) + count) % count)

  /** A reel's place relative to the centre, wrapped so the ring has no ends. */
  const offsetOf = (i: number) => {
    let d = (((i - active) % count) + count) % count
    if (d > count / 2) d -= count
    return d
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId, moved: false }
    draggedRef.current = false
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    // A mostly vertical move is the page scrolling, not a swipe.
    if (!d.moved && Math.abs(dx) < 6) return
    if (!d.moved && Math.abs(e.clientY - d.y) > Math.abs(dx)) {
      dragRef.current = null
      return
    }
    if (!d.moved) {
      d.moved = true
      draggedRef.current = true
      trackRef.current?.setPointerCapture(e.pointerId)
    }
    setDrag(dx)
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    dragRef.current = null
    if (!d || d.id !== e.pointerId || !d.moved) return
    const dx = e.clientX - d.x
    setDrag(0)
    if (Math.abs(dx) < SWIPE) return
    const card = trackRef.current?.querySelector<HTMLElement>('.reels_card')
    const step = card ? card.offsetWidth * 0.78 : 240
    go(-Math.sign(dx) * Math.max(1, Math.round(Math.abs(dx) / step)))
  }

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
      {/* Only the centre reel and its neighbours load a player; the rest wait. */}
      {Math.abs(offset) <= 1 ? (
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
