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
