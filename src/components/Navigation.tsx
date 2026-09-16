'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, registerGsap, DUR } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSmoothScroll } from '@/providers/SmoothScrollProvider'
import { navItems, HOVER_REPEAT } from '@/data/nav'
import { GRID } from '@/data/gridNodes'
import Wordmark from './Wordmark'
import { site } from '@/data/content'

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<HTMLAnchorElement[]>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const { start, stop } = useSmoothScroll()
  const reduced = useReducedMotion()

  // Build the open/close timeline once; play it forward or in reverse on toggle.
  useIsomorphicLayoutEffect(() => {
    registerGsap()
    const rows = rowsRef.current.filter(Boolean)
    if (!rows.length) return

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(rows, { y: 0, autoAlpha: 0 })
        timelineRef.current = gsap
          .timeline({ paused: true })
          .to(rows, { autoAlpha: 1, duration: 0.2 })
        return
      }

      // The stylesheet parks each row at translateY(-100vh) — a full viewport,
      // not the row's own height — so the offset is resolved against the window.
      gsap.set(rows, { y: () => -window.innerHeight })

      timelineRef.current = gsap.timeline({ paused: true }).to(rows, {
        y: 0,
        duration: DUR.base,
        ease: 'composed',
        stagger: 0.07,
      })
    })

    return () => {
      ctx.revert()
      timelineRef.current = null
    }
  }, [reduced])

  useEffect(() => {
    const tl = timelineRef.current
    if (!tl) return
    if (open) {
      stop()
      tl.play()
    } else {
      tl.reverse()
      start()
    }
  }, [open, start, stop])

  // ESC closes the menu.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setOpen((v) => !v)
  }, [])

  return (
    <div className="nav_wrap">
      <div ref={dropRef} className={`nav_drop_wrap${open ? ' active' : ''}`}>
        {/* Spacer row that sits behind the top bar, as in the export. */}
        <div className="nav_drop_link first" />

        {navItems.map((item, i) => {
          const body = (
            <>
              <div className="nav_drop_txt">{item.label}</div>
              <HoverMarquee text={item.hover} />
            </>
          )
          const shared = {
            ref: (el: HTMLAnchorElement | null) => {
              if (el) rowsRef.current[i] = el
            },
            className: `nav_drop_link ${item.className} w-inline-block`,
            tabIndex: open ? 0 : -1,
            onClick: () => setOpen(false),
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
        <a
          href={`mailto:${site.email}`}
          id={GRID.navLeft}
          className="nav_link_wrap left w-inline-block"
        >
          <div className="nav-txt">ENQUIRIES</div>
        </a>

        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="nav_logo_link w-inline-block w--current"
        >
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
              <div className="right">{open ? 'CLOSE' : 'MENU'}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

/**
 * Two identical tracks side by side. On row hover the wrap fades in (CSS) and
 * the tracks slide one full width, so the repeated phrase reads as endless.
 */
function HoverMarquee({ text }: { text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      gsap.to('.nav_drop_over-text_panel', {
        xPercent: -100,
        duration: 12,
        ease: 'none',
        repeat: -1,
      })
    }, wrap)

    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={wrapRef} className="nav_drop_over-text_wrap" aria-hidden="true">
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
