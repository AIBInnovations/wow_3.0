'use client'

import Link from 'next/link'
import SplitType from 'split-type'
import { useRef } from 'react'
import { gsap, registerGsap } from '@/lib/gsap'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useFontsReady } from '@/hooks/useFontsReady'
import { unwrapInitials } from '@/hooks/useSplitText'
import { heroMarquee } from '@/data/media'
import Initial from './Initial'
import { hero } from '@/data/content'

/**
 * Full-viewport hero: a drifting band of photographs behind the headline.
 *
 * The load sequence, all on one timeline:
 *
 *   0.00s  content container becomes visible; every photo fades in (0.5s) and the
 *          first panel's photos wipe upward out of a bottom clip, 0.07s apart
 *   1.00s  headline rises word by word from beneath each line's clip, while its
 *          script initial fades up in place
 *   2.00s  paragraph rises line by line, fading in as it goes
 *   2.50s  kicker fades in
 *   2.60s  button fades in
 *
 * The band drifts one full panel width every 60s, forever, independent of all of
 * the above.
 */
export default function HeroMarquee() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const fontsReady = useFontsReady()

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    registerGsap()

    const q = gsap.utils.selector(section)

    if (reduced) {
      gsap.set(q('.hw, .dim'), { autoAlpha: 1 })
      return
    }
    // Lines are measured, so the split has to wait for the real faces.
    if (!fontsReady) return

    const title = q('.home-hero_title')[0] as HTMLElement | undefined
    const para = q('.home-hero_p')[0] as HTMLElement | undefined

    const titleSplit = title
      ? new SplitType(title, { types: 'lines,words', tagName: 'span', lineClass: 'line', wordClass: 'word' })
      : null
    const paraSplit = para
      ? new SplitType(para, { types: 'lines', tagName: 'span', lineClass: 'line' })
      : null

    // Each paragraph line gets an inner block that does the moving.
    for (const line of (paraSplit?.lines ?? []) as HTMLElement[]) {
      const inner = document.createElement('span')
      inner.className = 'p-line-inner'
      inner.style.display = 'block'
      while (line.firstChild) inner.appendChild(line.firstChild)
      line.appendChild(inner)
    }

    // The script initial leaves the word masks; it fades in with the headline.
    if (title) unwrapInitials(title)

    // Deep descenders would otherwise be cut by the line clip mid-rise.
    for (const word of (titleSplit?.words ?? []) as HTMLElement[]) {
      word.style.paddingBottom = '3vw'
      word.style.marginBottom = '-3vw'
    }

    const ctx = gsap.context(() => {
      gsap.set('.first-bg .cta-marquee_bg_img', { clipPath: 'inset(100% 0 0 0)' })

      const tl = gsap.timeline()
      tl.set('.hw', { autoAlpha: 1 })
      tl.from('.cta-marquee_bg_img', { opacity: 0, duration: 0.5, ease: 'power3.inOut' }, '<')
      tl.to(
        gsap.utils.toArray('.first-bg .cta-marquee_bg_img'),
        { clipPath: 'inset(0% 0 0 0)', duration: 1.5, stagger: { each: 0.07 }, ease: 'power3.inOut' },
        '<'
      )
      tl.to('.dim', { opacity: 1 }, 0)
      tl.from('.home-hero_title .word', { yPercent: 100, stagger: 0.1, ease: 'power3.out', duration: 2 }, '<1')
      // Same start as the words, so the paragraph's '<1' below still counts from them.
      tl.from('.home-hero_title .initial', { opacity: 0, yPercent: 12, ease: 'power3.out', duration: 2 }, '<')
      tl.from('.p-line-inner', { yPercent: 100, stagger: 0.1, opacity: 0, ease: 'power3.out', duration: 2 }, '<1')
      tl.from('.hk', { opacity: 0, stagger: 0.1, ease: 'power3.out', duration: 1.5 }, '<.5')
      tl.from('.home-hero_btn_wrap', { opacity: 0, ease: 'power3.out', duration: 1.5 }, '<.1')

      gsap.to('.cta-marquee_panel', {
        xPercent: -100,
        ease: 'none',
        duration: 60,
        repeat: -1,
        modifiers: { xPercent: gsap.utils.wrap(-100, 0) },
      })
    }, section)

    return () => {
      ctx.revert()
      paraSplit?.revert()
      titleSplit?.revert()
    }
  }, [reduced, fontsReady])

  return (
    <section ref={sectionRef} data-theme="inherit" className="home-marquee_wrap">
      <div className="cta-marquee_contain dim">
        <div className="cta-marquee_componenet">
          {[0, 1].map((panel) => (
            <div
              key={panel}
              className={`cta-marquee_panel top${panel === 0 ? ' first-bg' : ''}`}
              aria-hidden={panel === 1}
            >
              {heroMarquee.map((img, i) => (
                <div key={i} className="cta-marquee_bg_wrap">
                  <img
                    src={img.src}
                    alt={panel === 0 && i < 3 ? img.alt : ''}
                    loading={panel === 0 && i < 3 ? 'eager' : 'lazy'}
                    className="cta-marquee_bg_img"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="cta-marquee_overlay" />
      </div>

      <div className="u-container hw home" data-padding-top="main" data-padding-bottom="main">
        <div className="home-hero_content u-vflex-center-center">
          <div className="div-block-30">
            <h1 className="kicker hk">{hero.kicker}</h1>
          </div>

          {hero.title ? (
            <h2 className="u-text-display home-hero_title">
              <Initial>{hero.title}</Initial>
            </h2>
          ) : null}

          <p className="home-hero_p">{hero.paragraph}</p>

          <div className="home-hero_btn_wrap">
            <MainButton href={hero.cta.href} label={hero.cta.label} />
          </div>
        </div>
      </div>
    </section>
  )
}

/** A styled shell with a full-bleed link laid over it, so the whole pill is a target. */
export function MainButton({ href, label }: { href: string; label: string }) {
  const external = href.startsWith('mailto:') || href.startsWith('http')

  return (
    <div className="btn_main_wrap" data-button-style="primary">
      <div className="btn_main_layout u-gap-xsmall u-hflex-center-center">
        <div className="btn_main_text">{label}</div>
      </div>
      {external ? (
        <a href={href} className="g_clickable_wrap u-cover-absolute w-inline-block" aria-label={label} />
      ) : (
        <Link href={href} className="g_clickable_wrap u-cover-absolute w-inline-block" aria-label={label} />
      )}
    </div>
  )
}
