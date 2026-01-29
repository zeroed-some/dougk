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

// Create a whimsical boot house with yard, sprites, and bendy chimney
export function createBootHouse(gradientMap) {
  const group = new THREE.Group()

  // Boot leather material - warm brown
  const leatherMaterial = new THREE.MeshToonMaterial({
    color: 0x8b4513,
    gradientMap
  })

  // Darker leather for details
  const darkLeatherMaterial = new THREE.MeshToonMaterial({
    color: 0x5c3317,
    gradientMap
  })

  // Sole material - darker rubber-like
  const soleMaterial = new THREE.MeshToonMaterial({
    color: 0x2d1f14,
    gradientMap
  })

  // Lace/tongue material
  const laceMaterial = new THREE.MeshToonMaterial({
    color: 0xdaa520,
    gradientMap
  })

  // Chimney brick
  const brickMaterial = new THREE.MeshToonMaterial({
    color: 0x8b4513,
    gradientMap
  })

  // Window glow
  const windowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffcc,
    transparent: true,
    opacity: 0.8
  })

  // Grass material
  const grassMaterial = new THREE.MeshToonMaterial({
    color: 0x4a7c3f,
    gradientMap
  })

  // Sprite body colors
  const spriteColors = [0xff6b9d, 0x9b59b6, 0x3498db, 0x2ecc71]

  // === BOOT STRUCTURE (Continuous realistic boot shape) ===

  // The boot is built as overlapping shapes with the same material
  // to create a seamless, continuous appearance

  // --- SOLE (follows the boot footprint) ---
  // Main sole - elongated with rounded ends
  const soleLength = 1.1
  const soleWidth = 0.5
  const soleHeight = 0.1

  // Sole base
  const soleBaseGeom = new THREE.BoxGeometry(soleLength - 0.3, soleHeight, soleWidth - 0.1)
  const soleBase = new THREE.Mesh(soleBaseGeom, soleMaterial)
  soleBase.position.set(0, soleHeight / 2, 0)
  group.add(soleBase)

  // Sole toe cap (rounded front)
  const soleToeGeom = new THREE.CylinderGeometry(soleWidth / 2 - 0.05, soleWidth / 2 - 0.05, soleHeight, 12)
  soleToeGeom.rotateX(Math.PI / 2)
  const soleToe = new THREE.Mesh(soleToeGeom, soleMaterial)
  soleToe.position.set(-soleLength / 2 + 0.15, soleHeight / 2, 0)
  group.add(soleToe)

  // Sole heel cap (rounded back)
  const soleHeelGeom = new THREE.CylinderGeometry(soleWidth / 2 - 0.05, soleWidth / 2 - 0.05, soleHeight * 1.3, 12)
  soleHeelGeom.rotateX(Math.PI / 2)
  const soleHeel = new THREE.Mesh(soleHeelGeom, soleMaterial)
  soleHeel.position.set(soleLength / 2 - 0.2, soleHeight * 0.65, 0)
  group.add(soleHeel)

  // --- FOOT PORTION (continuous with ankle) ---

  // Lower foot - the part that sits on the sole
  // Uses a squashed capsule shape tilted up at the toe
  const footBaseGeom = new THREE.CapsuleGeometry(0.22, 0.5, 8, 12)
  footBaseGeom.rotateZ(Math.PI / 2) // Lay it horizontal
  footBaseGeom.scale(1, 0.75, 1) // Flatten slightly
  const footBase = new THREE.Mesh(footBaseGeom, leatherMaterial)
  footBase.position.set(-0.1, 0.28, 0)
  footBase.rotation.z = -0.15 // Tilt toe up slightly
  group.add(footBase)

  // Toe box - rounded front that curves upward
  const toeBoxGeom = new THREE.SphereGeometry(0.28, 12, 10)
  toeBoxGeom.scale(0.9, 0.85, 1.0)
  const toeBox = new THREE.Mesh(toeBoxGeom, leatherMaterial)
  toeBox.position.set(-0.48, 0.26, 0)
  group.add(toeBox)

  // --- ANKLE/SHAFT (rises from heel, connects to foot) ---

  // Ankle transition - connects foot to shaft smoothly
  const ankleTransitionGeom = new THREE.SphereGeometry(0.34, 12, 10)
  ankleTransitionGeom.scale(1.0, 0.8, 1.0)
  const ankleTransition = new THREE.Mesh(ankleTransitionGeom, leatherMaterial)
  ankleTransition.position.set(0.25, 0.35, 0)
  group.add(ankleTransition)

  // Main shaft (ankle part) - tapers slightly upward
  const shaftGeom = new THREE.CylinderGeometry(0.28, 0.34, 0.75, 14)
  const shaft = new THREE.Mesh(shaftGeom, leatherMaterial)
  shaft.position.set(0.25, 0.72, 0)
  group.add(shaft)

  // Shaft top rim
  const shaftTopGeom = new THREE.TorusGeometry(0.30, 0.04, 8, 20)
  const shaftTop = new THREE.Mesh(shaftTopGeom, leatherMaterial)
  shaftTop.position.set(0.25, 1.1, 0)
  shaftTop.rotation.x = Math.PI / 2
  group.add(shaftTop)

  // --- INSTEP/VAMP (connects toe to ankle on top) ---

  // This fills the gap between toe and shaft on top of the foot
  const vampGeom = new THREE.CapsuleGeometry(0.18, 0.35, 6, 10)
  vampGeom.rotateZ(Math.PI / 2)
  vampGeom.scale(1, 0.7, 0.9)
  const vamp = new THREE.Mesh(vampGeom, leatherMaterial)
  vamp.position.set(-0.08, 0.38, 0)
  vamp.rotation.z = -0.4 // Angle down toward toe
  group.add(vamp)

  // --- HEEL COUNTER (back of heel, reinforcement) ---
  const heelCounterGeom = new THREE.CylinderGeometry(0.26, 0.3, 0.25, 14, 1, false, -Math.PI * 0.6, Math.PI * 1.2)
  const heelCounter = new THREE.Mesh(heelCounterGeom, darkLeatherMaterial)
  heelCounter.position.set(0.35, 0.22, 0)
  group.add(heelCounter)

  // --- TONGUE ---
  const tongueGeom = new THREE.CapsuleGeometry(0.08, 0.25, 4, 8)
  const tongue = new THREE.Mesh(tongueGeom, laceMaterial)
  tongue.position.set(0.0, 0.55, 0.26)
  tongue.rotation.x = 0.35
  tongue.rotation.z = -0.1
  group.add(tongue)

  // --- LACING DETAILS ---
  const laceCordMaterial = new THREE.MeshToonMaterial({
    color: 0xf5deb3,
    gradientMap
  })

  // Lace eyelets (holes)
  const eyeletGeom = new THREE.TorusGeometry(0.025, 0.008, 6, 12)
  for (let i = 0; i < 4; i++) {
    const y = 0.42 + i * 0.12
    const z = 0.28 - i * 0.02

    const eyeletL = new THREE.Mesh(eyeletGeom, darkLeatherMaterial)
    eyeletL.position.set(-0.06, y, z)
    eyeletL.rotation.x = Math.PI / 2 - 0.3
    group.add(eyeletL)

    const eyeletR = new THREE.Mesh(eyeletGeom, darkLeatherMaterial)
    eyeletR.position.set(0.08, y, z)
    eyeletR.rotation.x = Math.PI / 2 - 0.3
    group.add(eyeletR)
  }

  // Cross-laces
  for (let i = 0; i < 3; i++) {
    const y = 0.48 + i * 0.12
    const z = 0.30 - i * 0.02
    const cordGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.16, 4)
    const cord = new THREE.Mesh(cordGeom, laceCordMaterial)
    cord.position.set(0.01, y, z)
    cord.rotation.z = Math.PI / 2
    cord.rotation.y = 0.3
    group.add(cord)
  }

  // Bow at top of lacing
  const bowLoopGeom = new THREE.TorusGeometry(0.04, 0.012, 6, 12, Math.PI)
  const bowL = new THREE.Mesh(bowLoopGeom, laceCordMaterial)
  bowL.position.set(-0.04, 0.82, 0.24)
  bowL.rotation.y = Math.PI / 2
  bowL.rotation.x = 0.5
  group.add(bowL)

  const bowR = new THREE.Mesh(bowLoopGeom, laceCordMaterial)
  bowR.position.set(0.06, 0.82, 0.24)
  bowR.rotation.y = -Math.PI / 2
  bowR.rotation.x = 0.5
  group.add(bowR)

  // Bow tails
  const tailGeom = new THREE.CylinderGeometry(0.01, 0.006, 0.12, 4)
  const tailL = new THREE.Mesh(tailGeom, laceCordMaterial)
  tailL.position.set(-0.06, 0.76, 0.26)
  tailL.rotation.z = 0.4
  tailL.rotation.x = 0.3
  group.add(tailL)

  const tailR = new THREE.Mesh(tailGeom, laceCordMaterial)
  tailR.position.set(0.08, 0.76, 0.26)
  tailR.rotation.z = -0.4
  tailR.rotation.x = 0.3
  group.add(tailR)

  // === WINDOWS ===

  // Round window on toe
  const toeWindowGeom = new THREE.CircleGeometry(0.07, 12)
  const toeWindow = new THREE.Mesh(toeWindowGeom, windowMaterial)
  toeWindow.position.set(-0.72, 0.28, 0)
  toeWindow.rotation.y = -Math.PI / 2
  group.add(toeWindow)

  // Window frame
  const toeFrameGeom = new THREE.TorusGeometry(0.07, 0.012, 4, 16)
  const toeFrame = new THREE.Mesh(toeFrameGeom, darkLeatherMaterial)
  toeFrame.position.set(-0.71, 0.28, 0)
  toeFrame.rotation.y = -Math.PI / 2
  group.add(toeFrame)

  // Windows on shaft (2 on sides)
  for (let i = 0; i < 2; i++) {
    const angle = (i === 0) ? Math.PI * 0.65 : -Math.PI * 0.65
    const wx = 0.25 + Math.sin(angle) * 0.29
    const wz = Math.cos(angle) * 0.29

    const shaftWindowGeom = new THREE.CircleGeometry(0.06, 10)
    const shaftWindow = new THREE.Mesh(shaftWindowGeom, windowMaterial)
    shaftWindow.position.set(wx, 0.7, wz)
    shaftWindow.rotation.y = angle + Math.PI
    group.add(shaftWindow)

    // Frame
    const frameGeom = new THREE.TorusGeometry(0.06, 0.01, 4, 12)
    const frame = new THREE.Mesh(frameGeom, darkLeatherMaterial)
    frame.position.set(wx, 0.7, wz)
    frame.rotation.y = angle + Math.PI
    group.add(frame)
  }

  // === BENDY CHIMNEY ===

  const chimneyGroup = new THREE.Group()
  chimneyGroup.userData.isChimney = true

  // Build a crooked/bendy chimney from segments
  const segments = [
    { y: 0, height: 0.15, radius: 0.06, tiltX: 0, tiltZ: 0.15 },
    { y: 0.14, height: 0.12, radius: 0.055, tiltX: 0.1, tiltZ: -0.2 },
    { y: 0.25, height: 0.12, radius: 0.05, tiltX: -0.15, tiltZ: 0.25 },
    { y: 0.36, height: 0.1, radius: 0.045, tiltX: 0.05, tiltZ: -0.1 }
  ]

  let lastPos = new THREE.Vector3(0, 0, 0)
  for (const seg of segments) {
    const segGeom = new THREE.CylinderGeometry(seg.radius * 0.9, seg.radius, seg.height, 6)
    const segMesh = new THREE.Mesh(segGeom, brickMaterial)
    segMesh.position.copy(lastPos)
    segMesh.position.y += seg.height / 2
    segMesh.rotation.x = seg.tiltX
    segMesh.rotation.z = seg.tiltZ
    chimneyGroup.add(segMesh)

    // Track where next segment starts (approximate offset from tilt)
    lastPos.y += seg.height
    lastPos.x += Math.sin(seg.tiltZ) * seg.height * 0.5
    lastPos.z += Math.sin(seg.tiltX) * seg.height * 0.5
  }

  // Chimney cap
  const capGeom = new THREE.CylinderGeometry(0.06, 0.04, 0.04, 6)
  const cap = new THREE.Mesh(capGeom, darkLeatherMaterial)
  cap.position.copy(lastPos)
  cap.position.y += 0.02
  chimneyGroup.add(cap)

  // Smoke puffs
  const smokeGroup = new THREE.Group()
  const smokeMaterial = new THREE.MeshBasicMaterial({
    color: 0xdddddd,
    transparent: true,
    opacity: 0.5
  })

  for (let i = 0; i < 4; i++) {
    const puffGeom = new THREE.SphereGeometry(0.035, 6, 4)
    const puff = new THREE.Mesh(puffGeom, smokeMaterial.clone())
    puff.userData.isSmokePuff = true
    puff.userData.phase = i * 0.25
    puff.position.set(
      lastPos.x + (Math.random() - 0.5) * 0.02,
      lastPos.y + 0.05,
      lastPos.z + (Math.random() - 0.5) * 0.02
    )
    smokeGroup.add(puff)
  }
  chimneyGroup.add(smokeGroup)

  chimneyGroup.position.set(0.15, 1.1, -0.12)
  group.add(chimneyGroup)

  // === DOOR ===

  const doorGroup = new THREE.Group()

  // Arched door on the side of the toe/vamp area
  const doorGeom = new THREE.BoxGeometry(0.12, 0.22, 0.03)
  const door = new THREE.Mesh(doorGeom, darkLeatherMaterial)
  door.position.y = 0.11
  doorGroup.add(door)

  // Door arch
  const doorArchGeom = new THREE.SphereGeometry(0.06, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2)
  const doorArch = new THREE.Mesh(doorArchGeom, darkLeatherMaterial)
  doorArch.position.y = 0.22
  doorArch.rotation.x = Math.PI
  doorGroup.add(doorArch)

  // Door knob
  const knobGeom = new THREE.SphereGeometry(0.015, 6, 4)
  const knobMat = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap })
  const knob = new THREE.Mesh(knobGeom, knobMat)
  knob.position.set(0.04, 0.1, 0.02)
  doorGroup.add(knob)

  // Position door on the front-side of the boot
  doorGroup.position.set(-0.32, 0.1, 0.22)
  doorGroup.rotation.y = -0.4
  group.add(doorGroup)

  // === YARD WITH TALL GRASS PATCHES ===

  const yardGroup = new THREE.Group()
  yardGroup.userData.isYard = true

  // Create grass patches around the boot
  const grassPositions = [
    { x: -0.8, z: 0.35, count: 8 },
    { x: -0.75, z: -0.35, count: 6 },
    { x: 0.7, z: 0.4, count: 7 },
    { x: 0.75, z: -0.35, count: 5 },
    { x: 0.0, z: -0.55, count: 6 },
    { x: 0.0, z: 0.55, count: 5 }
  ]

  for (const patch of grassPositions) {
    for (let i = 0; i < patch.count; i++) {
      const bladeHeight = 0.12 + Math.random() * 0.15
      const bladeGeom = new THREE.ConeGeometry(0.015, bladeHeight, 4)
      const blade = new THREE.Mesh(bladeGeom, grassMaterial)

      const offsetX = (Math.random() - 0.5) * 0.2
      const offsetZ = (Math.random() - 0.5) * 0.2

      blade.position.set(
        patch.x + offsetX,
        bladeHeight / 2,
        patch.z + offsetZ
      )

      // Random lean
      blade.rotation.x = (Math.random() - 0.5) * 0.3
      blade.rotation.z = (Math.random() - 0.5) * 0.3

      blade.userData.isGrassBlade = true
      blade.userData.phase = Math.random() * Math.PI * 2
      blade.userData.baseRotX = blade.rotation.x
      blade.userData.baseRotZ = blade.rotation.z

      yardGroup.add(blade)
    }
  }

  group.add(yardGroup)

  // === TINY SPRITES ===

  const spritesGroup = new THREE.Group()
  spritesGroup.userData.isSpritesGroup = true

  // Create 4 tiny sprites that will run around
  for (let i = 0; i < 4; i++) {
    const sprite = new THREE.Group()
    sprite.userData.isBootSprite = true

    // Sprite body (small sphere)
    const bodyGeom = new THREE.SphereGeometry(0.04, 8, 6)
    const bodyMat = new THREE.MeshToonMaterial({
      color: spriteColors[i],
      gradientMap
    })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.y = 0.06
    sprite.add(body)

    // Tiny legs (2 little cylinders)
    const legGeom = new THREE.CylinderGeometry(0.008, 0.01, 0.04, 4)
    const legMat = new THREE.MeshToonMaterial({ color: 0x333333, gradientMap })

    const legL = new THREE.Mesh(legGeom, legMat)
    legL.position.set(-0.02, 0.02, 0)
    legL.userData.isLeg = true
    legL.userData.legSide = 'left'
    sprite.add(legL)

    const legR = new THREE.Mesh(legGeom, legMat)
    legR.position.set(0.02, 0.02, 0)
    legR.userData.isLeg = true
    legR.userData.legSide = 'right'
    sprite.add(legR)

    // Little eyes (2 white dots)
    const eyeGeom = new THREE.SphereGeometry(0.012, 6, 4)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const pupilGeom = new THREE.SphereGeometry(0.006, 4, 3)
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 })

    const eyeL = new THREE.Mesh(eyeGeom, eyeMat)
    eyeL.position.set(-0.015, 0.07, 0.03)
    sprite.add(eyeL)

    const pupilL = new THREE.Mesh(pupilGeom, pupilMat)
    pupilL.position.set(-0.015, 0.07, 0.04)
    sprite.add(pupilL)

    const eyeR = new THREE.Mesh(eyeGeom, eyeMat)
    eyeR.position.set(0.015, 0.07, 0.03)
    sprite.add(eyeR)

    const pupilR = new THREE.Mesh(pupilGeom, pupilMat)
    pupilR.position.set(0.015, 0.07, 0.04)
    sprite.add(pupilR)

    // Animation data
    sprite.userData.orbitRadius = 0.6 + Math.random() * 0.25
    sprite.userData.orbitSpeed = 0.8 + Math.random() * 0.6
    sprite.userData.orbitPhase = (i / 4) * Math.PI * 2
    sprite.userData.bobPhase = Math.random() * Math.PI * 2
    sprite.userData.orbitCenterX = 0.0 // Center of boot footprint
    sprite.userData.orbitCenterZ = 0

    // Initial position
    const angle = sprite.userData.orbitPhase
    sprite.position.set(
      sprite.userData.orbitCenterX + Math.cos(angle) * sprite.userData.orbitRadius,
      0,
      sprite.userData.orbitCenterZ + Math.sin(angle) * sprite.userData.orbitRadius
    )

    spritesGroup.add(sprite)
  }

  group.add(spritesGroup)

  // Mark for building identification
  group.userData.isBootHouse = true

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
    case 'boot_house':
      return createBootHouse(gradientMap)
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
