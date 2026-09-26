import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { iconSize } from './icon-size'
import type { PhosphorIcon, PhosphorWeight } from './icon.types'

@Component({
  selector: 'ph-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.color]': 'color()',
    '[style.font-size]': 'cssSize()',
    '[class.ph-fixed-width]': 'fixedWidth()',
    '[attr.aria-hidden]': 'label() ? null : "true"',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label()',
  },
  template: `
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false" [class.ph-spin]="spin()" [attr.data-icon]="icon().name" [attr.data-weight]="weight()">
      @for (path of paths(); track $index) {
        <path [attr.d]="path.d" [style.opacity]="path.opacity === undefined ? null : 'var(--ph-duotone-opacity, ' + path.opacity + ')'" [style.fill]="path.opacity === undefined ? null : 'var(--ph-duotone-color, currentColor)'" />
      }
    </svg>
  `,
  styles: `
    :host { display: inline-flex; align-items: center; justify-content: center; width: 1em; height: 1em; vertical-align: -0.125em; flex-shrink: 0; }
    :host(.ph-fixed-width) { width: 1.25em; }
    svg { display: block; width: 1em; height: 1em; overflow: visible; }
    .ph-spin { animation: ph-spin 1s linear infinite; }
    @keyframes ph-spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { .ph-spin { animation: none; } }
  `,
})
export class PhosphorIconComponent {
  readonly icon = input.required<PhosphorIcon>()
  readonly weight = input<PhosphorWeight>('regular')
  readonly size = input<number | string>('1em')
  readonly color = input<string | null>(null)
  readonly label = input<string | null>(null)
  readonly fixedWidth = input(false)
  readonly spin = input(false)
  protected readonly cssSize = computed(() => iconSize(this.size()))
  protected readonly paths = computed(() => this.icon().weights[this.weight()])
}
