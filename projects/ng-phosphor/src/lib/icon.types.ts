export type PhosphorWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'

export interface PhosphorPath {
  readonly d: string
  readonly opacity?: number
}

export interface PhosphorIcon {
  readonly name: string
  readonly weights: Readonly<Record<PhosphorWeight, readonly PhosphorPath[]>>
}
