import type { ReactNode } from 'react'

/**
 * Sets a heading's opening capital in the brand script, larger than the capitals
 * beside it — the way the deck opens its statement headings.
 *
 * The capital and the rest of its first word share a no-wrap span. The capital is
 * an inline-block, and a line may otherwise break right after one — which parted
 * "W" from "eddings" onto separate lines when the wordmark wrapped on a phone.
 *
 * `data-letter` lets each capital take its own measured clearance, because a
 * script capital's loops reach past its advance width by a different amount for
 * every letter.
 *
 * Headings are split into lines, words and characters for their reveal. The
 * split code unwraps the capital back to plain text afterwards, so it is never
 * inside a character or word clip — its loops extend well beyond a normal
 * letter's box and would otherwise be cut. It fades in with its heading instead.
 */
export default function Initial({ children }: { children: string }): ReactNode {
  const first = children.slice(0, 1)
  if (!first.trim()) return children

  const firstWordEnd = children.search(/\s/)
  const firstWord = firstWordEnd === -1 ? children : children.slice(0, firstWordEnd)
  const rest = firstWordEnd === -1 ? '' : children.slice(firstWordEnd)

  return (
    <>
      <span className="initial-word">
        <span className="initial" data-letter={first.toUpperCase()}>
          {first.toUpperCase()}
        </span>
        {firstWord.slice(1)}
      </span>
      {rest}
    </>
  )
}
