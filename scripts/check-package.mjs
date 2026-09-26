import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = JSON.parse(await readFile(resolve(root, 'projects/ng-phosphor/package.json'), 'utf8'))
const compiled = JSON.parse(await readFile(resolve(root, 'dist/ng-phosphor/package.json'), 'utf8'))
const result = spawnSync('npm', ['pack', './dist/ng-phosphor', '--dry-run', '--json'], { cwd: root, encoding: 'utf8' })
if (result.status !== 0) throw new Error(result.stderr || 'Package inspection failed')
const [packed] = JSON.parse(result.stdout)

assert.equal(compiled.name, '@wtiger001/ng-phosphor')
assert.equal(compiled.version, source.version)
assert.equal(compiled.license, 'MIT')
assert.equal(compiled.private, undefined)
assert.equal(compiled.publishConfig.access, 'public')
assert.equal(compiled.publishConfig.registry, 'https://registry.npmjs.org/')
assert.equal(compiled.sideEffects, false)
assert.equal(compiled.peerDependencies['@angular/core'], '^22.0.0')
assert.deepEqual(Object.keys(compiled.dependencies), ['tslib'])
assert.ok(compiled.exports['.'].types)
assert.ok(compiled.exports['.'].default)

const paths = packed.files.map(file => file.path)
for (const file of ['package.json', 'README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'CONTRIBUTING.md']) {
  assert.ok(paths.includes(file), `Missing package file: ${file}`)
}
for (const path of paths) {
  assert.ok(/^(package\.json|README\.md|LICENSE|THIRD_PARTY_NOTICES\.md|CONTRIBUTING\.md|fesm2022\/[\w.-]+\.mjs(?:\.map)?|types\/[\w.-]+\.d\.ts)$/.test(path), `Unexpected package file: ${path}`)
}
const bundle = await readFile(resolve(root, 'dist/ng-phosphor', compiled.exports['.'].default), 'utf8')
assert.ok(bundle.includes('ɵɵngDeclareComponent'), 'Library must use partial Angular compilation')
assert.ok(!bundle.includes('ɵɵdefineComponent'), 'Library must not contain full Angular compilation')
const declarations = await readFile(resolve(root, 'dist/ng-phosphor', compiled.exports['.'].types), 'utf8')
const iconCount = (declarations.match(/declare const Ph\w+: PhosphorIcon;/g) ?? []).length
assert.equal(iconCount, 1512, 'Published package must include the complete icon catalog')
const notices = await readFile(resolve(root, 'dist/ng-phosphor/THIRD_PARTY_NOTICES.md'), 'utf8')
assert.ok(notices.includes('Copyright (c) 2023 Phosphor Icons'))
console.log(`Ready: ${compiled.name}@${compiled.version}; ${iconCount} icons; ${paths.length} files; ${(packed.size / 1024 / 1024).toFixed(2)} MB packed`)
