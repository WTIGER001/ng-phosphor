# ng-phosphor

[![Build and test](https://github.com/wtiger001/ng-phosphor/actions/workflows/ci.yml/badge.svg)](https://github.com/wtiger001/ng-phosphor/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A community Angular library for [Phosphor Icons](https://phosphoricons.com/).
Standalone components, signal inputs, six icon weights, and SVGs that inherit your application colors.

This project is independently maintained. It is not an official Phosphor project or an Angular project.
The icon artwork belongs to the Phosphor contributors and retains its original MIT license.

## Status

Initial release preparation. The GitHub repository is public; the npm package is not published yet.
The intended package name is `@wtiger001/ng-phosphor`. The command below applies after the first npm release.

```sh
npm install @wtiger001/ng-phosphor
```

Requires Angular 22. Older Angular versions are not supported by this initial implementation.

## Quick start

Import the standalone component and the icons your component uses.

```ts
import { Component } from '@angular/core'
import {
  PhosphorIconComponent,
  PhMagnifyingGlass,
  PhStackPlus,
} from '@wtiger001/ng-phosphor'

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [PhosphorIconComponent],
  template: `
    <button type="button">
      <ph-icon [icon]="search" weight="light" /> Search
    </button>
    <button type="button" aria-label="Add layers">
      <ph-icon [icon]="layers" weight="duotone" [size]="24" />
    </button>
  `,
})
export class ToolbarComponent {
  readonly search = PhMagnifyingGlass
  readonly layers = PhStackPlus
}
```

There is no global registration step, DOM scanning, runtime icon fetch, or icon font.
Every icon is a typed constant. Names are prefixed with `Ph`, such as `PhHeart` and `PhX`.
SVG paths render through Angular bindings without HTML injection or sanitizer bypasses.

## Component API

| Input | Type | Default | Purpose |
|---|---|---|---|
| `icon` | `PhosphorIcon` | Required | Imported icon definition |
| `weight` | `PhosphorWeight` | `regular` | `thin`, `light`, `regular`, `bold`, `fill`, or `duotone` |
| `size` | `number \| string` | `1em` | Numbers use pixels; strings accept CSS sizes |
| `color` | `string \| null` | `null` | Inherit text color or set a CSS color |
| `label` | `string \| null` | `null` | Accessible label for a meaningful standalone icon |
| `fixedWidth` | `boolean` | `false` | Reserve `1.25em` for aligned rows |
| `spin` | `boolean` | `false` | Continuous rotation; respects reduced motion |

```html
<ph-icon [icon]="heart" weight="light" [size]="32" color="tomato" />
<ph-icon [icon]="spinner" [spin]="true" />
<ph-icon [icon]="globe" [fixedWidth]="true" label="Worldwide coverage" />
```

Each imported icon includes all six weights, so its weight can change at runtime.
Modern production bundlers can remove unused icon exports. Import individual icons rather than constructing a registry of every exported icon.
All weights of a used icon remain in the bundle; this version does not provide individual-weight imports.

## Duotone colors

The foreground uses `currentColor`. The background supports these CSS properties:

| Property | Default |
|---|---|
| `--ph-duotone-color` | `currentColor` |
| `--ph-duotone-opacity` | Phosphor's source opacity, normally `0.2` |

```html
<ph-icon
  [icon]="heart"
  weight="duotone"
  color="#006666"
  style="--ph-duotone-color: #f58220; --ph-duotone-opacity: .35"
/>
```

## Accessibility

Icons are decorative by default and hidden from assistive technology.
Give an icon-only button its own accessible name. Use `label` when the icon itself conveys meaning outside a labelled control.
The SVG is not keyboard-focusable. Rotation stops when the user requests reduced motion.

## Use in another Angular library

A consuming Angular library can import `PhosphorIconComponent` exactly as an application does.
Declare `@wtiger001/ng-phosphor` as a peer dependency and install it as a development dependency for the library build.
The final application installs both libraries. This project has no dependency on Mapag or MarketMaker.

## Local development

Use Node 24.15.0, as specified in `.nvmrc`.

```sh
npm ci
npm run check:icons
npm test
npm run build
npm run build:demo
```

Start the demo explicitly when you want it:

```sh
npm start
```

Build a local package for testing in another project:

```sh
npm run pack:lib
```

Install the resulting `wtiger001-ng-phosphor-0.1.0.tgz` from the consumer project with `npm install /absolute/path/to/the/package.tgz`.

## Icon source and generation

The project pins `@phosphor-icons/core` to `2.1.1` as a development dependency.
The generator creates typed icon definitions from its SVG paths and preserves duotone opacity.
Phosphor is not a runtime dependency of the published package.

```sh
npm run generate:icons
npm run check:icons
```

Generated files are committed so contributors and consumers can inspect the artwork.
To update upstream icons, update the pinned version, regenerate, review the changes, and run the checks.
Do not edit generated icon definitions by hand.

## Contributing

Bug reports, Angular compatibility fixes, documentation improvements, and accessibility improvements are welcome.
Open an issue for larger API changes before implementation. Keep changes focused and include tests for behavior changes.
Pull requests run generation checks, component tests, the library build, and the demo build.
See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.

## Release

Build and test before publishing. Publish the compiled package, not the workspace root.
Once you have npm access to the `@wtiger001` scope:

```sh
npm publish ./dist/ng-phosphor --access public
```

Publishing is manual. CI does not hold npm credentials or publish packages automatically.

## License

MIT. See [LICENSE](LICENSE) for the Angular library license and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the original Phosphor license.
