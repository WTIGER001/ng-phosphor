import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { PhosphorIconComponent } from '../../ng-phosphor/src/lib/phosphor-icon.component'
import { PhMagnifyingGlass } from '../../ng-phosphor/src/lib/icons/magnifying-glass'
import { PhHeart } from '../../ng-phosphor/src/lib/icons/heart'
import { PhSpinnerGap } from '../../ng-phosphor/src/lib/icons/spinner-gap'
import type { PhosphorWeight } from '@wtiger001/ng-phosphor'
import { IconGalleryService } from './icon-gallery.service'
import { filterIcons } from './utils/filter-icons'

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhosphorIconComponent],
  template: `
    <main>
      <header>
        <h1>ng-phosphor</h1>
        <p>Explore every Phosphor icon in all six weights.</p>
      </header>
      <div class="gallery-controls">
        <label class="search-control">Search icons
          <input type="search" placeholder="Name or import, such as heart or PhHeart" [value]="query()" (input)="query.set($any($event.target).value)" />
        </label>
        <label>Preview size
          <select [value]="size()" (change)="size.set(+$any($event.target).value)">
            <option value="24">24 px</option>
            <option value="32">32 px</option>
            <option value="48">48 px</option>
            <option value="64">64 px</option>
          </select>
        </label>
        <nav aria-label="Icon weight">
          @for (item of weights; track item) {
            <button type="button" [attr.aria-pressed]="weight() === item" (click)="weight.set(item)">{{ item }}</button>
          }
        </nav>
      </div>
      @if (gallery.loading()) {
        <p role="status">Loading the icon catalog…</p>
      } @else if (gallery.error()) {
        <p role="alert">The icon catalog could not load. Refresh the page to try again.</p>
      } @else {
        <p class="result-count" role="status">{{ visibleIcons().length }} of {{ gallery.icons().length }} icons</p>
        <section class="icon-grid" aria-label="All Phosphor icons">
          @for (item of visibleIcons(); track item.icon.name) {
            <article class="icon-card">
              <div class="icon-preview"><ph-icon [icon]="item.icon" [weight]="weight()" [size]="size()" /></div>
              <span>{{ item.icon.name }}</span>
              <code>{{ item.symbol }}</code>
            </article>
          } @empty {
            <p class="empty-state">No icons match “{{ query() }}”. Try another name.</p>
          }
        </section>
      }
      <section class="usage-examples" aria-label="Usage examples">
        <h2>Usage examples</h2>
        <button type="button"><ph-icon [icon]="search" weight="light" /> Search</button>
        <p><ph-icon [icon]="spinner" [spin]="true" /> Loading example</p>
        <p><ph-icon [icon]="heart" weight="duotone" [size]="32" style="--ph-duotone-color: #e76f51; --ph-duotone-opacity: .35" label="Duotone heart example" /></p>
      </section>
    </main>
  `,
})
export class AppComponent {
  readonly gallery = inject(IconGalleryService)
  readonly weight = signal<PhosphorWeight>('regular')
  readonly query = signal('')
  readonly size = signal(48)
  readonly weights: readonly PhosphorWeight[] = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone']
  readonly visibleIcons = computed(() => filterIcons(this.gallery.icons(), this.query()))
  readonly search = PhMagnifyingGlass
  readonly spinner = PhSpinnerGap
  readonly heart = PhHeart
}
