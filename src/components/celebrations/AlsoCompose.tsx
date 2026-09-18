'use client'

import { useRef } from 'react'
import { useLineAnimation } from '@/hooks/useSplitText'
import Initial from '@/components/Initial'
import { ALSO } from '@/data/celebrations'

/**
 * "We also compose" — the studio's other work, as a compact band: the heading
 * on the left, rising line by line, and the two lists beside it.
 */
export default function AlsoCompose() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useLineAnimation(headingRef)

  return (
    <section data-theme="inherit" className="cel-also">
      <div className="u-container cel-also_contain" data-padding-top="main" data-padding-bottom="main">
        <div className="cel-also_grid">
          <div className="cel-also_head">
            <p className="cel-label cel-also_pretitle">{ALSO.pretitle}</p>
            <h2 ref={headingRef} className="cel-also_title" js-line-animation="">
              <Initial>{ALSO.title[0]}</Initial>
              <br />
              {ALSO.title[1]}
            </h2>
          </div>
          {ALSO.lists.map((list) => (
            <div key={list.title} className="cel-list">
              <p className="cel-label cel-list_title">{list.title}</p>
              <ul className="cel-list_items">
                {list.items.map((item) => (
                  <li key={item} className="cel-list_item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
