// Doug the Duck - 3D low-poly model with Wind Waker cel-shading
import * as THREE from 'three'

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

  // Body - stretched sphere
  const bodyGeom = new THREE.SphereGeometry(0.5, 16, 12)
  bodyGeom.scale(1.2, 0.9, 1)
  const body = new THREE.Mesh(bodyGeom, bodyMaterial)
  body.position.y = 0.3
  group.add(body)

  // Body highlight (chest area)
  const chestGeom = new THREE.SphereGeometry(0.35, 12, 8)
  chestGeom.scale(1, 0.8, 0.8)
  const chest = new THREE.Mesh(chestGeom, highlightMaterial)
  chest.position.set(0.15, 0.35, 0.2)
  group.add(chest)

  // Tail feathers
  const tailGroup = new THREE.Group()
  for (let i = 0; i < 3; i++) {
    const tailGeom = new THREE.ConeGeometry(0.08, 0.3, 6)
    const tail = new THREE.Mesh(tailGeom, bodyMaterial)
    tail.rotation.x = Math.PI / 2 + (i - 1) * 0.15
    tail.rotation.z = (i - 1) * 0.2
    tail.position.set(-0.55 - i * 0.05, 0.35, (i - 1) * 0.08)
    tailGroup.add(tail)
  }
  group.add(tailGroup)

  // Wings
  const wingGeom = new THREE.SphereGeometry(0.25, 8, 6)
  wingGeom.scale(0.6, 1, 0.3)

  const leftWing = new THREE.Mesh(wingGeom, bodyMaterial)
  leftWing.position.set(-0.1, 0.35, 0.45)
  leftWing.rotation.x = 0.2
  group.add(leftWing)

  const rightWing = new THREE.Mesh(wingGeom, bodyMaterial)
  rightWing.position.set(-0.1, 0.35, -0.45)
  rightWing.rotation.x = -0.2
  group.add(rightWing)

  // Head
  const headGeom = new THREE.SphereGeometry(0.32, 16, 12)
  const head = new THREE.Mesh(headGeom, bodyMaterial)
  head.position.set(0.45, 0.7, 0)
  group.add(head)

  // Head tuft (little feather on top)
  const tuftGeom = new THREE.ConeGeometry(0.05, 0.15, 6)
  const tuft = new THREE.Mesh(tuftGeom, bodyMaterial)
  tuft.position.set(0.4, 1.0, 0)
  tuft.rotation.z = -0.3
  group.add(tuft)

  // Beak - cone pointing forward
  const beakGeom = new THREE.ConeGeometry(0.1, 0.35, 8)
  const beak = new THREE.Mesh(beakGeom, beakMaterial)
  beak.rotation.z = -Math.PI / 2
  beak.position.set(0.8, 0.65, 0)
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
    headBob: 0
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
      }
    } else {
      // Arrived
      if (state.mode === 'swimming') {
        state.mode = 'idle'
        // Eat nearby bread
        for (const bread of breadBits) {
          if (!bread.eaten) {
            const bx = bread.position.x - state.position.x
            const bz = bread.position.z - state.position.z
            if (Math.sqrt(bx * bx + bz * bz) < 0.4) {
              bread.eaten = true
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
    group.position.y = Math.sin(elapsed * 2) * 0.03

    // Rotation (face direction of movement)
    group.rotation.y = state.rotation

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
