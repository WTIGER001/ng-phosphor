import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { PhosphorIconComponent, PhMagnifyingGlass, PhStackPlus, PhGlobe, PhX, PhHeart, PhSpinnerGap, type PhosphorWeight } from '@wtiger001/ng-phosphor'

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhosphorIconComponent],
  template: `
    <main>
      <h1>ng-phosphor</h1>
      <p>Standalone Angular icons. Six weights. No runtime downloads.</p>
      <nav aria-label="Icon weight">
        @for (item of weights; track item) {
          <button type="button" [attr.aria-pressed]="weight() === item" (click)="weight.set(item)">{{ item }}</button>
        }
      </nav>
      <section aria-label="Icon examples">
        @for (item of icons; track item.name) {
          <article><ph-icon [icon]="item" [weight]="weight()" [size]="48" /><span>{{ item.name }}</span></article>
        }
      </section>
      <button type="button"><ph-icon [icon]="search" weight="light" /> Search</button>
      <p><ph-icon [icon]="spinner" [spin]="true" /> Loading example</p>
      <p><ph-icon [icon]="heart" weight="duotone" [size]="32" style="--ph-duotone-color: #e76f51; --ph-duotone-opacity: .35" label="Duotone heart example" /></p>
    </main>
  `,
})
export class AppComponent {
  readonly weight = signal<PhosphorWeight>('regular')
  readonly weights: readonly PhosphorWeight[] = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone']
  readonly icons = [PhMagnifyingGlass, PhStackPlus, PhGlobe, PhX, PhHeart]
  readonly search = PhMagnifyingGlass
  readonly spinner = PhSpinnerGap
  readonly heart = PhHeart
}
