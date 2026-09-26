import type { GalleryIcon } from '../gallery-icon'

export function filterIcons(icons: readonly GalleryIcon[], query: string): readonly GalleryIcon[] {
  const term = query.trim().toLowerCase()
  if (!term) return icons
  const nameTerm = term.replace(/\s+/g, '-')
  return icons.filter(item => item.icon.name.includes(nameTerm) || item.symbol.toLowerCase().includes(term))
}
