'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
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
 * The editorial round CTA: a brand disc with circular type that rotates
 * continuously and an arrow pinned at the centre.
 */
export default function CircleTextButton({ href, text, label }: Props) {
  const circleRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const external = href.startsWith('mailto:') || href.startsWith('http')

  useIsomorphicLayoutEffect(() => {
    const el = circleRef.current
    if (!el || reduced) return
    registerGsap()

    const ctx = gsap.context(() => {
      gsap.to(el, { rotation: 360, duration: 28, ease: 'none', repeat: -1 })
    })

    return () => ctx.revert()
  }, [reduced])

  const inner = (
    <>
      <div className="circle-text-btn_bg" />
      <div ref={circleRef} className="circle-text-btn-circle-wrap">
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
    <a href={href} className="circle-text-btn_wrap w-inline-block" aria-label={label}>
      {inner}
    </a>
  ) : (
    <Link href={href} className="circle-text-btn_wrap w-inline-block" aria-label={label}>
      {inner}
    </Link>
  )
}
