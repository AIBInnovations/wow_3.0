'use client'

import { useEffect, useState } from 'react'

/**
 * The display face (Love) and body mono (Cutive Mono) load from a CDN. Splitting
 * text into lines before they arrive measures the fallback font, which bakes in
 * the wrong line breaks — the split boxes keep those widths even after the real
 * face swaps in. Everything that calls SplitType waits on this.
 */
export function useFontsReady() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!('fonts' in document)) {
      setReady(true)
      return
    }

    document.fonts.ready.then(() => {
      if (!cancelled) setReady(true)
    })

    // Never block the reveal indefinitely if a font request hangs.
    const fallback = window.setTimeout(() => {
      if (!cancelled) setReady(true)
    }, 3000)

    return () => {
      cancelled = true
      window.clearTimeout(fallback)
    }
  }, [])

  return ready
}
