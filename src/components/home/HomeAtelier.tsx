'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import Initial from '@/components/Initial'
import { MainButton } from '@/components/HeroMarquee'
import { useLineAnimation } from '@/hooks/useSplitText'
import { homeAtelier, homeAtelierCards, type GalleryImage } from '@/data/home'

/**
 * Five sticky cards, each with a dedicated number strip. Their pin offsets match
 * the strip height so every earlier number remains visible beneath navigation.
 * The closing band stays outside the stack so the last card can scroll away.
 */
export default function HomeAtelier() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  useLineAnimation(headingRef)

  useIsomorphicLayoutEffect(() => {
    const stack = stackRef.current
    if (!stack) return
    const cards = Array.from(stack.querySelectorAll<HTMLElement>('.home-atelier_card'))
    let frame = 0
    const measure = () => {
      const strip = parseFloat(getComputedStyle(stack).getPropertyValue('--card-strip'))
      // Equal pinned bottom edges make every card release at the same scroll
      // position. Measuring the content, not the stretched card, avoids feedback.
      const bottom = Math.ceil(Math.max(...cards.map((card, i) => {
        const content = card.querySelector<HTMLElement>('.deets_card_wrap')!
        return strip + content.getBoundingClientRect().height + i * strip
      })))
      stack.style.setProperty('--stack-height', `${bottom}px`)
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    const observer = new ResizeObserver(schedule)
    cards.forEach(card => observer.observe(card.querySelector('.deets_card_wrap')!))
    // The cards' content only reflows when the width changes. A phone's address
    // bar sliding in and out changes the height alone, and fires this on every
    // scroll; re-measuring then is wasted work. Content changes are already
    // caught by the observer above.
    let width = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === width) return
      width = window.innerWidth
      schedule()
    }
    window.addEventListener('resize', onResize)
    measure()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      stack.style.removeProperty('--stack-height')
    }
  }, [])

  return (
    <section data-theme="inherit" className="home-atelier_wrap">
      <div className="u-container home-atelier_contain" data-padding-top="main" data-padding-bottom="main">
        <div className="home-atelier_head">
          {/* Wrapped: .kicker grows to fill a flex column on its own. */}
          <div>
            <div className="kicker home-atelier_kicker">{homeAtelier.kicker}</div>
          </div>
          <h2 ref={headingRef} className="home-atelier_title" js-line-animation="">
            <Initial>{homeAtelier.heading}</Initial>
          </h2>
        </div>

        <div ref={stackRef} className="deets_layout home-atelier_cards">
          {homeAtelierCards.map((card, i) => (
            <div
              key={card.href}
              className="home-atelier_card"
              /* The depth this card comes to rest at, counted down the stack. */
              style={{ '--i': i, background: card.background } as React.CSSProperties}
            >
              <div className="home-atelier_card_header">
                <span className="home-atelier_card_num kicker">{card.number}</span>
              </div>
              <div className="deets_card_wrap u-grid-custom">
                <div className="deets_card_text-wrap u-column u-vflex-left-top u-gap-large">
                  <h2 className="deets_card_title u-text-display home-atelier_card_title">
                    <Link href={card.href} className="home-atelier_card_link">
                      <Initial>{card.title}</Initial>
                    </Link>
                  </h2>
                  <p className="deets_card_p u-text-large">{card.body}</p>
                </div>
                <div className="deets_card_img_wrap u-column">
                  <img src={card.image} alt={card.alt} loading="lazy" className="deets_card_img home-atelier_single" />
                  {card.gallery.length > 1 ? <CardCarousel images={card.gallery} label={card.title} /> : null}
                </div>
              </div>
              {/* The button closes the last card, on its own colour, rather than
                  sitting on a band of its own beneath the stack. */}
              {i === homeAtelierCards.length - 1 ? (
                <div className="btn-wrap home-atelier_cta home-atelier_card_cta">
                  <MainButton href={homeAtelier.cta.href} label={homeAtelier.cta.label} />
                </div>
              ) : null}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

/** How far a swipe has to travel, in px, before it moves the ring. */
const SWIPE = 40
/** How far a finger moves before it is read as a sideways drag or the page scrolling. */
const SLOP = 8

/**
 * A discipline's photographs on a phone, set as the reels are: a ring with the
 * photograph in view large at the centre and its neighbours smaller, dimmed and
 * tucked behind it either side, looping without an end. Swipe either way or tap
 * a neighbour; the counter and its gold line beneath say which of how many is
 * showing. Hidden from 768px, where the card keeps its single
 * photograph.
 *
 * A swipe that starts sideways moves the ring and holds the page still under
 * it; one that starts up or down is left to scroll the page.
 */
function CardCarousel({ images, label }: { images: GalleryImage[]; label: string }) {
  const ringRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [drag, setDrag] = useState(0)
  const count = images.length
  const dragRef = useRef<{ x: number; y: number; dx: number; moved: boolean } | null>(null)
  const draggedRef = useRef(false)

  const go = useCallback((step: number) => setActive((a) => (((a + step) % count) + count) % count), [count])

  /** A photograph's place relative to the centre, wrapped so the ring has no ends. */
  const offsetOf = (i: number) => {
    let d = (((i - active) % count) + count) % count
    if (d > count / 2) d -= count
    return d
  }

  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return

    const onStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        dragRef.current = null
        return
      }
      const t = e.touches[0]
      dragRef.current = { x: t.clientX, y: t.clientY, dx: 0, moved: false }
      draggedRef.current = false
    }

    const onMove = (e: TouchEvent) => {
      const d = dragRef.current
      if (!d) return
      const t = e.touches[0]
      const dx = t.clientX - d.x
      const dy = t.clientY - d.y
      if (!d.moved) {
        if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return
        // Mostly up or down: the page is scrolling, not the ring.
        if (Math.abs(dy) > Math.abs(dx) || !e.cancelable) {
          dragRef.current = null
          return
        }
        d.moved = true
        draggedRef.current = true
      }
      e.preventDefault()
      d.dx = dx
      setDrag(dx)
    }

    const onEnd = () => {
      const d = dragRef.current
      dragRef.current = null
      if (!d?.moved) return
      setDrag(0)
      if (Math.abs(d.dx) >= SWIPE) go(d.dx < 0 ? 1 : -1)
    }

    ring.addEventListener('touchstart', onStart, { passive: true })
    ring.addEventListener('touchmove', onMove, { passive: false })
    ring.addEventListener('touchend', onEnd)
    ring.addEventListener('touchcancel', onEnd)
    return () => {
      ring.removeEventListener('touchstart', onStart)
      ring.removeEventListener('touchmove', onMove)
      ring.removeEventListener('touchend', onEnd)
      ring.removeEventListener('touchcancel', onEnd)
    }
  }, [go])

  return (
    <div className="card-carousel" role="region" aria-roledescription="carousel" aria-label={`${label}, photographs`}>
      <div className="card-ring_wrap">
        <div
          ref={ringRef}
          className={`card-ring${drag ? ' is-dragging' : ''}`}
          style={{ '--drag': `${drag}px` } as React.CSSProperties}
          onClickCapture={(e) => {
            if (!draggedRef.current) return
            draggedRef.current = false
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          {images.map((img, i) => {
            const offset = offsetOf(i)
            return (
              <figure
                key={img.src}
                className={`card-ring_slide${offset === 0 ? ' is-active' : ''}`}
                style={{ '--offset': offset, '--abs': Math.abs(offset) } as React.CSSProperties}
                data-far={Math.abs(offset) > 1 || undefined}
                aria-hidden={offset !== 0 || undefined}
                onClick={() => offset !== 0 && go(offset)}
              >
                <img src={img.src} alt={img.alt} loading="lazy" draggable={false} />
              </figure>
            )
          })}
        </div>
      </div>

      <div className="card-ring_bar reels_count" aria-live="polite">
        <span className="reels_count_now">{String(active + 1).padStart(2, '0')}</span>
        <span className="reels_count_line" aria-hidden="true">
          <span style={{ transform: `scaleX(${(active + 1) / count})` }} />
        </span>
        <span className="reels_count_all">{String(count).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
