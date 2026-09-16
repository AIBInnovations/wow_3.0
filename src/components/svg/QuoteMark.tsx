/**
 * The oversized opening quotation mark that sits behind the first statement.
 *
 * A soft black glyph at low alpha, set in the display face so it belongs to the
 * page's own type rather than being a separate illustration. The box keeps a
 * 950:769 proportion, which is what `.image-22`'s 80% width is sized against.
 */
export default function QuoteMark() {
  return (
    <svg
      className="image-22"
      viewBox="0 0 950 769"
      aria-hidden="true"
      focusable="false"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="quote-soften" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <text
        x="475"
        y="1240"
        textAnchor="middle"
        fontSize="1500"
        fill="#000"
        fillOpacity="0.16"
        filter="url(#quote-soften)"
        style={{ fontFamily: 'var(--font--primary-family)' }}
      >
        &#8220;
      </text>
    </svg>
  )
}
