// Doug the Duck - 3D low-poly model with Wind Waker cel-shading
import * as THREE from 'three'
import { playMonch } from './sounds.js'

export function createDoug(scene, gradientMap) {
  const group = new THREE.Group()

  // Color palette - vibrant Wind Waker yellows
  const bodyColor = 0xffdc50 // Warm yellow
  const bodyHighlight = 0xfff0a0 // Light yellow
  const beakColor = 0xff9020 // Bright orange
  const eyeWhite = 0xffffff
  const eyePupil = 0x191410

  // Toon materials
  const bodyMaterial = new THREE.MeshToonMaterial({
    color: bodyColor,
    gradientMap: gradientMap
  })

  const highlightMaterial = new THREE.MeshToonMaterial({
    color: bodyHighlight,
    gradientMap: gradientMap
  })

  const beakMaterial = new THREE.MeshToonMaterial({
    color: beakColor,
    gradientMap: gradientMap
  })

  const eyeWhiteMaterial = new THREE.MeshToonMaterial({
    color: eyeWhite,
    gradientMap: gradientMap
  })

  const eyePupilMaterial = new THREE.MeshBasicMaterial({
    color: eyePupil
  })

  // Body - elongated pear shape using multiple parts
  // Main body (more oval, less ball)
  const bodyGeom = new THREE.SphereGeometry(0.42, 8, 6) // Lower poly for angular look
  bodyGeom.scale(1.4, 0.75, 0.9)
  const body = new THREE.Mesh(bodyGeom, bodyMaterial)
  body.position.y = 0.28
  body.rotation.z = 0.1 // Slight tilt forward
  group.add(body)

  // Rear bump (makes it pear-shaped)
  const rearGeom = new THREE.SphereGeometry(0.28, 6, 5)
  rearGeom.scale(1, 0.8, 0.9)
  const rear = new THREE.Mesh(rearGeom, bodyMaterial)
  rear.position.set(-0.35, 0.22, 0)
  group.add(rear)

  // Chest puff (front bump)
  const chestGeom = new THREE.SphereGeometry(0.25, 6, 5)
  chestGeom.scale(0.8, 0.9, 0.85)
  const chest = new THREE.Mesh(chestGeom, highlightMaterial)
  chest.position.set(0.25, 0.32, 0)
  group.add(chest)

  // Subtle feather tufts on body (toned down)
  const tuftMaterial = bodyMaterial
  const featherPositions = [
    { x: -0.38, y: 0.44, z: 0.1, rx: 0.2, rz: 0.3 },
    { x: -0.38, y: 0.44, z: -0.1, rx: -0.2, rz: 0.3 },
  ]

  for (const f of featherPositions) {
    const featherGeom = new THREE.ConeGeometry(0.04, 0.12, 4)
    const feather = new THREE.Mesh(featherGeom, tuftMaterial)
    feather.position.set(f.x, f.y, f.z)
    feather.rotation.x = f.rx
    feather.rotation.z = f.rz
    group.add(feather)
  }

  // Tail feathers - subtle curl up
  const tailGroup = new THREE.Group()
  const tailFeathers = [
    { x: -0.55, y: 0.36, z: 0, rx: 1.6, rz: 0, scale: 1.0 },
    { x: -0.52, y: 0.40, z: 0.08, rx: 1.4, rz: 0.2, scale: 0.7 },
    { x: -0.52, y: 0.40, z: -0.08, rx: 1.4, rz: -0.2, scale: 0.7 },
  ]

  for (const t of tailFeathers) {
    const tailGeom = new THREE.ConeGeometry(0.04, 0.18, 4)
    const tail = new THREE.Mesh(tailGeom, bodyMaterial)
    tail.position.set(t.x, t.y, t.z)
    tail.rotation.x = t.rx
    tail.rotation.z = t.rz
    tail.scale.setScalar(t.scale)
    tailGroup.add(tail)
  }
  group.add(tailGroup)

  // Wings - more angular, feather-like
  const wingGeom = new THREE.ConeGeometry(0.18, 0.4, 4)

  const leftWing = new THREE.Mesh(wingGeom, bodyMaterial)
  leftWing.position.set(-0.1, 0.32, 0.38)
  leftWing.rotation.x = 1.2
  leftWing.rotation.z = 0.4
  group.add(leftWing)

  const rightWing = new THREE.Mesh(wingGeom, bodyMaterial)
  rightWing.position.set(-0.1, 0.32, -0.38)
  rightWing.rotation.x = -1.2
  rightWing.rotation.z = 0.4
  group.add(rightWing)

  // Wing feather details
  const wingFeatherGeom = new THREE.ConeGeometry(0.08, 0.22, 3)

  const leftWingFeather = new THREE.Mesh(wingFeatherGeom, bodyMaterial)
  leftWingFeather.position.set(-0.2, 0.28, 0.42)
  leftWingFeather.rotation.x = 1.4
  leftWingFeather.rotation.z = 0.6
  group.add(leftWingFeather)

  const rightWingFeather = new THREE.Mesh(wingFeatherGeom, bodyMaterial)
  rightWingFeather.position.set(-0.2, 0.28, -0.42)
  rightWingFeather.rotation.x = -1.4
  rightWingFeather.rotation.z = 0.6
  group.add(rightWingFeather)

  // Head - slightly egg-shaped, not perfectly round
  const headGeom = new THREE.SphereGeometry(0.28, 7, 6)
  headGeom.scale(1.1, 1.0, 0.95)
  const head = new THREE.Mesh(headGeom, bodyMaterial)
  head.position.set(0.42, 0.68, 0)
  group.add(head)

  // Cheek puffs
  const cheekGeom = new THREE.SphereGeometry(0.1, 5, 4)
  const leftCheek = new THREE.Mesh(cheekGeom, highlightMaterial)
  leftCheek.position.set(0.48, 0.62, 0.18)
  leftCheek.scale.set(0.8, 0.7, 0.6)
  group.add(leftCheek)

  const rightCheek = new THREE.Mesh(cheekGeom, highlightMaterial)
  rightCheek.position.set(0.48, 0.62, -0.18)
  rightCheek.scale.set(0.8, 0.7, 0.6)
  group.add(rightCheek)

  // Head tuft - simple pair of feathers
  const tuftGeom = new THREE.ConeGeometry(0.035, 0.12, 4)
  const tuft1 = new THREE.Mesh(tuftGeom, bodyMaterial)
  tuft1.position.set(0.34, 0.93, 0.03)
  tuft1.rotation.z = -0.3
  tuft1.rotation.x = 0.2
  group.add(tuft1)

  const tuft2 = new THREE.Mesh(tuftGeom, bodyMaterial)
  tuft2.position.set(0.34, 0.93, -0.03)
  tuft2.rotation.z = -0.3
  tuft2.rotation.x = -0.2
  group.add(tuft2)

  // Beak - flatter, more duck-like
  const beakGeom = new THREE.ConeGeometry(0.09, 0.32, 6)
  beakGeom.scale(1, 1, 0.6) // Flatten it
  const beak = new THREE.Mesh(beakGeom, beakMaterial)
  beak.rotation.z = -Math.PI / 2
  beak.position.set(0.75, 0.62, 0)
  group.add(beak)

  // Eyes - big and expressive Wind Waker style
  const eyeGeom = new THREE.SphereGeometry(0.1, 12, 8)

  const leftEye = new THREE.Mesh(eyeGeom, eyeWhiteMaterial)
  leftEye.position.set(0.65, 0.78, 0.15)
  leftEye.scale.set(0.8, 1, 0.6)
  group.add(leftEye)

  const rightEye = new THREE.Mesh(eyeGeom, eyeWhiteMaterial)
  rightEye.position.set(0.65, 0.78, -0.15)
  rightEye.scale.set(0.8, 1, 0.6)
  group.add(rightEye)

  // Pupils
  const pupilGeom = new THREE.SphereGeometry(0.05, 8, 6)

  const leftPupil = new THREE.Mesh(pupilGeom, eyePupilMaterial)
  leftPupil.position.set(0.72, 0.78, 0.15)
  group.add(leftPupil)

  const rightPupil = new THREE.Mesh(pupilGeom, eyePupilMaterial)
  rightPupil.position.set(0.72, 0.78, -0.15)
  group.add(rightPupil)

  // Eye shine
  const shineGeom = new THREE.SphereGeometry(0.025, 6, 4)
  const shineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

  const leftShine = new THREE.Mesh(shineGeom, shineMaterial)
  leftShine.position.set(0.73, 0.82, 0.13)
  group.add(leftShine)

  const rightShine = new THREE.Mesh(shineGeom, shineMaterial)
  rightShine.position.set(0.73, 0.82, -0.17)
  group.add(rightShine)

  // Add to scene
  scene.add(group)

  // Duck state
  const state = {
    position: new THREE.Vector3(0, 0, 0),
    targetPosition: new THREE.Vector3(0, 0, 0),
    rotation: 0,
    targetRotation: 0,
    mode: 'idle', // 'idle', 'waiting', 'swimming'
    waitTimer: 0,
    waitDuration: 0,
    idleTimer: 0,
    nextIdleMove: 3 + Math.random() * 4,
    wobble: 0,
    headBob: 0,
    rippleTimer: 0,
    isMoving: false
  }

  // Movement speeds
  const idleSpeed = 0.5
  const swimSpeed = 1.2
  const turnSpeed = 4 // radians per second

  // Helper to lerp angles properly (handles wraparound)
  function lerpAngle(from, to, t) {
    let diff = to - from
    // Normalize to -PI to PI
    while (diff > Math.PI) diff -= Math.PI * 2
    while (diff < -Math.PI) diff += Math.PI * 2
    return from + diff * t
  }

  function pickIdleTarget(pond) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * (pond.radius * 0.7) + pond.radius * 0.1
    state.targetPosition.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    )
  }

  function update(delta, elapsed, breadBits, pond) {
    // Find closest bread
    let closestBread = null
    let closestDist = Infinity

    for (const bread of breadBits) {
      if (!bread.eaten) {
        const dx = bread.position.x - state.position.x
        const dz = bread.position.z - state.position.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < closestDist) {
          closestDist = dist
          closestBread = bread
        }
      }
    }

    // React to bread
    if (closestBread && state.mode === 'idle') {
      state.mode = 'waiting'
      state.waitTimer = 0
      state.waitDuration = 0.5 + Math.random() * 0.8 // Quirky delay
      state.pendingTarget = closestBread.position.clone()
    }

    // Handle waiting (the quirky pause)
    if (state.mode === 'waiting') {
      state.waitTimer += delta
      state.headBob = Math.sin(state.waitTimer * 8) * 0.1
      head.position.y = 0.7 + state.headBob

      if (state.waitTimer >= state.waitDuration) {
        state.mode = 'swimming'
        state.targetPosition.copy(state.pendingTarget)
      }
    }

    // Movement
    const dx = state.targetPosition.x - state.position.x
    const dz = state.targetPosition.z - state.position.z
    const dist = Math.sqrt(dx * dx + dz * dz)

    if (dist > 0.1) {
      // Calculate desired rotation to face target
      state.targetRotation = Math.atan2(dx, dz)

      // Smoothly turn toward target direction
      state.rotation = lerpAngle(state.rotation, state.targetRotation, turnSpeed * delta)

      // Check if we're facing roughly the right direction (within ~30 degrees)
      let angleDiff = Math.abs(state.targetRotation - state.rotation)
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2
      angleDiff = Math.abs(angleDiff)

      // Only move forward if facing the right way
      if (angleDiff < 0.5) {
        const speed = state.mode === 'swimming' ? swimSpeed : idleSpeed
        const moveAmount = Math.min(speed * delta, dist)

        // Move in the direction Doug is FACING (not toward target directly)
        const moveX = Math.sin(state.rotation) * moveAmount
        const moveZ = Math.cos(state.rotation) * moveAmount

        state.position.x += moveX
        state.position.z += moveZ

        // Wobble animation while moving
        state.wobble += delta * 8
        state.isMoving = true

        // Create swimming ripples
        state.rippleTimer += delta
        const rippleInterval = state.mode === 'swimming' ? 0.25 : 0.5
        if (state.rippleTimer >= rippleInterval) {
          state.rippleTimer = 0
          // Ripple slightly behind the duck
          const rippleX = state.position.x - Math.sin(state.rotation) * 0.3
          const rippleZ = state.position.z - Math.cos(state.rotation) * 0.3
          pond.addRipple(rippleX, rippleZ)
        }
      } else {
        state.isMoving = false
      }
    } else {
      state.isMoving = false
      // Arrived
      if (state.mode === 'swimming') {
        state.mode = 'idle'
        // Eat nearby bread - create splash ripple!
        for (const bread of breadBits) {
          if (!bread.eaten) {
            const bx = bread.position.x - state.position.x
            const bz = bread.position.z - state.position.z
            if (Math.sqrt(bx * bx + bz * bz) < 0.4) {
              bread.eaten = true
              // Eating splash ripple
              pond.addRipple(state.position.x, state.position.z)
              // Damp crunch sound
              playMonch()
            }
          }
        }
      }
    }

    // Idle wandering
    if (state.mode === 'idle' && !closestBread) {
      state.idleTimer += delta
      if (state.idleTimer >= state.nextIdleMove) {
        pickIdleTarget(pond)
        state.idleTimer = 0
        state.nextIdleMove = 3 + Math.random() * 4
      }
    }

    // Apply transforms
    group.position.x = state.position.x
    group.position.z = state.position.z

    // Bobbing on water
    const bobAmount = Math.sin(elapsed * 2)
    group.position.y = bobAmount * 0.03

    // Occasional idle bob ripples (when bobbing down)
    if (!state.isMoving && bobAmount < -0.9 && state.rippleTimer > 1.5) {
      state.rippleTimer = 0
      pond.addRipple(state.position.x, state.position.z)
    }
    if (!state.isMoving) {
      state.rippleTimer += delta
    }

    // Rotation (face direction of movement)
    // Duck model faces +X locally, so offset by -PI/2 to align with movement
    group.rotation.y = state.rotation - Math.PI / 2

    // Body wobble while swimming
    const wobbleAmount = Math.sin(state.wobble) * 0.08
    body.rotation.z = wobbleAmount
    head.position.x = 0.45 + wobbleAmount * 0.2

    // Wing flap animation
    leftWing.rotation.z = Math.sin(elapsed * 3) * 0.1
    rightWing.rotation.z = -Math.sin(elapsed * 3) * 0.1

    // Gentle head bob
    if (state.mode !== 'waiting') {
      head.position.y = 0.7 + Math.sin(elapsed * 2) * 0.02
    }
  }

  return {
    group,
    update,
    getPosition: () => state.position.clone()
  }
}
