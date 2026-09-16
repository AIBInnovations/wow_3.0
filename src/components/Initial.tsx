import type { ReactNode } from 'react'

/**
 * Sets the opening letter of a heading in the brand's script face, the way the
 * deck opens every statement slide — an ornate initial, then the rest of the
 * line in the display serif.
 *
 * The letter is wrapped rather than styled with ::first-letter because the
 * headings are split into lines and words at runtime; once a splitter has
 * rewrapped the text, ::first-letter no longer addresses the character the
 * design means. A real element survives that.
 */
export default function Initial({ children }: { children: string }): ReactNode {
  const text = children
  const first = text.slice(0, 1)
  const rest = text.slice(1)

  if (!first.trim()) return text

  return (
    <>
      <span className="initial">{first}</span>
      {rest}
    </>
  )
}
