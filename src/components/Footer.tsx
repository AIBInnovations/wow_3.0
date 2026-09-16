'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { useWordReveal } from '@/hooks/useSplitText'
import { footerColumns, copyright, credit } from '@/data/footer'
import Wordmark from './Wordmark'
import { GRID } from '@/data/gridNodes'

export default function Footer() {
  const logoRef = useRef<HTMLDivElement>(null)
  useWordReveal(logoRef)

  return (
    <section data-theme="inherit" className="footernn_wrap">
      <div className="u-container" data-padding-top="small" data-padding-bottom="none">
        <div className="logo-footer-wrap">
          <div ref={logoRef} className="footernn_logo" js-letter-animation="">
            <Wordmark />
          </div>
        </div>

        <div className="footernn_bot-line" />

        <div className="footernn_layout">
          {footerColumns.map((col) => (
            <div
              key={col.heading}
              id={col.modifier === 'center' ? GRID.footerCenter : undefined}
              className={`footernn_col u-vflex-left-top ${col.modifier}`.trim()}
            >
              <h3 className="u-text-h4">{col.heading}</h3>
              <div className={`footernn_link_layout ${col.modifier}`.trim()}>
                {col.links.map((link) => {
                  const external = link.href.startsWith('http') || link.href.startsWith('mailto:')
                  const className = `footernn_link_block${link.className ? ` ${link.className}` : ''} w-inline-block`
                  const inner = (
                    <>
                      <div className="footernn_link_text">{link.label}</div>
                      <div className="footernn_link_line" />
                    </>
                  )

                  return external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      {...(link.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className={className}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link key={link.label} href={link.href} className={className}>
                      {inner}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="footernn_bot-line" />

        <div className="footernn_credits_layout">
          <div className="text-block-3">{copyright}</div>
          <a href={credit.href} className="footernn_credits_link w-inline-block">
            <div>{credit.label}</div>
          </a>
        </div>
      </div>
    </section>
  )
}
