/**
 * The line drawings in the celebrations band, one for each day. Every stroke is
 * a separate path so it can be drawn in on its own when the slide changes; the
 * colour is the band's gold, taken from `currentColor`.
 */

const common = {
  viewBox: '0 0 240 200',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  className: 'voices-draw',
}

/** Rays of a firework burst, centred on (x, y). */
function Burst({ x, y, r }: { x: number; y: number; r: number }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4
    const x1 = x + Math.cos(a) * r * 0.35
    const y1 = y + Math.sin(a) * r * 0.35
    const x2 = x + Math.cos(a) * r
    const y2 = y + Math.sin(a) * r
    return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`} />
  })
  return <>{rays}</>
}

/** The Wedding: a mandap beneath two bursts of fireworks. */
export function MandapDrawing() {
  return (
    <svg {...common}>
      <path d="M10 190 H230" />
      <path d="M40 182 H200" />
      <path d="M55 174 V166 H185 V174" />
      <path d="M70 166 V92" />
      <path d="M170 166 V92" />
      <path d="M95 166 V128 C95 110 145 110 145 128 V166" />
      <path d="M60 92 H180" />
      <path d="M64 100 H176" />
      <path d="M66 92 C66 46 174 46 174 92" />
      <path d="M120 52 V92" />
      <path d="M93 58 C101 70 103 82 101 92" />
      <path d="M147 58 C139 70 137 82 139 92" />
      <path d="M120 52 V36" />
      <path d="M113 36 C113 27 127 27 127 36 Z" />
      <path d="M120 27 V18" />
      <path d="M70 108 Q82 122 95 108" />
      <path d="M145 108 Q158 122 170 108" />
      <Burst x={38} y={44} r={20} />
      <Burst x={204} y={34} r={16} />
    </svg>
  )
}

/** Mehendi & Sangeet: a paisley in henna line, a vine and a note of music. */
export function PaisleyDrawing() {
  return (
    <svg {...common}>
      <path d="M118 186 C62 186 44 130 74 96 C100 66 158 70 166 112 C172 146 140 162 122 146 C108 132 120 112 136 120" />
      <path d="M118 172 C80 170 68 134 88 110 C106 90 146 94 150 120" />
      <path d="M104 156 C88 150 84 132 96 120" />
      <circle cx="132" cy="134" r="3" />
      <circle cx="92" cy="92" r="2.5" />
      <circle cx="78" cy="118" r="2.5" />
      <circle cx="160" cy="92" r="2.5" />
      <path d="M150 188 C176 162 200 162 214 136" />
      <path d="M182 164 C188 150 202 150 200 160 C194 166 186 167 182 164 Z" />
      <path d="M204 144 C208 130 222 130 220 140 C214 146 208 147 204 144 Z" />
      <path d="M44 74 V32 L70 24 V64" />
      <path d="M44 46 L70 38" />
      <ellipse cx="38" cy="75" rx="7" ry="5" />
      <ellipse cx="64" cy="66" rx="7" ry="5" />
    </svg>
  )
}

export const drawings = { mandap: MandapDrawing, paisley: PaisleyDrawing }
export type DrawingName = keyof typeof drawings
