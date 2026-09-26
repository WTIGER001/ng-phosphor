export function iconSize(size: number | string): string {
  return typeof size === 'number' ? `${size}px` : size
}
