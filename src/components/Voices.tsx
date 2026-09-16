'use client'

import { useCallback, useState } from 'react'
import { voices } from '@/data/voices'
import { voicesMarquee } from '@/data/content'
import { ArrowSlider } from './svg'

/**
 * Two stacked pieces: the endlessly running headline — driven entirely by the
 * `move-text` keyframes already in the stylesheet — and a manually advanced
 * slider of the studio's own statements beneath it.
 */
export default function Voices() {
  const [index, setIndex] = useState(0)
  const count = voices.length

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count]
  )

  return (
    <section data-theme="inherit" className="testimonial1_wrap">
      <div className="kind-words_wrap" aria-hidden="true">
        {[0, 1].map((panel) => (
          <div key={panel} className="kind-words_panel">
            <h3 className="testimonial1_slider_left_text">{voicesMarquee}</h3>
          </div>
        ))}
      </div>

      <div
        className="u-container testimonial1_contain"
        data-padding-top="main"
        data-padding-bottom="main"
      >
        <div className="testimonial1_slider_wrap">
          <div
            className="testimonial1_slider_component w-slider"
            role="region"
            aria-roledescription="carousel"
            aria-label="What the studio works to"
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') go(-1)
              if (e.key === 'ArrowRight') go(1)
            }}
            tabIndex={0}
          >
            <div className="testimonial1_slider_mask w-slider-mask">
              {voices.map((t, i) => {
                const current = i === index
                return (
                  <div
                    key={t.name}
                    className="testimonial1_slider_slide w-slide"
                    role="group"
                    aria-label={`${i + 1} of ${count}`}
                    aria-hidden={!current}
                    style={{
                      // Fade between slides, matching the export's `data-animation="fade"`.
                      opacity: current ? 1 : 0,
                      visibility: current ? 'visible' : 'hidden',
                      transition: 'opacity 0.7s ease',
                      position: current ? 'relative' : 'absolute',
                      inset: current ? 'auto' : 0,
                      pointerEvents: current ? 'auto' : 'none',
                    }}
                  >
                    <div className="testimonial1_slider_layout u-hflex-center-stretch">
                      <div className="testimonial1_slider_left_wrap">
                        <div className="testimonial1_slider_left_contain u-container">
                          <div className="testimonial1_slider_left_content_layout u-vflex-center-center u-gap-main">
                            {t.extra && <img src={t.extra} alt="" loading="lazy" className="image-22" />}
                            {t.portrait && (
                              <div className="testimonial1_slider_img_wrap">
                                <img
                                  src={t.portrait}
                                  alt=""
                                  loading="lazy"
                                  className="testimonial1_slider_img"
                                />
                              </div>
                            )}
                            <div className="testimonial1_slider_rtb text-align-center w-richtext">
                              <p>{t.quote}</p>
                            </div>
                            <div className="testimonial1_slider_name_wrap">
                              <h3 className="testimonial1_slider_name">–</h3>
                              <h3 className="testimonial1_slider_name">{t.name}</h3>
                            </div>
                          </div>

                          <div className="testimonial1_slider_controls">
                            <div className="testimonial1_slider_control_layout u-hflex-between-center">
                              <button
                                type="button"
                                onClick={() => go(-1)}
                                aria-label="Previous statement"
                                className="testimonial1_slider_control_btn left w-inline-block"
                              >
                                <ArrowSlider />
                              </button>
                              <span className="testimonial1_slider_control_btn" aria-hidden="true" />
                              <button
                                type="button"
                                onClick={() => go(1)}
                                aria-label="Next statement"
                                className="testimonial1_slider_control_btn right w-inline-block"
                              >
                                <ArrowSlider />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="testimonial1_slider_right_wrap">
                        <div className="testimonial1_slider_right_visual_wrap">
                          {t.right && (
                            <img
                              src={t.right}
                              alt=""
                              loading="lazy"
                              className="testimonial1_slider_right_image"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
