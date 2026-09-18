/**
 * Scrolls to a chapter by its anchor id.
 *
 * Native scrolling is used so that Lenis, which adopts any scroll position it did
 * not set itself, stays in step. `scroll-margin-top` on the chapter keeps the
 * fixed navigation off the section's top edge.
 */
export function scrollToChapter(slug: string, smooth: boolean) {
  const el = document.getElementById(slug)
  if (!el) return
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' })
  if (window.location.hash !== `#${slug}`) {
    window.history.replaceState(null, '', `#${slug}`)
  }
}
