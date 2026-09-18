'use client'

import { useRef, useState, type MouseEvent } from 'react'
import { gsap, registerGsap, MQ } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { disciplines, disciplinesIndex } from '@/data/disciplines'
import { scrollToChapter } from './scrollToChapter'

/**
 * The index: five full-width rows, one per discipline, each a link to its chapter.
 *
 * The rows rise in with a stagger as the list enters. On a desktop with a
 * pointer, hovering a row shows that discipline's photograph in a fixed frame
 * that trails the cursor — its position is eased with `quickTo`, so it follows
 * a beat behind — and the photograph warms from greyscale to colour while the
 * row is held. The row's name turns brand-coloured in the stylesheet.
 *
 * The frame is a child of the section, not of the container: `.u-container`
 * carries layout containment, which would pin a fixed element to it.
 */
export default function DisciplinesIndex() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    registerGsap()

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>('.disc-index_row')
      const head = section.querySelector('.disc-index_head')

      if (reduced) {
        gsap.set([head, ...rows], { autoAlpha: 1 })
        return
      }

      gsap.to(head, {
        autoAlpha: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%', once: true },
      })
      gsap.fromTo(
        rows,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.disc-index_list', start: 'top 85%', once: true },
        }
      )

      const mm = gsap.matchMedia()
      mm.add(`${MQ.desktop} and (hover: hover)`, () => {
        const frame = section.querySelector<HTMLElement>('.disc-index_frame')
        const list = section.querySelector<HTMLElement>('.disc-index_list')
        if (!frame || !list) return

        gsap.set(frame, { xPercent: -50, yPercent: -50 })
        const xTo = gsap.quickTo(frame, 'x', { duration: 0.9, ease: 'power3.out' })
        const yTo = gsap.quickTo(frame, 'y', { duration: 0.9, ease: 'power3.out' })

        // On entry the frame is placed under the cursor at once, so it never
        // flies in from the corner; from then on it trails.
        const onEnter = (e: PointerEvent) => {
          gsap.set(frame, { x: e.clientX, y: e.clientY })
        }
        const onMove = (e: PointerEvent) => {
          xTo(e.clientX)
          yTo(e.clientY)
        }
        list.addEventListener('pointerenter', onEnter)
        list.addEventListener('pointermove', onMove)
        return () => {
          list.removeEventListener('pointerenter', onEnter)
          list.removeEventListener('pointermove', onMove)
        }
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  const onRowClick = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToChapter(slug, !reduced)
  }

  return (
    <section ref={sectionRef} data-theme="inherit" className="disc-index">
      <div className="u-container disc-index_contain" data-padding-top="small" data-padding-bottom="large">
        <div className="disc-index_head">
          <p className="disc-index_label">{disciplinesIndex.label}</p>
          <p className="disc-index_lead">{disciplinesIndex.lead}</p>
        </div>

        <ol className="disc-index_list">
          {disciplines.map((d, i) => (
            <li key={d.slug}>
              <a
                href={`#${d.slug}`}
                className="disc-index_row"
                onClick={onRowClick(d.slug)}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
                onFocus={() => setActive(i)}
                onBlur={() => setActive((cur) => (cur === i ? null : cur))}
              >
                <span className="disc-num">{d.number}</span>
                <span className="disc-index_name">{d.name}</span>
                <span className="disc-index_caption">{d.caption}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className={`disc-index_frame${active !== null ? ' is-visible' : ''}`} aria-hidden="true">
        {disciplines.map((d, i) => (
          <img
            key={d.slug}
            src={d.photos.index.src800}
            srcSet={`${d.photos.index.src800} 640w, ${d.photos.index.src} 1122w`}
            sizes="24rem"
            width={d.photos.index.w}
            height={d.photos.index.h}
            alt=""
            loading="lazy"
            className={`disc-index_frame_img${active === i ? ' is-active' : ''}`}
          />
        ))}
      </div>
    </section>
  )
}
