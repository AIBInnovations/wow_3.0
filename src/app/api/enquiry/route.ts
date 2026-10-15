import { NextResponse } from 'next/server'

/**
 * Receives an enquiry from EnquiryForm and hands it to Slide, server-side —
 * the webhook URL (and API key, if the automation needs one) must never
 * reach the browser. Point SLIDE_WEBHOOK_URL at a Slide automation whose
 * trigger is "Webhook"; that automation is what creates/updates the Contact
 * and runs any auto-reply or team-notification steps.
 */
const SLIDE_WEBHOOK_URL = process.env.SLIDE_WEBHOOK_URL
const SLIDE_API_KEY = process.env.SLIDE_API_KEY

type EnquiryPayload = {
  name?: string
  email?: string
  phone?: string
  celebration?: string
  date?: string
  guests?: string
  place?: string
  message?: string
}

export async function POST(request: Request) {
  let data: EnquiryPayload
  try {
    data = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 })
  }

  const name = data.name?.trim()
  const email = data.email?.trim()
  if (!name || !email) {
    return NextResponse.json({ ok: false, error: 'Name and email are required' }, { status: 400 })
  }

  if (!SLIDE_WEBHOOK_URL) {
    console.error('SLIDE_WEBHOOK_URL is not configured')
    return NextResponse.json({ ok: false, error: 'Enquiries are not configured' }, { status: 503 })
  }

  const payload = {
    customer_name: name,
    customer_email: email,
    customer_phone: data.phone?.trim() || undefined,
    event_type: 'website_enquiry',
    celebration: data.celebration?.trim() || '—',
    date: data.date?.trim() || '—',
    guests: data.guests?.trim() || '—',
    destination: data.place?.trim() || '—',
    message: data.message?.trim() || '—',
  }

  try {
    const res = await fetch(SLIDE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(SLIDE_API_KEY ? { Authorization: `Bearer ${SLIDE_API_KEY}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      console.error('Slide webhook rejected the enquiry', res.status, await res.text().catch(() => ''))
      return NextResponse.json({ ok: false, error: 'Slide rejected the enquiry' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to reach Slide', error)
    return NextResponse.json({ ok: false, error: 'Could not reach Slide' }, { status: 502 })
  }
}
