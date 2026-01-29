// Pond environment - 3D water, shore, and fence with Wind Waker styling
import * as THREE from 'three'

export function createPond(scene, gradientMap) {
  const group = new THREE.Group()
  const radius = 4

  // Colors
  const waterColor = 0x46a0be // Vibrant teal
  const waterDeep = 0x2d7a94 // Darker teal
  const shoreColor = 0x78b456 // Bright grass green
  const sandColor = 0xc8b080 // Sandy edge
  const fenceColor = 0xb4823c // Warm wood

  // Materials
  const waterMaterial = new THREE.MeshToonMaterial({
    color: waterColor,
    gradientMap: gradientMap,
    transparent: true,
    opacity: 0.9
  })

  const shoreMaterial = new THREE.MeshToonMaterial({
    color: shoreColor,
    gradientMap: gradientMap
  })

  const sandMaterial = new THREE.MeshToonMaterial({
    color: sandColor,
    gradientMap: gradientMap
  })

  const fenceMaterial = new THREE.MeshToonMaterial({
    color: fenceColor,
    gradientMap: gradientMap
  })

  // Ground plane (grass)
  const groundGeom = new THREE.CircleGeometry(radius + 2.5, 32)
  groundGeom.rotateX(-Math.PI / 2)
  const ground = new THREE.Mesh(groundGeom, shoreMaterial)
  ground.position.y = -0.05
  group.add(ground)

  // Sandy shore ring
  const sandGeom = new THREE.RingGeometry(radius - 0.2, radius + 0.5, 32)
  sandGeom.rotateX(-Math.PI / 2)
  const sand = new THREE.Mesh(sandGeom, sandMaterial)
  sand.position.y = -0.02
  group.add(sand)

  // Water surface
  const waterGeom = new THREE.CircleGeometry(radius, 32)
  waterGeom.rotateX(-Math.PI / 2)
  const water = new THREE.Mesh(waterGeom, waterMaterial)
  water.position.y = 0
  group.add(water)

  // Water depth visual (darker center with gradient)
  const deepGeom = new THREE.CircleGeometry(radius * 0.7, 32)
  deepGeom.rotateX(-Math.PI / 2)
  const deepMaterial = new THREE.MeshToonMaterial({
    color: waterDeep,
    gradientMap: gradientMap,
    transparent: true,
    opacity: 0.6
  })
  const deep = new THREE.Mesh(deepGeom, deepMaterial)
  deep.position.y = -0.02
  group.add(deep)

  // Secondary highlight shimmer
  const shimmerGeom = new THREE.CircleGeometry(radius * 0.5, 24)
  shimmerGeom.rotateX(-Math.PI / 2)
  const shimmerMaterial = new THREE.MeshBasicMaterial({
    color: 0x6bc4d8,
    transparent: true,
    opacity: 0.25
  })
  const shimmer = new THREE.Mesh(shimmerGeom, shimmerMaterial)
  shimmer.position.set(radius * 0.15, 0.01, radius * 0.15)
  group.add(shimmer)

  // Main highlight (sun reflection)
  const highlightGeom = new THREE.CircleGeometry(radius * 0.25, 16)
  highlightGeom.rotateX(-Math.PI / 2)
  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: 0xa8e8f8,
    transparent: true,
    opacity: 0.5
  })
  const highlight = new THREE.Mesh(highlightGeom, highlightMaterial)
  highlight.position.set(-radius * 0.35, 0.02, -radius * 0.35)
  group.add(highlight)

  // Small sparkle highlights
  const sparkles = []
  const sparkleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.7
  })
  for (let i = 0; i < 6; i++) {
    const sparkleGeom = new THREE.CircleGeometry(0.08 + Math.random() * 0.06, 6)
    sparkleGeom.rotateX(-Math.PI / 2)
    const sparkle = new THREE.Mesh(sparkleGeom, sparkleMaterial.clone())
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * radius * 0.8
    sparkle.position.set(
      Math.cos(angle) * dist,
      0.03,
      Math.sin(angle) * dist
    )
    sparkle.userData.baseX = sparkle.position.x
    sparkle.userData.baseZ = sparkle.position.z
    sparkle.userData.phase = Math.random() * Math.PI * 2
    group.add(sparkle)
    sparkles.push(sparkle)
  }

  // Grass tufts around the pond
  const grassTuftGeom = new THREE.ConeGeometry(0.15, 0.3, 4)
  const grassMaterial = new THREE.MeshToonMaterial({
    color: 0x4a8530,
    gradientMap: gradientMap
  })

  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2
    const dist = radius + 0.8 + Math.random() * 1.5

    const tuft = new THREE.Mesh(grassTuftGeom, grassMaterial)
    tuft.position.set(
      Math.cos(angle) * dist,
      0.1,
      Math.sin(angle) * dist
    )
    tuft.rotation.x = (Math.random() - 0.5) * 0.3
    tuft.rotation.z = (Math.random() - 0.5) * 0.3
    tuft.scale.setScalar(0.5 + Math.random() * 0.5)
    group.add(tuft)
  }

  // Rickety fence
  const fenceGroup = new THREE.Group()
  const fenceX = radius + 1
  const postCount = 5
  const postSpacing = 0.8

  for (let i = 0; i < postCount; i++) {
    const wobble = Math.sin(i * 1.5) * 0.1

    // Fence post
    const postGeom = new THREE.BoxGeometry(0.12, 0.8, 0.12)
    const post = new THREE.Mesh(postGeom, fenceMaterial)
    post.position.set(
      fenceX + wobble,
      0.35,
      -1.5 + i * postSpacing
    )
    post.rotation.x = wobble * 0.3
    post.rotation.z = wobble * 0.5
    fenceGroup.add(post)

    // Post cap
    const capGeom = new THREE.BoxGeometry(0.16, 0.06, 0.16)
    const cap = new THREE.Mesh(capGeom, fenceMaterial)
    cap.position.set(
      fenceX + wobble,
      0.78,
      -1.5 + i * postSpacing
    )
    cap.rotation.x = wobble * 0.3
    cap.rotation.z = wobble * 0.5
    fenceGroup.add(cap)
  }

  // Horizontal rails
  const railGeom = new THREE.BoxGeometry(0.08, 0.08, postSpacing * (postCount - 1) + 0.3)

  const topRail = new THREE.Mesh(railGeom, fenceMaterial)
  topRail.position.set(fenceX + 0.05, 0.6, -1.5 + (postCount - 1) * postSpacing / 2)
  topRail.rotation.y = 0.02
  fenceGroup.add(topRail)

  const bottomRail = new THREE.Mesh(railGeom, fenceMaterial)
  bottomRail.position.set(fenceX - 0.03, 0.25, -1.5 + (postCount - 1) * postSpacing / 2)
  bottomRail.rotation.y = -0.03
  fenceGroup.add(bottomRail)

  group.add(fenceGroup)

  // ============================================
  // DISTANT SCENERY - Mountains and Village
  // Scaled small like game board pieces!
  // ============================================

  // Mountain range materials
  const mountainMaterial = new THREE.MeshToonMaterial({
    color: 0x6b8e7a, // Muted green-grey
    gradientMap: gradientMap
  })
  const mountainSnowMaterial = new THREE.MeshToonMaterial({
    color: 0xe8e8f0, // Snow white with slight blue
    gradientMap: gradientMap
  })
  const mountainDarkMaterial = new THREE.MeshToonMaterial({
    color: 0x4a6b5a, // Darker mountain
    gradientMap: gradientMap
  })

  // Create mountain range (back-left corner)
  const mountains = new THREE.Group()

  // Large back mountain
  const bigMountainGeom = new THREE.ConeGeometry(0.8, 1.4, 6)
  const bigMountain = new THREE.Mesh(bigMountainGeom, mountainMaterial)
  bigMountain.position.set(-5.5, 0.7, -5)
  mountains.add(bigMountain)

  // Snow cap for big mountain
  const snowCapGeom = new THREE.ConeGeometry(0.35, 0.45, 6)
  const snowCap = new THREE.Mesh(snowCapGeom, mountainSnowMaterial)
  snowCap.position.set(-5.5, 1.35, -5)
  mountains.add(snowCap)

  // Medium mountain
  const medMountainGeom = new THREE.ConeGeometry(0.6, 1.0, 5)
  const medMountain = new THREE.Mesh(medMountainGeom, mountainDarkMaterial)
  medMountain.position.set(-4.5, 0.5, -5.8)
  mountains.add(medMountain)

  // Small mountain
  const smallMountainGeom = new THREE.ConeGeometry(0.5, 0.8, 5)
  const smallMountain = new THREE.Mesh(smallMountainGeom, mountainMaterial)
  smallMountain.position.set(-6.2, 0.4, -4.2)
  mountains.add(smallMountain)

  // Another tiny peak
  const tinyMountainGeom = new THREE.ConeGeometry(0.4, 0.6, 5)
  const tinyMountain = new THREE.Mesh(tinyMountainGeom, mountainDarkMaterial)
  tinyMountain.position.set(-5, 0.3, -4)
  mountains.add(tinyMountain)

  group.add(mountains)

  // ============================================
  // VILLAGE - tiny game-board scale!
  // ============================================

  const village = new THREE.Group()
  const villageX = 5.5
  const villageZ = -3

  // House materials
  const houseMaterial = new THREE.MeshToonMaterial({
    color: 0xd4a574, // Warm beige/tan
    gradientMap: gradientMap
  })
  const roofMaterial = new THREE.MeshToonMaterial({
    color: 0x8b4513, // Brown roof
    gradientMap: gradientMap
  })
  const roofRedMaterial = new THREE.MeshToonMaterial({
    color: 0xb85450, // Red roof
    gradientMap: gradientMap
  })
  const windowMaterial = new THREE.MeshToonMaterial({
    color: 0x87ceeb, // Light blue windows
    gradientMap: gradientMap
  })

  // Helper to create a tiny house
  function createHouse(x, z, scale, roofMat) {
    const houseGroup = new THREE.Group()

    // House body
    const bodyGeom = new THREE.BoxGeometry(0.3, 0.25, 0.25)
    const body = new THREE.Mesh(bodyGeom, houseMaterial)
    body.position.y = 0.125
    houseGroup.add(body)

    // Roof
    const roofGeom = new THREE.ConeGeometry(0.22, 0.2, 4)
    const roof = new THREE.Mesh(roofGeom, roofMat)
    roof.position.y = 0.32
    roof.rotation.y = Math.PI / 4
    houseGroup.add(roof)

    // Window (tiny dot)
    const windowGeom = new THREE.PlaneGeometry(0.06, 0.06)
    const windowMesh = new THREE.Mesh(windowGeom, windowMaterial)
    windowMesh.position.set(0.151, 0.14, 0)
    houseGroup.add(windowMesh)

    houseGroup.position.set(x, 0, z)
    houseGroup.scale.setScalar(scale)
    houseGroup.rotation.y = Math.random() * 0.5 - 0.25

    return houseGroup
  }

  // Create village houses - clustered together
  const house1 = createHouse(villageX, villageZ, 1.0, roofMaterial)
  village.add(house1)

  const house2 = createHouse(villageX + 0.5, villageZ + 0.3, 0.8, roofRedMaterial)
  village.add(house2)

  const house3 = createHouse(villageX + 0.2, villageZ + 0.6, 0.9, roofMaterial)
  village.add(house3)

  const house4 = createHouse(villageX - 0.35, villageZ + 0.25, 0.7, roofRedMaterial)
  village.add(house4)

  // Chimney on main house
  const chimneyGeom = new THREE.BoxGeometry(0.06, 0.15, 0.06)
  const chimney = new THREE.Mesh(chimneyGeom, new THREE.MeshToonMaterial({
    color: 0x8b7355,
    gradientMap: gradientMap
  }))
  chimney.position.set(villageX + 0.08, 0.45, villageZ + 0.04)
  village.add(chimney)

  // Smoke particles (tiny puffs)
  const smokeParticles = []
  const smokeMaterial = new THREE.MeshBasicMaterial({
    color: 0xdddddd,
    transparent: true,
    opacity: 0.5
  })

  function createSmokeParticle() {
    const size = 0.03 + Math.random() * 0.03
    const smokeGeom = new THREE.SphereGeometry(size, 5, 4)
    const smoke = new THREE.Mesh(smokeGeom, smokeMaterial.clone())
    smoke.position.set(
      villageX + 0.08 + (Math.random() - 0.5) * 0.03,
      0.52,
      villageZ + 0.04 + (Math.random() - 0.5) * 0.03
    )
    village.add(smoke)
    smokeParticles.push({
      mesh: smoke,
      age: 0,
      maxAge: 2.5 + Math.random() * 1.5,
      driftX: (Math.random() - 0.5) * 0.08,
      driftZ: (Math.random() - 0.5) * 0.08,
      riseSpeed: 0.12 + Math.random() * 0.08
    })
  }

  // Initial smoke
  for (let i = 0; i < 4; i++) {
    createSmokeParticle()
    smokeParticles[i].age = Math.random() * 1.5
  }

  group.add(village)

  // ============================================
  // BOATHOUSE - cozy little structure at pond corner
  // ============================================

  const boathouse = new THREE.Group()
  const boathouseX = -3.3
  const boathouseZ = 3.8

  // Boathouse materials
  const boathouseWoodMaterial = new THREE.MeshToonMaterial({
    color: 0x8b6914, // Weathered wood
    gradientMap: gradientMap
  })
  const boathouseRoofMaterial = new THREE.MeshToonMaterial({
    color: 0x5a4a3a, // Dark wood/slate roof
    gradientMap: gradientMap
  })
  const boathouseTrimMaterial = new THREE.MeshToonMaterial({
    color: 0x6b5030, // Darker trim
    gradientMap: gradientMap
  })

  // Main building - slightly larger than houses to dwarf Doug
  const boathouseBodyGeom = new THREE.BoxGeometry(1.2, 0.9, 1.0)
  const boathouseBody = new THREE.Mesh(boathouseBodyGeom, boathouseWoodMaterial)
  boathouseBody.position.set(0, 0.45, 0)
  boathouse.add(boathouseBody)

  // Roof - pitched roof
  const roofShape = new THREE.Shape()
  roofShape.moveTo(-0.75, 0)
  roofShape.lineTo(0, 0.5)
  roofShape.lineTo(0.75, 0)
  roofShape.lineTo(-0.75, 0)

  const roofExtrudeSettings = { depth: 1.15, bevelEnabled: false }
  const boathouseRoofGeom = new THREE.ExtrudeGeometry(roofShape, roofExtrudeSettings)
  const boathouseRoof = new THREE.Mesh(boathouseRoofGeom, boathouseRoofMaterial)
  boathouseRoof.position.set(0, 0.9, -0.575)
  boathouse.add(boathouseRoof)

  // Roof overhang trim
  const overhangGeom = new THREE.BoxGeometry(1.5, 0.05, 0.08)
  const overhangFront = new THREE.Mesh(overhangGeom, boathouseTrimMaterial)
  overhangFront.position.set(0, 0.92, 0.54)
  boathouse.add(overhangFront)
  const overhangBack = new THREE.Mesh(overhangGeom, boathouseTrimMaterial)
  overhangBack.position.set(0, 0.92, -0.54)
  boathouse.add(overhangBack)

  // Door opening (dark rectangle facing pond)
  const doorGeom = new THREE.PlaneGeometry(0.45, 0.6)
  const doorMaterial = new THREE.MeshToonMaterial({
    color: 0x1a1a1a,
    gradientMap: gradientMap
  })
  const door = new THREE.Mesh(doorGeom, doorMaterial)
  door.position.set(0.601, 0.35, 0.15)
  door.rotation.y = Math.PI / 2
  boathouse.add(door)

  // Window on side
  const boathouseWindowGeom = new THREE.PlaneGeometry(0.25, 0.2)
  const boathouseWindowMaterial = new THREE.MeshToonMaterial({
    color: 0x6b9bc3,
    gradientMap: gradientMap
  })
  const boathouseWindow = new THREE.Mesh(boathouseWindowGeom, boathouseWindowMaterial)
  boathouseWindow.position.set(0, 0.55, 0.51)
  boathouse.add(boathouseWindow)

  // Window frame
  const frameH = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.02, 0.02),
    boathouseTrimMaterial
  )
  frameH.position.set(0, 0.55, 0.52)
  boathouse.add(frameH)
  const frameV = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.25, 0.02),
    boathouseTrimMaterial
  )
  frameV.position.set(0, 0.55, 0.52)
  boathouse.add(frameV)

  // Dock/platform extending toward pond
  const dockGeom = new THREE.BoxGeometry(1.0, 0.08, 0.6)
  const dock = new THREE.Mesh(dockGeom, boathouseWoodMaterial)
  dock.position.set(1.1, 0.04, 0.15)
  boathouse.add(dock)

  // Dock support posts
  const dockPostGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.3, 6)
  const dockPost1 = new THREE.Mesh(dockPostGeom, boathouseTrimMaterial)
  dockPost1.position.set(1.5, -0.1, 0.35)
  boathouse.add(dockPost1)
  const dockPost2 = new THREE.Mesh(dockPostGeom, boathouseTrimMaterial)
  dockPost2.position.set(1.5, -0.1, -0.05)
  boathouse.add(dockPost2)

  // Position boathouse at corner, angled toward pond
  boathouse.position.set(boathouseX, 0, boathouseZ)
  boathouse.rotation.y = Math.PI / 4 + 0.3 // Angled toward pond center

  group.add(boathouse)

  // ============================================
  // ROWBOAT - floating by the dock
  // ============================================

  const rowboat = new THREE.Group()

  const rowboatWoodMaterial = new THREE.MeshToonMaterial({
    color: 0x6b4423, // Dark wood
    gradientMap: gradientMap
  })
  const rowboatTrimMaterial = new THREE.MeshToonMaterial({
    color: 0x8b5a2b, // Lighter trim
    gradientMap: gradientMap
  })

  // Boat hull - elongated bowl shape using lathe geometry
  const hullPoints = []
  hullPoints.push(new THREE.Vector2(0, 0))
  hullPoints.push(new THREE.Vector2(0.18, 0))
  hullPoints.push(new THREE.Vector2(0.22, 0.03))
  hullPoints.push(new THREE.Vector2(0.22, 0.1))
  hullPoints.push(new THREE.Vector2(0.18, 0.14))
  hullPoints.push(new THREE.Vector2(0, 0.14))

  const hullGeom = new THREE.LatheGeometry(hullPoints, 8)
  hullGeom.scale(1, 1, 2.2) // Stretch into boat shape
  const hull = new THREE.Mesh(hullGeom, rowboatWoodMaterial)
  hull.rotation.x = Math.PI // Flip right side up
  hull.position.y = 0.14
  rowboat.add(hull)

  // Boat seats (thwarts)
  const seatGeom = new THREE.BoxGeometry(0.32, 0.02, 0.08)
  const seat1 = new THREE.Mesh(seatGeom, rowboatTrimMaterial)
  seat1.position.set(0, 0.08, 0.15)
  rowboat.add(seat1)
  const seat2 = new THREE.Mesh(seatGeom, rowboatTrimMaterial)
  seat2.position.set(0, 0.08, -0.15)
  rowboat.add(seat2)

  // Oars resting in boat
  const oarMaterial = new THREE.MeshToonMaterial({
    color: 0x9b7b4a,
    gradientMap: gradientMap
  })
  const oarHandleGeom = new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6)
  const oarBladeGeom = new THREE.BoxGeometry(0.06, 0.01, 0.15)

  // Left oar
  const oar1 = new THREE.Group()
  const oarHandle1 = new THREE.Mesh(oarHandleGeom, oarMaterial)
  oarHandle1.rotation.z = Math.PI / 2
  oar1.add(oarHandle1)
  const oarBlade1 = new THREE.Mesh(oarBladeGeom, oarMaterial)
  oarBlade1.position.x = 0.28
  oar1.add(oarBlade1)
  oar1.position.set(0.12, 0.1, 0)
  oar1.rotation.y = 0.15
  rowboat.add(oar1)

  // Right oar
  const oar2 = new THREE.Group()
  const oarHandle2 = new THREE.Mesh(oarHandleGeom, oarMaterial)
  oarHandle2.rotation.z = Math.PI / 2
  oar2.add(oarHandle2)
  const oarBlade2 = new THREE.Mesh(oarBladeGeom, oarMaterial)
  oarBlade2.position.x = -0.28
  oar2.add(oarBlade2)
  oar2.position.set(-0.12, 0.1, 0)
  oar2.rotation.y = -0.15
  rowboat.add(oar2)

  // Position rowboat by the dock (in the water)
  // Place it at the pond edge near the dock - inside the water
  const rowboatAngle = Math.atan2(boathouseZ, boathouseX) // Angle from center to boathouse
  const rowboatDist = 2.7 // Closer to pond center
  rowboat.position.set(
    Math.cos(rowboatAngle) * rowboatDist,
    0,
    Math.sin(rowboatAngle) * rowboatDist
  )
  rowboat.rotation.y = rowboatAngle + Math.PI / 2 + 0.2 // Parallel to shore, slightly askew
  rowboat.userData.baseY = 0
  rowboat.userData.baseX = rowboat.position.x
  rowboat.userData.baseZ = rowboat.position.z
  rowboat.userData.phase = Math.random() * Math.PI * 2
  rowboat.userData.lastRipple = 0

  group.add(rowboat)

  // ============================================
  // TREES - scattered around the edges
  // ============================================

  const treeMaterial = new THREE.MeshToonMaterial({
    color: 0x2d5a3d,
    gradientMap: gradientMap
  })
  const trunkMaterial = new THREE.MeshToonMaterial({
    color: 0x5c4033,
    gradientMap: gradientMap
  })

  // Tree positions - scattered around the scene edges
  const treePositions = [
    { x: 5.2, z: -4.5, scale: 0.35 },
    { x: 6.2, z: -2.5, scale: 0.4 },
    { x: 4.8, z: -1.8, scale: 0.3 },
    { x: -5.8, z: -3.5, scale: 0.35 },
    { x: -4.8, z: -2.8, scale: 0.28 },
    { x: -6, z: 2, scale: 0.32 },
    { x: 5.5, z: 3, scale: 0.38 },
    { x: -4, z: 4.5, scale: 0.3 },
  ]

  for (const pos of treePositions) {
    const treeGroup = new THREE.Group()

    // Trunk
    const trunkGeom = new THREE.CylinderGeometry(0.04, 0.06, 0.25, 5)
    const trunk = new THREE.Mesh(trunkGeom, trunkMaterial)
    trunk.position.y = 0.125
    treeGroup.add(trunk)

    // Foliage (stacked cones)
    const foliage1 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 5), treeMaterial)
    foliage1.position.y = 0.35
    treeGroup.add(foliage1)

    const foliage2 = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.25, 5), treeMaterial)
    foliage2.position.y = 0.55
    treeGroup.add(foliage2)

    treeGroup.position.set(pos.x, 0, pos.z)
    treeGroup.scale.setScalar(pos.scale)

    group.add(treeGroup)
  }

  // Ripple system
  const ripples = []
  const rippleGeom = new THREE.RingGeometry(0.1, 0.15, 16)
  rippleGeom.rotateX(-Math.PI / 2)

  function addRipple(x, z) {
    const rippleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    })
    const ripple = new THREE.Mesh(rippleGeom.clone(), rippleMaterial)
    ripple.position.set(x, 0.02, z)

    group.add(ripple)
    ripples.push({
      mesh: ripple,
      age: 0,
      maxAge: 1.5
    })
  }

  let smokeSpawnTimer = 0

  function update(delta, elapsed) {
    // Animate water highlight
    highlight.position.x = -radius * 0.35 + Math.sin(elapsed * 0.5) * 0.3
    highlight.position.z = -radius * 0.35 + Math.cos(elapsed * 0.5) * 0.3
    highlight.material.opacity = 0.4 + Math.sin(elapsed * 2) * 0.1

    // Animate shimmer
    shimmer.position.x = radius * 0.15 + Math.cos(elapsed * 0.4) * 0.2
    shimmer.position.z = radius * 0.15 + Math.sin(elapsed * 0.3) * 0.2
    shimmer.material.opacity = 0.2 + Math.sin(elapsed * 1.5 + 1) * 0.1

    // Animate sparkles - twinkle effect
    for (const sparkle of sparkles) {
      const twinkle = Math.sin(elapsed * 4 + sparkle.userData.phase)
      sparkle.material.opacity = twinkle > 0.3 ? 0.8 : 0
      sparkle.position.x = sparkle.userData.baseX + Math.sin(elapsed * 0.5 + sparkle.userData.phase) * 0.1
      sparkle.position.z = sparkle.userData.baseZ + Math.cos(elapsed * 0.5 + sparkle.userData.phase) * 0.1
    }

    // Update ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i]
      ripple.age += delta

      const progress = ripple.age / ripple.maxAge
      ripple.mesh.scale.setScalar(1 + progress * 3)
      ripple.mesh.material.opacity = 0.6 * (1 - progress)

      if (ripple.age >= ripple.maxAge) {
        group.remove(ripple.mesh)
        ripple.mesh.geometry.dispose()
        ripple.mesh.material.dispose()
        ripples.splice(i, 1)
      }
    }

    // Spawn new smoke particles
    smokeSpawnTimer += delta
    if (smokeSpawnTimer > 0.8) {
      smokeSpawnTimer = 0
      createSmokeParticle()
    }

    // Animate rowboat - gentle bobbing and rocking
    const boatPhase = rowboat.userData.phase
    rowboat.position.y = rowboat.userData.baseY + Math.sin(elapsed * 1.2 + boatPhase) * 0.025
    rowboat.rotation.x = Math.sin(elapsed * 0.8 + boatPhase) * 0.03
    rowboat.rotation.z = Math.sin(elapsed * 1.0 + boatPhase + 1) * 0.025
    // Slight drift/tug motion
    rowboat.position.x = rowboat.userData.baseX + Math.sin(elapsed * 0.5 + boatPhase) * 0.015
    rowboat.position.z = rowboat.userData.baseZ + Math.cos(elapsed * 0.4 + boatPhase) * 0.015

    // Occasional ripples from rowboat
    rowboat.userData.lastRipple += delta
    if (rowboat.userData.lastRipple > 2.5 + Math.random() * 2) {
      rowboat.userData.lastRipple = 0
      addRipple(
        rowboat.position.x + (Math.random() - 0.5) * 0.3,
        rowboat.position.z + (Math.random() - 0.5) * 0.3
      )
    }

    // Update smoke particles
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
      const smoke = smokeParticles[i]
      smoke.age += delta

      // Rise and drift
      smoke.mesh.position.y += smoke.riseSpeed * delta
      smoke.mesh.position.x += smoke.driftX * delta
      smoke.mesh.position.z += smoke.driftZ * delta

      // Grow and fade
      const progress = smoke.age / smoke.maxAge
      smoke.mesh.scale.setScalar(1 + progress * 2)
      smoke.mesh.material.opacity = 0.6 * (1 - progress)

      if (smoke.age >= smoke.maxAge) {
        village.remove(smoke.mesh)
        smoke.mesh.geometry.dispose()
        smoke.mesh.material.dispose()
        smokeParticles.splice(i, 1)
      }
    }
  }

  scene.add(group)

  // Forbidden zones for creature emergence (dock and rowboat areas)
  const forbiddenZones = [
    { x: rowboat.position.x, z: rowboat.position.z, radius: 0.8 }, // Rowboat
    { // Dock area - extends from boathouse toward pond
      x: boathouseX + Math.cos(Math.PI / 4 + 0.3) * 1.5,
      z: boathouseZ + Math.sin(Math.PI / 4 + 0.3) * 1.5,
      radius: 1.2
    }
  ]

  function isValidEmergenceSpot(x, z) {
    for (const zone of forbiddenZones) {
      const dx = x - zone.x
      const dz = z - zone.z
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist < zone.radius) {
        return false
      }
    }
    return true
  }

  // Add a new forbidden zone (for placed buildings)
  function addForbiddenZone(x, z, zoneRadius) {
    forbiddenZones.push({ x, z, radius: zoneRadius })
  }

  // Get initial forbidden zones (for building placement)
  function getInitialForbiddenZones() {
    // Return copy of initial zones (rowboat and dock area)
    return forbiddenZones.slice(0, 2).map(z => ({ ...z }))
  }

  // Snap zones for building placement
  // Each zone has: id, position, angle (rotation), type, allowed buildings, occupied status
  const snapZones = [
    // Water edge zones (for docks, fishing huts) - all around the pond
    { id: 'water_n', x: 0, z: -4.3, angle: Math.PI, type: 'waterEdge', allowedBuildings: ['dock_wooden', 'fishing_hut', 'reeds'], occupied: false },
    { id: 'water_ne', x: 3.0, z: -3.0, angle: Math.PI * 0.75, type: 'waterEdge', allowedBuildings: ['dock_wooden', 'fishing_hut', 'reeds'], occupied: false },
    { id: 'water_e', x: 4.3, z: 0, angle: Math.PI * 0.5, type: 'waterEdge', allowedBuildings: ['dock_wooden', 'fishing_hut', 'reeds'], occupied: false },
    { id: 'water_se', x: 3.0, z: 3.0, angle: Math.PI * 0.25, type: 'waterEdge', allowedBuildings: ['dock_wooden', 'fishing_hut', 'reeds'], occupied: false },
    { id: 'water_s', x: 0, z: 4.3, angle: 0, type: 'waterEdge', allowedBuildings: ['dock_wooden', 'fishing_hut', 'reeds'], occupied: false },
    { id: 'water_sw', x: -3.0, z: 3.0, angle: -Math.PI * 0.25, type: 'waterEdge', allowedBuildings: ['dock_wooden', 'fishing_hut', 'reeds'], occupied: false },
    { id: 'water_w', x: -4.3, z: 0, angle: -Math.PI * 0.5, type: 'waterEdge', allowedBuildings: ['dock_wooden', 'fishing_hut', 'reeds'], occupied: false },
    { id: 'water_nw', x: -3.0, z: -3.0, angle: -Math.PI * 0.75, type: 'waterEdge', allowedBuildings: ['dock_wooden', 'fishing_hut', 'reeds'], occupied: false },

    // Shore zones (for lighthouse, fence, onion house) - further from water
    { id: 'shore_n', x: 0, z: -5.5, angle: Math.PI, type: 'shore', allowedBuildings: ['lighthouse', 'fence', 'onion_house'], occupied: false },
    { id: 'shore_ne', x: 4.0, z: -4.0, angle: Math.PI * 0.75, type: 'shore', allowedBuildings: ['lighthouse', 'fence', 'onion_house'], occupied: false },
    { id: 'shore_e', x: 5.5, z: 0, angle: Math.PI * 0.5, type: 'shore', allowedBuildings: ['lighthouse', 'fence', 'onion_house'], occupied: false },
    { id: 'shore_se', x: 4.0, z: 4.0, angle: Math.PI * 0.25, type: 'shore', allowedBuildings: ['lighthouse', 'fence', 'onion_house'], occupied: false },
    { id: 'shore_s', x: 0, z: 5.5, angle: 0, type: 'shore', allowedBuildings: ['lighthouse', 'fence', 'onion_house'], occupied: false },

    // In-water zones (for reeds)
    { id: 'water_inner_n', x: 0, z: -2.5, angle: Math.PI, type: 'water', allowedBuildings: ['reeds'], occupied: false },
    { id: 'water_inner_e', x: 2.5, z: 0, angle: Math.PI * 0.5, type: 'water', allowedBuildings: ['reeds'], occupied: false },
    { id: 'water_inner_s', x: 0, z: 2.5, angle: 0, type: 'water', allowedBuildings: ['reeds'], occupied: false },
    { id: 'water_inner_w', x: -2.5, z: 0, angle: -Math.PI * 0.5, type: 'water', allowedBuildings: ['reeds'], occupied: false }
  ]

  // Get available snap zones for a building type
  function getAvailableZones(buildingType) {
    return snapZones.filter(zone =>
      !zone.occupied && zone.allowedBuildings.includes(buildingType)
    )
  }

  // Get zone by ID
  function getZone(zoneId) {
    return snapZones.find(z => z.id === zoneId)
  }

  // Mark a zone as occupied
  function occupyZone(zoneId) {
    const zone = getZone(zoneId)
    if (zone) {
      zone.occupied = true
    }
  }

  // Find nearest valid zone to a point
  function findNearestZone(x, z, buildingType, snapDistance = 1.5) {
    const available = getAvailableZones(buildingType)
    let nearest = null
    let nearestDist = snapDistance

    for (const zone of available) {
      const dx = x - zone.x
      const dz = z - zone.z
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = zone
      }
    }

    return nearest
  }

  return {
    group,
    water,
    radius,
    addRipple,
    update,
    isValidEmergenceSpot,
    addForbiddenZone,
    getInitialForbiddenZones,
    snapZones,
    getAvailableZones,
    getZone,
    occupyZone,
    findNearestZone
  }
}
