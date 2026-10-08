/**
 * The line drawings for the four days of a celebration, one for each day. Every stroke is
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

/** Haldi: a marigold in full bloom, with a petal falling. */
export function MarigoldDrawing() {
  const petals = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2
    const x = 120 + Math.cos(a) * 34
    const y = 92 + Math.sin(a) * 34
    const cx = 120 + Math.cos(a) * 62
    const cy = 92 + Math.sin(a) * 62
    const x2 = 120 + Math.cos(a + 0.5) * 34
    const y2 = 92 + Math.sin(a + 0.5) * 34
    return <path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`} />
  })
  return (
    <svg {...common}>
      <circle cx="120" cy="92" r="16" />
      <circle cx="120" cy="92" r="26" />
      {petals}
      <path d="M120 158 C118 172 122 182 120 196" />
      <path d="M120 176 C108 168 98 170 92 178 C102 182 112 182 120 176 Z" />
      <path d="M190 40 C196 48 194 56 186 58 C180 52 182 44 190 40 Z" />
      <path d="M46 150 C52 156 50 164 42 166 C36 160 38 152 46 150 Z" />
    </svg>
  )
}

/** Beyond the wedding: a burst of fireworks over a lit skyline. */
export function NightDrawing() {
  return (
    <svg {...common}>
      <Burst x={120} y={64} r={46} />
      <Burst x={56} y={44} r={22} />
      <Burst x={190} y={52} r={26} />
      <circle cx="120" cy="64" r="4" />
      <path d="M10 190 H230" />
      <path d="M24 190 V160 H52 V146 H72 V190" />
      <path d="M86 190 V150 C86 132 116 132 116 150 V190" />
      <path d="M101 132 V122" />
      <path d="M130 190 V142 H162 V190" />
      <path d="M176 190 V156 H210 V190" />
      <path d="M140 156 H152 M140 170 H152 M186 168 H200" />
    </svg>
  )
}

export const drawings = {
  mandap: MandapDrawing,
  paisley: PaisleyDrawing,
  marigold: MarigoldDrawing,
  night: NightDrawing,
}
export type DrawingName = keyof typeof drawings
