// Koi fish - natural swimmers that react to bread
import * as THREE from 'three'

export function createKoiSchool(scene, gradientMap, pondRadius) {
  const group = new THREE.Group()
  const kois = []
  const koiCount = 5

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
      turnRate: 0,  // Current turning rate
      targetTurnRate: 0,
      turnTimer: Math.random() * 3,
      panicTimer: 0,
      flickerPhase: Math.random() * Math.PI * 2
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

  function triggerPanic(x, z) {
    for (const koi of kois) {
      const dist = Math.hypot(
        koi.group.position.x - x,
        koi.group.position.z - z
      )

      if (dist < 1.5) {
        koi.state.panicTimer = 1 + Math.random() * 0.5

        // Turn away from the disturbance
        const awayAngle = Math.atan2(
          koi.group.position.x - x,
          koi.group.position.z - z
        )
        // Set a strong turn toward the away direction
        let turnNeeded = awayAngle - koi.group.rotation.y
        while (turnNeeded > Math.PI) turnNeeded -= Math.PI * 2
        while (turnNeeded < -Math.PI) turnNeeded += Math.PI * 2
        koi.state.targetTurnRate = Math.sign(turnNeeded) * 3
      }
    }
  }

  function update(delta, elapsed) {
    for (const koi of kois) {
      const s = koi.state
      const pos = koi.group.position

      // Update panic
      const isPanicked = s.panicTimer > 0
      if (isPanicked) {
        s.panicTimer -= delta
      }

      // Decide turning behavior
      s.turnTimer -= delta
      if (s.turnTimer <= 0 && !isPanicked) {
        // Occasionally change turn rate for natural wandering
        s.targetTurnRate = (Math.random() - 0.5) * 1.5
        s.turnTimer = 1 + Math.random() * 3
      }

      // Check if heading toward pond edge
      const distFromCenter = Math.hypot(pos.x, pos.z)
      if (distFromCenter > pondRadius * 0.75) {
        // Calculate angle to center
        const toCenter = Math.atan2(-pos.x, -pos.z)
        let turnNeeded = toCenter - koi.group.rotation.y
        while (turnNeeded > Math.PI) turnNeeded -= Math.PI * 2
        while (turnNeeded < -Math.PI) turnNeeded += Math.PI * 2

        // Steer back toward center
        s.targetTurnRate = Math.sign(turnNeeded) * 1.5
      }

      // Smooth turn rate changes
      s.turnRate += (s.targetTurnRate - s.turnRate) * delta * 2

      // Apply rotation
      koi.group.rotation.y += s.turnRate * delta

      // Move forward (in the direction the fish is facing, which is +Z in local space)
      const speed = isPanicked ? s.speed * 2.5 : s.speed

      // Get forward direction from rotation
      const forwardX = Math.sin(koi.group.rotation.y)
      const forwardZ = Math.cos(koi.group.rotation.y)

      pos.x += forwardX * speed * delta
      pos.z += forwardZ * speed * delta

      // Tail wiggle - faster when moving fast
      const wiggleSpeed = isPanicked ? 18 : 10
      const wiggleAmount = isPanicked ? 0.4 : 0.25
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
  }

  return {
    group,
    update,
    triggerPanic,
    getKois: () => kois.map(k => k.group)
  }
}
