// Building mesh factories for dougk
// Creates 3D meshes for placeable buildings

import * as THREE from 'three'

// Create a wooden dock
// Dock protrudes into water - shore side at origin, water side extends in -Z direction
export function createDock(gradientMap) {
  const group = new THREE.Group()

  const woodMaterial = new THREE.MeshToonMaterial({
    color: 0x8b6914,
    gradientMap
  })

  const darkWoodMaterial = new THREE.MeshToonMaterial({
    color: 0x5c4a1a,
    gradientMap
  })

  // Dock dimensions - extends into water
  const dockWidth = 0.8
  const dockLength = 1.2  // How far it protrudes into water
  const dockHeight = 0.08

  // Main platform - offset so shore edge is at z=0, water edge at z=-dockLength
  const platformGeom = new THREE.BoxGeometry(dockWidth, dockHeight, dockLength)
  const platform = new THREE.Mesh(platformGeom, woodMaterial)
  platform.position.set(0, 0.04, -dockLength / 2)
  group.add(platform)

  // Planks (crosswise detail lines)
  for (let i = 0; i < 6; i++) {
    const plankGeom = new THREE.BoxGeometry(dockWidth - 0.02, 0.09, 0.03)
    const plank = new THREE.Mesh(plankGeom, darkWoodMaterial)
    plank.position.set(0, 0.045, -0.1 - i * 0.2)
    group.add(plank)
  }

  // Support posts - two at shore, two at water end
  const postGeom = new THREE.CylinderGeometry(0.05, 0.06, 0.5, 6)
  const postPositions = [
    // Shore posts (shorter, above ground)
    { x: -dockWidth / 2 + 0.08, z: -0.1, height: 0.3, yOffset: -0.1 },
    { x: dockWidth / 2 - 0.08, z: -0.1, height: 0.3, yOffset: -0.1 },
    // Water posts (longer, go into water)
    { x: -dockWidth / 2 + 0.08, z: -dockLength + 0.15, height: 0.6, yOffset: -0.25 },
    { x: dockWidth / 2 - 0.08, z: -dockLength + 0.15, height: 0.6, yOffset: -0.25 }
  ]

  for (const pos of postPositions) {
    const pGeom = new THREE.CylinderGeometry(0.05, 0.06, pos.height, 6)
    const post = new THREE.Mesh(pGeom, darkWoodMaterial)
    post.position.set(pos.x, pos.yOffset, pos.z)
    group.add(post)
  }

  // Rope detail on water-end posts
  const ropeMaterial = new THREE.MeshToonMaterial({
    color: 0x8b7355,
    gradientMap
  })
  const ropeGeom = new THREE.TorusGeometry(0.06, 0.015, 6, 12)

  // Rope on left water post
  const ropeLeft = new THREE.Mesh(ropeGeom, ropeMaterial)
  ropeLeft.position.set(-dockWidth / 2 + 0.08, 0.08, -dockLength + 0.15)
  ropeLeft.rotation.x = Math.PI / 2
  group.add(ropeLeft)

  // Rope on right water post
  const ropeRight = new THREE.Mesh(ropeGeom, ropeMaterial)
  ropeRight.position.set(dockWidth / 2 - 0.08, 0.08, -dockLength + 0.15)
  ropeRight.rotation.x = Math.PI / 2
  group.add(ropeRight)

  return group
}

// Create a fishing hut
// Hut sits on shore with front porch extending toward water (-Z direction)
export function createFishingHut(gradientMap) {
  const group = new THREE.Group()

  const woodMaterial = new THREE.MeshToonMaterial({
    color: 0x9b7653,
    gradientMap
  })

  const roofMaterial = new THREE.MeshToonMaterial({
    color: 0x654321,
    gradientMap
  })

  const windowMaterial = new THREE.MeshBasicMaterial({
    color: 0x87ceeb,
    transparent: true,
    opacity: 0.6
  })

  const darkWoodMaterial = new THREE.MeshToonMaterial({
    color: 0x5c4a1a,
    gradientMap
  })

  // Front porch/deck extending into water
  const porchGeom = new THREE.BoxGeometry(0.7, 0.06, 0.5)
  const porch = new THREE.Mesh(porchGeom, darkWoodMaterial)
  porch.position.set(0, 0.02, -0.25)
  group.add(porch)

  // Porch support posts (in water)
  const porchPostGeom = new THREE.CylinderGeometry(0.03, 0.04, 0.4, 6)
  const porchPosts = [
    { x: -0.3, z: -0.45 },
    { x: 0.3, z: -0.45 }
  ]
  for (const pos of porchPosts) {
    const post = new THREE.Mesh(porchPostGeom, darkWoodMaterial)
    post.position.set(pos.x, -0.15, pos.z)
    group.add(post)
  }

  // Main building base/floor - offset onto shore
  const baseGeom = new THREE.BoxGeometry(0.9, 0.08, 0.7)
  const base = new THREE.Mesh(baseGeom, woodMaterial)
  base.position.set(0, 0.04, 0.35)
  group.add(base)

  // Walls
  const wallGeom = new THREE.BoxGeometry(0.85, 0.5, 0.65)
  const walls = new THREE.Mesh(wallGeom, woodMaterial)
  walls.position.set(0, 0.33, 0.35)
  group.add(walls)

  // Roof
  const roofGeom = new THREE.ConeGeometry(0.55, 0.35, 4)
  const roof = new THREE.Mesh(roofGeom, roofMaterial)
  roof.position.set(0, 0.75, 0.35)
  roof.rotation.y = Math.PI / 4
  group.add(roof)

  // Window (on side wall)
  const windowGeom = new THREE.PlaneGeometry(0.15, 0.15)
  const window1 = new THREE.Mesh(windowGeom, windowMaterial)
  window1.position.set(0.43, 0.37, 0.35)
  window1.rotation.y = Math.PI / 2
  group.add(window1)

  // Door (facing water)
  const doorFrameGeom = new THREE.BoxGeometry(0.22, 0.35, 0.03)
  const doorFrame = new THREE.Mesh(doorFrameGeom, roofMaterial)
  doorFrame.position.set(0, 0.26, 0.03)
  group.add(doorFrame)

  const doorGeom = new THREE.BoxGeometry(0.18, 0.32, 0.02)
  const door = new THREE.Mesh(doorGeom, darkWoodMaterial)
  door.position.set(0, 0.24, 0.02)
  group.add(door)

  return group
}

// Create a mini lighthouse
export function createLighthouse(gradientMap) {
  const group = new THREE.Group()

  const whiteMaterial = new THREE.MeshToonMaterial({
    color: 0xf5f5f5,
    gradientMap
  })

  const redMaterial = new THREE.MeshToonMaterial({
    color: 0xcc3333,
    gradientMap
  })

  const glassMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffaa,
    transparent: true,
    opacity: 0.8
  })

  // Base
  const baseGeom = new THREE.CylinderGeometry(0.25, 0.3, 0.15, 8)
  const base = new THREE.Mesh(baseGeom, whiteMaterial)
  base.position.y = 0.075
  group.add(base)

  // Tower - alternating stripes
  const stripeHeight = 0.2
  for (let i = 0; i < 4; i++) {
    const stripeGeom = new THREE.CylinderGeometry(
      0.18 - i * 0.02,
      0.2 - i * 0.02,
      stripeHeight,
      8
    )
    const stripe = new THREE.Mesh(stripeGeom, i % 2 === 0 ? whiteMaterial : redMaterial)
    stripe.position.y = 0.25 + i * stripeHeight
    group.add(stripe)
  }

  // Lamp housing
  const housingGeom = new THREE.CylinderGeometry(0.12, 0.1, 0.15, 8)
  const housing = new THREE.Mesh(housingGeom, redMaterial)
  housing.position.y = 1.02
  group.add(housing)

  // Glass/light
  const glassGeom = new THREE.SphereGeometry(0.08, 8, 6)
  const glass = new THREE.Mesh(glassGeom, glassMaterial)
  glass.position.y = 1.0
  group.add(glass)

  // Light beam (animated)
  const beamGroup = new THREE.Group()
  beamGroup.position.y = 1.0

  const beamMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffaa,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  })

  // Create a cone-shaped beam - tip at lamp, wide end extending outward
  const beamGeom = new THREE.ConeGeometry(0.8, 2.5, 8, 1, true)
  beamGeom.rotateX(-Math.PI / 2) // Tip toward -Z, base toward +Z
  beamGeom.translate(0, 0, 1.25) // Move so tip is at origin (lamp), base extends outward
  const beam = new THREE.Mesh(beamGeom, beamMaterial)
  beamGroup.add(beam)

  // Mark for animation
  beamGroup.userData.isLightBeam = true
  group.add(beamGroup)

  // Roof cap
  const capGeom = new THREE.ConeGeometry(0.14, 0.12, 8)
  const cap = new THREE.Mesh(capGeom, redMaterial)
  cap.position.y = 1.15
  group.add(cap)

  // Mark group as lighthouse for animation
  group.userData.isLighthouse = true

  return group
}

// Create reed cluster
export function createReeds(gradientMap) {
  const group = new THREE.Group()

  const reedMaterial = new THREE.MeshToonMaterial({
    color: 0x4a7c3f,
    gradientMap
  })

  const tipMaterial = new THREE.MeshToonMaterial({
    color: 0x8b7355,
    gradientMap
  })

  // Create 5-7 reeds
  const reedCount = 5 + Math.floor(Math.random() * 3)
  const reeds = []

  for (let i = 0; i < reedCount; i++) {
    const height = 0.4 + Math.random() * 0.3
    const angle = (i / reedCount) * Math.PI * 2 + Math.random() * 0.5
    const dist = Math.random() * 0.15

    // Reed group (stalk + tip together for swaying)
    const reedGroup = new THREE.Group()
    reedGroup.position.set(
      Math.cos(angle) * dist,
      0,
      Math.sin(angle) * dist
    )

    // Reed stalk
    const stalkGeom = new THREE.CylinderGeometry(0.015, 0.02, height, 4)
    const stalk = new THREE.Mesh(stalkGeom, reedMaterial)
    stalk.position.y = height / 2 - 0.1
    reedGroup.add(stalk)

    // Cattail tip
    const tipGeom = new THREE.CylinderGeometry(0.03, 0.025, 0.1, 6)
    const tip = new THREE.Mesh(tipGeom, tipMaterial)
    tip.position.y = height - 0.05
    reedGroup.add(tip)

    // Mark for animation with random phase
    reedGroup.userData.isReed = true
    reedGroup.userData.phase = Math.random() * Math.PI * 2
    reedGroup.userData.baseRotX = (Math.random() - 0.5) * 0.2
    reedGroup.userData.baseRotZ = (Math.random() - 0.5) * 0.2

    reeds.push(reedGroup)
    group.add(reedGroup)
  }

  // Mark group as reeds cluster for animation
  group.userData.isReeds = true
  group.userData.reedChildren = reeds

  return group
}

// Create fence segment
export function createFence(gradientMap) {
  const group = new THREE.Group()

  const woodMaterial = new THREE.MeshToonMaterial({
    color: 0xa0826d,
    gradientMap
  })

  // Two posts
  const postGeom = new THREE.BoxGeometry(0.06, 0.4, 0.06)

  const post1 = new THREE.Mesh(postGeom, woodMaterial)
  post1.position.set(-0.25, 0.15, 0)
  group.add(post1)

  const post2 = new THREE.Mesh(postGeom, woodMaterial)
  post2.position.set(0.25, 0.15, 0)
  group.add(post2)

  // Pointed tops
  const pointGeom = new THREE.ConeGeometry(0.04, 0.08, 4)

  const point1 = new THREE.Mesh(pointGeom, woodMaterial)
  point1.position.set(-0.25, 0.39, 0)
  group.add(point1)

  const point2 = new THREE.Mesh(pointGeom, woodMaterial)
  point2.position.set(0.25, 0.39, 0)
  group.add(point2)

  // Cross beams
  const beamGeom = new THREE.BoxGeometry(0.5, 0.04, 0.03)

  const beam1 = new THREE.Mesh(beamGeom, woodMaterial)
  beam1.position.set(0, 0.25, 0)
  group.add(beam1)

  const beam2 = new THREE.Mesh(beamGeom, woodMaterial)
  beam2.position.set(0, 0.1, 0)
  group.add(beam2)

  return group
}

// Create a giant onion house
export function createOnionHouse(gradientMap) {
  const group = new THREE.Group()

  // Onion colors - layered purples and whites
  const outerSkinMaterial = new THREE.MeshToonMaterial({
    color: 0x8b668b, // Dusty purple outer skin
    gradientMap
  })

  const innerSkinMaterial = new THREE.MeshToonMaterial({
    color: 0xdda0dd, // Lighter purple inner layer peeking through
    gradientMap
  })

  const rootMaterial = new THREE.MeshToonMaterial({
    color: 0xd2b48c, // Tan roots
    gradientMap
  })

  const doorMaterial = new THREE.MeshToonMaterial({
    color: 0x4a3728, // Dark wood door
    gradientMap
  })

  const chimneyMaterial = new THREE.MeshToonMaterial({
    color: 0x8b7355, // Stone chimney
    gradientMap
  })

  // Main onion body - bulbous bottom
  const bulbGeom = new THREE.SphereGeometry(0.5, 10, 8)
  bulbGeom.scale(1, 0.85, 1)
  const bulb = new THREE.Mesh(bulbGeom, outerSkinMaterial)
  bulb.position.y = 0.4
  group.add(bulb)

  // Onion top/neck tapering up
  const neckGeom = new THREE.CylinderGeometry(0.15, 0.35, 0.4, 8)
  const neck = new THREE.Mesh(neckGeom, outerSkinMaterial)
  neck.position.y = 0.95
  group.add(neck)

  // Dried top sprout/tip
  const tipGeom = new THREE.ConeGeometry(0.08, 0.25, 6)
  const tip = new THREE.Mesh(tipGeom, rootMaterial)
  tip.position.y = 1.27
  tip.rotation.z = 0.15 // Slight lean for whimsy
  group.add(tip)

  // Peeling skin detail (decorative flaps)
  const peelGeom = new THREE.PlaneGeometry(0.2, 0.35)
  const peel1 = new THREE.Mesh(peelGeom, innerSkinMaterial)
  peel1.position.set(0.45, 0.5, 0.15)
  peel1.rotation.y = -0.4
  peel1.rotation.z = 0.3
  group.add(peel1)

  const peel2 = new THREE.Mesh(peelGeom, innerSkinMaterial)
  peel2.position.set(-0.35, 0.6, 0.3)
  peel2.rotation.y = 0.6
  peel2.rotation.z = -0.2
  group.add(peel2)

  // Root tendrils at the bottom
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.3
    const rootGeom = new THREE.CylinderGeometry(0.02, 0.01, 0.15 + Math.random() * 0.1, 4)
    const root = new THREE.Mesh(rootGeom, rootMaterial)
    root.position.set(
      Math.cos(angle) * 0.15,
      -0.02,
      Math.sin(angle) * 0.15
    )
    root.rotation.x = (Math.random() - 0.5) * 0.4
    root.rotation.z = (Math.random() - 0.5) * 0.4
    group.add(root)
  }

  // Door - cute rounded top
  const doorGroup = new THREE.Group()

  // Door frame (arch)
  const doorFrameGeom = new THREE.BoxGeometry(0.22, 0.35, 0.05)
  const doorFrame = new THREE.Mesh(doorFrameGeom, doorMaterial)
  doorFrame.position.y = 0.175
  doorGroup.add(doorFrame)

  // Door arch top
  const archGeom = new THREE.SphereGeometry(0.11, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2)
  const arch = new THREE.Mesh(archGeom, doorMaterial)
  arch.position.y = 0.35
  arch.rotation.x = Math.PI
  doorGroup.add(arch)

  // Door knob
  const knobGeom = new THREE.SphereGeometry(0.02, 6, 4)
  const knobMaterial = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap })
  const knob = new THREE.Mesh(knobGeom, knobMaterial)
  knob.position.set(0.07, 0.2, 0.03)
  doorGroup.add(knob)

  doorGroup.position.set(0.48, 0.02, 0)
  doorGroup.rotation.y = Math.PI / 2
  group.add(doorGroup)

  // Chimney - whimsically placed on the side/top
  const chimneyGroup = new THREE.Group()

  const chimneyBaseGeom = new THREE.CylinderGeometry(0.06, 0.07, 0.3, 6)
  const chimneyBase = new THREE.Mesh(chimneyBaseGeom, chimneyMaterial)
  chimneyBase.position.y = 0.15
  chimneyGroup.add(chimneyBase)

  // Chimney cap
  const capGeom = new THREE.CylinderGeometry(0.08, 0.06, 0.04, 6)
  const cap = new THREE.Mesh(capGeom, chimneyMaterial)
  cap.position.y = 0.32
  chimneyGroup.add(cap)

  // Position chimney at a jaunty angle on the onion
  chimneyGroup.position.set(-0.25, 0.75, 0.2)
  chimneyGroup.rotation.z = 0.3 // Tilted for whimsy
  chimneyGroup.rotation.x = -0.15
  group.add(chimneyGroup)

  // Smoke puffs - create several that will be animated
  const smokeGroup = new THREE.Group()
  smokeGroup.userData.isSmoke = true

  const smokeMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.6
  })

  // Create 4 smoke puffs at different phases
  for (let i = 0; i < 4; i++) {
    const puffGeom = new THREE.SphereGeometry(0.04, 6, 4)
    const puff = new THREE.Mesh(puffGeom, smokeMaterial.clone())
    puff.userData.isSmokePuff = true
    puff.userData.phase = i * 0.25  // Stagger the animation phases
    puff.userData.baseY = 0
    puff.position.set(
      (Math.random() - 0.5) * 0.03,
      0,
      (Math.random() - 0.5) * 0.03
    )
    smokeGroup.add(puff)
  }

  // Position smoke at chimney top (in world space, accounting for chimney tilt)
  // Chimney cap is at local y=0.32, chimney group at (-0.25, 0.75, 0.2)
  smokeGroup.position.set(-0.35, 1.05, 0.15)
  group.add(smokeGroup)

  // Little window
  const windowGeom = new THREE.CircleGeometry(0.08, 8)
  const windowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffcc,
    transparent: true,
    opacity: 0.7
  })
  const windowMesh = new THREE.Mesh(windowGeom, windowMaterial)
  windowMesh.position.set(0.1, 0.55, 0.49)
  group.add(windowMesh)

  // Window frame
  const windowFrameGeom = new THREE.TorusGeometry(0.08, 0.012, 4, 12)
  const windowFrame = new THREE.Mesh(windowFrameGeom, doorMaterial)
  windowFrame.position.set(0.1, 0.55, 0.485)
  group.add(windowFrame)

  return group
}

// Factory function to create building by type
export function createBuilding(type, gradientMap) {
  switch (type) {
    case 'dock_wooden':
      return createDock(gradientMap)
    case 'fishing_hut':
      return createFishingHut(gradientMap)
    case 'lighthouse':
      return createLighthouse(gradientMap)
    case 'reeds':
      return createReeds(gradientMap)
    case 'fence':
      return createFence(gradientMap)
    case 'onion_house':
      return createOnionHouse(gradientMap)
    default:
      console.warn('Unknown building type:', type)
      return new THREE.Group()
  }
}

// Create ghost (preview) version of a building
export function createGhostBuilding(type, gradientMap, isValid) {
  const building = createBuilding(type, gradientMap)

  // Make all materials transparent and tinted
  const color = isValid ? 0x44ff44 : 0xff4444
  const opacity = 0.5

  building.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity
      })
    }
  })

  return building
}
