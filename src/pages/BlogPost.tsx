import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createRestaurant, getBlogPost } from '../data/api'
import { useAsync } from '../hooks/useAsync'
import { BlogImage } from '../components/BlogImage'
import { Button, buttonClass, Card, EmptyState, ErrorNote, HalalBadge, Loading, PageHeader, RatingStars } from '../components/ui'
import { isSamplePost } from '../lib/blog'
import { formatDate, HALAL_LABEL } from '../lib/format'

export default function BlogPostPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const post = useAsync(() => getBlogPost(id), [id])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [heroFailed, setHeroFailed] = useState(false)

  if (post.loading && !post.data) return <Loading />
  const p = post.data
  if (!p) {
    return (
      <div>
        <PageHeader title="Not found" back />
        <EmptyState title="We could not find that post" action={<Link to="/blog" className={buttonClass()}>Back to Halal Finds</Link>} />
      </div>
    )
  }

  async function save() {
    if (!p) return
    setSaving(true)
    setError(null)
    try {
      // The source's halal claim is NOT copied into the halal status: it stays "unsure"
      // until the user checks it themselves.
      const saved = await createRestaurant({
        name: p.restaurant_name,
        address: p.city,
        cuisine: p.cuisine,
        status: 'want_to_try',
        notes: `From the Halal Finds blog: "${p.title}" (${p.source_name}). Source says: ${HALAL_LABEL[p.halal_claim]}. Not verified yet.`,
      })
      navigate(`/restaurant/${saved.id}`, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save.')
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Halal Finds" back />

      {isSamplePost(p) && (
        <p className="mb-3 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
          This is a sample post with a made-up restaurant. It is not a real review.
        </p>
      )}

      <figure className="-mx-4 mb-4 sm:mx-0">
        <BlogImage
          src={p.images[0]?.url}
          alt={p.images[0]?.alt || `${p.restaurant_name}, ${p.cuisine}`}
          cuisine={p.cuisine}
          stock={p.images[0]?.stock}
          onFail={() => setHeroFailed(true)}
          className="aspect-video w-full sm:rounded-2xl"
        />
        {p.images[0] && !heroFailed && (
          <figcaption className="mt-1.5 px-4 text-xs text-slate-500 sm:px-0">
            {p.images[0].stock ? (
              <>
                <strong className="font-semibold text-slate-700">Stock image.</strong> This is a generic photo of a similar
                dish, not a photo of {p.restaurant_name} or its food.
                {p.images[0].credit && (
                  <>
                    {' '}Photo from{' '}
                    {p.images[0].credit_url ? (
                      <a href={p.images[0].credit_url} target="_blank" rel="noopener noreferrer" className="underline">
                        {p.images[0].credit}
                      </a>
                    ) : (
                      p.images[0].credit
                    )}
                    .
                  </>
                )}
              </>
            ) : (
              <>
                Photo from the source review
                {p.source_url ? (
                  <>
                    {' · '}
                    <a href={p.source_url} target="_blank" rel="noopener noreferrer" className="underline">
                      {p.source_name}
                    </a>
                  </>
                ) : (
                  ` · ${p.source_name}`
                )}
              </>
            )}
          </figcaption>
        )}
      </figure>

      <p className="text-xs text-slate-500">{p.city} · {p.cuisine}</p>
      <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight">{p.title}</h1>
      <p className="mt-1 font-medium text-emerald-800">{p.restaurant_name}</p>

      <Card className="mt-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {p.rating != null && (
            <span className="inline-flex items-center gap-2 text-sm">
              <RatingStars value={p.rating} />
              <span className="font-semibold">{p.rating.toFixed(1)}</span>
              <span className="text-slate-500">{p.rating_source}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-2 text-sm text-slate-500">
            Source says <HalalBadge status={p.halal_claim} />
          </span>
        </div>
        <p className="mt-3 text-slate-700">{p.summary}</p>
        <p className="mt-3 text-xs text-slate-500">
          Summary in our own words, based on a review by {p.source_name} · {formatDate(p.published_at)}
        </p>
      </Card>

      {p.images.length > 1 && (
        <section className="mt-4" aria-label="More photos">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">More photos</h2>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {p.images.slice(1).map((img) => (
              <BlogImage
                key={img.url}
                src={img.url}
                alt={img.alt || `${p.restaurant_name}, ${p.cuisine}`}
                cuisine={p.cuisine}
                stock={img.stock}
                className="h-32 w-48 shrink-0 rounded-xl"
              />
            ))}
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            {p.images.slice(1).some((i) => i.stock)
              ? 'Photos marked "Stock image" are generic photos of similar dishes.'
              : `Photos belong to ${p.source_name} and are shown as a preview of their review.`}
          </p>
        </section>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {p.source_url ? (
          <a href={p.source_url} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary')}>
            Read the original review
          </a>
        ) : (
          <span className={buttonClass('secondary', 'cursor-not-allowed opacity-60')} aria-disabled>
            Original review link unavailable
          </span>
        )}
        <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save to Want to try'}</Button>
      </div>
      <div className="mt-3"><ErrorNote message={error} /></div>

      <p className="mt-6 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Halal claims come from the original source and have not been verified by this app. Saving a place adds it to your
        journal with halal status set to Unsure, so you can confirm it yourself.
      </p>
    </div>
  )
}
