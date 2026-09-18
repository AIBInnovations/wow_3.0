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
  GALLERY_CATEGORIES,
  GALLERY_SHOTS,
  galleryCopy,
  categoryLabel,
  largeSrc,
  smallSrc,
  type GalleryShot,
} from '@/data/gallery'

/**
 * The gallery: a flat, endless grid of photographs, filtered by event.
 *
 * Every cell is the same size — a 4:5 portrait — so the rows and columns line
 * up exactly, edge to edge, however far the reader pans. A photograph is
 * cropped to its cell here and shown whole in the lightbox.
 *
 * The grid is a plane of `cols` x `rows` cells that repeats in both directions:
 * a cell's position is its place on the plane minus the pan offset, wrapped by
 * the plane's size, so dragging, wheeling or keying in any direction never
 * reaches an edge. The plane is always two cells wider and taller than the
 * viewport, which is what guarantees every visible slot is covered exactly once.
 *
 * The pan is not React state. The offset lives in a ref and the frame loop
 * writes `transform` straight onto the tile nodes; React renders the tiles once
 * per category.
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
const ALL = 'all'

// How many categories sit in the bar before the rest move under "More", per
// width band. The classes below carry this to the stylesheet; see
// `.gal__tab--hide-*` in styles/gallery.css.
const INLINE = { xl: 6, lg: 4, md: 2 } as const

type Geo = { cw: number; ch: number; cols: number; rows: number }
type Cell = { shot: GalleryShot; col: number; row: number }

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a
}

/**
 * Fill the plane's cells from the photographs. When there are more cells than
 * photographs the list is walked again, each pass with a different stride
 * through it (co-prime with its length, so every photograph still appears once
 * per pass): a repeat then never sits in the same arrangement as the pass
 * before, and the grid does not read as a tiled wallpaper.
 */
function buildCells(list: GalleryShot[], cols: number, rows: number): Cell[] {
  const n = list.length
  if (!n) return []
  const strides: number[] = []
  for (let s = 1; strides.length < 8 && s <= n * 2 + 1; s++) if (gcd(s, n) === 1) strides.push(s)
  const cells: Cell[] = []
  for (let i = 0; i < cols * rows; i++) {
    const pass = Math.floor(i / n)
    const stride = strides[pass % strides.length]
    const j = ((i % n) * stride + pass * 3) % n
    cells.push({ shot: list[j], col: i % cols, row: Math.floor(i / cols) })
  }
  return cells
}

function measureGeo(w: number, h: number, count: number): Geo {
  const cw = w < 560 ? Math.floor((w - GAP * 3) / 2) : w < 951 ? 210 : w < 1440 ? 240 : 270
  const ch = Math.round(cw * CELL_RATIO)
  const cols = Math.ceil(w / (cw + GAP)) + 2
  // never fewer cells than photographs, or some of them would never be shown
  const rows = Math.max(Math.ceil(h / (ch + GAP)) + 2, Math.ceil(count / cols))
  return { cw, ch, cols, rows }
}

export default function InfiniteGallery() {
  const rootRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
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

  const [cat, setCat] = useState<string>(ALL)
  const [geo, setGeo] = useState<Geo | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const openRef = useRef<number | null>(null)
  openRef.current = open

  const { start, stop } = useSmoothScroll()

  // "Gallery" interleaves the events, so the first screen shows a little of each
  const list = useMemo(
    () => (cat === ALL ? ALL_SHOTS : GALLERY_SHOTS.filter((s) => s.cat === cat)),
    [cat]
  )
  const listRef = useRef(list)
  listRef.current = list

  const cells = useMemo(() => (geo ? buildCells(list, geo.cols, geo.rows) : []), [list, geo])
  const cellsRef = useRef(cells)
  cellsRef.current = cells

  const catIndex = GALLERY_CATEGORIES.findIndex((c) => c.slug === cat)

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

  // The category lives in the hash, so a link to /gallery#sufi-night opens on
  // that event. Read before the first paint, so the plane never shows "Gallery"
  // for a frame before switching.
  useIsomorphicLayoutEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(window.location.hash.slice(1))
      setCat(GALLERY_CATEGORIES.some((c) => c.slug === h) ? h : ALL)
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [])

  const choose = useCallback((slug: string) => {
    setMoreOpen(false)
    setOpen(null)
    offset.current = { x: -GAP, y: -GAP }
    velocity.current = { x: 0, y: 0 }
    setCat(slug)
    const url = slug === ALL ? window.location.pathname : `#${slug}`
    window.history.replaceState(null, '', url)
  }, [])

  // On a phone the tabs are one row that scrolls sideways: bring the chosen
  // event into view, whether it was tapped or came from the hash.
  useEffect(() => {
    const tabs = tabsRef.current
    const btn = tabs?.querySelector<HTMLElement>('.gal__tab.is-active')
    if (!tabs || !btn || tabs.scrollWidth <= tabs.clientWidth) return
    tabs.scrollTo({ left: Math.max(0, btn.offsetLeft - (tabs.clientWidth - btn.offsetWidth) / 2) })
  }, [cat])

  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const measure = () => {
      const next = measureGeo(wrap.clientWidth, wrap.clientHeight, listRef.current.length)
      // only a real change re-renders: the observer also fires for sizes that land on the same grid
      setGeo((g) => (g && g.cw === next.cw && g.cols === next.cols && g.rows === next.rows ? g : next))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [list.length])

  /** Place every tile at its wrapped slot. Only runs when the offset or the grid changed. */
  const paint = useCallback(() => {
    if (!geo) return
    const { x: ox, y: oy } = offset.current
    const key = `${cat}|${geo.cw}|${geo.cols}|${geo.rows}`
    const p = painted.current
    if (p.x === ox && p.y === oy && p.key === key) return
    painted.current = { x: ox, y: oy, key }

    const stepX = geo.cw + GAP
    const stepY = geo.ch + GAP
    const planeW = geo.cols * stepX
    const planeH = geo.rows * stepY
    cellsRef.current.forEach((c, i) => {
      const node = nodes.current[i]
      if (!node) return
      let x = c.col * stepX - ox
      x = (((x + stepX) % planeW) + planeW) % planeW - stepX
      let y = c.row * stepY - oy
      y = (((y + stepY) % planeH) + planeH) % planeH - stepY
      // rounded once, from the one shared offset, so every gap on screen is the same width
      node.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`
    })
  }, [geo, cat])

  // the frame loop: momentum when not dragging, then paint
  useEffect(() => {
    if (!geo) return
    painted.current.key = ''
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
  }, [paint, geo, cells])

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
      const cell = cellsRef.current[idx]
      if (idx < 0 || !cell || at - openedAt.current < 500) return
      openedAt.current = at
      velocity.current = { x: 0, y: 0 }
      setOpen(listRef.current.indexOf(cell.shot))
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

  // lightbox keys: Escape closes, the arrows step through the current event
  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      const n = listRef.current.length
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % n))
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + n) % n))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // the More menu closes on a press anywhere outside it, and on Escape
  useEffect(() => {
    if (!moreOpen) return
    const away = (e: PointerEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false)
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    window.addEventListener('pointerdown', away)
    window.addEventListener('keydown', esc)
    return () => {
      window.removeEventListener('pointerdown', away)
      window.removeEventListener('keydown', esc)
    }
  }, [moreOpen])

  const tabClass = (i: number) =>
    [
      'gal__tab',
      i >= INLINE.xl ? 'gal__tab--hide-xl' : '',
      i >= INLINE.lg ? 'gal__tab--hide-lg' : '',
      i >= INLINE.md ? 'gal__tab--hide-md' : '',
      GALLERY_CATEGORIES[i].slug === cat ? 'is-active' : '',
    ]
      .filter(Boolean)
      .join(' ')

  const itemClass = (i: number) =>
    [
      'gal__menu-item',
      i < INLINE.xl ? 'gal__menu-item--in-xl' : '',
      i < INLINE.lg ? 'gal__menu-item--in-lg' : '',
      i < INLINE.md ? 'gal__menu-item--in-md' : '',
    ]
      .filter(Boolean)
      .join(' ')

  // "More" reads as active when the chosen event is one of those tucked inside it
  const moreClass = [
    'gal__tab gal__more-btn',
    catIndex >= INLINE.xl ? 'is-active-xl' : '',
    catIndex >= INLINE.lg ? 'is-active-lg' : '',
    catIndex >= INLINE.md ? 'is-active-md' : '',
    moreOpen ? 'is-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const current = open !== null ? list[open] : null
  const step = (d: number) => (e: ReactMouseEvent) => {
    e.stopPropagation()
    setOpen((i) => (i === null ? i : (i + d + list.length) % list.length))
  }

  return (
    <div ref={rootRef} className="gal">
      <div className="gal__bar">
        <p className="gal__credit">
          {galleryCopy.credit[0]}
          <br />
          {galleryCopy.credit[1]}
        </p>

        <nav ref={tabsRef} className="gal__tabs" aria-label="Events">
          <button
            type="button"
            className={`gal__tab${cat === ALL ? ' is-active' : ''}`}
            aria-pressed={cat === ALL}
            onClick={() => choose(ALL)}
          >
            {galleryCopy.all}
          </button>
          {GALLERY_CATEGORIES.map((c, i) => (
            <button
              type="button"
              key={c.slug}
              className={tabClass(i)}
              aria-pressed={c.slug === cat}
              onClick={() => choose(c.slug)}
            >
              {i + 1}. {c.label}
            </button>
          ))}

          <div className="gal__more" ref={moreRef}>
            <button
              type="button"
              className={moreClass}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              onClick={() => setMoreOpen((o) => !o)}
            >
              {galleryCopy.more}
              <svg viewBox="0 0 12 8" aria-hidden="true" focusable="false">
                <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </button>
            {moreOpen && (
              <ul className="gal__menu">
                {GALLERY_CATEGORIES.map((c, i) => (
                  <li className={itemClass(i)} key={c.slug}>
                    <button
                      type="button"
                      className={c.slug === cat ? 'is-active' : ''}
                      onClick={() => choose(c.slug)}
                    >
                      {i + 1}. {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        <p className="gal__count">
          {list.length} {galleryCopy.countNoun}
          <span aria-hidden="true"> · </span>
          {galleryCopy.hint}
        </p>
      </div>

      <div
        className="gal__plane"
        ref={wrapRef}
        role="application"
        aria-label="Photographs, pannable in any direction. Use the arrow keys to move."
        tabIndex={0}
      >
        {geo &&
          cells.map((c, i) => (
            <button
              type="button"
              className="gal__tile"
              key={`${cat}-${i}`}
              ref={(el) => {
                nodes.current[i] = el
              }}
              style={{ width: geo.cw, height: geo.ch }}
              aria-label={`Open photograph: ${categoryLabel(c.shot.cat)}`}
              tabIndex={-1}
            >
              {/* lazy: the plane holds every photograph of the event, but only
                  the cells near the viewport need to load; the rest arrive as
                  the reader pans toward them */}
              <img src={smallSrc(c.shot.id)} alt="" draggable={false} loading="lazy" decoding="async" />
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
                {open! + 1} / {list.length}
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
