'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { gsap, registerGsap, EASE } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ArrowCircle, CircleText } from './svg'

type Props = {
  href: string
  /** Phrase set around the ring; end it with a separator so it tiles cleanly. */
  text: string
  label: string
}

/**
 * The round CTA.
 *
 * At rest there is no disc — only the ring of type, turning once every 30s, and
 * a brand-coloured arrow at the centre. On hover the disc blooms out from
 * nothing, overshooting to 1.1, while the arrow swells to 1.5 and turns light.
 * Leaving reverses it, with the arrow's colour lagging 0.3s behind the collapse.
 */
export default function CircleTextButton({ href, text, label }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const external = href.startsWith('mailto:') || href.startsWith('http')

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    registerGsap()

    const bg = root.querySelector('.circle-text-btn_bg')
    const ring = root.querySelector('.circle-text-btn_ring')
    const arrow = root.querySelector('.circle-text-btn_arrow')
    if (!bg || !ring || !arrow) return

    const css = getComputedStyle(document.documentElement)
    const brand = css.getPropertyValue('--swatch--brand').trim()
    const light = css.getPropertyValue('--swatch--light').trim()

    const ctx = gsap.context(() => {
      gsap.set(bg, { scale: 0 })
      gsap.set(arrow, { color: brand, scale: 1 })

      if (!reduced) {
        gsap.to(ring, { rotation: 360, duration: 30, ease: 'none', repeat: -1 })
      }
    }, root)

    const over = () => {
      if (reduced) return
      gsap.to(bg, { scale: 1.1, duration: 1.25, ease: EASE.outBack, overwrite: 'auto' })
      gsap.to(arrow, { color: light, duration: 1.25, ease: EASE.outExpo, overwrite: 'auto' })
      gsap.to(arrow, { scale: 1.5, duration: 1.5, ease: EASE.outBack, overwrite: 'auto' })
    }
    const out = () => {
      if (reduced) return
      gsap.to(bg, { scale: 0, duration: 0.63, ease: EASE.outQuad, overwrite: 'auto' })
      gsap.to(arrow, { scale: 1, duration: 0.75, ease: EASE.outQuad, overwrite: 'auto' })
      gsap.to(arrow, { color: brand, duration: 0.63, delay: 0.3, ease: EASE.outExpo, overwrite: 'auto' })
    }

    root.addEventListener('mouseenter', over)
    root.addEventListener('mouseleave', out)

    return () => {
      root.removeEventListener('mouseenter', over)
      root.removeEventListener('mouseleave', out)
      ctx.revert()
    }
  }, [reduced])

  const inner = (
    <>
      <div className="circle-text-btn_bg" />
      <div className="circle-text-btn-circle-wrap">
        <div className="circle-text-btn_ring w-embed">
          <CircleText text={text} />
        </div>
      </div>
      <div className="circle-text-btn_arrow w-embed">
        <ArrowCircle />
      </div>
    </>
  )

  return external ? (
    <a
      ref={rootRef as React.RefObject<HTMLAnchorElement>}
      href={href}
      className="circle-text-btn_wrap w-inline-block"
      aria-label={label}
    >
      {inner}
    </a>
  ) : (
    <Link
      ref={rootRef as React.RefObject<HTMLAnchorElement>}
      href={href}
      className="circle-text-btn_wrap w-inline-block"
      aria-label={label}
    >
      {inner}
    </Link>
  )
}
