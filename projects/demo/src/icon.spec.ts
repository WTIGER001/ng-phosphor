import { TestBed } from '@angular/core/testing'
import { PhosphorIconComponent, PhMagnifyingGlass, PhHeart, PhX } from '@wtiger001/ng-phosphor'
import { iconSize } from '../../ng-phosphor/src/lib/icon-size'

describe('PhosphorIconComponent', () => {
  function create() {
    const fixture = TestBed.createComponent(PhosphorIconComponent)
    fixture.componentRef.setInput('icon', PhMagnifyingGlass)
    fixture.detectChanges()
    return fixture
  }

  it('updates artwork when weight and icon change', () => {
    const fixture = create()
    expect(fixture.nativeElement.querySelector('path').getAttribute('d')).toBe(PhMagnifyingGlass.weights.regular[0].d)
    fixture.componentRef.setInput('weight', 'light')
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('path').getAttribute('d')).toBe(PhMagnifyingGlass.weights.light[0].d)
    fixture.componentRef.setInput('icon', PhX)
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector('path').getAttribute('d')).toBe(PhX.weights.light[0].d)
  })

  it('hides decorative icons and exposes labelled icons', () => {
    const fixture = create()
    expect(fixture.nativeElement.getAttribute('aria-hidden')).toBe('true')
    fixture.componentRef.setInput('label', 'Search')
    fixture.detectChanges()
    expect(fixture.nativeElement.hasAttribute('aria-hidden')).toBe(false)
    expect(fixture.nativeElement.getAttribute('role')).toBe('img')
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('Search')
    expect(fixture.nativeElement.querySelector('svg').getAttribute('focusable')).toBe('false')
  })

  it('renders both duotone layers with configurable opacity', () => {
    const fixture = create()
    fixture.componentRef.setInput('icon', PhHeart)
    fixture.componentRef.setInput('weight', 'duotone')
    fixture.detectChanges()
    const paths = fixture.nativeElement.querySelectorAll('path')
    expect(paths.length).toBe(PhHeart.weights.duotone.length)
    expect(paths[0].style.opacity).toContain('--ph-duotone-opacity')
    expect(paths[0].style.fill).toContain('--ph-duotone-color')
  })

  it('supports fixed width, inherited color, and spin', () => {
    const fixture = create()
    expect(fixture.nativeElement.style.color).toBe('')
    fixture.componentRef.setInput('fixedWidth', true)
    fixture.componentRef.setInput('spin', true)
    fixture.componentRef.setInput('size', 32)
    fixture.detectChanges()
    expect(fixture.nativeElement.classList.contains('ph-fixed-width')).toBe(true)
    expect(fixture.nativeElement.style.fontSize).toBe('32px')
    expect(fixture.nativeElement.querySelector('svg').classList.contains('ph-spin')).toBe(true)
  })

  it('accepts numeric and CSS sizes', () => {
    expect(iconSize(24)).toBe('24px')
    expect(iconSize('1.5rem')).toBe('1.5rem')
  })
})
