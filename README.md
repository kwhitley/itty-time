<br />

<p>
<a href="https://itty.dev/itty-time" target="_blank">
  <img src="https://github.com/kwhitley/itty-time/assets/865416/e45b9e04-a442-43b1-9961-59d62c62e88a" alt="itty-time" height="120" />
</a>
</p>

[![Version](https://img.shields.io/npm/v/itty-time.svg?style=flat-square)](https://npmjs.com/package/itty-time)
[![Bundle Size](https://deno.bundlejs.com/?q=itty-time&badge&badge-style=flat-square)](https://deno.bundlejs.com/?q=itty-time)
[![Coverage Status](https://img.shields.io/coveralls/github/kwhitley/itty-time?style=flat-square)](https://coveralls.io/github/kwhitley/itty-time)
[![Issues](https://img.shields.io/github/issues/kwhitley/itty-time?style=flat-square)](https://coveralls.io/github/kwhitley/itty-time)
[![Discord](https://img.shields.io/discord/832353585802903572?label=Discord&logo=Discord&style=flat-square&logoColor=fff)](https://discord.gg/53vyrZAu9u)

###  [v1 Documentation](https://itty.dev/itty-time) &nbsp;| &nbsp; [Discord](https://discord.gg/53vyrZAu9u)

---

Ultra-small (~390 bytes) library for TTL date math and converting ms durations to and from strings.

## Features

- Convert string durations to ms/seconds.
- Convert ms to human-readable string durations.
- Add durations to dates.
- Tiny. The entire library is ~390 bytes, and tree-shakeable to be even smaller.

## Comparison to other top-rated libraries
| library | string to ms | ms to string | date math | size<sup>1</sup>
| --- | :-: | :-: | :-: | :-: |
| [itty-time](https://www.npmjs.com/package/itty-time) | ✅ | ✅ | ✅ | 391b |
| [@lukeed/ms](https://www.npmjs.com/package/@lukeed/ms) | ✅ | ✅ | ❌ | 435b |
| [ms](https://www.npmjs.com/package/ms) | ✅ | ❌ | ❌ | 938b |
| [pretty-ms](https://www.npmjs.com/package/pretty-ms) | ❌ | ✅ | ❌ | 1.04kB |
| [humanize-duration](https://www.npmjs.com/package/humanize-duration) | ❌ | ✅ | ❌ | 6.74kB |

<sup>1: minified and gzipped</sup> &nbsp;

## Performance

The only function most folks care about in terms of raw performance is string to ms conversion.  In this, itty stacks up pretty well, being significantly faster than [ms](https://www.npmjs.com/package/ms), but falling to the insanely-optimized [@lukeed/ms](https://www.npmjs.com/package/@lukeed/ms).

![image](https://github.com/kwhitley/itty-time/assets/865416/71170005-7962-4bc8-9a66-f4ad5713e545)

Moral of the story, probably don't use [ms](https://www.npmjs.com/package/ms).

Use Luke's if you want the absolute fastest parsing, or itty if you want some of the other functions as well.  If you're byte-counting, itty wins again, but if you're byte-counting that hard, you're probably better off with raw ms math if you can stomach it.

---

# What does it do?
TTL math is a maintenance nightmare. It's a pain to write, a pain to read, and when you update the math later, you'll probably forget to update the comment, causing all sorts of mayhem.  Instead of maintaining math in your code like this:

```ts
const TTL = 2 * 7 * 24 * 60 * 60 * 1000 // 2 weeks... I think?
```

Use a simple converter so you can use plain english time descriptions like this:

```
const TTL = seconds('2 weeks')
```

That's it!

## Differences between itty-time and ms (the library)
Aside from the smaller size and faster speed, do note that itty-time's `ms` and `seconds` functions require writing out the actual unit name like `"3 hours"`, rather than supporting abbreviations like `"3h"` or `"3hrs"`.  We do this for two reasons:

1. This improves readability.  We like this.
1. Supporting fewer variations keeps itty-time smaller.

# API

### `ms(duration: TimeString) => number` &nbsp; ![bundle size](https://deno.bundlejs.com/?q=itty-time/ms&badge&badge-style=flat-square)
Converts string durations to **milliseconds** (great for time math).
```ts
import { ms } from 'itty-time' // ~190 bytes

// to milliseconds
ms('2 weeks') // 1209600000
```

### `seconds(duration: TimeString) => number` &nbsp; ![bundle size](https://deno.bundlejs.com/?q=itty-time/seconds&badge&badge-style=flat-square)
Convert string durations to **seconds** (great for expiry systems that use seconds, like Cloudflare KV).
```ts
import { seconds } from 'itty-time' ~200 bytes

// to seconds
seconds('2 weeks') // 1209600
```

### `duration(ms: number) => string | Array<TimeParts>` &nbsp; ![bundle size](https://deno.bundlejs.com/?q=itty-time/duration&badge&badge-style=flat-square)
Converts a duration number to a string.

```ts
import { duration } from 'itty-time'

duration(3750000)
// "1 hour, 2 minutes, 30 seconds"

// limit number of segments returned
duration(3750000, { parts: 2 })
// "1 hour, 2.5 minutes"

// change the delimiter
duration(3750000, { join: ' --> ' })
// "1 hour --> 2 minutes --> 30 seconds"

// or get the raw components
duration(3750000, { join: false })
/*
  [
    ['hour', 1],
    ['minutes', 2],
    ['seconds', 30]
  ]
/*
```

### `datePlus(duration: TimeString, from = new Date) => Date` &nbsp; ![bundle size](https://deno.bundlejs.com/?q=itty-time/datePlus&badge&badge-style=flat-square)
Need to add/subtract time from a date?  Find the date two weeks from now?  Set an alarm for 30 minutes before your birthday?  Use this.
```js
import { datePlus } from 'itty-time'

// from right now
datePlus('2 weeks')

// or from a different date
datePlus('-30 minutes', new Date('2024/11/1'))
```
