import { random } from 'lodash'
import {
  deobfuscate,
  drawLots,
  obfuscate,
  padWith,
  PAD_TO_LENGTH,
  SecretSanta,
} from './lib'

describe('obfuscate', () => {
  it('must pad to given length', () => {
    expect(obfuscate('hans')?.length).toBe(PAD_TO_LENGTH)
    expect(obfuscate('quitealongname')?.length).toBe(PAD_TO_LENGTH)
    expect(obfuscate('reallyaverylongnameunbelievable')?.length).toBe(68)
  })
  it.each([[undefined], [null], ['']])(
    'must return null if called with %s',
    input => {
      expect(obfuscate(input)).toBe(null)
    }
  )
})

describe('deobfuscate', () => {
  it.each([
    [undefined],
    [null],
    [''],
    ['invalid'],
    ['test'],
    ['101010testasd'],
    ['10104testtestt'],
    ['http://scammy.site'],
  ])('must return null if given invalid input like "%s"', input => {
    expect(deobfuscate(input)).toBe(null)
  })
})

describe('padWith', () => {
  it('must pad string to given length with result of given function', () => {
    expect(padWith('foo', 10, () => 'a')).toBe('fooaaaaaaa')
    expect(padWith('foo', 10, () => random(0, 15).toString(10)).length).toBe(10)
  })
})

test.each([
  'Bjørn',
  'Jacquéline',
  'Jacques-Jérôme Pâtios',
  'reallyaverylongnameunbelievable',
])('obfuscate/deobfuscate e2e with "%s"', name => {
  expect(deobfuscate(obfuscate(name))).toBe(name)
})

describe('drawLots', () => {
  it('must fail if names are not unique', () => {
    expect(() => drawLots([{ name: 'same' }, { name: 'same' }])).toThrowError(
      /not unique/
    )
  })
  it('must draw lots such that no-one draws him or herself and that lots are unique', () => {
    const santas: SecretSanta[] = [
      { name: 'Hans' },
      { name: 'Otto' },
      { name: 'Oskar' },
      { name: 'Nadine' },
      { name: 'Nina' },
      { name: 'Anita' },
      { name: 'Petra' },
      { name: 'Sandra' },
      { name: 'Flavia' },
      { name: 'Andrea' },
      { name: 'Tina' },
      { name: 'Rosina' },
      { name: 'Kurt' },
      { name: 'Berta' },
      { name: 'Karl' },
      { name: 'Boris' },
      { name: 'Sven' },
      { name: 'Carla' },
      { name: 'Xenia' },
      { name: 'Sonja' },
      { name: 'Reto' },
      { name: 'Thomas' },
      { name: 'Daniel' },
      { name: 'Peter' },
      { name: 'Monika' },
      { name: 'Heidi' },
      { name: 'Jacqueline' },
    ]

    drawLots(santas)

    expect(santas.every(s => !!s.presentee)).toBe(true)
    expect(santas.every(s => s.presentee !== s.name)).toBe(true)
    expect(new Set(santas.map(s => s.name))).toStrictEqual(
      new Set(santas.map(s => s.presentee))
    )
  })
})
