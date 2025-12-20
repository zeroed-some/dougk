// Donny the Narwhal - distinguished gentleman of the deep
import * as THREE from 'three'

export function createDonny(scene, gradientMap) {
  const group = new THREE.Group()

  // Color palette
  const bodyColor = 0x7a9eb8 // Dusty blue-grey
  const bellyColor = 0xc8d8e4 // Pale belly
  const tuskColor = 0xf5f0e6 // Ivory
  const monocleColor = 0xd4af37 // Gold

  // Materials
  const bodyMaterial = new THREE.MeshToonMaterial({
    color: bodyColor,
    gradientMap: gradientMap
  })

  const bellyMaterial = new THREE.MeshToonMaterial({
    color: bellyColor,
    gradientMap: gradientMap
  })

  const tuskMaterial = new THREE.MeshToonMaterial({
    color: tuskColor,
    gradientMap: gradientMap
  })

  const monocleMaterial = new THREE.MeshToonMaterial({
    color: monocleColor,
    gradientMap: gradientMap
  })

  const glassMaterial = new THREE.MeshBasicMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.3
  })

  // Main body - elongated oval
  const bodyGeom = new THREE.SphereGeometry(0.5, 8, 6)
  bodyGeom.scale(2.2, 0.7, 0.8)
  const body = new THREE.Mesh(bodyGeom, bodyMaterial)
  body.position.y = 0.1
  group.add(body)

  // Belly
  const bellyGeom = new THREE.SphereGeometry(0.4, 8, 6)
  bellyGeom.scale(1.8, 0.5, 0.7)
  const belly = new THREE.Mesh(bellyGeom, bellyMaterial)
  belly.position.set(0, -0.05, 0)
  group.add(belly)

  // Head bump
  const headGeom = new THREE.SphereGeometry(0.35, 8, 6)
  headGeom.scale(1.2, 1, 1)
  const head = new THREE.Mesh(headGeom, bodyMaterial)
  head.position.set(1.0, 0.25, 0)
  group.add(head)

  // The magnificent tusk!
  const tuskGeom = new THREE.ConeGeometry(0.06, 1.8, 6)
  const tusk = new THREE.Mesh(tuskGeom, tuskMaterial)
  tusk.position.set(1.6, 0.35, 0)
  tusk.rotation.z = -Math.PI / 2 + 0.15 // Pointing forward, slightly up
  // Add spiral ridges (simplified with rotation)
  tusk.rotation.y = 0.3
  group.add(tusk)

  // Eyes
  const eyeGeom = new THREE.SphereGeometry(0.08, 8, 6)
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x1a1a1a })

  const leftEye = new THREE.Mesh(eyeGeom, eyeMaterial)
  leftEye.position.set(1.15, 0.38, 0.28)
  group.add(leftEye)

  const rightEye = new THREE.Mesh(eyeGeom, eyeMaterial)
  rightEye.position.set(1.15, 0.38, -0.28)
  group.add(rightEye)

  // Eye shines
  const shineGeom = new THREE.SphereGeometry(0.025, 6, 4)
  const shineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

  const leftShine = new THREE.Mesh(shineGeom, shineMaterial)
  leftShine.position.set(1.18, 0.42, 0.3)
  group.add(leftShine)

  const rightShine = new THREE.Mesh(shineGeom, shineMaterial)
  rightShine.position.set(1.18, 0.42, -0.26)
  group.add(rightShine)

  // THE MONOCLE - on right eye (our left when facing)
  const monocleGroup = new THREE.Group()

  // Monocle rim
  const rimGeom = new THREE.TorusGeometry(0.12, 0.015, 8, 16)
  const rim = new THREE.Mesh(rimGeom, monocleMaterial)
  monocleGroup.add(rim)

  // Monocle glass
  const glassGeom = new THREE.CircleGeometry(0.11, 16)
  const glass = new THREE.Mesh(glassGeom, glassMaterial)
  glass.position.z = 0.01
  monocleGroup.add(glass)

  // Monocle chain attachment
  const chainStartGeom = new THREE.SphereGeometry(0.02, 6, 4)
  const chainStart = new THREE.Mesh(chainStartGeom, monocleMaterial)
  chainStart.position.set(0, -0.12, 0)
  monocleGroup.add(chainStart)

  // Chain (simple dangling segments)
  const chainMaterial = new THREE.MeshToonMaterial({
    color: monocleColor,
    gradientMap: gradientMap
  })
  for (let i = 0; i < 4; i++) {
    const linkGeom = new THREE.TorusGeometry(0.018, 0.005, 4, 8)
    const link = new THREE.Mesh(linkGeom, chainMaterial)
    link.position.set(0, -0.16 - i * 0.05, 0)
    link.rotation.x = i % 2 === 0 ? 0 : Math.PI / 2
    monocleGroup.add(link)
  }

  monocleGroup.position.set(1.22, 0.38, -0.32)
  monocleGroup.rotation.y = -0.3
  group.add(monocleGroup)

  // Flippers
  const flipperGeom = new THREE.ConeGeometry(0.15, 0.5, 4)

  const leftFlipper = new THREE.Mesh(flipperGeom, bodyMaterial)
  leftFlipper.position.set(0.3, -0.1, 0.45)
  leftFlipper.rotation.x = 0.5
  leftFlipper.rotation.z = 2.2
  group.add(leftFlipper)

  const rightFlipper = new THREE.Mesh(flipperGeom, bodyMaterial)
  rightFlipper.position.set(0.3, -0.1, -0.45)
  rightFlipper.rotation.x = -0.5
  rightFlipper.rotation.z = 2.2
  group.add(rightFlipper)

  // Tail flukes
  const flukeGeom = new THREE.ConeGeometry(0.2, 0.4, 4)

  const leftFluke = new THREE.Mesh(flukeGeom, bodyMaterial)
  leftFluke.position.set(-1.2, 0.15, 0.15)
  leftFluke.rotation.z = 1.8
  leftFluke.rotation.y = 0.3
  group.add(leftFluke)

  const rightFluke = new THREE.Mesh(flukeGeom, bodyMaterial)
  rightFluke.position.set(-1.2, 0.15, -0.15)
  rightFluke.rotation.z = 1.8
  rightFluke.rotation.y = -0.3
  group.add(rightFluke)

  // Donny starts hidden below the water
  group.position.y = -3
  group.visible = false

  scene.add(group)

  // State
  const state = {
    mode: 'waiting', // 'waiting', 'rumbling', 'emerging', 'surfaced', 'submerging'
    timer: 30 + Math.random() * 30, // First appearance in 30-60 seconds
    emergeX: 0,
    emergeZ: 0,
    surfaceTime: 0
  }

  function startRumble(pond) {
    state.mode = 'rumbling'
    state.timer = 0

    // Pick random spot in the pond
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * pond.radius * 0.5 + pond.radius * 0.2
    state.emergeX = Math.cos(angle) * dist
    state.emergeZ = Math.sin(angle) * dist

    group.position.x = state.emergeX
    group.position.z = state.emergeZ
    group.rotation.y = angle + Math.PI / 2 // Face outward-ish
  }

  // Helper to smoothly interpolate angles
  function lerpAngle(from, to, t) {
    let diff = to - from
    while (diff > Math.PI) diff -= Math.PI * 2
    while (diff < -Math.PI) diff += Math.PI * 2
    return from + diff * t
  }

  function update(delta, elapsed, pond, doug) {
    state.timer += delta

    // Calculate angle to face Doug
    // Model faces +X, so we offset by -PI/2
    let angleToDoug = 0
    if (doug) {
      const dougPos = doug.getPosition()
      const dx = dougPos.x - group.position.x
      const dz = dougPos.z - group.position.z
      angleToDoug = Math.atan2(dx, dz) - Math.PI / 2
    }

    switch (state.mode) {
      case 'waiting':
        if (state.timer >= 60) {
          startRumble(pond)
        }
        break

      case 'rumbling':
        // Create rumble ripples
        if (state.timer < 2) {
          if (Math.random() < delta * 8) {
            const rx = state.emergeX + (Math.random() - 0.5) * 0.8
            const rz = state.emergeZ + (Math.random() - 0.5) * 0.8
            pond.addRipple(rx, rz)
          }
        } else {
          state.mode = 'emerging'
          state.timer = 0
          group.visible = true
          group.position.y = -2
          // Start facing Doug
          group.rotation.y = angleToDoug
        }
        break

      case 'emerging':
        // Rise from the water
        const emergeProgress = Math.min(state.timer / 1.5, 1)
        const easeOut = 1 - Math.pow(1 - emergeProgress, 3)
        group.position.y = -2 + easeOut * 2.5 // Rise higher out of water

        // Slowly turn toward Doug - lugubrious, not laser tracking
        group.rotation.y = lerpAngle(group.rotation.y, angleToDoug, delta * 0.5)

        // Tilt nose UP ~55 degrees - rotate around Z since model faces +X
        group.rotation.z = 0.95 * easeOut

        // Gentle side-to-side rocking
        group.rotation.x = Math.sin(state.timer * 4) * 0.06

        if (emergeProgress >= 1) {
          state.mode = 'surfaced'
          state.timer = 0
          state.surfaceTime = 4 + Math.random() * 3 // Stay 4-7 seconds
        }
        break

      case 'surfaced':
        // Bob gently, positioned higher
        group.position.y = 0.5 + Math.sin(elapsed * 2) * 0.06

        // Slowly turn toward Doug
        group.rotation.y = lerpAngle(group.rotation.y, angleToDoug, delta * 0.3)

        // Keep steep tilt ~55 degrees - nose up, tail in water
        group.rotation.z = 0.95 + Math.sin(elapsed * 1.5) * 0.04

        // Gentle side-to-side rocking
        group.rotation.x = Math.sin(elapsed * 1.5) * 0.03

        // Gentle flipper animation
        leftFlipper.rotation.z = 2.2 + Math.sin(elapsed * 3) * 0.15
        rightFlipper.rotation.z = 2.2 + Math.sin(elapsed * 3 + 0.5) * 0.15

        // Occasional ripples
        if (Math.random() < delta * 0.5) {
          pond.addRipple(
            group.position.x + (Math.random() - 0.5) * 0.5,
            group.position.z + (Math.random() - 0.5) * 0.5
          )
        }

        if (state.timer >= state.surfaceTime) {
          state.mode = 'submerging'
          state.timer = 0
        }
        break

      case 'submerging':
        // Sink back down
        const submergeProgress = Math.min(state.timer / 1.2, 1)
        const easeIn = Math.pow(submergeProgress, 2)
        group.position.y = 0.5 - easeIn * 2.7

        // Tilt nose down as diving back under
        group.rotation.z = 0.95 - easeIn * 1.2

        // Add bubbles/ripples as submerging
        if (Math.random() < delta * 4) {
          pond.addRipple(
            group.position.x + (Math.random() - 0.5) * 0.6,
            group.position.z + (Math.random() - 0.5) * 0.6
          )
        }

        if (submergeProgress >= 1) {
          state.mode = 'waiting'
          state.timer = 0
          group.visible = false
          group.position.y = -3
          group.rotation.x = 0
          group.rotation.z = 0
        }
        break
    }
  }

  return {
    group,
    update
  }
}
