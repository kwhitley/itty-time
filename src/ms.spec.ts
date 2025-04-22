import { describe, expect, it } from 'vitest'
import { ms } from './ms'

describe('ms(duration: string): number', () => {
  type MsTest = [duration: string | number, expected: number]

  const tests: MsTest[] = [
    ['1 minutes', 60 * 1000],
    ['24 hour', 60 * 60 * 24 * 1000],
    ['2 years', 2 * 365.25 * 24 * 60 * 60 * 1000],
    ['321 day', 60 * 60 * 24 * 321 * 1000],
    ['30.5 seconds', 30.5 * 1000],
    ['30.5   seconds', 30.5 * 1000],
    [4001, 4001], // a number is assumed to be a number
    ['100', 100], // string of a number is assumed to be ms
    ['100 ms', 100], // can handle ms
    ['100apple', NaN], // can handle ms
  ]

  describe('returns number of Ms', () => {
    for (const [duration, expected] of tests) {
      it(`ms('${duration}') => ${expected}`, () => {
        expect(ms(duration)).toEqual(expected)
      })
    }
  })

  describe('INPUT HANDLING', () => {
    const date = new Date

    const inputTypes = [
      { type: 'number', value: 1000, returns: 1000 },
      { type: 'string duration', value: '1 hour', returns: 1000 * 60 * 60 },
      { type: 'true', value: true, returns: 1 },
      { type: 'date', value: date, returns: +date },
      { type: 'false', value: false, returns: 0 },
      { type: '0 (string)', value: '0', returns: 0 },
      { type: '0', value: '0', returns: 0 },
      { type: 'unparsable string', value: '456apple', returns: NaN },
      { type: 'object', value: {}, throws: true },
      { type: 'function', value: () => {}, throws: true },
    ]

    for (const { type, value, throws, returns } of inputTypes) {
      const expected = throws
                        ? 'THROW AN ERROR'
                        : `return ${returns}`

      it(`when receiving ${type} (e.g. ${value}), it should ${expected}`, () => {
        if (throws) {
          // @ts-ignore
          expect(() => ms(value)).toThrow()
        } else {
          // @ts-ignore
          expect(ms(value)).toBe(returns)
        }
      })
    }
  })
})
