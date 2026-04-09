import type { ArticleFormat } from '@/types'

interface CategoryTagProps {
  format: ArticleFormat
}

const labels: Record<ArticleFormat, string> = {
  diagnostic: 'Diagnostic',
  guide: 'Guide',
  comparison: 'Comparison',
}

export function CategoryTag({ format }: CategoryTagProps) {
  return (
    <span className="category-tag">
      {labels[format]}
    </span>
  )
}
