/**
 * A lotus mandala in gold line, drawn the traditional way: a point at the
 * centre, nested rings, then rows of lotus petals whose counts double outward
 * (8, 16, 32), held apart by bands of dots, scallops, leaves and a zigzag
 * border. Every ring is a single path, so each can be drawn in as one stroke.
 *
 * It is three stacked layers — the inner lotus, the middle petals and the
 * outer border — so HomeStatement.tsx can turn them against each other.
 */

type Point = [number, number]

const TAU = Math.PI * 2
const round = (n: number) => Math.round(n * 100) / 100
/** Angle 0 is twelve o'clock. */
const polar = (r: number, a: number): Point => [r * Math.sin(a), -r * Math.cos(a)]
const at = ([x, y]: Point) => `${round(x)} ${round(y)}`

const ring = (r: number) => `M0 ${-r}A${r} ${r} 0 1 1 0 ${r}A${r} ${r} 0 1 1 0 ${-r}`

/** Lotus petals rising from radius r0 to a point at r1, the base left open. */
function petals(count: number, r0: number, r1: number, width = 1, offset = 0) {
  const w = (TAU / count / 2) * width
  const len = r1 - r0
  let d = ''
  for (let i = 0; i < count; i++) {
    const a = offset + (i * TAU) / count
    d += `M${at(polar(r0, a - w))}`
    d += `C${at(polar(r0 + len * 0.5, a - w * 1.08))} ${at(polar(r1 - len * 0.18, a - w * 0.3))} ${at(polar(r1, a))}`
    d += `C${at(polar(r1 - len * 0.18, a + w * 0.3))} ${at(polar(r0 + len * 0.5, a + w * 1.08))} ${at(polar(r0, a + w))}`
  }
  return d
}

/** Closed teardrops, pointing outward. */
function leaves(count: number, r0: number, r1: number, width = 1, offset = 0) {
  const w = (TAU / count / 2) * width
  const len = r1 - r0
  let d = ''
  for (let i = 0; i < count; i++) {
    const a = offset + (i * TAU) / count
    d += `M${at(polar(r0, a))}`
    d += `C${at(polar(r0 + len * 0.3, a - w))} ${at(polar(r1 - len * 0.25, a - w * 0.9))} ${at(polar(r1, a))}`
    d += `C${at(polar(r1 - len * 0.25, a + w * 0.9))} ${at(polar(r0 + len * 0.3, a + w))} ${at(polar(r0, a))}Z`
  }
  return d
}

/** Little arches standing on a ring. */
function scallops(count: number, rb: number, rt: number, offset = 0) {
  let d = ''
  for (let i = 0; i < count; i++) {
    const a0 = offset + (i * TAU) / count
    const a1 = a0 + TAU / count
    d += `M${at(polar(rb, a0))}Q${at(polar(rb + 2 * (rt - rb), (a0 + a1) / 2))} ${at(polar(rb, a1))}`
  }
  return d
}

/** A ring of small circles. */
function dots(count: number, radius: number, r: number, offset = 0) {
  let d = ''
  for (let i = 0; i < count; i++) {
    const [x, y] = polar(radius, offset + (i * TAU) / count)
    d += `M${round(x - r)} ${round(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`
  }
  return d
}

/** A closed zigzag between two radii. */
function zigzag(count: number, rIn: number, rOut: number) {
  const step = TAU / count
  const points: string[] = []
  for (let i = 0; i < count; i++) {
    points.push(at(polar(rIn, i * step)), at(polar(rOut, i * step + step / 2)))
  }
  return `M${points.join('L')}Z`
}

const LAYERS: { name: string; paths: string[] }[] = [
  {
    name: 'inner',
    paths: [
      ring(7),
      ring(11),
      petals(8, 11, 34),
      petals(8, 11, 25, 0.8, TAU / 16),
      ring(38),
      dots(16, 43, 1.3),
    ],
  },
  {
    name: 'middle',
    paths: [
      ring(48),
      petals(16, 48, 92),
      petals(16, 56, 80, 0.5),
      ring(96),
      ring(100),
      scallops(32, 100, 109),
      dots(32, 115, 1.1),
    ],
  },
  {
    name: 'outer',
    paths: [
      ring(121),
      petals(16, 121, 160, 1, TAU / 32),
      petals(16, 129, 151, 0.55, TAU / 32),
      ring(164),
      leaves(32, 164, 186, 0.85),
      ring(189),
      zigzag(64, 189, 196),
      ring(199),
    ],
  },
]

export default function Mandala({ className = '' }: { className?: string }) {
  return (
    <div className={`mandala ${className}`.trim()} aria-hidden="true">
      {LAYERS.map((layer) => (
        <svg key={layer.name} className={`mandala_layer mandala_${layer.name}`} viewBox="-200 -200 400 400">
          {layer.name === 'inner' ? <circle className="mandala_bindu" r="2.4" /> : null}
          {layer.paths.map((d, i) => (
            <path key={i} className="mandala_line" d={d} />
          ))}
        </svg>
      ))}
    </div>
  )
}
