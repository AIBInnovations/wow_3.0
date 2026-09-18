'use client'

import SplitType from 'split-type'
import { useRef, type MouseEvent } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useFontsReady } from '@/hooks/useFontsReady'
import { useLineAnimation, unwrapInitials } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import type { Discipline, Photo } from '@/data/disciplines'
import { scrollToChapter } from './scrollToChapter'

/**
 * One discipline, told as a chapter.
 *
 * It opens on a full-bleed photograph that wipes up from its lower edge as it
 * arrives, with the numeral and name held at the top-left of the frame while
 * the photograph scrolls past beneath them. Then the statement rises line by
 * line, the intro follows, two photographs drift at different rates, and the
 * feature, lists, cards and closing line each rise into place as they enter.
 *
 * Reduced motion: everything is shown at rest.
 */
export default function DisciplineChapter({ discipline, next }: { discipline: Discipline; next?: Discipline }) {
  const sectionRef = useRef<HTMLElement>(null)
  const closingRef = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const fontsReady = useFontsReady()

  useLineAnimation(closingRef)

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    registerGsap()

    const q = gsap.utils.selector(section)

    if (reduced) {
      gsap.set([...q('.hw'), ...q('.disc-chapter_statement')], { autoAlpha: 1 })
      return
    }
    if (!fontsReady) return

    const lines = q('[data-statement-line]') as HTMLElement[]
    const splits = lines.map(
      (line) => new SplitType(line, { types: 'lines', tagName: 'span', lineClass: 'line' })
    )
    const inners: HTMLElement[] = []
    for (const split of splits) {
      for (const line of (split.lines ?? []) as HTMLElement[]) {
        const inner = document.createElement('span')
        inner.className = 'line-inner'
        while (line.firstChild) inner.appendChild(line.firstChild)
        line.appendChild(inner)
        inners.push(inner)
      }
    }
    const initials = lines.flatMap((line) => unwrapInitials(line))

    const ctx = gsap.context(() => {
      const opener = q('.disc-opener')[0]
      const media = q('.disc-opener_media')[0]

      // The opening photograph wipes up, and its title rises, as the opener arrives.
      const open = gsap.timeline({
        scrollTrigger: { trigger: opener, start: 'top 85%', once: true },
      })
      open.fromTo(
        media,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.8, ease: 'power3.out' }
      )
      open.from('.disc-opener_title_inner', { yPercent: 100, duration: 1.5, ease: 'power3.out' }, 0.4)

      // Beneath the title the photograph travels more slowly than the page.
      gsap.fromTo(
        '.disc-opener_img',
        { yPercent: -13 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: opener, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      )

      // The statement rises line by line, its script initial fading in place.
      gsap.set('.disc-chapter_statement', { autoAlpha: 1 })
      const statement = gsap.timeline({
        scrollTrigger: { trigger: '.disc-chapter_statement', start: 'top 80%', once: true },
      })
      statement.from(inners, { yPercent: 100, duration: 2, stagger: 0.2, ease: 'power3.out' })
      if (initials.length) {
        statement.from(initials, { opacity: 0, yPercent: 12, duration: 2, ease: 'power3.out' }, 0)
      }

      // The two photographs wipe up as they enter, then drift at different rates.
      const figures = q('.disc-double figure') as HTMLElement[]
      figures.forEach((figure, i) => {
        gsap.fromTo(
          figure,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: figure, start: 'top 90%', once: true },
          }
        )
        const img = figure.querySelector('img')
        gsap.fromTo(
          img,
          { yPercent: i === 0 ? -12 : -18 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      })

      // Every other block rises softly into place as it enters.
      for (const block of q('.hw') as HTMLElement[]) {
        gsap.fromTo(
          block,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: { trigger: block, start: 'top 88%', once: true },
          }
        )
      }
    }, section)

    // The statement's line breaks are measured; after a width change it drops
    // back to plain text rather than keeping stale lines.
    let width = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === width) return
      width = window.innerWidth
      splits.forEach((s) => s.revert())
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
      splits.forEach((s) => s.revert())
    }
  }, [reduced, fontsReady])

  const onNextClick = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToChapter(slug, !reduced)
  }

  const { slug, number, name, statement, intro, feature, lists, cards, closing, background, photos } = discipline

  return (
    <section
      ref={sectionRef}
      id={slug}
      data-theme="inherit"
      className="disc-chapter"
      style={{ backgroundColor: background }}
    >
      <div className="disc-opener">
        <div className="disc-opener_media">
          <Frame photo={photos.open} className="disc-opener_img" sizes="100vw" eager={number === '01'} />
          <div className="disc-opener_scrim" />
        </div>
        <div className="disc-opener_title">
          <div className="div-hide">
            <div className="disc-opener_title_inner">
              <span className="disc-num">{number}</span>
              <h2 className="disc-opener_name">{name}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="u-container disc-chapter_contain" data-padding-top="main" data-padding-bottom="main">
        <div className="disc-chapter_lead">
          <p className="disc-chapter_statement">
            {statement.map((line, i) => (
              <span key={i} data-statement-line="" className="disc-chapter_statement_line">
                {i === 0 ? <Initial>{line}</Initial> : line}
              </span>
            ))}
          </p>
          <p className="disc-chapter_intro hw">{intro}</p>
        </div>

        <div className="disc-double">
          <figure className="disc-double_wide">
            <Frame photo={photos.wide} sizes="(max-width: 767px) 100vw, 60vw" />
          </figure>
          <figure className="disc-double_narrow">
            <Frame photo={photos.narrow} sizes="(max-width: 767px) 70vw, 34vw" />
          </figure>
        </div>

        <div className="disc-feature hw">
          <div className="disc-feature_text">
            <h3 className="u-text-h4">{feature.title}</h3>
            <p className="disc-p">{feature.text}</p>
          </div>
          <div className="disc-lists">
            {lists.map((list) => (
              <div key={list.title} className="disc-list">
                <h4 className="disc-list_title">{list.title}</h4>
                <ul>
                  {list.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <ul className="disc-cards hw">
          {cards.map((card) => (
            <li key={card.title} className="disc-card">
              <h3 className="u-text-h4">{card.title}</h3>
              <p className="disc-p">{card.text}</p>
            </li>
          ))}
        </ul>

        <div className="disc-closing">
          <p ref={closingRef} className="disc-closing_line" js-line-animation="">
            {closing.join(' ')}
          </p>
          {next && (
            <a href={`#${next.slug}`} className="disc-next" onClick={onNextClick(next.slug)}>
              <span className="disc-num">{next.number}</span>
              <span>{next.name}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

/** A photograph at its real size, so nothing shifts when it arrives. */
function Frame({ photo, className, sizes, eager }: { photo: Photo; className?: string; sizes: string; eager?: boolean }) {
  return (
    <img
      src={photo.src}
      srcSet={`${photo.src800} 800w, ${photo.src} 1600w`}
      sizes={sizes}
      width={photo.w}
      height={photo.h}
      alt={photo.alt}
      loading={eager ? 'eager' : 'lazy'}
      className={className}
    />
  )
}
