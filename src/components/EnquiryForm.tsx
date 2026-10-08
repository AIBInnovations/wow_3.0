'use client'

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react'
import Initial from './Initial'
import { useSmoothScroll } from '@/providers/SmoothScrollProvider'
import { closing, site } from '@/data/content'

const CELEBRATIONS = [
  'Wedding',
  'Destination wedding',
  'Pre-wedding celebrations',
  'Milestone celebration',
  'Private or corporate event',
  'Something else',
]

const GUESTS = ['Under 100', '100 – 250', '250 – 500', '500 +']

/**
 * Where a submitted enquiry goes. Set NEXT_PUBLIC_ENQUIRY_ENDPOINT in Vercel to
 * a form service's URL (Formspree, for one) and enquiries are posted there as
 * JSON and arrive in the studio's inbox directly. Until then the form writes
 * the enquiry out as an email to the studio, in the visitor's own mail app.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT

type Status = 'idle' | 'sending' | 'sent' | 'drafted' | 'failed'

/**
 * The enquiry form, as a panel over the page.
 *
 * Mounted once, in the layout. Any link to the studio's enquiry address opens
 * it instead of a mail app — the hero button, the bar, the menu, the footer and
 * the closing card all do — and so does a visit to any page with #enquire.
 * Without JavaScript those links are still ordinary email links.
 *
 * It is set the way the closing card is: the script-initialled heading, the
 * italic note, then fields drawn as a single hairline each, and the site's
 * pill button. It is a compact card that fits the screen without scrolling:
 * two fields to a row on a phone, three on a desktop. The page beneath holds still while it is open; Escape, the ×
 * and a click outside the panel all close it.
 */
export default function EnquiryForm() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const panelRef = useRef<HTMLDivElement>(null)
  const returnRef = useRef<HTMLElement | null>(null)
  const { start, stop } = useSmoothScroll()
  const scrollRef = useRef({ start, stop })
  scrollRef.current = { start, stop }
  const uid = useId().replace(/:/g, '')
  const field = (name: string) => `${uid}-${name}`

  const show = useCallback(() => {
    returnRef.current = document.activeElement as HTMLElement | null
    setStatus('idle')
    setOpen(true)
  }, [])

  const hide = useCallback(() => {
    setOpen(false)
    if (window.location.hash === '#enquire') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  // Every link to the enquiry address opens the form instead.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as HTMLElement | null)?.closest?.('a[href^="mailto:"]') as HTMLAnchorElement | null
      if (!link || !link.href.toLowerCase().includes(site.email.toLowerCase())) return
      if (link.closest('.enquiry')) return
      e.preventDefault()
      show()
    }
    const onHash = () => {
      if (window.location.hash === '#enquire') show()
    }
    document.addEventListener('click', onClick, true)
    window.addEventListener('hashchange', onHash)
    onHash()
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('hashchange', onHash)
    }
  }, [show])

  // While open: the page holds still, Escape closes, Tab stays inside the panel.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    scrollRef.current.stop()

    const panel = panelRef.current
    const focusable = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea') ?? []).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
      )
    const first = window.setTimeout(() => focusable()[1]?.focus({ preventScroll: true }), 450)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hide()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusable()
      if (!items.length) return
      const head = items[0]
      const tail = items[items.length - 1]
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault()
        tail.focus()
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault()
        head.focus()
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.clearTimeout(first)
      window.removeEventListener('keydown', onKey)
      root.style.overflow = previous
      scrollRef.current.start()
      returnRef.current?.focus?.({ preventScroll: true })
    }
  }, [open, hide])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>

    if (ENDPOINT) {
      setStatus('sending')
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...data, _subject: `Enquiry from ${data.name}` }),
        })
        setStatus(res.ok ? 'sent' : 'failed')
      } catch {
        setStatus('failed')
      }
      return
    }

    const details = [
      ['Name', data.name],
      ['Email', data.email],
      ['Phone', data.phone],
      ['Celebration', data.celebration],
      ['Dates', data.date],
      ['Destination', data.place],
      ['Guests', data.guests],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
    const lines = data.message ? [...details, '', data.message] : details
    const subject = `Enquiry${data.celebration ? ` — ${data.celebration}` : ''} — ${data.name}`
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
    setStatus('drafted')
  }

  const done = status === 'sent' || status === 'drafted'

  return (
    <div className={`enquiry${open ? ' is-open' : ''}`} inert={!open} data-lenis-prevent="">
      <button type="button" className="enquiry_scrim" aria-label="Close the enquiry form" tabIndex={-1} onClick={hide} />

      <div
        ref={panelRef}
        className="enquiry_panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={field('title')}
      >
        <button type="button" className="enquiry_close" onClick={hide} aria-label="Close">
          <span />
          <span />
        </button>

        <div className="enquiry_head">
          <p className="kicker enquiry_kicker">Enquiries</p>
          <h2 id={field('title')} className="enquiry_title">
            <Initial>{done ? 'Thank You' : closing.heading}</Initial>
          </h2>
          <p className={`enquiry_note${done || status === 'failed' ? '' : ' is-intro'}`}>
            {status === 'sent'
              ? 'Your enquiry is with our studio. We will write to you shortly.'
              : status === 'drafted'
                ? `Your enquiry is written out in your email app, addressed to our studio. Press send and we will reply to you there. If nothing opened, write to us at ${site.email}.`
                : closing.note}
          </p>
        </div>

        {done ? (
          <div className="enquiry_actions">
            <button type="button" className="btn_main_wrap enquiry_button" data-button-style="primary" onClick={hide}>
              <span className="btn_main_text">Back to the site</span>
            </button>
          </div>
        ) : (
          <form className="enquiry_form" onSubmit={onSubmit}>
            <div className="enquiry_field">
              <label htmlFor={field('name')}>Your name</label>
              <input id={field('name')} name="name" type="text" autoComplete="name" required />
            </div>
            <div className="enquiry_field">
              <label htmlFor={field('email')}>Email</label>
              <input id={field('email')} name="email" type="email" autoComplete="email" required />
            </div>
            <div className="enquiry_field">
              <label htmlFor={field('phone')}>Phone</label>
              <input id={field('phone')} name="phone" type="tel" autoComplete="tel" />
            </div>
            <div className="enquiry_field">
              <label htmlFor={field('celebration')}>The celebration</label>
              <select id={field('celebration')} name="celebration" defaultValue="">
                <option value="" disabled>
                  Choose one
                </option>
                {CELEBRATIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="enquiry_field">
              <label htmlFor={field('date')}>Dates</label>
              <input id={field('date')} name="date" type="text" placeholder="e.g. February 2027" />
            </div>
            <div className="enquiry_field">
              <label htmlFor={field('guests')}>Guests</label>
              <select id={field('guests')} name="guests" defaultValue="">
                <option value="" disabled>
                  Approximately
                </option>
                {GUESTS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="enquiry_field is-wide">
              <label htmlFor={field('place')}>Destination</label>
              <input id={field('place')} name="place" type="text" placeholder="City or venue" />
            </div>
            <div className="enquiry_field is-wide">
              <label htmlFor={field('message')}>Tell us about it</label>
              <textarea id={field('message')} name="message" rows={2} />
            </div>

            <div className="enquiry_actions is-wide">
              <button
                type="submit"
                className="btn_main_wrap enquiry_button"
                data-button-style="primary"
                disabled={status === 'sending'}
              >
                <span className="btn_main_text">{status === 'sending' ? 'Sending…' : 'Send enquiry'}</span>
              </button>
              {status === 'failed' ? (
                <p className="enquiry_error" role="alert">
                  It did not go through. Please try again, or write to us at{' '}
                  <a href={`mailto:${site.email}`}>{site.email}</a>.
                </p>
              ) : (
                <p className="enquiry_alt">
                  Or write to us at <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
