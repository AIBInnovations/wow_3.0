import type { ReactNode } from 'react'

/**
 * Sets a heading's opening capital in the display face's italic, larger than the
 * capitals beside it — the editorial capital the deck opens its headings with,
 * in the same family as the rest of the heading.
 *
 * The capital and the rest of its first word share a no-wrap span. The capital is
 * an inline-block, and a line may otherwise break right after one — which parted
 * "W" from "eddings" onto separate lines when the wordmark wrapped on a phone.
 *
 * `data-letter` lets each capital take its own measured italic correction,
 * because an italic capital leans past its advance width by a different amount
 * for every letter (see typography.css).
 *
 * Headings are split into lines, words and characters for their reveal, and the
 * capital is split with them: it rises or flips in its place like every other
 * letter. Its box is sized so no clip a reveal puts around it cuts the italic.
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
