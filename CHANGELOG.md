## Changelog

#### v1.0.7
- adds: type checking for duration string in ms/seconds/datePlus
- removes: sourcemap from dist files to shrink package
#### v1.0.6
- fix: duration was incorrectly rounding to seconds, instead of only when part limiting
- fix: duration incorrectly handled sub-second durations (returned empty string)
#### v1.0.5
- fix: last part in duration() should include remainder decimal, not just seconds
#### v1.0.0
- BREAKING: changed getSeconds() --> toSeconds()
- added: toMs()
- added: toDuration()
- datePlus() remains the same
- maintenance: code-golfing!
#### v0.1.0
- first public release
