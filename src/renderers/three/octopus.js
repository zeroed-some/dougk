// Ollie the Octopus - curious inspector of the pond
import * as THREE from 'three'

export function createOllie(scene, gradientMap) {
  const group = new THREE.Group()

  // Color palette - purple theme
  const bodyColor = 0x7b4b94 // Deep purple
  const bellyColor = 0xb89bc9 // Lighter lavender
  const suckerColor = 0xd4a5c9 // Pink-ish
  const glassRimColor = 0xd4af37 // Gold

  // Materials
  const bodyMaterial = new THREE.MeshToonMaterial({
    color: bodyColor,
    gradientMap: gradientMap
  })

  const bellyMaterial = new THREE.MeshToonMaterial({
    color: bellyColor,
    gradientMap: gradientMap
  })

  const suckerMaterial = new THREE.MeshToonMaterial({
    color: suckerColor,
    gradientMap: gradientMap
  })

  const glassRimMaterial = new THREE.MeshToonMaterial({
    color: glassRimColor,
    gradientMap: gradientMap
  })

  const glassMaterial = new THREE.MeshBasicMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.3
  })

  // Head/Mantle - bulbous dome
  const mantleGeom = new THREE.SphereGeometry(0.5, 10, 8)
  mantleGeom.scale(1.2, 1.4, 1.0)
  const mantle = new THREE.Mesh(mantleGeom, bodyMaterial)
  mantle.position.y = 0.3
  group.add(mantle)

  // Lower mantle/body connector
  const lowerMantleGeom = new THREE.SphereGeometry(0.4, 8, 6)
  lowerMantleGeom.scale(1.1, 0.8, 1.0)
  const lowerMantle = new THREE.Mesh(lowerMantleGeom, bellyMaterial)
  lowerMantle.position.y = -0.1
  group.add(lowerMantle)

  // Eyes - big and expressive Wind Waker style
  const eyeGeom = new THREE.SphereGeometry(0.12, 8, 6)
  const eyeWhiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x1a1a1a })

  // Left eye
  const leftEyeWhite = new THREE.Mesh(eyeGeom, eyeWhiteMaterial)
  leftEyeWhite.position.set(0.25, 0.35, 0.35)
  leftEyeWhite.scale.set(1, 1.2, 0.8)
  group.add(leftEyeWhite)

  const leftPupilGeom = new THREE.SphereGeometry(0.06, 6, 4)
  const leftPupil = new THREE.Mesh(leftPupilGeom, pupilMaterial)
  leftPupil.position.set(0.32, 0.35, 0.4)
  group.add(leftPupil)

  // Right eye
  const rightEyeWhite = new THREE.Mesh(eyeGeom, eyeWhiteMaterial)
  rightEyeWhite.position.set(0.25, 0.35, -0.35)
  rightEyeWhite.scale.set(1, 1.2, 0.8)
  group.add(rightEyeWhite)

  const rightPupil = new THREE.Mesh(leftPupilGeom, pupilMaterial)
  rightPupil.position.set(0.32, 0.35, -0.4)
  group.add(rightPupil)

  // Eye shines
  const shineGeom = new THREE.SphereGeometry(0.03, 6, 4)
  const shineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

  const leftShine = new THREE.Mesh(shineGeom, shineMaterial)
  leftShine.position.set(0.35, 0.4, 0.38)
  group.add(leftShine)

  const rightShine = new THREE.Mesh(shineGeom, shineMaterial)
  rightShine.position.set(0.35, 0.4, -0.38)
  group.add(rightShine)

  // Create 8 tentacles - splayed outward evenly around the body like \./
  const tentacles = []
  const tentacleGroup = new THREE.Group()
  tentacleGroup.position.y = -0.05 // Raised up so tentacles emerge above water

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const tentacle = createTentacle(bodyMaterial, suckerMaterial, gradientMap)

    // Position at edge of lower body
    tentacle.position.x = Math.cos(angle) * 0.35
    tentacle.position.z = Math.sin(angle) * 0.35

    // Simply rotate around Y to spread evenly - tentacles extend in +Z and curve up
    tentacle.rotation.y = angle

    tentacles.push(tentacle)
    tentacleGroup.add(tentacle)
  }

  group.add(tentacleGroup)

  // Magnifying glass - will be attached to front tentacle (index 0)
  const magGlassGroup = new THREE.Group()

  // Handle - longer and thicker for visibility
  const handleGeom = new THREE.CylinderGeometry(0.03, 0.035, 0.25, 6)
  const handle = new THREE.Mesh(handleGeom, glassRimMaterial)
  handle.rotation.z = Math.PI / 2
  handle.position.x = -0.18
  magGlassGroup.add(handle)

  // Rim
  const rimGeom = new THREE.TorusGeometry(0.15, 0.02, 8, 16)
  const rim = new THREE.Mesh(rimGeom, glassRimMaterial)
  magGlassGroup.add(rim)

  // Glass lens
  const lensGeom = new THREE.CircleGeometry(0.14, 16)
  const lens = new THREE.Mesh(lensGeom, glassMaterial)
  lens.position.z = 0.01
  magGlassGroup.add(lens)

  // Back of lens for visibility from other side
  const lensBack = new THREE.Mesh(lensGeom, glassMaterial)
  lensBack.position.z = -0.01
  lensBack.rotation.y = Math.PI
  magGlassGroup.add(lensBack)

  // Attach magnifying glass to the TIP of tentacle 2 (side tentacle, away from body)
  // Navigate to the last joint of that tentacle
  let magTentacle = tentacles[2]
  let lastJoint = magTentacle.children[0] // First joint
  while (lastJoint.children.length > 1 || (lastJoint.children[0] && lastJoint.children[0].type === 'Group')) {
    // Find the child that is a Group (the next joint)
    const nextJoint = lastJoint.children.find(c => c.type === 'Group')
    if (nextJoint) {
      lastJoint = nextJoint
    } else {
      break
    }
  }

  // Position at the tip of the last segment
  magGlassGroup.position.set(0, 0.05, 0.15)
  magGlassGroup.rotation.x = 0.5 // Angle it forward/up for visibility
  lastJoint.add(magGlassGroup)

  // Ollie starts hidden below the water
  group.position.y = -3
  group.visible = false

  scene.add(group)

  // State
  const state = {
    mode: 'waiting',
    timer: 45 + Math.random() * 30, // First appearance in 45-75 seconds (after narwhal)
    emergeX: 0,
    emergeZ: 0,
    surfaceTime: 0
  }

  function createTentacle(bodyMat, suckerMat, gradient) {
    // Build tentacle as a chain of segments, each one a child of the previous
    // This creates a smooth curve by rotating each joint
    const tentacleObj = new THREE.Group()

    const numSegments = 5
    let currentParent = tentacleObj

    for (let idx = 0; idx < numSegments; idx++) {
      const radius = 0.065 - idx * 0.01
      const length = 0.18 - idx * 0.015

      // Create a joint group for this segment
      const joint = new THREE.Group()

      // Position joint at end of parent (except first one at origin)
      if (idx > 0) {
        joint.position.z = 0.16 - (idx - 1) * 0.012 // Length of previous segment
      }

      // Rotate joint to curve upward - more curve toward the tip
      joint.rotation.x = -0.28 - idx * 0.08

      // Create the segment mesh
      const segGeom = new THREE.CylinderGeometry(radius * 0.7, radius, length, 6)
      segGeom.rotateX(Math.PI / 2) // Lay along Z axis
      segGeom.translate(0, 0, length / 2) // Move so base is at origin

      const segMesh = new THREE.Mesh(segGeom, bodyMat)
      joint.add(segMesh)

      // Add suckers on underside
      if (idx < 4) {
        const suckerGeom = new THREE.SphereGeometry(0.015, 4, 4)
        const sucker = new THREE.Mesh(suckerGeom, suckerMat)
        sucker.position.set(0, -radius * 0.85, length * 0.5)
        sucker.scale.set(1, 0.5, 1)
        joint.add(sucker)
      }

      currentParent.add(joint)
      currentParent = joint
    }

    // Curly tip at the end
    const tipGeom = new THREE.SphereGeometry(0.02, 6, 4)
    const tip = new THREE.Mesh(tipGeom, bodyMat)
    tip.position.z = 0.12
    currentParent.add(tip)

    return tentacleObj
  }

  function startRumble(pond) {
    state.mode = 'rumbling'
    state.timer = 0

    // Pick random spot in outer zone of pond (70-90% radius)
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * pond.radius * 0.2 + pond.radius * 0.7
    state.emergeX = Math.cos(angle) * dist
    state.emergeZ = Math.sin(angle) * dist

    group.position.x = state.emergeX
    group.position.z = state.emergeZ
    group.rotation.y = angle + Math.PI / 2
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
    let angleToDoug = 0
    if (doug) {
      const dougPos = doug.getPosition()
      const dx = dougPos.x - group.position.x
      const dz = dougPos.z - group.position.z
      angleToDoug = Math.atan2(dx, dz)
    }

    // Animate tentacles (always, when visible)
    if (group.visible) {
      tentacles.forEach((t, i) => {
        const baseAngle = (i / 8) * Math.PI * 2
        const phase = i * (Math.PI / 4)
        // Gentle swaying - each tentacle waves side to side
        t.rotation.y = baseAngle + Math.sin(elapsed * 1.5 + phase) * 0.12
        // Slight up/down bob
        t.rotation.x = Math.sin(elapsed * 2 + phase) * 0.08
      })

      // Magnifying glass gets a little extra wobble for curious inspection look
      magGlassGroup.rotation.z = Math.sin(elapsed * 3) * 0.1
      magGlassGroup.rotation.y = Math.sin(elapsed * 2) * 0.15
    }

    switch (state.mode) {
      case 'waiting':
        if (state.timer >= 75) {
          startRumble(pond)
        }
        break

      case 'rumbling':
        // Create rumble ripples
        if (state.timer < 2) {
          if (Math.random() < delta * 6) {
            const rx = state.emergeX + (Math.random() - 0.5) * 1.0
            const rz = state.emergeZ + (Math.random() - 0.5) * 1.0
            pond.addRipple(rx, rz)
          }
        } else {
          state.mode = 'emerging'
          state.timer = 0
          group.visible = true
          group.position.y = -2
          group.rotation.y = angleToDoug
        }
        break

      case 'emerging':
        const emergeProgress = Math.min(state.timer / 1.8, 1)
        const easeOut = 1 - Math.pow(1 - emergeProgress, 3)
        group.position.y = -2 + easeOut * 2.2

        // Slowly turn toward Doug - curious inspection
        group.rotation.y = lerpAngle(group.rotation.y, angleToDoug, delta * 0.6)

        // Gentle wobble during emerge
        group.rotation.x = Math.sin(state.timer * 3) * 0.05
        group.rotation.z = Math.cos(state.timer * 2.5) * 0.04

        if (emergeProgress >= 1) {
          state.mode = 'surfaced'
          state.timer = 0
          state.surfaceTime = 5 + Math.random() * 3 // Stay 5-8 seconds
        }
        break

      case 'surfaced':
        // Bob gently
        group.position.y = 0.2 + Math.sin(elapsed * 2) * 0.05

        // Track Doug with magnifying glass - curious inspection!
        group.rotation.y = lerpAngle(group.rotation.y, angleToDoug, delta * 0.4)

        // Gentle rocking
        group.rotation.x = Math.sin(elapsed * 1.2) * 0.03
        group.rotation.z = Math.cos(elapsed * 1.0) * 0.02

        // Extra curious magnifying glass wobble when pointed at Doug
        magGlassGroup.rotation.y = -0.5 + Math.sin(elapsed * 4) * 0.1

        // Occasional ripples
        if (Math.random() < delta * 0.4) {
          pond.addRipple(
            group.position.x + (Math.random() - 0.5) * 0.6,
            group.position.z + (Math.random() - 0.5) * 0.6
          )
        }

        if (state.timer >= state.surfaceTime) {
          state.mode = 'submerging'
          state.timer = 0
        }
        break

      case 'submerging':
        const submergeProgress = Math.min(state.timer / 1.5, 1)
        const easeIn = Math.pow(submergeProgress, 2)
        group.position.y = 0.2 - easeIn * 2.5

        // Tentacles curl as submerging
        tentacles.forEach((t, i) => {
          const baseAngle = (i / 8) * Math.PI * 2
          const phase = i * (Math.PI / 4)
          t.rotation.y = baseAngle + Math.sin(elapsed * 2 + phase) * 0.05
          // Curl downward as sinking
          t.rotation.x = easeIn * 0.4 + Math.sin(elapsed * 2 + phase) * 0.05
        })

        // Add ripples as submerging
        if (Math.random() < delta * 5) {
          pond.addRipple(
            group.position.x + (Math.random() - 0.5) * 0.8,
            group.position.z + (Math.random() - 0.5) * 0.8
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
