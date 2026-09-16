import { wordmark } from '@/data/content'

/**
 * The studio wordmark, set in the display face.
 *
 * The export carried a drawn monogram; WOW's identity is typographic, so the
 * name is set as text and the middle word takes the outlined treatment the
 * stylesheet already defines for display type.
 */
export default function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={className}>
      {wordmark.lead} <span className="outline">{wordmark.outline}</span> {wordmark.tail}
    </span>
  )
}
