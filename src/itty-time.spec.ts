import { describe, expect, it } from 'vitest'
import {
  getDatePlus,
  getDuration,
  getTTL,
  divideBy,
  divide,
} from './itty-time'
import * as time from './itty-time'

describe('itty-time', () => {
  describe('exports', () => {
    it('getDuration', () => {
      expect(typeof getDuration).toBe('function')
    })

    it('getTTL', () => {
      expect(typeof getTTL).toBe('function')
    })

    it('getDatePlus', () => {
      expect(typeof getDatePlus).toBe('function')
    })
  })

  describe('getDuration(duration: string): { value: number, unit: string }', () => {
    const tests = [
      ['5 seconds', { value: 5, unit: 'second' }],
      ['1 minutes', { value: 1, unit: 'minute' }],
      ['24 hour', { value: 24, unit: 'hour' }],
      ['321 day', { value: 321, unit: 'day' }],
      ['12 week', { value: 12, unit: 'week' }],
      ['3 month', { value: 3, unit: 'month' }],
      ['11 year', { value: 11, unit: 'year' }],
      ['1.5 minutes', { value: 1.5, unit: 'minute' }],
    ]

    it('returns value in { value: number, unit: string } format, such as { value: 12, unit: "minute" }', () => {
      const { value, unit} = getDuration('5 minutes')

      expect(value).toBe(5)
      expect(unit).toBe('minute')
    })

    describe('parses', () => {
      for (const [duration, expected] of tests) {
        it(`getDuration('${duration}') => ${JSON.stringify(expected).replace(/([:,])/g, '$1 ')}`, () => {
          const { value, unit } = getDuration(duration)

          expect(getDuration(duration)).toEqual(expected)
        })
      }
    })
  })

  describe('getTTL(duration: string): number', () => {
    type TTLTest = [duration: string, expected: number]

    const tests: TTLTest[] = [
      ['5 seconds', 5],
      ['1 minutes', 60],
      ['24 hour', 60 * 60 * 24],
      ['1 day, 4 hours, and 36 minutes', 60 * 60 * 24 + 60 * 60 * 4 + 60 * 36],
      ['321 day', 60 * 60 * 24 * 321],
    ]

    describe('returns number of seconds', () => {
      for (const [duration, expected] of tests) {
        it(`getTTL('${duration}') => ${expected}`, () => {
          expect(getTTL(duration)).toEqual(expected)
        })
      }
    })
  })

  describe('getDatePlus(duration: string): Date', () => {
    type DatePlusTest = [duration: string]

    const tests: DatePlusTest[] = [
      ['5 seconds'],
      ['1 minutes'],
      ['24 hour'],
      ['1 day, 4 hours, and 36 minutes'],
      ['2 months'],
      ['4 years'],
      ['321 day'],
    ]

    describe('returns a Date object from the future', () => {
      for (const [duration] of tests) {
        const future = getDatePlus(duration)

        it(`getDatePlus('${duration}') => ${future.toISOString()}`, () => {

          const ttl = getTTL(duration)
          const diff = (+future - +new Date()) / 1000|0 - ttl

          expect(diff).toBeLessThan(2)
        })
      }
    })
  })

  describe('divideBy(seconds: number) => (duration: string): number', () => {
    type DivisionTest = [
      duration: string,
      divisor: string,
      result: number,
      fuzzy?: boolean,
    ]

    const tests: DivisionTest[] = [
      ['1 week', 'days', 7],
      ['2 minutes', 'second', 120],
      ['3 days', 'hour', 24 * 3],
      ['1 day', '3 hours', 8],
      ['1 year', 'month', 12, true],
      ['4 months', 'weeks', 4.25 * 4, true],
      ['3 minutes', 'seconds', 60 * 3],
      ['1 week', 'seconds', 60 * 60 * 24 * 7],
      ['24 hours', 'minutes', 60 * 24],
      ['3 days', 'hours', 24 * 3],
      ['1 day, 30 minutes', 'hours', 24 + 0.5],
      ['1 week', 'days', 7],
      ['12 hours', 'days', 0.5],
      ['3 months', 'days', 30.5 * 3, true],
      ['1 year', 'weeks', 52, true],
      ['1 month', 'weeks', 4.3, true],
      ['3 years', 'months', 36, true],
    ]

    describe('divides dates', () => {
      for (const [duration, divisor, expected, fuzzy] of tests) {
        it(`divide('${duration}').by('${divisor}') = ${fuzzy ? '~' : ''}${expected}`, () => {
          const value = divide(duration).by(divisor)

          if (fuzzy) {
            const proximity = Math.min(value, expected) / Math.max(value, expected)
            const closeEnough = proximity > 0.95
            expect(closeEnough).toBe(true)
          } else {
            expect(value).toBe(expected)
          }
        })
      }
    })
  })
})
