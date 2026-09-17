'use client'

import { useId } from 'react'

/** The ring's radius in viewBox units, and the exact length of text it holds. */
const RADIUS = 74
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * Text set around a circle.
 *
 * Drawn from a string rather than from baked outlines, so the wording is data
 * and can be changed without touching vectors.
 *
 * The phrase is set once and fitted to the full circumference with `textLength`,
 * which spreads any spare length evenly into the letter spacing. The ring then
 * closes exactly on the phrase's own trailing separator. Tiling it instead ran
 * past one lap, and everything beyond the lap was dropped — so the seam fell in
 * the middle of a phrase with no separator ("…ENQUIRY START AN…"), and because
 * the ring turns, that seam was always somewhere in view.
 *
 * End `text` with a separator, e.g. "START AN ENQUIRY · MAKE AN ENQUIRY · ".
 */
export default function CircleText({ text }: { text: string }) {
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
          d={`M 100,100 m -${RADIUS},0 a ${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0 a ${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0`}
        />
      </defs>
      <text
        fill="currentColor"
        fontSize="15"
        letterSpacing="1.6"
        // SVG strips trailing spaces by default, which would close the seam up to
        // "·THE" while every other separator reads " · ".
        style={{ fontFamily: 'var(--font--inherit)', textTransform: 'uppercase', whiteSpace: 'pre' }}
      >
        <textPath
          href={`#${ring}`}
          startOffset="0"
          textLength={CIRCUMFERENCE}
          lengthAdjust="spacing"
        >
          {text}
        </textPath>
      </text>
    </svg>
  )
}
