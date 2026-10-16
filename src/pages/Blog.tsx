import { useState } from 'react'
import { Link } from 'react-router-dom'
import { listBlogPosts } from '../data/api'
import type { BlogArea, BlogPost } from '../data/types'
import { useAsync } from '../hooks/useAsync'
import { Chip, EmptyState, ErrorNote, HalalBadge, Loading, PageHeader, RatingStars } from '../components/ui'
import { formatDate } from '../lib/format'

const AREAS: BlogArea[] = ['New Jersey', 'New York City']

export default function Blog() {
  const posts = useAsync(listBlogPosts, [])
  const [area, setArea] = useState<BlogArea | ''>('')
  const list = (posts.data ?? []).filter((p) => !area || p.area === area)

  return (
    <div>
      <PageHeader title="Halal Finds" subtitle="New, highly rated halal restaurants, from reviews around the web" />

      <div className="flex flex-wrap gap-2" role="group" aria-label="Area">
        <Chip active={area === ''} onClick={() => setArea('')}>All</Chip>
        {AREAS.map((a) => (
          <Chip key={a} active={area === a} onClick={() => setArea(area === a ? '' : a)}>{a}</Chip>
        ))}
      </div>

      <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Summaries are written in our own words and link to the original review. Halal claims come from those sources
        and have not been verified by this app. Always confirm with the restaurant.
      </p>

      <div className="mt-4 space-y-3">
        <ErrorNote message={posts.error} />
        {posts.loading && !posts.data ? (
          <Loading />
        ) : list.length === 0 ? (
          <EmptyState title="No posts yet" body={area ? 'Nothing here for that area yet.' : 'Check back soon for new halal finds.'} />
        ) : (
          list.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>
    </div>
  )
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>{post.city}</span>
        <span aria-hidden>·</span>
        <span>{post.cuisine}</span>
        {post.is_sample && (
          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">Sample</span>
        )}
      </div>
      <h2 className="mt-1 text-lg font-bold leading-snug tracking-tight">{post.title}</h2>
      <p className="text-sm font-medium text-emerald-800">{post.restaurant_name}</p>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.summary}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {post.rating != null && (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <RatingStars value={post.rating} />
            <span className="font-semibold text-slate-700">{post.rating.toFixed(1)}</span>
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          Source says <HalalBadge status={post.halal_claim} />
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        via {post.source_name} · {formatDate(post.published_at)}
      </p>
    </Link>
  )
}
