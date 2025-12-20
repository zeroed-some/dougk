// Koi fish - rapid flickering swimmers that react to bread
import * as THREE from 'three'

export function createKoiSchool(scene, gradientMap, pondRadius) {
  const group = new THREE.Group()
  const kois = []
  const koiCount = 5

  // Koi color variations
  const koiColors = [
    { body: 0xff6b35, spots: 0xffffff },  // Orange with white
    { body: 0xffffff, spots: 0xff4444 },  // White with red
    { body: 0xffaa00, spots: 0x000000 },  // Gold with black
    { body: 0xff3333, spots: 0xffffff },  // Red with white
    { body: 0xffd700, spots: 0xff6600 },  // Golden
  ]

  for (let i = 0; i < koiCount; i++) {
    const koi = createKoi(gradientMap, koiColors[i % koiColors.length])

    // Random starting position
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * pondRadius * 0.7 + pondRadius * 0.1
    koi.group.position.set(
      Math.cos(angle) * dist,
      -0.08, // Just below water surface
      Math.sin(angle) * dist
    )
    koi.group.rotation.y = Math.random() * Math.PI * 2

    koi.state = {
      targetX: koi.group.position.x,
      targetZ: koi.group.position.z,
      baseSpeed: 0.8 + Math.random() * 1.2,
      speed: 0.8 + Math.random() * 1.2,
      turnSpeed: 2 + Math.random() * 3,
      flickerPhase: Math.random() * Math.PI * 2,
      panicTimer: 0,
      panicMode: false,
      wanderTimer: Math.random() * 3,
      // Independent personality
      restlessness: 0.3 + Math.random() * 0.7, // How often they change direction
      curiosity: Math.random(), // Likelihood to investigate bread vs flee
      sociability: Math.random() * 0.5, // How much they follow others
      idleTimer: 0,
      isIdle: false,
      idleDuration: 0
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

    // Body - elongated oval
    const bodyGeom = new THREE.SphereGeometry(0.12, 6, 4)
    bodyGeom.scale(2, 0.6, 0.8)
    const body = new THREE.Mesh(bodyGeom, bodyMaterial)
    koiGroup.add(body)

    // Head
    const headGeom = new THREE.SphereGeometry(0.08, 5, 4)
    headGeom.scale(1.2, 0.8, 1)
    const head = new THREE.Mesh(headGeom, bodyMaterial)
    head.position.set(0.2, 0, 0)
    koiGroup.add(head)

    // Tail fin
    const tailGeom = new THREE.ConeGeometry(0.08, 0.18, 4)
    const tail = new THREE.Mesh(tailGeom, bodyMaterial)
    tail.position.set(-0.28, 0, 0)
    tail.rotation.z = Math.PI / 2
    koiGroup.add(tail)

    // Spots (2-3 random spots)
    const spotCount = 2 + Math.floor(Math.random() * 2)
    for (let i = 0; i < spotCount; i++) {
      const spotGeom = new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 4, 3)
      const spot = new THREE.Mesh(spotGeom, spotMaterial)
      spot.position.set(
        (Math.random() - 0.5) * 0.2,
        0.04,
        (Math.random() - 0.5) * 0.08
      )
      spot.scale.y = 0.5
      koiGroup.add(spot)
    }

    // Dorsal fin
    const dorsalGeom = new THREE.ConeGeometry(0.03, 0.08, 3)
    const dorsal = new THREE.Mesh(dorsalGeom, bodyMaterial)
    dorsal.position.set(-0.05, 0.06, 0)
    dorsal.rotation.z = -0.3
    koiGroup.add(dorsal)

    // Scale down the whole koi
    koiGroup.scale.setScalar(0.8)

    return { group: koiGroup, body, tail }
  }

  function pickNewTarget(koi, pondRadius, avoidX, avoidZ) {
    let attempts = 0
    let x, z

    do {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * pondRadius * 0.7 + pondRadius * 0.1
      x = Math.cos(angle) * dist
      z = Math.sin(angle) * dist
      attempts++
    } while (
      avoidX !== undefined &&
      Math.hypot(x - avoidX, z - avoidZ) < 1.5 &&
      attempts < 10
    )

    koi.state.targetX = x
    koi.state.targetZ = z
  }

  function triggerPanic(x, z) {
    for (const koi of kois) {
      const dist = Math.hypot(
        koi.group.position.x - x,
        koi.group.position.z - z
      )

      if (dist < 1.5) {
        koi.state.panicMode = true
        koi.state.panicTimer = 0.8 + Math.random() * 0.6 // Shorter panic
        koi.state.speed = koi.state.baseSpeed * 2 // Just double speed, not crazy fast

        // Flee away from the bread - but keep it smooth
        const fleeAngle = Math.atan2(
          koi.group.position.z - z,
          koi.group.position.x - x
        )
        const fleeDist = pondRadius * 0.5 + Math.random() * pondRadius * 0.3
        koi.state.targetX = Math.cos(fleeAngle) * fleeDist
        koi.state.targetZ = Math.sin(fleeAngle) * fleeDist

        // Clamp to pond
        const targetDist = Math.hypot(koi.state.targetX, koi.state.targetZ)
        if (targetDist > pondRadius * 0.85) {
          koi.state.targetX *= (pondRadius * 0.85) / targetDist
          koi.state.targetZ *= (pondRadius * 0.85) / targetDist
        }
      }
    }
  }

  function update(delta, elapsed) {
    for (const koi of kois) {
      const s = koi.state

      // Update panic timer
      if (s.panicMode) {
        s.panicTimer -= delta
        if (s.panicTimer <= 0) {
          s.panicMode = false
          s.speed = s.baseSpeed
        }
      }

      // Idle behavior - sometimes koi just stop and chill
      if (s.isIdle) {
        s.idleTimer -= delta
        if (s.idleTimer <= 0) {
          s.isIdle = false
          pickNewTarget(koi, pondRadius)
        }
        // Gentle drifting while idle - still wiggle tail slowly
        koi.tail.rotation.y = Math.sin(elapsed * 3 + s.flickerPhase) * 0.15
        koi.group.position.y = -0.1 + Math.sin(elapsed * 2 + s.flickerPhase) * 0.008
        continue
      }

      // Wander behavior - each koi has its own rhythm
      s.wanderTimer -= delta
      if (s.wanderTimer <= 0 && !s.panicMode) {
        // Random chance to go idle
        if (Math.random() < 0.2) {
          s.isIdle = true
          s.idleTimer = 2 + Math.random() * 4
          s.wanderTimer = 0.5
          continue
        }

        // Sometimes follow another koi loosely (if sociable)
        if (Math.random() < s.sociability && kois.length > 1) {
          const otherKoi = kois[Math.floor(Math.random() * kois.length)]
          if (otherKoi !== koi) {
            // Head toward where they are, with some offset
            s.targetX = otherKoi.group.position.x + (Math.random() - 0.5) * 2
            s.targetZ = otherKoi.group.position.z + (Math.random() - 0.5) * 2
          }
        } else {
          pickNewTarget(koi, pondRadius)
        }

        // Longer wander intervals for more natural movement
        s.wanderTimer = 2 + Math.random() * 4
      }

      // Move toward target - smooth, natural swimming
      const dx = s.targetX - koi.group.position.x
      const dz = s.targetZ - koi.group.position.z
      const dist = Math.hypot(dx, dz)

      // Calculate target rotation - koi model faces +X, so use atan2(dz, dx)
      const targetRot = Math.atan2(dz, dx)

      // Very smooth rotation - fish don't turn sharply
      let rotDiff = targetRot - koi.group.rotation.y
      while (rotDiff > Math.PI) rotDiff -= Math.PI * 2
      while (rotDiff < -Math.PI) rotDiff += Math.PI * 2

      // Slower turn rate for natural movement
      const turnRate = s.panicMode ? 2.5 : 1.2
      koi.group.rotation.y += rotDiff * turnRate * delta

      // Move in the direction koi is facing (model faces +X, so use cos/sin)
      const moveSpeed = s.panicMode ? s.speed * 1.8 : s.speed * 0.5
      const moveX = Math.cos(koi.group.rotation.y) * moveSpeed * delta
      const moveZ = Math.sin(koi.group.rotation.y) * moveSpeed * delta
      koi.group.position.x += moveX
      koi.group.position.z += moveZ

      // Tail wiggle - proportional to speed
      const wiggleSpeed = s.panicMode ? 15 : 8
      const wiggleAmount = s.panicMode ? 0.4 : 0.3
      koi.tail.rotation.y = Math.sin(elapsed * wiggleSpeed + s.flickerPhase) * wiggleAmount

      // Reached close to target - pick new one
      if (dist < 0.3) {
        if (Math.random() < 0.25) {
          s.isIdle = true
          s.idleTimer = 1 + Math.random() * 3
        } else {
          pickNewTarget(koi, pondRadius)
        }
      }

      // Gentle depth variation - natural swimming motion
      koi.group.position.y = -0.08 + Math.sin(elapsed * 3 + s.flickerPhase) * 0.01

      // Keep in pond bounds - smooth turnaround
      const currentDist = Math.hypot(koi.group.position.x, koi.group.position.z)
      if (currentDist > pondRadius * 0.85) {
        // Steer back toward center
        s.targetX = (Math.random() - 0.5) * pondRadius * 0.5
        s.targetZ = (Math.random() - 0.5) * pondRadius * 0.5
      }
    }
  }

  return {
    group,
    update,
    triggerPanic,
    getKois: () => kois.map(k => k.group)
  }
}
