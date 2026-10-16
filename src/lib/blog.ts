import type { BlogPost } from '../data/types'

/**
 * Only made-up placeholder posts get the "sample" banner and badge. A post that links to
 * a real source review is never treated as a sample, even if its flag was set by mistake.
 */
export function isSamplePost(post: BlogPost): boolean {
  return post.is_sample && !post.source_url
}
