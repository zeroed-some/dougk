// Web Audio API sound synthesis for dougk

let audioContext = null
let unlocked = false

function getContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Must be called on first user interaction to enable audio on mobile
export function unlockAudio() {
  if (unlocked) return
  unlocked = true // Set immediately to prevent multiple attempts

  // Create context fresh during user gesture (mobile requirement)
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }

  const ctx = audioContext

  // Resume synchronously - don't wait for promise
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  // Immediately play a sound to force audio pipeline open
  // Must happen synchronously in the user gesture
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.value = 200
    gain.gain.value = 0.001 // Nearly silent

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(0)
    osc.stop(ctx.currentTime + 0.1)
  } catch (e) {
    console.warn('Unlock sound failed:', e)
  }
}

// Damp crunch sound - wet bread being chomped
export function playMonch() {
  const ctx = getContext()

  // Try to resume if needed, but don't block
  if (ctx.state === 'suspended') {
    ctx.resume()
  }

  const now = ctx.currentTime

  // Master output - keep it gentle
  const master = ctx.createGain()
  master.gain.value = 0.25
  master.connect(ctx.destination)

  // High-pass to remove speaker-popping low frequencies
  const highPass = ctx.createBiquadFilter()
  highPass.type = 'highpass'
  highPass.frequency.value = 150
  highPass.connect(master)

  // Create multiple small crunch "grains" for texture
  const grainCount = 5
  for (let i = 0; i < grainCount; i++) {
    const delay = i * 0.018 + Math.random() * 0.01
    const grainTime = now + delay

    // Each grain is a short filtered noise burst
    const grainLength = 0.04 + Math.random() * 0.03
    const bufferSize = Math.floor(ctx.sampleRate * grainLength)
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)

    // Softer noise - not full amplitude
    for (let j = 0; j < bufferSize; j++) {
      noiseData[j] = (Math.random() * 2 - 1) * 0.7
    }

    const grain = ctx.createBufferSource()
    grain.buffer = noiseBuffer

    // Bandpass for crunch character - varied per grain
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 300 + Math.random() * 400
    filter.Q.value = 2 + Math.random() * 2

    // Gentle envelope - no sharp attacks
    const env = ctx.createGain()
    const peakGain = 0.3 + Math.random() * 0.2
    env.gain.setValueAtTime(0, grainTime)
    env.gain.linearRampToValueAtTime(peakGain, grainTime + 0.008) // Soft attack
    env.gain.linearRampToValueAtTime(peakGain * 0.6, grainTime + 0.02)
    env.gain.linearRampToValueAtTime(0, grainTime + grainLength) // Soft release

    grain.connect(filter)
    filter.connect(env)
    env.connect(highPass)

    grain.start(grainTime)
    grain.stop(grainTime + grainLength)
  }

  // Soft muffled "body" of the bite - no harsh transients
  const bodyLength = 0.12
  const bodyBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * bodyLength), ctx.sampleRate)
  const bodyData = bodyBuffer.getChannelData(0)
  for (let i = 0; i < bodyData.length; i++) {
    bodyData[i] = (Math.random() * 2 - 1) * 0.5
  }

  const body = ctx.createBufferSource()
  body.buffer = bodyBuffer

  // Heavy lowpass for muffled wet sound
  const wetFilter = ctx.createBiquadFilter()
  wetFilter.type = 'lowpass'
  wetFilter.frequency.setValueAtTime(600, now)
  wetFilter.frequency.linearRampToValueAtTime(200, now + 0.1)
  wetFilter.Q.value = 1

  const bodyEnv = ctx.createGain()
  bodyEnv.gain.setValueAtTime(0, now)
  bodyEnv.gain.linearRampToValueAtTime(0.25, now + 0.02) // Gentle attack
  bodyEnv.gain.linearRampToValueAtTime(0.15, now + 0.05)
  bodyEnv.gain.linearRampToValueAtTime(0, now + bodyLength)

  body.connect(wetFilter)
  wetFilter.connect(bodyEnv)
  bodyEnv.connect(highPass)

  body.start(now)
  body.stop(now + bodyLength)

  // Tonal body - soft pitched "chomp" character
  // Primary tone - warm mid frequency
  const tone1 = ctx.createOscillator()
  tone1.type = 'triangle'
  tone1.frequency.setValueAtTime(280, now)
  tone1.frequency.linearRampToValueAtTime(180, now + 0.08)

  const tone1Env = ctx.createGain()
  tone1Env.gain.setValueAtTime(0, now)
  tone1Env.gain.linearRampToValueAtTime(0.12, now + 0.015) // Soft attack
  tone1Env.gain.linearRampToValueAtTime(0.06, now + 0.05)
  tone1Env.gain.linearRampToValueAtTime(0, now + 0.1)

  tone1.connect(tone1Env)
  tone1Env.connect(highPass)
  tone1.start(now)
  tone1.stop(now + 0.12)

  // Secondary harmonic - adds richness
  const tone2 = ctx.createOscillator()
  tone2.type = 'sine'
  tone2.frequency.setValueAtTime(420, now)
  tone2.frequency.linearRampToValueAtTime(300, now + 0.06)

  const tone2Env = ctx.createGain()
  tone2Env.gain.setValueAtTime(0, now)
  tone2Env.gain.linearRampToValueAtTime(0.06, now + 0.01)
  tone2Env.gain.linearRampToValueAtTime(0, now + 0.07)

  tone2.connect(tone2Env)
  tone2Env.connect(highPass)
  tone2.start(now)
  tone2.stop(now + 0.1)

  // Soft low "gulp" undertone - filtered to be safe
  const gulp = ctx.createOscillator()
  gulp.type = 'sine'
  gulp.frequency.setValueAtTime(200, now + 0.02)
  gulp.frequency.linearRampToValueAtTime(160, now + 0.1)

  const gulpEnv = ctx.createGain()
  gulpEnv.gain.setValueAtTime(0, now)
  gulpEnv.gain.linearRampToValueAtTime(0, now + 0.02) // Delayed start
  gulpEnv.gain.linearRampToValueAtTime(0.08, now + 0.04)
  gulpEnv.gain.linearRampToValueAtTime(0, now + 0.12)

  gulp.connect(gulpEnv)
  gulpEnv.connect(highPass)
  gulp.start(now)
  gulp.stop(now + 0.15)
}

// Koi capture sound - magical sparkle pop
export function playCapture() {
  const ctx = getContext()
  if (ctx.state === 'suspended') ctx.resume()

  const now = ctx.currentTime

  const master = ctx.createGain()
  master.gain.value = 0.3
  master.connect(ctx.destination)

  // Rising sparkle tones
  const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq

    const env = ctx.createGain()
    const startTime = now + i * 0.05
    env.gain.setValueAtTime(0, startTime)
    env.gain.linearRampToValueAtTime(0.15, startTime + 0.02)
    env.gain.linearRampToValueAtTime(0, startTime + 0.15)

    osc.connect(env)
    env.connect(master)
    osc.start(startTime)
    osc.stop(startTime + 0.2)
  })

  // Soft pop at the end
  const popOsc = ctx.createOscillator()
  popOsc.type = 'sine'
  popOsc.frequency.setValueAtTime(400, now + 0.15)
  popOsc.frequency.linearRampToValueAtTime(200, now + 0.25)

  const popEnv = ctx.createGain()
  popEnv.gain.setValueAtTime(0, now + 0.15)
  popEnv.gain.linearRampToValueAtTime(0.2, now + 0.17)
  popEnv.gain.linearRampToValueAtTime(0, now + 0.3)

  popOsc.connect(popEnv)
  popEnv.connect(master)
  popOsc.start(now + 0.15)
  popOsc.stop(now + 0.35)
}

// Purchase/coin sound - satisfying cha-ching
export function playPurchase() {
  const ctx = getContext()
  if (ctx.state === 'suspended') ctx.resume()

  const now = ctx.currentTime

  const master = ctx.createGain()
  master.gain.value = 0.25
  master.connect(ctx.destination)

  // High bell tone
  const bell1 = ctx.createOscillator()
  bell1.type = 'sine'
  bell1.frequency.value = 1200

  const bell1Env = ctx.createGain()
  bell1Env.gain.setValueAtTime(0.3, now)
  bell1Env.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

  bell1.connect(bell1Env)
  bell1Env.connect(master)
  bell1.start(now)
  bell1.stop(now + 0.35)

  // Second bell tone (slightly delayed)
  const bell2 = ctx.createOscillator()
  bell2.type = 'sine'
  bell2.frequency.value = 1600

  const bell2Env = ctx.createGain()
  bell2Env.gain.setValueAtTime(0, now)
  bell2Env.gain.setValueAtTime(0.25, now + 0.08)
  bell2Env.gain.exponentialRampToValueAtTime(0.01, now + 0.35)

  bell2.connect(bell2Env)
  bell2Env.connect(master)
  bell2.start(now)
  bell2.stop(now + 0.4)

  // Metallic shimmer (noise burst)
  const shimmerLength = 0.15
  const shimmerBuffer = ctx.createBuffer(1, ctx.sampleRate * shimmerLength, ctx.sampleRate)
  const shimmerData = shimmerBuffer.getChannelData(0)
  for (let i = 0; i < shimmerData.length; i++) {
    shimmerData[i] = (Math.random() * 2 - 1) * 0.3
  }

  const shimmer = ctx.createBufferSource()
  shimmer.buffer = shimmerBuffer

  const shimmerFilter = ctx.createBiquadFilter()
  shimmerFilter.type = 'highpass'
  shimmerFilter.frequency.value = 3000

  const shimmerEnv = ctx.createGain()
  shimmerEnv.gain.setValueAtTime(0.15, now)
  shimmerEnv.gain.linearRampToValueAtTime(0, now + shimmerLength)

  shimmer.connect(shimmerFilter)
  shimmerFilter.connect(shimmerEnv)
  shimmerEnv.connect(master)
  shimmer.start(now)
  shimmer.stop(now + shimmerLength)
}

// Shop open sound - friendly chime
export function playShopOpen() {
  const ctx = getContext()
  if (ctx.state === 'suspended') ctx.resume()

  const now = ctx.currentTime

  const master = ctx.createGain()
  master.gain.value = 0.2
  master.connect(ctx.destination)

  // Ascending arpeggio - warm and inviting
  const notes = [392, 494, 587, 784] // G4, B4, D5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = freq

    const env = ctx.createGain()
    const startTime = now + i * 0.08
    env.gain.setValueAtTime(0, startTime)
    env.gain.linearRampToValueAtTime(0.2, startTime + 0.03)
    env.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4)

    osc.connect(env)
    env.connect(master)
    osc.start(startTime)
    osc.stop(startTime + 0.45)
  })
}

// Shop close sound - gentle descending tone
export function playShopClose() {
  const ctx = getContext()
  if (ctx.state === 'suspended') ctx.resume()

  const now = ctx.currentTime

  const master = ctx.createGain()
  master.gain.value = 0.15
  master.connect(ctx.destination)

  // Single soft descending tone
  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(600, now)
  osc.frequency.linearRampToValueAtTime(400, now + 0.2)

  const env = ctx.createGain()
  env.gain.setValueAtTime(0.2, now)
  env.gain.linearRampToValueAtTime(0, now + 0.25)

  osc.connect(env)
  env.connect(master)
  osc.start(now)
  osc.stop(now + 0.3)
}

// Dialog blip sound - for typewriter text
export function playDialogBlip() {
  const ctx = getContext()
  if (ctx.state === 'suspended') ctx.resume()

  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  osc.type = 'square'
  osc.frequency.value = 440 + Math.random() * 60 // Slight variation

  const env = ctx.createGain()
  env.gain.setValueAtTime(0.08, now)
  env.gain.linearRampToValueAtTime(0, now + 0.04)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1000

  osc.connect(filter)
  filter.connect(env)
  env.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.05)
}

// Placement confirm sound - solid thunk
export function playPlaceBuilding() {
  const ctx = getContext()
  if (ctx.state === 'suspended') ctx.resume()

  const now = ctx.currentTime

  const master = ctx.createGain()
  master.gain.value = 0.25
  master.connect(ctx.destination)

  // Low thump
  const thump = ctx.createOscillator()
  thump.type = 'sine'
  thump.frequency.setValueAtTime(150, now)
  thump.frequency.linearRampToValueAtTime(60, now + 0.1)

  const thumpEnv = ctx.createGain()
  thumpEnv.gain.setValueAtTime(0.4, now)
  thumpEnv.gain.linearRampToValueAtTime(0, now + 0.15)

  thump.connect(thumpEnv)
  thumpEnv.connect(master)
  thump.start(now)
  thump.stop(now + 0.2)

  // Wood knock overtone
  const knock = ctx.createOscillator()
  knock.type = 'triangle'
  knock.frequency.setValueAtTime(300, now)
  knock.frequency.linearRampToValueAtTime(200, now + 0.05)

  const knockEnv = ctx.createGain()
  knockEnv.gain.setValueAtTime(0.2, now)
  knockEnv.gain.linearRampToValueAtTime(0, now + 0.08)

  knock.connect(knockEnv)
  knockEnv.connect(master)
  knock.start(now)
  knock.stop(now + 0.1)
}
