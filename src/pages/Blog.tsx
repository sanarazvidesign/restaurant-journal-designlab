import { Link, useParams } from 'react-router-dom'
import { BLOG_POSTS } from '../data/blog'
import { Card, EmptyState, PageHeader } from '../components/ui'

export function BlogList() {
  return (
    <div>
      <PageHeader title="Blog" subtitle="Highly rated halal spots in NYC & NJ" />
      <div className="space-y-3">
        {BLOG_POSTS.map((p) => (
          <Link key={p.slug} to={`/blog/${p.slug}`} className="block">
            <Card className="hover:bg-slate-50">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">{p.area}</p>
              <h2 className="mt-1 text-lg font-bold leading-snug">{p.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{p.summary}</p>
              <p className="mt-2 text-xs text-slate-500">{p.cuisine} · {p.rating}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function BlogPostPage() {
  const { slug } = useParams()
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return <EmptyState title="Post not found" action={<Link to="/blog" className="text-emerald-800 underline">Back to blog</Link>} />
  return (
    <article>
      <PageHeader title={post.area} subtitle={`${post.cuisine} · ${post.published}`} back />
      <h2 className="text-2xl font-bold leading-tight">{post.title}</h2>
      <p className="mt-2 text-sm font-medium text-emerald-800">{post.rating}</p>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-slate-800">
        {post.body.map((para, i) => <p key={i}>{para}</p>)}
      </div>
      <h3 className="mb-1 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Sources</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {post.source.map((s) => (
          <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="text-emerald-800 underline">{s.label}</a></li>
        ))}
      </ul>
    </article>
  )
}
