export type Voice = {
  quote: string
  /** Attribution line — the discipline or theme the statement belongs to. */
  name: string
  portrait: string | null
  right: string | null
  extra: string | null
}

/**
 * The studio's own statements, not client quotes.
 *
 * The original clone carried five client testimonials here. WOW's site has no
 * testimonials anywhere, so rather than invent them this band runs the copy the
 * studio already writes about its own work, attributed to the discipline it
 * belongs to. Swap in real client quotes by replacing `quote`/`name`.
 */
export const voices: Voice[] = [
  {
    "quote": "Nothing on show. The working parts of a celebration dissolve into it — only what was meant to be seen remains.",
    "name": "The Atelier",
    "portrait": "/images/voice-0.jpg",
    "right": "/images/voice-0-wide.jpg",
    "extra": null
  },
  {
    "quote": "Rather than spectacle, atmosphere; rather than excess, refinement. Nothing is incidental. Everything is intentional.",
    "name": "Our approach",
    "portrait": "/images/voice-1.jpg",
    "right": "/images/voice-1-wide.jpg",
    "extra": null
  },
  {
    "quote": "A slower kind of celebration — the spaces expand, and everything within them is placed with intention.",
    "name": "The Setting",
    "portrait": "/images/voice-2.jpg",
    "right": "/images/voice-2-wide.jpg",
    "extra": null
  },
  {
    "quote": "Production, sound and lighting are designed to disappear.",
    "name": "Entertainment",
    "portrait": "/images/voice-3.jpg",
    "right": "/images/voice-3-wide.jpg",
    "extra": null
  },
  {
    "quote": "Arrivals, accommodation and transport handled end to end, so that arriving is already part of the celebration.",
    "name": "Guest Experience",
    "portrait": "/images/voice-4.jpg",
    "right": "/images/voice-4-wide.jpg",
    "extra": null
  }
]
