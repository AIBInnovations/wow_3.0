import { wordmark } from '@/data/content'

/**
 * The studio wordmark, set in the display face.
 *
 * WOW's identity is typographic rather than a drawn mark, so the name is set as
 * text and the middle word takes the outlined treatment site.css already
 * defines for display type.
 */
export default function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={className}>
      {wordmark.lead} <span className="outline">{wordmark.outline}</span> {wordmark.tail}
    </span>
  )
}
