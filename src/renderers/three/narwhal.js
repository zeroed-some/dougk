// Donny the Narwhal - distinguished gentleman of the deep
import * as THREE from 'three'
import gameState from './gameState.js'

export function createDonny(scene, gradientMap) {
  const group = new THREE.Group()

  // Store gradientMap for accessory creation
  const storedGradientMap = gradientMap

  // Default colors
  const defaultColors = {
    body: 0x7a9eb8,
    belly: 0xc8d8e4,
    monocleRim: 0xd4af37,
    monocleGlass: 0x88ccff
  }

  // Materials (stored for outfit swapping)
  const bodyMaterial = new THREE.MeshToonMaterial({
    color: defaultColors.body,
    gradientMap: gradientMap
  })

  const bellyMaterial = new THREE.MeshToonMaterial({
    color: defaultColors.belly,
    gradientMap: gradientMap
  })

  const tuskMaterial = new THREE.MeshToonMaterial({
    color: 0xf5f0e6,
    gradientMap: gradientMap
  })

  const monocleMaterial = new THREE.MeshToonMaterial({
    color: defaultColors.monocleRim,
    gradientMap: gradientMap
  })

  const glassMaterial = new THREE.MeshBasicMaterial({
    color: defaultColors.monocleGlass,
    transparent: true,
    opacity: 0.3
  })

  // Accessory tracking
  const accessories = {
    head: null,
    clothing: null
  }

  // Mount points
  const mountPoints = {
    head: new THREE.Vector3(1.0, 0.55, 0)
  }

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

  // The magnificent tusk! - positioned so base touches front of head
  const tuskGeom = new THREE.ConeGeometry(0.05, 1.4, 6)
  // Shift geometry so base is at origin, tip extends in +Y
  tuskGeom.translate(0, 0.7, 0)
  const tusk = new THREE.Mesh(tuskGeom, tuskMaterial)
  // Position at front of head
  tusk.position.set(1.35, 0.4, 0)
  // Rotate to point forward and slightly up
  tusk.rotation.z = -Math.PI / 2 + 0.2
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
    color: defaultColors.monocleRim,
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
    mode: 'waiting', // 'waiting', 'rumbling', 'emerging', 'surfaced', 'submerging', 'shop_approaching', 'shop_ready', 'shop_departing'
    timer: 30 + Math.random() * 30, // First appearance in 30-60 seconds
    emergeX: 0,
    emergeZ: 0,
    surfaceTime: 0,
    // Shop state
    shopMode: false,
    shopCooldown: 0,
    onShopReady: null
  }

  // Shop trigger thresholds
  const SHOP_KOI_THRESHOLD = 5 // Lower threshold for first shop experience
  const SHOP_COOLDOWN = 45 // seconds between shop approaches

  function startRumble(pond) {
    state.mode = 'rumbling'
    state.timer = 0

    // Pick random spot in the pond, avoiding forbidden zones (dock, boat)
    let attempts = 0
    let angle, dist
    do {
      angle = Math.random() * Math.PI * 2
      dist = Math.random() * pond.radius * 0.5 + pond.radius * 0.2
      state.emergeX = Math.cos(angle) * dist
      state.emergeZ = Math.sin(angle) * dist
      attempts++
    } while (!pond.isValidEmergenceSpot(state.emergeX, state.emergeZ) && attempts < 20)

    group.position.x = state.emergeX
    group.position.z = state.emergeZ
    group.rotation.y = angle + Math.PI / 2 // Face outward-ish
  }

  function startShopApproach(pond, doug) {
    state.mode = 'shop_approaching'
    state.shopMode = true
    state.timer = 0

    // Emerge near Doug
    const dougPos = doug.getPosition()
    const approachAngle = Math.random() * Math.PI * 2
    const approachDist = 1.5 // Close to Doug

    state.emergeX = dougPos.x + Math.cos(approachAngle) * approachDist
    state.emergeZ = dougPos.z + Math.sin(approachAngle) * approachDist

    // Clamp to pond bounds
    const distFromCenter = Math.hypot(state.emergeX, state.emergeZ)
    if (distFromCenter > pond.radius * 0.85) {
      const scale = (pond.radius * 0.85) / distFromCenter
      state.emergeX *= scale
      state.emergeZ *= scale
    }

    group.position.x = state.emergeX
    group.position.z = state.emergeZ
    group.visible = true
    group.position.y = -2
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
        group.position.y = -2 + easeOut * 2.25 // Rise higher out of water (10% less)

        // Slowly turn toward Doug - lugubrious, not laser tracking
        group.rotation.y = lerpAngle(group.rotation.y, angleToDoug, delta * 0.5)

        // Tilt nose UP ~50 degrees - rotate around Z since model faces +X (8% less)
        group.rotation.z = 0.87 * easeOut

        // Gentle side-to-side rocking
        group.rotation.x = Math.sin(state.timer * 4) * 0.06

        if (emergeProgress >= 1) {
          state.mode = 'surfaced'
          state.timer = 0
          state.surfaceTime = 4 + Math.random() * 3 // Stay 4-7 seconds
        }
        break

      case 'surfaced':
        // Bob gently, positioned at adjusted height
        group.position.y = 0.25 + Math.sin(elapsed * 2) * 0.06

        // Slowly turn toward Doug
        group.rotation.y = lerpAngle(group.rotation.y, angleToDoug, delta * 0.3)

        // Keep tilt ~50 degrees - nose up, tail in water
        group.rotation.z = 0.87 + Math.sin(elapsed * 1.5) * 0.04

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
        group.position.y = 0.25 - easeIn * 2.5

        // Tilt nose down as diving back under
        group.rotation.z = 0.87 - easeIn * 1.1

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

      case 'shop_approaching':
        // Rise from water for shop
        const shopEmergeProgress = Math.min(state.timer / 1.2, 1)
        const shopEaseOut = 1 - Math.pow(1 - shopEmergeProgress, 3)
        group.position.y = -2 + shopEaseOut * 2.25

        // Face Doug
        group.rotation.y = lerpAngle(group.rotation.y, angleToDoug, delta * 0.8)
        group.rotation.z = 0.87 * shopEaseOut

        if (shopEmergeProgress >= 1) {
          state.mode = 'shop_ready'
          state.timer = 0
          // Trigger shop UI callback
          if (state.onShopReady) {
            state.onShopReady('donny')
          }
        }
        break

      case 'shop_ready':
        // Bob gently while shop is open
        group.position.y = 0.25 + Math.sin(elapsed * 2) * 0.06
        group.rotation.y = lerpAngle(group.rotation.y, angleToDoug, delta * 0.3)
        group.rotation.z = 0.87 + Math.sin(elapsed * 1.5) * 0.04

        // Follow Doug while talking - swim toward him
        if (doug) {
          const dougPos = doug.getPosition()
          const dx = dougPos.x - group.position.x
          const dz = dougPos.z - group.position.z
          const distToDoug = Math.hypot(dx, dz)
          const minDist = 1.0 // Keep some distance from Doug

          if (distToDoug > minDist) {
            // Swim toward Doug - faster when farther away
            const approachSpeed = Math.min(distToDoug * 0.5, 1.5) * delta
            group.position.x += (dx / distToDoug) * approachSpeed
            group.position.z += (dz / distToDoug) * approachSpeed

            // Clamp to pond bounds
            const distFromCenter = Math.hypot(group.position.x, group.position.z)
            if (distFromCenter > pond.radius * 0.85) {
              const scale = (pond.radius * 0.85) / distFromCenter
              group.position.x *= scale
              group.position.z *= scale
            }
          }
        }

        // Flipper animation
        leftFlipper.rotation.z = 2.2 + Math.sin(elapsed * 3) * 0.15
        rightFlipper.rotation.z = 2.2 + Math.sin(elapsed * 3 + 0.5) * 0.15

        // Occasional ripples
        if (Math.random() < delta * 0.5) {
          pond.addRipple(
            group.position.x + (Math.random() - 0.5) * 0.5,
            group.position.z + (Math.random() - 0.5) * 0.5
          )
        }
        // Stay in this state until dismissShop() is called
        break

      case 'shop_departing':
        // Sink back down after shop closes
        const shopSubmergeProgress = Math.min(state.timer / 1.2, 1)
        const shopEaseIn = Math.pow(shopSubmergeProgress, 2)
        group.position.y = 0.25 - shopEaseIn * 2.5
        group.rotation.z = 0.87 - shopEaseIn * 1.1

        if (Math.random() < delta * 4) {
          pond.addRipple(
            group.position.x + (Math.random() - 0.5) * 0.6,
            group.position.z + (Math.random() - 0.5) * 0.6
          )
        }

        if (shopSubmergeProgress >= 1) {
          state.mode = 'waiting'
          state.timer = 0
          state.shopMode = false
          state.shopCooldown = SHOP_COOLDOWN
          group.visible = false
          group.position.y = -3
          group.rotation.x = 0
          group.rotation.z = 0
        }
        break
    }

    // Decrement shop cooldown
    if (state.shopCooldown > 0) {
      state.shopCooldown -= delta
    }
  }

  // Try to trigger shop approach (called from main loop)
  // Only approaches Doug on first emergence or when player unlocked new affordable items
  function tryTriggerShop(koiCount, pond, doug) {
    if (state.shopCooldown > 0) return false
    if (koiCount < SHOP_KOI_THRESHOLD) return false

    // Check if there's a reason to approach Doug
    if (!gameState.shouldCreatureApproach('donny')) {
      return false
    }

    // If waiting, do full approach sequence
    if (state.mode === 'waiting') {
      startShopApproach(pond, doug)
      gameState.markApproachComplete('donny')
      return true
    }

    // If already surfaced, transition directly to shop mode
    if (state.mode === 'surfaced') {
      state.mode = 'shop_ready'
      state.shopMode = true
      state.timer = 0
      gameState.markApproachComplete('donny')
      if (state.onShopReady) {
        state.onShopReady('donny')
      }
      return true
    }

    return false
  }

  // Dismiss shop and start departing
  function dismissShop() {
    if (state.mode === 'shop_ready') {
      state.mode = 'shop_departing'
      state.timer = 0
    }
  }

  // Set callback for when shop is ready
  function setShopReadyCallback(callback) {
    state.onShopReady = callback
  }

  // Check if in shop mode
  function isInShopMode() {
    return state.shopMode
  }

  // Apply an outfit to Donny
  function applyOutfit(outfit) {
    if (!outfit) return

    switch (outfit.type) {
      case 'color_body':
        if (outfit.colors) {
          if (outfit.colors.body) bodyMaterial.color.setHex(outfit.colors.body)
          if (outfit.colors.belly) bellyMaterial.color.setHex(outfit.colors.belly)
        }
        break

      case 'accessory_face':
        // Monocle color swap
        if (outfit.colors) {
          if (outfit.colors.rim) monocleMaterial.color.setHex(outfit.colors.rim)
          if (outfit.colors.glass) glassMaterial.color.setHex(outfit.colors.glass)
        }
        break

      case 'accessory_head':
        // Remove existing head accessory
        if (accessories.head) {
          group.remove(accessories.head)
          accessories.head = null
        }
        // Add new accessory
        if (outfit.meshFactory) {
          accessories.head = outfit.meshFactory(storedGradientMap)
          accessories.head.position.copy(mountPoints.head)
          group.add(accessories.head)
        }
        break

      case 'clothing_body':
        // Remove existing clothing
        if (accessories.clothing) {
          group.remove(accessories.clothing)
          accessories.clothing = null
        }
        // Add new clothing
        if (outfit.meshFactory) {
          accessories.clothing = outfit.meshFactory(storedGradientMap)
          // Clothing is positioned relative to body origin
          group.add(accessories.clothing)
        }
        break
    }
  }

  // Remove an outfit from Donny
  function removeOutfit(outfit) {
    if (!outfit) return

    switch (outfit.type) {
      case 'color_body':
        bodyMaterial.color.setHex(defaultColors.body)
        bellyMaterial.color.setHex(defaultColors.belly)
        break

      case 'accessory_face':
        monocleMaterial.color.setHex(defaultColors.monocleRim)
        glassMaterial.color.setHex(defaultColors.monocleGlass)
        break

      case 'accessory_head':
        if (accessories.head) {
          group.remove(accessories.head)
          accessories.head = null
        }
        break

      case 'clothing_body':
        if (accessories.clothing) {
          group.remove(accessories.clothing)
          accessories.clothing = null
        }
        break
    }
  }

  // Check if Donny can be tapped to open shop
  function isTappable() {
    // Tappable when visible and surfaced (not emerging/submerging)
    return group.visible && (state.mode === 'surfaced' || state.mode === 'shop_ready')
  }

  // Manually trigger shop (for tap-to-shop feature)
  function triggerShopFromTap(pond, doug) {
    if (state.mode === 'surfaced') {
      // Already surfaced - transition to shop mode
      state.mode = 'shop_ready'
      state.shopMode = true
      state.timer = 0
      if (state.onShopReady) {
        state.onShopReady('donny')
      }
      return true
    }
    return false
  }

  return {
    group,
    update,
    tryTriggerShop,
    dismissShop,
    setShopReadyCallback,
    isInShopMode,
    isTappable,
    triggerShopFromTap,
    applyOutfit,
    removeOutfit
  }
}
