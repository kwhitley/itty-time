import { describe, expect, it } from 'bun:test'
import * as exports from './index'

const expected: (keyof typeof exports)[] = [
  'seconds',
  'ms',
  'duration',
  'datePlus'
]

describe('itty-time', () => {
  describe('exports', () => {
    for (const exportName of expected) {
      it(exportName, () => {
        expect(typeof exports[exportName]).toBe('function')
      })
    }
  })
})
