import { useState } from 'react'

const CUISINE_EMOJI: [RegExp, string][] = [
  [/bbq|barbecue|grill|steak|kebab|smok/i, '🍖'],
  [/burger/i, '🍔'],
  [/pizza/i, '🍕'],
  [/chinese|noodle|ramen|dumpling/i, '🍜'],
  [/korean|fried chicken|wings/i, '🍗'],
  [/indian|pakistani|bangladeshi|biryani|curry/i, '🍛'],
  [/lebanese|yemeni|egyptian|mediterranean|middle eastern|turkish|afghan|shawarma|falafel/i, '🥙'],
  [/bakery|dessert|pastry/i, '🥐'],
  [/seafood|fish/i, '🐟'],
]

function emojiFor(cuisine: string): string {
  return CUISINE_EMOJI.find(([re]) => re.test(cuisine))?.[1] ?? '🍽️'
}

/** Food-themed placeholder shown when a post has no image or the image fails to load. */
export function BlogImageFallback({ cuisine, className = '' }: { cuisine: string; className?: string }) {
  return (
    <div
      className={`grid place-items-center bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50 text-5xl ${className}`}
      role="img"
      aria-label={`${cuisine || 'Restaurant'} placeholder illustration`}
    >
      <span aria-hidden>{emojiFor(cuisine)}</span>
    </div>
  )
}

/**
 * Remote image with a graceful fallback. Images come from third-party pages, so they are
 * lazy-loaded without sending a referrer, and replaced by the placeholder if the source
 * blocks or removes them. Stock photos get a visible "Stock image" label.
 */
export function BlogImage({
  src,
  alt,
  cuisine,
  className = '',
  stock = false,
  onFail,
}: {
  src: string | undefined
  alt: string
  cuisine: string
  className?: string
  stock?: boolean
  onFail?: () => void
}) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <BlogImageFallback cuisine={cuisine} className={className} />
  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => {
          setFailed(true)
          onFail?.()
        }}
        className="h-full w-full object-cover"
      />
      {stock && (
        <span className="absolute bottom-2 left-2 rounded-full bg-black/65 px-2 py-0.5 text-[11px] font-semibold text-white">
          Stock image
        </span>
      )}
    </div>
  )
}
