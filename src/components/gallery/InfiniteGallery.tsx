'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useSmoothScroll } from '@/providers/SmoothScrollProvider'
import {
  ALL_SHOTS,
  galleryCopy,
  categoryLabel,
  largeSrc,
  smallSrc,
  type GalleryShot,
} from '@/data/gallery'

/**
 * The gallery: a flat, endless grid of every photograph, panned in any direction.
 *
 * Every cell is the same size — a 4:5 portrait — so the rows and columns line
 * up exactly, edge to edge, however far the reader pans. A photograph is
 * cropped to its cell here and shown whole in the lightbox.
 *
 * The tiles are a grid of `cols` x `rows` nodes, two cells wider and taller
 * than the viewport, that wraps in both directions: a tile's position is its
 * place in the grid minus the pan offset, wrapped by the grid's size, so
 * dragging, wheeling or keying in any direction never reaches an edge, and
 * every visible slot is covered exactly once.
 *
 * Each time a tile wraps it stands on a new cell of the endless plane, and it
 * shows that cell's photograph. Which photograph sits in which cell is a
 * lattice (see chooseLattice), picked for the screen so that the same
 * photograph is never on screen twice where the set is large enough to avoid
 * it, and is as far from itself as possible where it is not. Because the
 * photograph follows the cell rather than the tile, the lattice is free of the
 * tile grid's size.
 *
 * The pan is not React state. The offset lives in a ref and the frame loop
 * writes `transform`, and on a wrap the photograph, straight onto the tile
 * nodes; React renders the tiles once per grid size.
 *
 * The page has no document scroll: the plane is fixed to the viewport and owns
 * the wheel, so the site's smooth scrolling is stopped while this is mounted
 * and the document's own overflow is locked, both restored on unmount. The
 * fixed site header stays on top; its height is measured into --nav-h so the
 * bar sits exactly beneath it at every width.
 */

const GAP = 12
const FRICTION = 0.93
const CELL_RATIO = 5 / 4 // height / width

/**
 * How the set repeats across the plane. One copy of the set fills a block `p`
 * cells wide and `q` tall; copies sit side by side, and each band of `q` rows is
 * slid `a` cells along from the band above. The copies of any one photograph
 * are therefore exactly the steps m·(p, 0) + k·(a, q) apart.
 */
type Lattice = { p: number; q: number; a: number }
type Geo = Lattice & { cw: number; ch: number; cols: number; rows: number }

/** The block index of the photograph at a plane cell (any cell, negative too). */
function blockIndex({ p, q, a }: Lattice, col: number, row: number) {
  const band = Math.floor(row / q)
  const r = row - band * q
  const c = (((col - band * a) % p) + p) % p
  return r * p + c
}

/**
 * Picks the lattice that keeps each photograph furthest from its own copies,
 * measured against the screen.
 *
 * `spanX` and `spanY` are how many columns and rows apart two cells can be and
 * still both show, in part, on one screen (see measureGeo). A step of (dx, dy) cells is scored
 * max(|dx| / spanX, |dy| / spanY): at 1 or more its two copies can never be on
 * screen together. The lattice with the highest score for its shortest step
 * wins; ties go to the longer straight-line step (copies diagonally apart rather
 * than straight below).
 */
function chooseLattice(n: number, spanX: number, spanY: number): Lattice {
  let best: (Lattice & { reach: number; dist: number }) | null = null
  for (let q = 1; q <= n; q++) {
    if (n % q) continue
    const p = n / q
    for (let a = 0; a < p; a++) {
      // the step straight along, then one per band down; beyond the point where
      // the vertical part alone outscores the shortest so far, none can be shorter
      let reach = p / spanX
      let dist = reach
      for (let k = 1; (k * q) / spanY < dist; k++) {
        const r = (k * a) % p
        const fx = Math.min(r, p - r) / spanX
        const fy = (k * q) / spanY
        reach = Math.min(reach, Math.max(fx, fy))
        dist = Math.min(dist, Math.hypot(fx, fy))
      }
      // past 1 nothing is ever on screen twice, so more distance buys nothing
      reach = Math.min(reach, 1)
      dist = Math.min(dist, 1)
      const better =
        !best || reach > best.reach + 0.01 || (reach > best.reach - 0.01 && dist > best.dist + 0.05)
      if (better) best = { p, q, a, reach, dist }
    }
  }
  return { p: best!.p, q: best!.q, a: best!.a }
}

/**
 * Orders the set within its block so that photographs from the same event touch
 * as rarely as possible — across the block's edges too, since the block repeats.
 * It starts from the list's own even spread and keeps any swap of two cells that
 * lowers the number of same-event neighbours, until no swap does. Deterministic,
 * so a given screen always gets the same arrangement.
 */
function arrange(list: GalleryShot[], lattice: Lattice): GalleryShot[] {
  const { p } = lattice
  const n = list.length
  // each cell's four neighbours on the repeating block, as block indices
  const near: number[][] = []
  for (let i = 0; i < n; i++) {
    const col = i % p
    const row = Math.floor(i / p)
    near.push([
      blockIndex(lattice, col + 1, row),
      blockIndex(lattice, col - 1, row),
      blockIndex(lattice, col, row + 1),
      blockIndex(lattice, col, row - 1),
    ])
  }
  const order = [...list]
  // how many of cell i's neighbours (other than `skip`) share event `cat`
  const touching = (i: number, cat: string, skip: number) =>
    near[i].reduce((sum, k) => sum + (k !== i && k !== skip && order[k].cat === cat ? 1 : 0), 0)
  // A swap only changes the pairs that touch the two cells it moves, so its
  // effect is counted from their neighbours alone rather than the whole block.
  for (let improved = true; improved; ) {
    improved = false
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = order[i].cat
        const b = order[j].cat
        if (a === b) continue
        const delta = touching(i, b, j) - touching(i, a, j) + touching(j, a, i) - touching(j, b, i)
        if (delta < 0) {
          ;[order[i], order[j]] = [order[j], order[i]]
          improved = true
        }
      }
    }
  }
  return order
}

/** Which cell of the endless plane a tile stands on, from where it is drawn. */
function cellOf(slot: number, drawn: number, step: number, count: number) {
  // `drawn` is the slot's own position wrapped round the grid; how many whole
  // grid widths it was shifted by says which copy of the slot it is
  return slot + Math.round((drawn - slot * step) / (count * step)) * count
}

function measureGeo(w: number, h: number): Geo {
  // Larger screens get larger tiles rather than more of them: about four
  // columns on a tablet and six to seven on a desktop, so the set fills a
  // screen without any photograph needing to show twice.
  const cw =
    w < 560
      ? Math.floor((w - GAP * 3) / 2)
      : w < 951
        ? Math.min(240, Math.max(210, Math.round(w / 3.4)))
        : w < 1440
          ? 240
          : Math.max(270, Math.min(400, Math.round(w / 6.4)))
  const ch = Math.round(cw * CELL_RATIO)
  const stepX = cw + GAP
  const stepY = ch + GAP
  // How far apart two tiles can be and both show at least a quarter of their
  // width (or height): a thinner sliver at the edge does not read as a repeat.
  const spanX = (w + cw / 2) / stepX
  const spanY = (h + ch / 2) / stepY
  const lattice = chooseLattice(ALL_SHOTS.length, spanX, spanY)
  return { cw, ch, ...lattice, cols: Math.ceil(w / stepX) + 2, rows: Math.ceil(h / stepY) + 2 }
}

export default function InfiniteGallery() {
  const rootRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const nodes = useRef<(HTMLButtonElement | null)[]>([])
  const offset = useRef({ x: -GAP, y: -GAP })
  const painted = useRef({ x: NaN, y: NaN, key: '' })
  const velocity = useRef({ x: 0, y: 0 })
  const dragging = useRef(false)
  const moved = useRef(0)
  const downAt = useRef(0)
  const openedAt = useRef(-1000)
  const downTile = useRef(-1)
  const last = useRef({ x: 0, y: 0 })
  const raf = useRef<number | null>(null)

  const [geo, setGeo] = useState<Geo | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const openRef = useRef<number | null>(null)
  openRef.current = open

  const { start, stop } = useSmoothScroll()

  // the set in its block order for this screen's lattice
  const order = useMemo(() => (geo ? arrange(ALL_SHOTS, geo) : []), [geo])
  const orderRef = useRef(order)
  orderRef.current = order
  // the block index each tile is showing, so a photograph is only swapped on a wrap
  const shown = useRef<number[]>([])

  // The plane owns the wheel and the page has nothing to scroll, so the site's
  // smooth scrolling is paused and the document locked for as long as this
  // is mounted. The scroll API changes identity once the provider is ready,
  // which re-runs this: the old (no-op) start, then the real stop.
  useEffect(() => {
    stop()
    return () => start()
  }, [start, stop])

  useEffect(() => {
    const html = document.documentElement
    const previous = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = previous
    }
  }, [])

  // The bar sits beneath the fixed site header, whose height is measured into
  // --nav-h. The wrapper's own height is 0 — its bar is absolutely positioned
  // inside it — so the bar itself is what is observed.
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    const nav =
      document.querySelector<HTMLElement>('.nav_wrap .nav_flex') ??
      document.querySelector<HTMLElement>('.nav_wrap')
    if (!root || !nav) return
    const apply = () => root.style.setProperty('--nav-h', `${nav.offsetHeight}px`)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(nav)
    return () => ro.disconnect()
  }, [])

  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const measure = () => {
      const next = measureGeo(wrap.clientWidth, wrap.clientHeight)
      // only a real change re-renders: the observer also fires for sizes that land on the same grid
      setGeo((g) =>
        g &&
        g.cw === next.cw &&
        g.cols === next.cols &&
        g.rows === next.rows &&
        g.p === next.p &&
        g.q === next.q &&
        g.a === next.a
          ? g
          : next
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [])

  /** Place every tile at its wrapped slot. Only runs when the offset or the grid changed. */
  const paint = useCallback(() => {
    if (!geo) return
    const { x: ox, y: oy } = offset.current
    const key = `${geo.cw}|${geo.cols}|${geo.rows}`
    const p = painted.current
    if (p.x === ox && p.y === oy && p.key === key) return
    painted.current = { x: ox, y: oy, key }

    const stepX = geo.cw + GAP
    const stepY = geo.ch + GAP
    const planeW = geo.cols * stepX
    const planeH = geo.rows * stepY
    const shots = orderRef.current
    for (let i = 0; i < geo.cols * geo.rows; i++) {
      const node = nodes.current[i]
      if (!node) continue
      const col = i % geo.cols
      const row = Math.floor(i / geo.cols)
      let x = col * stepX - ox
      x = (((x + stepX) % planeW) + planeW) % planeW - stepX
      let y = row * stepY - oy
      y = (((y + stepY) % planeH) + planeH) % planeH - stepY
      // rounded once, from the one shared offset, so every gap on screen is the same width
      node.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`
      // the photograph of the plane cell the tile now stands on
      const at = blockIndex(geo, cellOf(col, x + ox, stepX, geo.cols), cellOf(row, y + oy, stepY, geo.rows))
      if (shown.current[i] !== at) {
        shown.current[i] = at
        const shot = shots[at]
        node.querySelector('img')!.src = smallSrc(shot.id)
        node.setAttribute('aria-label', `Open photograph: ${categoryLabel(shot.cat)}`)
      }
    }
  }, [geo])

  // the frame loop: momentum when not dragging, then paint
  useEffect(() => {
    if (!geo) return
    painted.current.key = ''
    shown.current = []
    const tick = () => {
      if (!dragging.current) {
        const v = velocity.current
        if (Math.abs(v.x) > 0.05 || Math.abs(v.y) > 0.05) {
          offset.current.x += v.x
          offset.current.y += v.y
          v.x *= FRICTION
          v.y *= FRICTION
        }
      }
      paint()
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [paint, geo, order])

  // pointer drag, wheel and keys all write to the same offset
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    // Which tile is under a point, found from the tiles' own rectangles rather
    // than the browser's hit test: on a touch screen every event on this plane
    // reported the plane itself as its target while a tile sat squarely under
    // the finger.
    const tileAt = (cx: number, cy: number) => {
      const list = nodes.current
      for (let i = list.length - 1; i >= 0; i--) {
        const n = list[i]
        if (!n) continue
        const r = n.getBoundingClientRect()
        if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) return i
      }
      return -1
    }
    const press = (cx: number, cy: number, at: number) => {
      dragging.current = true
      moved.current = 0
      downAt.current = at
      downTile.current = tileAt(cx, cy)
      last.current = { x: cx, y: cy }
      velocity.current = { x: 0, y: 0 }
      wrap.classList.add('is-dragging')
    }
    const release = (at: number) => {
      if (!dragging.current) return
      dragging.current = false
      wrap.classList.remove('is-dragging')
      const idx = downTile.current
      downTile.current = -1
      // a tap: little movement, short, on a tile, and not the same press twice
      if (moved.current >= 14 || at - downAt.current >= 450) return
      const shot = idx < 0 ? undefined : orderRef.current[shown.current[idx]]
      if (!shot || at - openedAt.current < 500) return
      openedAt.current = at
      velocity.current = { x: 0, y: 0 }
      setOpen(ALL_SHOTS.indexOf(shot))
    }
    const move = (e: PointerEvent) => {
      if (!dragging.current) return
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      last.current = { x: e.clientX, y: e.clientY }
      moved.current += Math.abs(dx) + Math.abs(dy)
      offset.current.x -= dx
      offset.current.y -= dy
      velocity.current = { x: -dx, y: -dy }
    }
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      offset.current.x += e.deltaX
      offset.current.y += e.deltaY
      velocity.current = { x: 0, y: 0 }
    }
    const key = (e: KeyboardEvent) => {
      if (openRef.current !== null) return
      const step = 220
      const map: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      }
      const d = map[e.key]
      if (!d) return
      e.preventDefault()
      velocity.current = { x: d[0] / 12, y: d[1] / 12 }
    }

    let pointerSeen = false
    const tstart = (e: TouchEvent) => {
      if (pointerSeen) return
      const t = e.touches[0]
      if (!t) return
      press(t.clientX, t.clientY, e.timeStamp)
    }
    const tmove = (e: TouchEvent) => {
      if (pointerSeen || !dragging.current) return
      const t = e.touches[0]
      if (!t) return
      const dx = t.clientX - last.current.x
      const dy = t.clientY - last.current.y
      last.current = { x: t.clientX, y: t.clientY }
      moved.current += Math.abs(dx) + Math.abs(dy)
      offset.current.x -= dx
      offset.current.y -= dy
      velocity.current = { x: -dx, y: -dy }
    }
    const tend = (e: TouchEvent) => {
      if (!pointerSeen) release(e.timeStamp)
      // the click a touch screen synthesises after touchend would land on the
      // lightbox that tap just opened and close it again; preventDefault stops
      // it being generated
      if (e.timeStamp - openedAt.current < 600) e.preventDefault()
    }
    const downP = (e: PointerEvent) => {
      pointerSeen = true
      press(e.clientX, e.clientY, e.timeStamp)
    }
    const upP = (e: PointerEvent) => {
      release(e.timeStamp)
      pointerSeen = false
    }

    wrap.addEventListener('pointerdown', downP)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', upP)
    window.addEventListener('pointercancel', upP)
    wrap.addEventListener('touchstart', tstart, { passive: true })
    wrap.addEventListener('touchmove', tmove, { passive: true })
    wrap.addEventListener('touchend', tend)
    wrap.addEventListener('wheel', wheel, { passive: false })
    wrap.addEventListener('keydown', key)
    return () => {
      wrap.removeEventListener('pointerdown', downP)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', upP)
      window.removeEventListener('pointercancel', upP)
      wrap.removeEventListener('touchstart', tstart)
      wrap.removeEventListener('touchmove', tmove)
      wrap.removeEventListener('touchend', tend)
      wrap.removeEventListener('wheel', wheel)
      wrap.removeEventListener('keydown', key)
    }
  }, [])

  // lightbox keys: Escape closes, the arrows step through the set
  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      const n = ALL_SHOTS.length
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % n))
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + n) % n))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const current = open !== null ? ALL_SHOTS[open] : null
  const step = (d: number) => (e: ReactMouseEvent) => {
    e.stopPropagation()
    setOpen((i) => (i === null ? i : (i + d + ALL_SHOTS.length) % ALL_SHOTS.length))
  }

  return (
    <div ref={rootRef} className="gal">
      <div className="gal__bar">
        <h1 className="gal__heading">{galleryCopy.title}</h1>

        <p className="gal__hint">{galleryCopy.hint}</p>
      </div>

      <div
        className="gal__plane"
        ref={wrapRef}
        role="application"
        aria-label="Photographs, pannable in any direction. Use the arrow keys to move."
        tabIndex={0}
      >
        {geo &&
          Array.from({ length: geo.cols * geo.rows }, (_, i) => (
            <button
              type="button"
              className="gal__tile"
              key={i}
              ref={(el) => {
                nodes.current[i] = el
              }}
              style={{ width: geo.cw, height: geo.ch }}
              tabIndex={-1}
            >
              {/* The photograph and the label are set by the frame loop, from
                  the plane cell the tile stands on (see paint). */}
              <img alt="" draggable={false} decoding="async" />
            </button>
          ))}
      </div>

      {/* Rendered into <body>, not here: `.gal` is position:fixed, which makes
          it its own stacking context, and inside it no z-index could lift the
          lightbox above the site header — the wordmark and the menu button
          would sit on top of the photograph. */}
      {current &&
        createPortal(
          <div
            className="gal__lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={categoryLabel(current.cat)}
            onClick={() => setOpen(null)}
          >
            {/* The frame is sized from the photograph's own ratio, so it holds
                still while the file arrives. */}
            <img
              src={largeSrc(current.id)}
              alt=""
              decoding="async"
              style={{ ['--ar' as string]: String(current.ar) }}
            />
            <p className="gal__caption">
              {categoryLabel(current.cat)}
              <span>
                {open! + 1} / {ALL_SHOTS.length}
              </span>
            </p>
            <button
              type="button"
              className="gal__step gal__step--prev"
              aria-label="Previous photograph"
              onClick={step(-1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className="gal__step gal__step--next"
              aria-label="Next photograph"
              onClick={step(1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            <button type="button" className="gal__close" aria-label="Close">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>,
          document.body
        )}
    </div>
  )
}
