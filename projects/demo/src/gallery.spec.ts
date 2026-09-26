import { TestBed } from '@angular/core/testing'
import { signal } from '@angular/core'
import { AppComponent } from './app.component'
import { iconCatalog } from './icon-catalog'
import { IconGalleryService } from './icon-gallery.service'
import { filterIcons } from './utils/filter-icons'

const gallery = {
  icons: signal(iconCatalog),
  loading: signal(false),
  error: signal(false),
}

describe('Complete icon gallery', () => {
  it('lists every icon once, alphabetically, with its import name', () => {
    TestBed.configureTestingModule({ providers: [{ provide: IconGalleryService, useValue: gallery }] })
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const cards: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('.icon-card'))
    expect(cards.length).toBe(1512)
    expect(new Set(iconCatalog.map(item => item.icon.name)).size).toBe(1512)
    expect(cards.map(card => card.querySelector('span')?.textContent?.trim())).toEqual(iconCatalog.map(item => item.icon.name))
    expect(cards.map(card => card.querySelector('code')?.textContent?.trim())).toEqual(iconCatalog.map(item => item.symbol))
    const names = iconCatalog.map(item => item.icon.name)
    expect(names).toEqual([...names].sort())
  })

  it('searches by icon name, import name, and spaced names', () => {
    expect(filterIcons(iconCatalog, '  PhMagnifyingGlassMinus  ').map(item => item.icon.name)).toEqual(['magnifying-glass-minus'])
    expect(filterIcons(iconCatalog, 'magnifying glass').map(item => item.icon.name)).toEqual(['file-magnifying-glass', 'list-magnifying-glass', 'magnifying-glass', 'magnifying-glass-minus', 'magnifying-glass-plus'])
    expect(filterIcons(iconCatalog, 'not-an-icon')).toEqual([])
    expect(filterIcons(iconCatalog, ' ')).toBe(iconCatalog)
  })

  it('changes the rendered catalog weight and size, and shows no-match feedback', () => {
    TestBed.configureTestingModule({ providers: [{ provide: IconGalleryService, useValue: gallery }] })
    const fixture = TestBed.createComponent(AppComponent)
    fixture.componentInstance.query.set('PhHeart')
    fixture.componentInstance.weight.set('duotone')
    fixture.componentInstance.size.set(64)
    fixture.detectChanges()
    const svg = fixture.nativeElement.querySelector('.icon-card svg')
    expect(svg.getAttribute('data-weight')).toBe('duotone')
    expect(svg.querySelector('path').getAttribute('d')).toBe(iconCatalog.find(item => item.symbol === 'PhHeart')!.icon.weights.duotone[0].d)
    expect(fixture.nativeElement.querySelector('.icon-card ph-icon').style.fontSize).toBe('64px')
    fixture.componentInstance.query.set('not-an-icon')
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelectorAll('.icon-card').length).toBe(0)
    expect(fixture.nativeElement.querySelector('.empty-state').textContent).toContain('No icons match')
  })
})
