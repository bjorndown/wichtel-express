import _random from 'lodash/random'
import _range from 'lodash/range'

const PREFIX_LENGTH = 2
const PREFIX_HEX_LENGTH = 2 * PREFIX_LENGTH
export const PAD_TO_LENGTH = 40

export const firstQp = (p: string | string[]): string =>
  Array.isArray(p) ? p[0] : p

export const stringToHex = (str: string): string =>
  Array.from(str)
    .map(c => toHex(c.charCodeAt(0)))
    .join('')

const randomHex = () => toHex(_random(0, 255))

const toHex = (number: Number) => number.toString(16).padStart(2, '0')

export const obfuscate = (str: string): string => {
  return padWith(
    `${randomHex()}${randomHex()}${toHex(str.length)}${stringToHex(str)}`,
    PAD_TO_LENGTH,
    randomHex
  )
}

export const padWith = (
  str: string,
  padToLength: number,
  padFn: () => string
): string => {
  if (str.length >= padToLength) {
    return str
  }

  const delta = padToLength - str.length
  const padding = _range(0, delta, 1)
    .map(() => padFn())
    .join('')
  return str.concat(padding).slice(0, padToLength)
}

export const deobfuscate = (str: string): string => {
  const stringWithoutPrefix = str.slice(PREFIX_HEX_LENGTH)
  const len = parseInt(stringWithoutPrefix.slice(0, 2), 16)
  return hexToString(stringWithoutPrefix.slice(2, 2 + len * 2))
}

export const hexToString = (str: string): string => {
  return Array.from(str.matchAll(/.{2}/g))
    .filter(c => !!c)
    .map(c => String.fromCodePoint(parseInt(c[0], 16)))
    .join('')
}
