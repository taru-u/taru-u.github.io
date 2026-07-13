# Musemaster

A browser-only MIDI practice prototype with a playable piano, chord recognition, and a relative-ear game.

## Run it

Serve this folder over `http://localhost` (for example with your preferred static-server extension), then open the local address in a recent Chromium-based browser. Web MIDI requires a secure context, and browsers treat `localhost` as secure.

Allow MIDI access when the browser asks. The status badge changes when it sees a connected controller. Every MIDI note is synthesized locally, no matter which game is open.

## Included modes

- **Chord sprint:** Match the named chord. Pitch classes must match with no extras; doubled notes are allowed. When an inversion is selected, the lowest MIDI note must be its prescribed chord tone.
- **Relative ear:** Hear a named reference note, then identify the following note on your controller. Octave is ignored. The generated melody remains between C4 and C6, moving at most 14 semitones at a time.

The on-screen piano is also playable for quick testing without a controller.
