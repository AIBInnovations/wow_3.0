import Initial from './Initial'
import { wordmark } from '@/data/content'

/**
 * The studio wordmark in solid display capitals, with the W of "Weddings" set in
 * the display italic — the same lockup the deck uses for its own
 * "Not Just Weddings" mark.
 */
export default function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={className}>
      {wordmark.lead} <Initial>{wordmark.middle}</Initial> {wordmark.tail}
    </span>
  )
}
