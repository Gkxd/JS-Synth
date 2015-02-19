/* A simple javascript synth
 *
 * References: http://www.html5rocks.com/en/tutorials/webaudio/intro/
 */

var audioCtx;

window.addEventListener('load', init, false);
function init() {
  try {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
  var buffer = generateEnvelopeSound(makeEnvelope(0, 1, 5, 0.3, 0), sawtooth(620, zero()));
  
  playSound(buffer);
}

function generateSound(length, waveform) {
  var channels = 2;
  var sampleRate = audioCtx.sampleRate;
  var frameCount = sampleRate * length;
  var soundBuffer = audioCtx.createBuffer(channels, frameCount, sampleRate);
    
  for (var channel = 0; channel < channels; channel++) {
    var buffer = soundBuffer.getChannelData(channel);
    for (var i = 0; i < frameCount; i++) {
      buffer[i] = waveform(i/sampleRate);
    }
  }
  
  return soundBuffer;
}

function generateStereoSound(length, waveleft, waveright) {
  var channels = 2;
  var sampleRate = audioCtx.sampleRate;
  var frameCount = sampleRate * length;
  var soundBuffer = audioCtx.createBuffer(channels, frameCount, sampleRate);
  
  var buffer0 = soundBuffer.getChannelData(0);
  var buffer1 = soundBuffer.getChannelData(1);
  
  for (var i = 0; i < frameCount; i++) {
    buffer0[i] = waveleft(i/sampleRate);
    buffer1[i] = waveright(i/sampleRate);
  }
  
  return soundBuffer;
}

function generateEnvelopeSound(envelope, waveform) {
  var channels = 2;
  var sampleRate = audioCtx.sampleRate;
  var frameCount = sampleRate * (envelope.attack + envelope.decay + envelope.hold + envelope.release);
  var soundBuffer = audioCtx.createBuffer(channels, frameCount, sampleRate);
    
  for (var channel = 0; channel < channels; channel++) {
    var buffer = soundBuffer.getChannelData(channel);
    for (var i = 0; i < frameCount; i++) {
      buffer[i] = envelope(i/sampleRate)*waveform(i/sampleRate);
    }
  }
  
  return soundBuffer;
}

function sine(frequency, modulo) {
  function waveform(i) {
    return Math.sin(frequency * 2 * Math.PI * i + modulo(i));
  }
  
  return waveform;
}

function sawtooth(frequency, modulo) {
  function waveform(i) {
    return (frequency * 2 * i + modulo(i)) % 2 - 1;
  }
  
  return waveform;
}

function triangle(frequency, modulo) {
  function waveform(i) {
    return Math.abs((frequency * 2 * i + modulo(i)) % 2 - 1)*2 - 1;
  }
  
  return waveform;
}

function square(frequency) {
  function waveform(i) {
    var temp = (frequency * 2 * i + modulo(i))% 2 - 1;
    
    if (temp > 0) return 1;
    else return -1;
  }
  
  return waveform;
}

function random() {
  function waveform(i) {
    return Math.random()*2 - 1;
  }
  
  return waveform;
}

function zero() {
  function waveform(i) {
    return 0;
  }
  
  return waveform;
}

function makeEnvelope(attack, decay, hold, sustain, release) {
  function envelope(i) {
    if (i < attack) {
      return i/attack;
    }
    else if (i < attack + decay) {
      return 1 - (1-sustain)*(i-attack)/decay;
    }
    else if (i < attack + decay + hold) {
      return sustain;
    }
    else {
      return sustain*(attack + decay + hold + release - i)/release;
    }
  }
  
  envelope["attack"] = attack;
  envelope["decay"] = decay;
  envelope["hold"] = hold;
  envelope["release"] = release;
  
  return envelope;
}

function playSound(buffer) {
  var source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start(0);
}