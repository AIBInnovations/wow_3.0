'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, registerGsap, EASE, MQ } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { navItems, HOVER_REPEAT } from '@/data/nav'
import { GRID } from '@/data/gridNodes'
import Wordmark from './Wordmark'
import { site } from '@/data/content'

/**
 * Top bar and fullscreen menu.
 *
 * Every row — the spacer included — is parked a full viewport above the screen.
 * MENU drops them into place over 1.5s, 0.05s apart, and pressing it again runs
 * the same timeline backwards. The page underneath is not locked; it keeps
 * scrolling, as the menu is a fixed layer over it.
 *
 * Hovering a row (tablet and up) swaps its label for a panel of repeated text,
 * shown instantly and faded out over 0.5s. On desktop that panel also creeps
 * left, a full width every 60s, and eases home when the pointer leaves.
 */
export default function Navigation() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    registerGsap()

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.nav_drop_link', { y: 0, autoAlpha: 0 })
        timelineRef.current = gsap.timeline({ paused: true }).to('.nav_drop_link', { autoAlpha: 1, duration: 0.2 })
        return
      }

      gsap.set('.nav_drop_link', { y: '-100vh' })
      timelineRef.current = gsap.timeline({ paused: true }).to(
        '.nav_drop_link',
        { y: '0vh', duration: 1.5, stagger: { each: 0.05, from: 'start' }, ease: 'power3.out' },
        0
      )
    }, root)

    return () => {
      ctx.revert()
      timelineRef.current = null
    }
  }, [reduced])

  const toggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const tl = timelineRef.current
    if (!tl) return
    // Play when closed or mid-close; otherwise run it back.
    if (tl.reversed() || tl.progress() === 0) {
      tl.play()
      setOpen(true)
    } else {
      tl.reverse()
      setOpen(false)
    }
  }, [])

  const close = useCallback(() => {
    const tl = timelineRef.current
    if (!tl || tl.progress() === 0) return
    tl.reverse()
    setOpen(false)
  }, [])

  // ESC closes it — a keyboard affordance only; nothing changes for the pointer.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  return (
    <div ref={rootRef} className="nav_wrap">
      <div className={`nav_drop_wrap${open ? ' active' : ''}`}>
        <div className="nav_drop_link first" />

        {navItems.map((item) => {
          const body = (
            <>
              <div className="nav_drop_txt">{item.label}</div>
              <HoverPanel text={item.hover} />
            </>
          )
          const shared = {
            className: `nav_drop_link ${item.className} w-inline-block`,
            tabIndex: open ? 0 : -1,
            onClick: close,
            onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => hoverIn(e.currentTarget, reduced),
            onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => hoverOut(e.currentTarget, reduced),
          }

          // Enquiries is a mailto, which next/link must not own.
          return item.href.startsWith('mailto:') ? (
            <a key={item.href} href={item.href} {...shared}>
              {body}
            </a>
          ) : (
            <Link key={item.href} href={item.href} {...shared}>
              {body}
            </Link>
          )
        })}
      </div>

      <div className="nav_flex nl1">
        <a href={`mailto:${site.email}`} id={GRID.navLeft} className="nav_link_wrap left w-inline-block">
          <div className="nav-txt">ENQUIRIES</div>
        </a>

        <Link href="/" aria-label={`${site.name} — home`} className="nav_logo_link w-inline-block w--current">
          <Wordmark className="nav_wordmark" />
        </Link>

        <div id="nav-btn" className={`nav_link_wrap right ${GRID.navRight}${open ? ' active' : ''}`}>
          <a
            href="#"
            onClick={toggle}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="nav_btn_wrap w-inline-block"
          >
            <div className="nav-txt">
              <div className="right">MENU</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

function hoverIn(row: HTMLElement, reduced: boolean) {
  if (reduced || !window.matchMedia(MQ.tabletUp).matches) return
  const wrap = row.querySelector('.nav_drop_over-text_wrap')
  const panels = row.querySelectorAll('.nav_drop_over-text_panel')

  gsap.set(wrap, { opacity: 1 })

  if (window.matchMedia(MQ.desktop).matches) {
    // A single 60s creep, then home — not a loop.
    gsap.fromTo(
      panels,
      { xPercent: 0 },
      { xPercent: -100, duration: 60, ease: 'none', overwrite: 'auto', onComplete: () => gsap.set(panels, { xPercent: 0 }) }
    )
  }
}

function hoverOut(row: HTMLElement, reduced: boolean) {
  if (reduced || !window.matchMedia(MQ.tabletUp).matches) return
  const wrap = row.querySelector('.nav_drop_over-text_wrap')
  const panels = row.querySelectorAll('.nav_drop_over-text_panel')

  gsap.to(wrap, { opacity: 0, duration: 0.5, ease: EASE.ease, overwrite: 'auto' })

  if (window.matchMedia(MQ.desktop).matches) {
    gsap.to(panels, { xPercent: 0, duration: 0.5, ease: EASE.ease, overwrite: 'auto' })
  }
}

function HoverPanel({ text }: { text: string }) {
  return (
    <div className="nav_drop_over-text_wrap" aria-hidden="true">
      {[0, 1].map((panel) => (
        <div key={panel} className="nav_drop_over-text_panel u-hflex-left-stretch">
          {Array.from({ length: HOVER_REPEAT }, (_, i) => (
            <div key={i} className="nav_drop_txt">
              {text}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
