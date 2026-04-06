import type { ArticleFormat } from '@/types'

interface CategoryTagProps {
  format: ArticleFormat
}

const labels: Record<ArticleFormat, string> = {
  diagnostic: 'DIAGNOSTIC',
  guide: 'GUIDE',
  comparison: 'COMPARISON',
}

export function CategoryTag({ format }: CategoryTagProps) {
  return (
    <span className="category-tag">
      {labels[format]}
    </span>
  )
}
