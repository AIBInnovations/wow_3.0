import Initial from './Initial'
import { wordmark } from '@/data/content'

/**
 * The studio wordmark in solid display capitals, with the W of "Weddings" set as
 * the site's italic opening capital (see Initial).
 */
export default function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={className}>
      {wordmark.lead} <Initial>{wordmark.middle}</Initial> {wordmark.tail}
    </span>
  )
}
