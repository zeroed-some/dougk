// Web Audio API sound synthesis for dougk

let audioContext = null

function getContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Damp crunch sound - wet bread being chomped
export function playMonch() {
  const ctx = getContext()
  const now = ctx.currentTime

  // Resume context if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  // Create noise buffer for the crunch texture
  const noiseLength = 0.15
  const bufferSize = ctx.sampleRate * noiseLength
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const noiseData = noiseBuffer.getChannelData(0)

  // Fill with noise
  for (let i = 0; i < bufferSize; i++) {
    noiseData[i] = Math.random() * 2 - 1
  }

  // Noise source
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuffer

  // Low-pass filter for the "damp" wet quality
  const dampFilter = ctx.createBiquadFilter()
  dampFilter.type = 'lowpass'
  dampFilter.frequency.setValueAtTime(800, now)
  dampFilter.frequency.exponentialRampToValueAtTime(300, now + 0.08)
  dampFilter.Q.value = 2

  // Bandpass for crunch character
  const crunchFilter = ctx.createBiquadFilter()
  crunchFilter.type = 'bandpass'
  crunchFilter.frequency.value = 400
  crunchFilter.Q.value = 1.5

  // Envelope for the noise burst
  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0, now)
  noiseGain.gain.linearRampToValueAtTime(0.4, now + 0.01) // Quick attack
  noiseGain.gain.exponentialRampToValueAtTime(0.15, now + 0.04) // Initial drop
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12) // Tail off

  // Low thump for the bite impact
  const thump = ctx.createOscillator()
  thump.type = 'sine'
  thump.frequency.setValueAtTime(120, now)
  thump.frequency.exponentialRampToValueAtTime(50, now + 0.06)

  const thumpGain = ctx.createGain()
  thumpGain.gain.setValueAtTime(0, now)
  thumpGain.gain.linearRampToValueAtTime(0.3, now + 0.005)
  thumpGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)

  // Secondary squelch - adds wetness
  const squelch = ctx.createOscillator()
  squelch.type = 'triangle'
  squelch.frequency.setValueAtTime(200, now)
  squelch.frequency.exponentialRampToValueAtTime(80, now + 0.05)

  const squelchGain = ctx.createGain()
  squelchGain.gain.setValueAtTime(0, now + 0.01)
  squelchGain.gain.linearRampToValueAtTime(0.15, now + 0.02)
  squelchGain.gain.exponentialRampToValueAtTime(0.01, now + 0.07)

  // Master output with slight compression feel
  const master = ctx.createGain()
  master.gain.value = 0.6

  // Connect noise chain
  noise.connect(dampFilter)
  dampFilter.connect(crunchFilter)
  crunchFilter.connect(noiseGain)
  noiseGain.connect(master)

  // Connect thump
  thump.connect(thumpGain)
  thumpGain.connect(master)

  // Connect squelch
  squelch.connect(squelchGain)
  squelchGain.connect(master)

  // Output
  master.connect(ctx.destination)

  // Play
  noise.start(now)
  noise.stop(now + noiseLength)
  thump.start(now)
  thump.stop(now + 0.1)
  squelch.start(now)
  squelch.stop(now + 0.08)
}
