import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const core = resolve(dirname(fileURLToPath(import.meta.resolve('@phosphor-icons/core'))), '..')
const generated = resolve(root, 'projects/ng-phosphor/src/lib/icons')
const weights = ['thin', 'light', 'regular', 'bold', 'fill', 'duotone']
const check = process.argv.includes('--check')
const names = (await readdir(resolve(core, 'assets/regular'))).filter(name => name.endsWith('.svg')).map(name => name.slice(0, -4)).sort()
const exports = []
const catalog = []
const seen = new Set()

async function output(file, content) {
  if (check) {
    const actual = await readFile(file, 'utf8').catch(() => '')
    if (actual !== content) throw new Error(`Generated content differs: ${file}`)
  } else {
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, content)
  }
}

for (const name of names) {
  const symbol = 'Ph' + name.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('')
  if (seen.has(symbol)) throw new Error(`Duplicate export: ${symbol}`)
  seen.add(symbol)
  const artwork = {}
  for (const weight of weights) {
    const suffix = weight === 'regular' ? '' : `-${weight}`
    const svg = await readFile(resolve(core, 'assets', weight, `${name}${suffix}.svg`), 'utf8')
    if (!svg.includes('viewBox="0 0 256 256"')) throw new Error(`Unexpected canvas: ${name}/${weight}`)
    const paths = [...svg.matchAll(/<path\s+([^>]+)\/?\s*>/g)].map(match => {
      const d = match[1].match(/\bd="([^"]+)"/)?.[1]
      const opacity = match[1].match(/\bopacity="([^"]+)"/)?.[1]
      if (!d) throw new Error(`Missing path: ${name}/${weight}`)
      return opacity === undefined ? { d } : { d, opacity: Number(opacity) }
    })
    if (!paths.length) throw new Error(`Missing artwork: ${name}/${weight}`)
    artwork[weight] = paths
  }
  const data = JSON.stringify({ name, weights: artwork }, null, 2)
  await output(resolve(generated, `${name}.ts`), `import type { PhosphorIcon } from '../icon.types'\n\nexport const ${symbol}: PhosphorIcon = ${data}\n`)
  exports.push(`export { ${symbol} } from './lib/icons/${name}'`)
  catalog.push({ symbol, name })
}

const api = ["export { PhosphorIconComponent } from './lib/phosphor-icon.component'", "export type { PhosphorIcon, PhosphorPath, PhosphorWeight } from './lib/icon.types'", ...exports].join('\n') + '\n'
await output(resolve(root, 'projects/ng-phosphor/src/public-api.ts'), api)
const demoCatalog = `${catalog.map(item => `import { ${item.symbol} } from '../../ng-phosphor/src/lib/icons/${item.name}'`).join('\n')}\nimport type { GalleryIcon } from './gallery-icon'\n\nexport const iconCatalog: readonly GalleryIcon[] = [\n${catalog.map(item => `  { symbol: '${item.symbol}', icon: ${item.symbol} },`).join('\n')}\n]\n`
await output(resolve(root, 'projects/demo/src/icon-catalog.ts'), demoCatalog)
console.log(`${check ? 'Verified' : 'Generated'} ${names.length} icons in ${weights.length} weights`)
