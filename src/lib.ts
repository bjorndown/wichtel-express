import _random from 'lodash/random'
import _range from 'lodash/range'
import _sample from 'lodash/sample'

const RANDOM_PREFIX_LENGTH = 4 // two two-digit hex numbers
export const PAD_TO_LENGTH = 40
export const ALLOWED_CHARS =
  /[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZäöüéèàçêâëãøô\- ]+/

export const firstQp = (p: string | string[] | undefined): string | undefined =>
  Array.isArray(p) ? p[0] : p

export const stringToHex = (str: string | undefined | null): string | null => {
  if (!str) {
    return null
  }
  return Array.from(str)
    .map(c => toHex(c.charCodeAt(0)))
    .join('')
}

const randomHex = () => toHex(_random(0, 255))

const toHex = (number: Number) => number.toString(16).padStart(2, '0')

export const obfuscate = (str: string | undefined | null): string | null => {
  if (!str) {
    return null
  }
  if (!ALLOWED_CHARS.test(str)) {
    return null
  }

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

export const deobfuscate = (str: string | undefined | null): string | null => {
  if (!str) {
    return null
  }

  const stringWithoutPrefix = str.slice(RANDOM_PREFIX_LENGTH)
  const obfuscatedTextLength = parseInt(stringWithoutPrefix.slice(0, 2), 16)

  if (isNaN(obfuscatedTextLength)) {
    console.error('invalid obfuscated text')
    return null
  }

  const stringWithoutPadding = stringWithoutPrefix.slice(
    2,
    2 + obfuscatedTextLength * 2
  )

  if (obfuscatedTextLength * 2 != stringWithoutPadding.length) {
    console.error('obfuscated text too short')
    return null
  }

  const plainText = hexToString(
    stringWithoutPrefix.slice(2, 2 + obfuscatedTextLength * 2)
  )
  if (!ALLOWED_CHARS.test(plainText ?? '')) {
    return null
  }

  return plainText
}

export const hexToString = (str: string): string | null => {
  try {
    return Array.from(str.matchAll(/.{2}/g))
      .map(c => {
        const codePoint = parseInt(c[0], 16)
        return String.fromCodePoint(codePoint)
      })
      .join('')
  } catch (error) {
    console.error(error)
    return null
  }
}

export type SecretSanta = {
  name: string
  presentee?: string
  url?: string
}

export const drawLots = (santas: SecretSanta[]): void => {
  if (new Set(santas.map(s => s.name)).size !== santas.length) {
    throw new Error('Names are not unique')
  }

  while (santas.some(santa => !santa.presentee)) {
    for (const santa of santas) {
      const otherSantas = santas.filter(
        otherSanta => otherSanta.name !== santa.name
      )
      const presentee = _sample(otherSantas) as SecretSanta // it will not be nullish
      const alreadyPresentee = santas.some(
        santa => santa.presentee === presentee.name
      )
      if (!alreadyPresentee) {
        santa.presentee = presentee.name
      }
    }
  }
}

export const generateLink = (santa: SecretSanta): string => {
  const url = new URL('reveal', location.href)
  url.searchParams.append('s', santa.name)
  url.searchParams.append('p', obfuscate(santa.presentee) as string)
  return url.toString()
}
