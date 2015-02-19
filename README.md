# JS-Synth
A simple PM synthesizer written in Javascript

## Usage:
### Playing sounds
**`playSound(buffer)`**:
- Plays the supplied buffer
- `buffer`: A sound buffer (see below for buffer generation)

### Sound buffer generation
**`generateSound(length, waveform)`**:
- Generates a sound for `length` seconds using the supplied waveform.
- `length`: number (in seconds)
- `waveform`: a function that takes in a number argument and returns a number between -1 and 1

**`generateStereoSound(length, waveleft, waveright)`**:
- Generates a sound for `length` seconds using different waveforms for left and right speakers
- `length`: number (in seconds)
- `waveleft`: the waveform used for the left speaker
- `waveright`: the waveform used for the right speaker

### Waveform generation
This synthesizer provides 4 different waveform generator: `sine`, `sawtooth`, `triangle`, `square`. Each waveform generator takes in 2 arguments. The first argument, `frequency`, is the base frequency of the wave. The second argument, `modulo`, is the waveform that is used to modulate the phase of the first. To create a waveform with no modulation, use `zero()` for the `modulo` argument.

**`zero()`**:
- Creates a waveform that returns 0
