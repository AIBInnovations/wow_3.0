import type { Photo } from '@/data/celebrations'

type Props = {
  photo: Photo
  alt?: string
  className?: string
  /** The photograph is oversized inside its frame and drifts on scroll. */
  parallax?: boolean
  sizes?: string
  loading?: 'lazy' | 'eager'
}

/**
 * One photograph in a frame that already knows its shape.
 *
 * The frame takes the file's true aspect ratio up front, so nothing shifts when
 * the image arrives; the 800px rendition serves small frames and phones. The
 * chapter and rail scripts wipe `.cel-frame` up from a bottom clip as it enters,
 * and drift the image inside any `.is-parallax` frame.
 */
export default function Frame({ photo, alt = '', className, parallax, sizes, loading = 'lazy' }: Props) {
  const classes = ['cel-frame', parallax ? 'is-parallax' : '', className ?? ''].filter(Boolean).join(' ')
  return (
    <figure className={classes} style={{ aspectRatio: `${photo.w} / ${photo.h}` }}>
      <img
        src={photo.src}
        srcSet={`${photo.src800} ${photo.w800}w, ${photo.src} ${photo.w}w`}
        sizes={sizes ?? '(max-width: 767px) 100vw, 50vw'}
        width={photo.w}
        height={photo.h}
        alt={alt}
        loading={loading}
        decoding="async"
      />
    </figure>
  )
}
