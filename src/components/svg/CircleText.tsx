'use client'

import { useId } from 'react'

/**
 * Text set around a circle.
 *
 * The export baked its two circular lockups into vector outlines, so their
 * wording could not be changed. This draws the ring live from a string instead,
 * which is what lets the studio's own words sit in the CTA. `repeat` tiles the
 * phrase so it closes the ring without a gap.
 */
export default function CircleText({
  text,
  repeat = 2,
}: {
  text: string
  repeat?: number
}) {
  const id = useId().replace(/:/g, '')
  const ring = `ring-${id}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      role="img"
    >
      <defs>
        {/* A full circle drawn as two arcs so textPath has an unbroken run. */}
        <path
          id={ring}
          fill="none"
          d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"
        />
      </defs>
      <text
        fill="currentColor"
        fontSize="13"
        letterSpacing="1.6"
        style={{ fontFamily: 'var(--font--inherit)', textTransform: 'uppercase' }}
      >
        <textPath href={`#${ring}`} startOffset="0">
          {text.repeat(repeat)}
        </textPath>
      </text>
    </svg>
  )
}
