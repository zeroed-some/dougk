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

  // Water depth visual (darker center)
  const deepGeom = new THREE.CircleGeometry(radius * 0.6, 24)
  deepGeom.rotateX(-Math.PI / 2)
  const deepMaterial = new THREE.MeshToonMaterial({
    color: waterDeep,
    gradientMap: gradientMap,
    transparent: true,
    opacity: 0.5
  })
  const deep = new THREE.Mesh(deepGeom, deepMaterial)
  deep.position.y = -0.01
  group.add(deep)

  // Water highlight (light reflection)
  const highlightGeom = new THREE.CircleGeometry(radius * 0.3, 16)
  highlightGeom.rotateX(-Math.PI / 2)
  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: 0x88d4e8,
    transparent: true,
    opacity: 0.4
  })
  const highlight = new THREE.Mesh(highlightGeom, highlightMaterial)
  highlight.position.set(-radius * 0.35, 0.02, -radius * 0.35)
  group.add(highlight)

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
  // ============================================

  const sceneDistance = 12 // How far away the scenery is

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

  // Create mountain range (back-left)
  const mountains = new THREE.Group()

  // Large back mountain
  const bigMountainGeom = new THREE.ConeGeometry(3, 5, 6)
  const bigMountain = new THREE.Mesh(bigMountainGeom, mountainMaterial)
  bigMountain.position.set(-sceneDistance, 2, -sceneDistance * 0.8)
  bigMountain.rotation.y = 0.3
  mountains.add(bigMountain)

  // Snow cap for big mountain
  const snowCapGeom = new THREE.ConeGeometry(1.2, 1.5, 6)
  const snowCap = new THREE.Mesh(snowCapGeom, mountainSnowMaterial)
  snowCap.position.set(-sceneDistance, 4.2, -sceneDistance * 0.8)
  snowCap.rotation.y = 0.3
  mountains.add(snowCap)

  // Medium mountain
  const medMountainGeom = new THREE.ConeGeometry(2.2, 3.5, 5)
  const medMountain = new THREE.Mesh(medMountainGeom, mountainDarkMaterial)
  medMountain.position.set(-sceneDistance * 0.7, 1.5, -sceneDistance)
  medMountain.rotation.y = -0.2
  mountains.add(medMountain)

  // Small mountain
  const smallMountainGeom = new THREE.ConeGeometry(1.8, 2.8, 5)
  const smallMountain = new THREE.Mesh(smallMountainGeom, mountainMaterial)
  smallMountain.position.set(-sceneDistance * 1.1, 1.2, -sceneDistance * 0.5)
  mountains.add(smallMountain)

  // Another range on the right side (further back)
  const farMountainGeom = new THREE.ConeGeometry(2.5, 4, 5)
  const farMountain = new THREE.Mesh(farMountainGeom, mountainDarkMaterial)
  farMountain.position.set(sceneDistance * 0.5, 1.8, -sceneDistance * 1.2)
  mountains.add(farMountain)

  const farSnowGeom = new THREE.ConeGeometry(0.9, 1.2, 5)
  const farSnow = new THREE.Mesh(farSnowGeom, mountainSnowMaterial)
  farSnow.position.set(sceneDistance * 0.5, 3.6, -sceneDistance * 1.2)
  mountains.add(farSnow)

  group.add(mountains)

  // ============================================
  // VILLAGE
  // ============================================

  const village = new THREE.Group()
  const villageX = sceneDistance * 0.8
  const villageZ = -sceneDistance * 0.4

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

  // Helper to create a simple house
  function createHouse(x, z, scale, roofMat) {
    const houseGroup = new THREE.Group()

    // House body
    const bodyGeom = new THREE.BoxGeometry(0.8, 0.6, 0.6)
    const body = new THREE.Mesh(bodyGeom, houseMaterial)
    body.position.y = 0.3
    houseGroup.add(body)

    // Roof
    const roofGeom = new THREE.ConeGeometry(0.55, 0.5, 4)
    const roof = new THREE.Mesh(roofGeom, roofMat)
    roof.position.y = 0.75
    roof.rotation.y = Math.PI / 4
    houseGroup.add(roof)

    // Window
    const windowGeom = new THREE.PlaneGeometry(0.15, 0.15)
    const windowMesh = new THREE.Mesh(windowGeom, windowMaterial)
    windowMesh.position.set(0.401, 0.35, 0)
    houseGroup.add(windowMesh)

    houseGroup.position.set(x, 0, z)
    houseGroup.scale.setScalar(scale)
    houseGroup.rotation.y = Math.random() * 0.5 - 0.25

    return houseGroup
  }

  // Create village houses
  const house1 = createHouse(villageX, villageZ, 1.2, roofMaterial)
  village.add(house1)

  const house2 = createHouse(villageX + 1.5, villageZ + 0.8, 0.9, roofRedMaterial)
  village.add(house2)

  const house3 = createHouse(villageX + 0.5, villageZ + 1.5, 1.0, roofMaterial)
  village.add(house3)

  const house4 = createHouse(villageX - 0.8, villageZ + 0.6, 0.8, roofRedMaterial)
  village.add(house4)

  // Chimney on main house
  const chimneyGeom = new THREE.BoxGeometry(0.15, 0.4, 0.15)
  const chimney = new THREE.Mesh(chimneyGeom, new THREE.MeshToonMaterial({
    color: 0x8b7355,
    gradientMap: gradientMap
  }))
  chimney.position.set(villageX + 0.2, 1.1, villageZ + 0.1)
  village.add(chimney)

  // Smoke particles
  const smokeParticles = []
  const smokeMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.6
  })

  function createSmokeParticle() {
    const size = 0.1 + Math.random() * 0.1
    const smokeGeom = new THREE.SphereGeometry(size, 6, 4)
    const smoke = new THREE.Mesh(smokeGeom, smokeMaterial.clone())
    smoke.position.set(
      villageX + 0.2 + (Math.random() - 0.5) * 0.1,
      1.3,
      villageZ + 0.1 + (Math.random() - 0.5) * 0.1
    )
    village.add(smoke)
    smokeParticles.push({
      mesh: smoke,
      age: 0,
      maxAge: 3 + Math.random() * 2,
      driftX: (Math.random() - 0.5) * 0.3,
      driftZ: (Math.random() - 0.5) * 0.3,
      riseSpeed: 0.3 + Math.random() * 0.2
    })
  }

  // Initial smoke
  for (let i = 0; i < 5; i++) {
    createSmokeParticle()
    smokeParticles[i].age = Math.random() * 2 // Stagger initial ages
  }

  group.add(village)

  // Small trees near village
  const treeMaterial = new THREE.MeshToonMaterial({
    color: 0x2d5a3d,
    gradientMap: gradientMap
  })
  const trunkMaterial = new THREE.MeshToonMaterial({
    color: 0x5c4033,
    gradientMap: gradientMap
  })

  for (let i = 0; i < 6; i++) {
    const treeGroup = new THREE.Group()

    // Trunk
    const trunkGeom = new THREE.CylinderGeometry(0.08, 0.12, 0.5, 6)
    const trunk = new THREE.Mesh(trunkGeom, trunkMaterial)
    trunk.position.y = 0.25
    treeGroup.add(trunk)

    // Foliage (stacked cones)
    const foliage1 = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.6, 6), treeMaterial)
    foliage1.position.y = 0.7
    treeGroup.add(foliage1)

    const foliage2 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 6), treeMaterial)
    foliage2.position.y = 1.1
    treeGroup.add(foliage2)

    const angle = (i / 6) * Math.PI * 0.8 - 0.4
    const dist = sceneDistance * 0.6 + Math.random() * 2
    treeGroup.position.set(
      Math.cos(angle) * dist + villageX * 0.3,
      0,
      Math.sin(angle) * dist + villageZ * 0.3
    )
    treeGroup.scale.setScalar(0.6 + Math.random() * 0.4)

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
    highlight.position.x = -radius * 0.35 + Math.sin(elapsed * 0.5) * 0.2
    highlight.position.z = -radius * 0.35 + Math.cos(elapsed * 0.5) * 0.2

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

  return {
    group,
    water,
    radius,
    addRipple,
    update
  }
}
