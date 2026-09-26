import { Injectable, signal } from '@angular/core'
import type { GalleryIcon } from './gallery-icon'

@Injectable({ providedIn: 'root' })
export class IconGalleryService {
  private readonly catalog = signal<readonly GalleryIcon[]>([])
  private readonly pending = signal(true)
  private readonly failed = signal(false)
  readonly icons = this.catalog.asReadonly()
  readonly loading = this.pending.asReadonly()
  readonly error = this.failed.asReadonly()

  constructor() {
    void this.load()
  }

  private async load(): Promise<void> {
    try {
      const { iconCatalog } = await import('./icon-catalog')
      this.catalog.set(iconCatalog)
    } catch {
      this.failed.set(true)
    } finally {
      this.pending.set(false)
    }
  }
}
