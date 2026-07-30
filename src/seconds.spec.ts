import { describe, expect, it } from 'bun:test'
import { seconds } from './seconds'
import { type TimeString } from './lib/units'

describe('seconds(duration: string): number', () => {
  type SecondsTest = [duration: TimeString | number, expected: number]

  const tests: SecondsTest[] = [
    ['5 seconds', 5],
    ['1 minutes', 60],
    ['24 hour', 60 * 60 * 24],
    ['2 years', 2 * 365.25 * 24 * 60 * 60],
    ['321 day', 60 * 60 * 24 * 321],
    ['1.5 seconds', 1.5],
    ['-30 seconds', -30],
    [10000, 10],
  ]

  describe('returns number of seconds', () => {
    for (const [duration, expected] of tests) {
      it(`seconds('${duration}') => ${expected}`, () => {
        expect(seconds(duration)).toEqual(expected)
      })
    }
  })
})
