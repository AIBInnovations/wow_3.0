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
 * This band is shaped for client testimonials, and there are none on record
 * yet. Rather than invent them it runs the copy the studio already writes about
 * its own work, attributed to the discipline it belongs to. Swap in real client
 * quotes by replacing `quote`/`name`.
 */
export const voices: Voice[] = [
  {
    "quote": "Nothing on show. The working parts of a celebration dissolve into it — only what was meant to be seen remains.",
    "name": "The Atelier",
    "portrait": "/images/wow-arch-night-800.jpg",
    "right": "/images/wow-tented-lounge.jpg",
    "extra": null
  },
  {
    "quote": "Rather than spectacle, atmosphere; rather than excess, refinement. Nothing is incidental. Everything is intentional.",
    "name": "Our approach",
    "portrait": "/images/wow-white-florals-800.jpg",
    "right": "/images/wow-lawn-dinner.jpg",
    "extra": null
  },
  {
    "quote": "A slower kind of celebration — the spaces expand, and everything within them is placed with intention.",
    "name": "The Setting",
    "portrait": "/images/wow-desert-pavilion-800.jpg",
    "right": "/images/wow-palm-walk.jpg",
    "extra": null
  },
  {
    "quote": "Production, sound and lighting are designed to disappear.",
    "name": "Entertainment",
    "portrait": "/images/wow-arch-performer-800.jpg",
    "right": "/images/wow-carpet-stage.jpg",
    "extra": null
  },
  {
    "quote": "Arrivals, accommodation and transport handled end to end, so that arriving is already part of the celebration.",
    "name": "Guest Experience",
    "portrait": "/images/wow-welcome-sign-800.jpg",
    "right": "/images/wow-cocktails.jpg",
    "extra": null
  }
]
