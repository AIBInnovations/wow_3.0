import type { DrawingName } from '@/components/VoiceDrawings'

export type Voice = {
  /** The day this slide is about, shown between the arrows. */
  title: string
  /**
   * The large statement in the left column, line by line: that day's own
   * three lines from the Celebrations page. The middle line is set in italic.
   */
  headline: [string, string, string]
  /** The line drawing above it, drawn in each time the slide arrives. */
  drawing: DrawingName
  /** The full-height photograph beside it. */
  right: string
}

/**
 * The celebrations band: two days of a celebration, each a drawing, a
 * statement and a photograph. Titles and statements are the Celebrations
 * page's own, so the two never say different things.
 */
export const voices: Voice[] = [
  {
    title: 'The Wedding',
    headline: ['The mandap,', 'the procession,', 'the vows.'],
    drawing: 'mandap',
    right: '/wow/lib-fireworks-aisle.jpg',
  },
  {
    title: 'Mehendi & Sangeet',
    headline: ['Henna,', 'rehearsal and an evening', 'that runs long.'],
    drawing: 'paisley',
    right: '/wow/lib-stage-crowd.jpg',
  },
]
