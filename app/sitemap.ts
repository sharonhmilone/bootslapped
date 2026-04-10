import type { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import type { ArticleFormat, TopicDomain } from '@/types'

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.bootslapped.com').replace(/\/$/, '')

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
  { url: `${BASE_URL}/diagnostic`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/guide`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/comparison`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE_URL}/tools`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.4 },
  { url: `${BASE_URL}/affiliate-disclosure`, changeFrequency: 'monthly', priority: 0.3 },
  { url: `${BASE_URL}/privacy`, changeFrequency: 'monthly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createServiceClient()

    const { data: articles } = await supabase
      .from('content_items')
      .select('format, topic_domain, slug, published_at, updated_at')
      .eq('status', 'ready_to_publish')
      .not('published_at', 'is', null)
      .not('slug', 'is', null)
      .order('published_at', { ascending: false })

    const publishedArticles = articles ?? []

    // Unique format+domain hub pages — only include combos that have articles
    const hubSet = new Set<string>()
    for (const a of publishedArticles) {
      if (a.topic_domain) {
        hubSet.add(`${a.format}/${a.topic_domain}`)
      }
    }

    const hubRoutes: MetadataRoute.Sitemap = [...hubSet].map((combo) => ({
      url: `${BASE_URL}/${combo}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Individual article pages
    const articleRoutes: MetadataRoute.Sitemap = publishedArticles
      .filter((a) => a.slug && a.topic_domain)
      .map((a) => ({
        url: `${BASE_URL}/${a.format as ArticleFormat}/${a.topic_domain as TopicDomain}/${a.slug}`,
        lastModified: a.updated_at ? new Date(a.updated_at) : new Date(a.published_at),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))

    return [...STATIC_ROUTES, ...hubRoutes, ...articleRoutes]
  } catch (err) {
    console.error('[sitemap] Failed to generate dynamic routes:', err)
    return STATIC_ROUTES
  }
}
