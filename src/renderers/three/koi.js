// Koi fish - natural swimmers that are attracted to bread and can be captured
import * as THREE from 'three'
import gameState from './gameState.js'
import { playCapture } from './sounds.js'

export function createKoiSchool(scene, gradientMap, pondRadius) {
  const group = new THREE.Group()
  const kois = []
  const koiCount = 5

  // Sparkle particles for capture effect
  const sparkles = []
  const sparkleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true
  })

  function createCaptureSparkles(x, y, z) {
    const particleCount = 12
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const upAngle = Math.random() * Math.PI * 0.5

      const sparkleGeom = new THREE.OctahedronGeometry(0.06)
      const sparkle = new THREE.Mesh(sparkleGeom, sparkleMaterial.clone())
      sparkle.position.set(x, y + 0.1, z)

      // Random velocity outward and upward
      const speed = 1.5 + Math.random() * 1
      sparkle.userData = {
        vx: Math.cos(angle) * Math.cos(upAngle) * speed,
        vy: Math.sin(upAngle) * speed + 1,
        vz: Math.sin(angle) * Math.cos(upAngle) * speed,
        age: 0,
        maxAge: 0.6 + Math.random() * 0.3,
        rotSpeed: (Math.random() - 0.5) * 10
      }

      group.add(sparkle)
      sparkles.push(sparkle)
    }
  }

  function updateSparkles(delta) {
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const sparkle = sparkles[i]
      const d = sparkle.userData

      d.age += delta
      const progress = d.age / d.maxAge

      // Move
      sparkle.position.x += d.vx * delta
      sparkle.position.y += d.vy * delta
      sparkle.position.z += d.vz * delta

      // Gravity
      d.vy -= 4 * delta

      // Spin
      sparkle.rotation.x += d.rotSpeed * delta
      sparkle.rotation.y += d.rotSpeed * delta

      // Fade and shrink
      sparkle.material.opacity = 1 - progress
      sparkle.scale.setScalar(1 - progress * 0.5)

      // Remove when done
      if (d.age >= d.maxAge) {
        group.remove(sparkle)
        sparkle.geometry.dispose()
        sparkle.material.dispose()
        sparkles.splice(i, 1)
      }
    }
  }

  // Koi color variations
  const koiColors = [
    { body: 0xff6b35, spots: 0xffffff },  // Orange with white
    { body: 0xffffff, spots: 0xff4444 },  // White with red
    { body: 0xffaa00, spots: 0x222222 },  // Gold with black
    { body: 0xff3333, spots: 0xffffff },  // Red with white
    { body: 0xffd700, spots: 0xff6600 },  // Golden
  ]

  for (let i = 0; i < koiCount; i++) {
    const koi = createKoi(gradientMap, koiColors[i % koiColors.length])

    // Random starting position and direction
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * pondRadius * 0.6 + pondRadius * 0.1

    koi.group.position.set(
      Math.cos(angle) * dist,
      -0.08,
      Math.sin(angle) * dist
    )

    // Face a random direction to start
    koi.group.rotation.y = Math.random() * Math.PI * 2

    koi.state = {
      speed: 0.3 + Math.random() * 0.3,
      turnRate: 0,
      targetTurnRate: 0,
      turnTimer: Math.random() * 3,
      flickerPhase: Math.random() * Math.PI * 2,
      // Attraction state
      attractedTo: null, // { x, z } of bread attracting this koi
      // Capture state
      captured: false,
      beingCaptured: false,
      captureProgress: 0,
      respawnTimer: 0,
      originalScale: 0.9
    }

    group.add(koi.group)
    kois.push(koi)
  }

  scene.add(group)

  function createKoi(gradientMap, colors) {
    const koiGroup = new THREE.Group()

    const bodyMaterial = new THREE.MeshToonMaterial({
      color: colors.body,
      gradientMap: gradientMap
    })

    const spotMaterial = new THREE.MeshToonMaterial({
      color: colors.spots,
      gradientMap: gradientMap
    })

    // Body - elongated oval, facing +Z
    const bodyGeom = new THREE.SphereGeometry(0.1, 6, 4)
    bodyGeom.scale(0.7, 0.5, 1.8) // Long along Z
    const body = new THREE.Mesh(bodyGeom, bodyMaterial)
    koiGroup.add(body)

    // Head - at +Z end
    const headGeom = new THREE.SphereGeometry(0.07, 5, 4)
    headGeom.scale(0.9, 0.7, 1)
    const head = new THREE.Mesh(headGeom, bodyMaterial)
    head.position.set(0, 0.01, 0.18)
    koiGroup.add(head)

    // Tail fin - at -Z end
    const tailGeom = new THREE.ConeGeometry(0.06, 0.15, 4)
    tailGeom.rotateX(Math.PI / 2) // Point along Z
    const tail = new THREE.Mesh(tailGeom, bodyMaterial)
    tail.position.set(0, 0, -0.22)
    koiGroup.add(tail)

    // Spots on top
    const spotCount = 2 + Math.floor(Math.random() * 2)
    for (let i = 0; i < spotCount; i++) {
      const spotGeom = new THREE.SphereGeometry(0.03 + Math.random() * 0.02, 4, 3)
      const spot = new THREE.Mesh(spotGeom, spotMaterial)
      spot.position.set(
        (Math.random() - 0.5) * 0.06,
        0.04,
        (Math.random() - 0.5) * 0.12
      )
      spot.scale.y = 0.4
      koiGroup.add(spot)
    }

    // Dorsal fin
    const dorsalGeom = new THREE.ConeGeometry(0.02, 0.06, 3)
    const dorsal = new THREE.Mesh(dorsalGeom, bodyMaterial)
    dorsal.position.set(0, 0.055, -0.03)
    koiGroup.add(dorsal)

    // Scale the whole koi
    koiGroup.scale.setScalar(0.9)

    return { group: koiGroup, tail }
  }

  // Attract koi to nearby bread - replaces panic behavior
  function attractToBread(breadBits) {
    for (const koi of kois) {
      if (koi.state.captured || koi.state.beingCaptured) continue

      // Find nearest bread
      let nearestBread = null
      let nearestDist = 2.5 // Attraction radius

      for (const bread of breadBits) {
        const dist = Math.hypot(
          koi.group.position.x - bread.x,
          koi.group.position.z - bread.z
        )
        if (dist < nearestDist) {
          nearestDist = dist
          nearestBread = bread
        }
      }

      koi.state.attractedTo = nearestBread
    }
  }

  // Legacy panic trigger - keep for ripple effects but make koi scatter briefly
  function triggerPanic(x, z) {
    // Now just a brief scatter, not sustained panic
    for (const koi of kois) {
      if (koi.state.captured || koi.state.beingCaptured) continue

      const dist = Math.hypot(
        koi.group.position.x - x,
        koi.group.position.z - z
      )

      if (dist < 0.8) {
        // Brief scatter only when bread lands very close
        koi.state.attractedTo = null
        // Turn slightly away then resume
        const awayAngle = Math.atan2(
          koi.group.position.x - x,
          koi.group.position.z - z
        )
        let turnNeeded = awayAngle - koi.group.rotation.y
        while (turnNeeded > Math.PI) turnNeeded -= Math.PI * 2
        while (turnNeeded < -Math.PI) turnNeeded += Math.PI * 2
        koi.state.targetTurnRate = Math.sign(turnNeeded) * 2
        koi.state.turnTimer = 0.3 // Brief scatter
      }
    }
  }

  // Get koi under a given position (for capture detection)
  function getKoiUnderPosition(x, z, radius = 0.3) {
    for (const koi of kois) {
      if (koi.state.captured || koi.state.beingCaptured) continue

      const dist = Math.hypot(
        koi.group.position.x - x,
        koi.group.position.z - z
      )

      if (dist < radius) {
        return koi
      }
    }
    return null
  }

  // Start capturing a koi
  function startCapture(koi) {
    if (!koi || koi.state.captured || koi.state.beingCaptured) return false
    koi.state.beingCaptured = true
    koi.state.captureProgress = 0
    koi.state.attractedTo = null
    return true
  }

  // Update capture progress - returns true if capture completes
  function updateCapture(koi, delta) {
    if (!koi || !koi.state.beingCaptured) return false

    koi.state.captureProgress += delta / 0.8 // 0.8 seconds to capture

    // Scale down and wiggle during capture
    const scale = koi.state.originalScale * (1 - koi.state.captureProgress * 0.3)
    koi.group.scale.setScalar(Math.max(scale, 0.4))

    // Wiggle/struggle effect
    koi.group.rotation.z = Math.sin(koi.state.captureProgress * 20) * 0.3

    if (koi.state.captureProgress >= 1) {
      completeCapture(koi)
      return true
    }
    return false
  }

  // Cancel capture in progress
  function cancelCapture(koi) {
    if (!koi || !koi.state.beingCaptured) return
    koi.state.beingCaptured = false
    koi.state.captureProgress = 0
    koi.group.scale.setScalar(koi.state.originalScale)
    koi.group.rotation.z = 0
  }

  // Complete capture - hide koi and schedule respawn
  function completeCapture(koi) {
    // Spawn sparkles at koi position before hiding
    const pos = koi.group.position
    createCaptureSparkles(pos.x, pos.y, pos.z)

    koi.state.captured = true
    koi.state.beingCaptured = false
    koi.state.captureProgress = 0
    koi.group.visible = false

    // Schedule respawn
    koi.state.respawnTimer = 8 + Math.random() * 12 // 8-20 seconds

    // Add to game state and play sound
    gameState.addKoi(1)
    playCapture()
  }

  // Respawn a captured koi
  function respawnKoi(koi) {
    koi.state.captured = false
    koi.group.visible = true
    koi.group.scale.setScalar(koi.state.originalScale)
    koi.group.rotation.z = 0

    // Random new position
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * pondRadius * 0.6 + pondRadius * 0.1
    koi.group.position.set(
      Math.cos(angle) * dist,
      -0.08,
      Math.sin(angle) * dist
    )
    koi.group.rotation.y = Math.random() * Math.PI * 2
  }

  function update(delta, elapsed) {
    for (const koi of kois) {
      const s = koi.state
      const pos = koi.group.position

      // Handle respawn timer
      if (s.captured) {
        s.respawnTimer -= delta
        if (s.respawnTimer <= 0) {
          respawnKoi(koi)
        }
        continue
      }

      // Skip movement if being captured
      if (s.beingCaptured) {
        continue
      }

      // Decide turning behavior
      s.turnTimer -= delta

      // If attracted to bread, swim toward it
      if (s.attractedTo) {
        const toBreakX = s.attractedTo.x - pos.x
        const toBreadZ = s.attractedTo.z - pos.z
        const distToBread = Math.hypot(toBreakX, toBreadZ)

        if (distToBread < 0.15) {
          // Very close to bread - slow down and circle
          s.targetTurnRate = 0.3
          s.speed = 0.1
        } else {
          // Swim toward bread
          const toBreadAngle = Math.atan2(toBreakX, toBreadZ)
          let turnNeeded = toBreadAngle - koi.group.rotation.y
          while (turnNeeded > Math.PI) turnNeeded -= Math.PI * 2
          while (turnNeeded < -Math.PI) turnNeeded += Math.PI * 2

          s.targetTurnRate = Math.sign(turnNeeded) * Math.min(Math.abs(turnNeeded) * 2, 2)
          s.speed = 0.4 + Math.min(distToBread * 0.2, 0.3) // Faster when far
        }
      } else {
        // Natural wandering behavior
        if (s.turnTimer <= 0) {
          s.targetTurnRate = (Math.random() - 0.5) * 1.5
          s.turnTimer = 1 + Math.random() * 3
          s.speed = 0.3 + Math.random() * 0.3
        }
      }

      // Check if heading toward pond edge
      const distFromCenter = Math.hypot(pos.x, pos.z)
      if (distFromCenter > pondRadius * 0.75) {
        const toCenter = Math.atan2(-pos.x, -pos.z)
        let turnNeeded = toCenter - koi.group.rotation.y
        while (turnNeeded > Math.PI) turnNeeded -= Math.PI * 2
        while (turnNeeded < -Math.PI) turnNeeded += Math.PI * 2
        s.targetTurnRate = Math.sign(turnNeeded) * 1.5
      }

      // Smooth turn rate changes
      s.turnRate += (s.targetTurnRate - s.turnRate) * delta * 2

      // Apply rotation
      koi.group.rotation.y += s.turnRate * delta

      // Move forward
      const forwardX = Math.sin(koi.group.rotation.y)
      const forwardZ = Math.cos(koi.group.rotation.y)
      pos.x += forwardX * s.speed * delta
      pos.z += forwardZ * s.speed * delta

      // Tail wiggle
      const wiggleSpeed = s.attractedTo ? 14 : 10
      const wiggleAmount = s.attractedTo ? 0.35 : 0.25
      koi.tail.rotation.y = Math.sin(elapsed * wiggleSpeed + s.flickerPhase) * wiggleAmount

      // Gentle vertical bob
      pos.y = -0.08 + Math.sin(elapsed * 2.5 + s.flickerPhase) * 0.008

      // Hard clamp to pond bounds
      const currentDist = Math.hypot(pos.x, pos.z)
      if (currentDist > pondRadius * 0.88) {
        const scale = (pondRadius * 0.85) / currentDist
        pos.x *= scale
        pos.z *= scale
      }
    }

    // Update sparkle particles
    updateSparkles(delta)
  }

  return {
    group,
    update,
    triggerPanic,
    attractToBread,
    getKoiUnderPosition,
    startCapture,
    updateCapture,
    cancelCapture,
    getKois: () => kois.filter(k => !k.state.captured).map(k => k.group)
  }
}
