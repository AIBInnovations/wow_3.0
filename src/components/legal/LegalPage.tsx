'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLineAnimation } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import type { LegalPage as LegalPageData } from '@/data/legal'

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/**
 * The quiet page: a title block, then a numbered index that stays put on the
 * left while the sections scroll past on the right.
 *
 * The index entry for the section currently in view is lit; the others sit at
 * 45%. Clicking one scrolls there. On narrow screens the index becomes a row of
 * links above the sections.
 */
export default function LegalPage({ page }: { page: LegalPageData }) {
  const rootRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()

  useLineAnimation(titleRef)

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    registerGsap()

    const ctx = gsap.context(() => {
      const links = gsap.utils.toArray<HTMLElement>('.legal_index_link')
      const sections = gsap.utils.toArray<HTMLElement>('.legal_section')

      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => links[i]?.classList.toggle('is-active', self.isActive),
        })
      })

      if (reduced) return

      gsap.from('.legal_standfirst, .legal_meta', {
        opacity: 0,
        y: 16,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.6,
      })

      sections.forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 24,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 88%', once: true },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={rootRef} data-theme="inherit" className="legal_wrap">
      <div className="u-container legal_contain" data-padding-top="large" data-padding-bottom="main">
        <header className="legal_head">
          <div className="kicker legal_kicker">{page.kicker}</div>
          <h1 ref={titleRef} className="legal_title" js-line-animation="">
            <Initial>{page.title}</Initial>
          </h1>
          <p className="legal_standfirst">{page.standfirst}</p>
          <p className="legal_meta">{page.updated}</p>
        </header>

        <div className="legal_rule" />

        <div className="legal_layout">
          <nav className="legal_index" aria-label="On this page">
            <ol className="legal_index_list">
              {page.sections.map((section, i) => (
                <li key={section.heading}>
                  <a href={`#${slug(section.heading)}`} className="legal_index_link">
                    <span className="legal_index_num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="legal_index_text">{section.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal_body">
            <p className="legal_notice">{page.notice}</p>

            {page.sections.map((section, i) => (
              <section key={section.heading} id={slug(section.heading)} className="legal_section">
                <div className="legal_section_num">{String(i + 1).padStart(2, '0')}</div>
                <h2 className="u-text-h4 legal_section_heading">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="legal_p">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
