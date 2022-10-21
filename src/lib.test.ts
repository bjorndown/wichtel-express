import { random } from 'lodash'
import { deobfuscate, obfuscate, padWith, PAD_TO_LENGTH } from './lib'

describe('obfuscate', () => {
  it('must pad to given length', () => {
    expect(obfuscate('hans').length).toBe(PAD_TO_LENGTH)
    expect(obfuscate('quitealongname').length).toBe(PAD_TO_LENGTH)
    expect(obfuscate('reallyaverylongnameunbelievable').length).toBe(68)
  })
})

describe('padWith', () => {
  it('must pad string to given length with result of given function', () => {
    expect(padWith('foo', 10, () => 'a')).toBe('fooaaaaaaa')
    expect(padWith('foo', 10, () => random(0, 15).toString(10)).length).toBe(10)
  })
})

test.each(['Bjørn', 'Jacquéline', 'reallyaverylongnameunbelievable'])(
  'obfuscate/deobfuscate e2e with "%s"',
  name => {
    expect(deobfuscate(obfuscate(name))).toBe(name)
  }
)
