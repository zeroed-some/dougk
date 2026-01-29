// Building placement system for dougk
// Constraint-based freeform placement with real-time validation

import * as THREE from 'three'
import { createBuilding, createGhostBuilding } from './buildings.js'
import inventory from './shop/inventory.js'
import { playPlaceBuilding } from './sounds.js'
import { BUILDINGS } from './shop/items.js'

// Placement states
const STATE = {
  INACTIVE: 'inactive',
  SELECTING: 'selecting'
}

// Terrain types
const TERRAIN = {
  WATER: 'water',
  WATER_EDGE: 'waterEdge',
  SHORE: 'shore',
  OUT_OF_BOUNDS: 'outOfBounds'
}

// Building terrain requirements
const BUILDING_TERRAIN = {
  dock_wooden: [TERRAIN.WATER_EDGE],
  fishing_hut: [TERRAIN.WATER_EDGE],
  lighthouse: [TERRAIN.SHORE],
  reeds: [TERRAIN.WATER, TERRAIN.WATER_EDGE],
  fence: [TERRAIN.SHORE],
  onion_house: [TERRAIN.SHORE],
  boot_house: [TERRAIN.SHORE]
}

// Building collision radii (for overlap detection)
const BUILDING_COLLISION_RADIUS = {
  dock_wooden: 0.8,
  fishing_hut: 0.7,
  lighthouse: 0.5,
  reeds: 0.3,
  fence: 0.25,
  onion_house: 0.5,
  boot_house: 1.0
}

export class PlacementManager {
  constructor(scene, pond, camera, gradientMap) {
    this.scene = scene
    this.pond = pond
    this.camera = camera
    this.gradientMap = gradientMap

    this.state = STATE.INACTIVE
    this.currentBuildingType = null
    this.ghostMesh = null
    this.isValidPosition = false
    this.currentPosition = new THREE.Vector3()
    this.currentRotation = 0
    this.placedBuildings = new THREE.Group()

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    // Pond geometry constants
    this.pondCenter = new THREE.Vector2(0, 0)
    this.pondRadius = 4.0  // Water radius

    // Terrain zone boundaries (distance from center)
    this.terrainBounds = {
      waterInner: 3.2,      // Deep water
      waterEdgeInner: 3.2,  // Water edge starts
      waterEdgeOuter: 4.8,  // Water edge ends
      shoreInner: 4.3,      // Shore starts
      shoreOuter: 7.0,      // Shore ends (map bounds)
      mapBounds: 8.0        // Absolute map edge
    }

    // Invisible ground plane for raycasting
    this.groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshBasicMaterial({ visible: false })
    )
    this.groundPlane.rotation.x = -Math.PI / 2
    this.groundPlane.position.y = 0
    scene.add(this.groundPlane)

    // Building forbidden radius (for creature emergence)
    this.buildingRadius = {
      dock_wooden: 1.0,
      fishing_hut: 0.9,
      lighthouse: 0.5,
      reeds: 0.4,
      fence: 0.3,
      onion_house: 0.6,
      boot_house: 1.2
    }

    // Placed building positions for collision detection
    this.placedPositions = []

    // Forbidden zones (rowboat, dock area, etc.)
    this.forbiddenZones = []

    scene.add(this.placedBuildings)

    // Callbacks
    this.onPlacementComplete = null
    this.onPlacementCancel = null
  }

  // Get terrain type at a position
  getTerrainType(x, z) {
    const dx = x - this.pondCenter.x
    const dz = z - this.pondCenter.y
    const distance = Math.sqrt(dx * dx + dz * dz)

    if (distance > this.terrainBounds.mapBounds) {
      return TERRAIN.OUT_OF_BOUNDS
    }

    if (distance > this.terrainBounds.shoreOuter) {
      return TERRAIN.OUT_OF_BOUNDS
    }

    if (distance >= this.terrainBounds.shoreInner) {
      return TERRAIN.SHORE
    }

    if (distance >= this.terrainBounds.waterEdgeInner && distance <= this.terrainBounds.waterEdgeOuter) {
      return TERRAIN.WATER_EDGE
    }

    if (distance < this.terrainBounds.waterInner) {
      return TERRAIN.WATER
    }

    // Transition zone - allow water edge
    return TERRAIN.WATER_EDGE
  }

  // Check if position collides with existing buildings
  checkBuildingCollision(x, z, buildingType) {
    const newRadius = BUILDING_COLLISION_RADIUS[buildingType] || 0.5

    for (const placed of this.placedPositions) {
      const dx = x - placed.x
      const dz = z - placed.z
      const distance = Math.sqrt(dx * dx + dz * dz)
      const minDistance = newRadius + placed.radius

      if (distance < minDistance) {
        return true // Collision!
      }
    }

    return false
  }

  // Check if position is in a forbidden zone
  checkForbiddenZone(x, z) {
    for (const zone of this.forbiddenZones) {
      const dx = x - zone.x
      const dz = z - zone.z
      const distance = Math.sqrt(dx * dx + dz * dz)

      if (distance < zone.radius) {
        return true // In forbidden zone
      }
    }

    return false
  }

  // Validate placement position
  validatePosition(x, z, buildingType) {
    // Check map bounds
    const terrain = this.getTerrainType(x, z)
    if (terrain === TERRAIN.OUT_OF_BOUNDS) {
      return { valid: false, reason: 'out_of_bounds' }
    }

    // Check terrain requirements for building type
    const allowedTerrain = BUILDING_TERRAIN[buildingType] || []
    if (!allowedTerrain.includes(terrain)) {
      return { valid: false, reason: 'wrong_terrain', terrain, required: allowedTerrain }
    }

    // Check collision with existing buildings
    if (this.checkBuildingCollision(x, z, buildingType)) {
      return { valid: false, reason: 'collision' }
    }

    // Check forbidden zones (rowboat area, etc.)
    if (this.checkForbiddenZone(x, z)) {
      return { valid: false, reason: 'forbidden_zone' }
    }

    return { valid: true, terrain }
  }

  // Calculate rotation angle to face pond center
  calculateRotation(x, z) {
    const dx = this.pondCenter.x - x
    const dz = this.pondCenter.y - z
    return Math.atan2(dx, dz)
  }

  // Start placement mode for a building type
  startPlacement(buildingType, callbacks = {}) {
    if (this.state !== STATE.INACTIVE) {
      this.cancelPlacement()
    }

    this.currentBuildingType = buildingType
    this.onPlacementComplete = callbacks.onComplete
    this.onPlacementCancel = callbacks.onCancel

    // Create ghost mesh (starts as invalid/red)
    this.ghostMesh = createGhostBuilding(buildingType, this.gradientMap, false)
    this.ghostMesh.visible = true
    this.ghostMesh.position.set(0, 0, 0)
    this.scene.add(this.ghostMesh)

    this.state = STATE.SELECTING
    this.isValidPosition = false

    return true
  }

  // Cancel current placement
  cancelPlacement() {
    if (this.ghostMesh) {
      this.scene.remove(this.ghostMesh)
      this.ghostMesh.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose()
          child.material?.dispose()
        }
      })
      this.ghostMesh = null
    }

    this.state = STATE.INACTIVE
    this.currentBuildingType = null
    this.isValidPosition = false

    if (this.onPlacementCancel) {
      this.onPlacementCancel()
    }
  }

  // Update mouse position and ghost preview
  onMouseMove(event, containerWidth, containerHeight) {
    if (this.state !== STATE.SELECTING) return
    if (!this.ghostMesh) return

    // Update mouse coordinates
    this.mouse.x = (event.clientX / containerWidth) * 2 - 1
    this.mouse.y = -(event.clientY / containerHeight) * 2 + 1

    // Raycast to invisible ground plane
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObject(this.groundPlane)

    if (intersects.length > 0) {
      const point = intersects[0].point

      // Ghost always follows cursor
      this.currentPosition.set(point.x, 0, point.z)
      this.ghostMesh.position.copy(this.currentPosition)

      // Calculate rotation to face pond center
      this.currentRotation = this.calculateRotation(point.x, point.z)
      this.ghostMesh.rotation.y = this.currentRotation

      // Validate position
      const validation = this.validatePosition(point.x, point.z, this.currentBuildingType)
      this.isValidPosition = validation.valid

      // Update ghost color
      this.updateGhostColor(this.isValidPosition)

      // Always visible during placement
      this.ghostMesh.visible = true
    }
  }

  // Update ghost mesh color based on validity
  updateGhostColor(isValid) {
    const color = isValid ? 0x44ff44 : 0xff4444
    this.ghostMesh.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color.setHex(color)
      }
    })
  }

  // Handle click during placement
  onClick(event, containerWidth, containerHeight) {
    if (this.state !== STATE.SELECTING) return false

    // Update position one more time
    this.onMouseMove(event, containerWidth, containerHeight)

    if (this.isValidPosition) {
      // Valid position - confirm placement
      this.confirmPlacement()
      return true
    }

    return false
  }

  // Confirm and place the building
  confirmPlacement() {
    const x = this.currentPosition.x
    const z = this.currentPosition.z
    const rotation = this.currentRotation

    // Create the real building
    const building = createBuilding(this.currentBuildingType, this.gradientMap)
    building.position.set(x, 0, z)
    building.rotation.y = rotation
    building.userData.buildingType = this.currentBuildingType
    building.userData.placementId = `placed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    this.placedBuildings.add(building)

    // Play placement sound
    playPlaceBuilding()

    // Track placed position for collision detection
    const collisionRadius = BUILDING_COLLISION_RADIUS[this.currentBuildingType] || 0.5
    this.placedPositions.push({
      x, z,
      radius: collisionRadius,
      buildingType: this.currentBuildingType,
      placementId: building.userData.placementId
    })

    // Add forbidden zone for creature emergence
    const forbiddenRadius = this.buildingRadius[this.currentBuildingType] || 0.5
    this.pond.addForbiddenZone(x, z, forbiddenRadius)

    // Save to inventory (use coordinates as ID for freeform placement)
    const placementData = {
      type: this.currentBuildingType,
      x, z, rotation,
      placementId: building.userData.placementId
    }
    inventory.placeBuildingFreeform(placementData)

    // Clean up ghost
    if (this.ghostMesh) {
      this.scene.remove(this.ghostMesh)
      this.ghostMesh.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose()
          child.material?.dispose()
        }
      })
      this.ghostMesh = null
    }

    // Reset state
    const buildingType = this.currentBuildingType
    this.state = STATE.INACTIVE
    this.currentBuildingType = null
    this.isValidPosition = false

    // Callback
    if (this.onPlacementComplete) {
      this.onPlacementComplete(buildingType, { x, z, rotation })
    }

    return building
  }

  // Initialize forbidden zones from pond
  initForbiddenZones(zones) {
    this.forbiddenZones = zones || []
  }

  // Add a forbidden zone
  addForbiddenZone(x, z, radius) {
    this.forbiddenZones.push({ x, z, radius })
  }

  // Load saved buildings from inventory
  loadSavedBuildings() {
    // Try new freeform format first
    const savedFreeform = inventory.getPlacedBuildingsFreeform()

    if (savedFreeform && savedFreeform.length > 0) {
      for (const data of savedFreeform) {
        this.loadBuilding(data.type, data.x, data.z, data.rotation, data.placementId)
      }
    } else {
      // Fall back to old zone-based format for backwards compatibility
      const savedBuildings = inventory.getPlacedBuildings()

      for (const { type, zoneId } of savedBuildings) {
        const zone = this.pond.getZone(zoneId)
        if (zone && !zone.occupied) {
          this.loadBuilding(type, zone.x, zone.z, zone.angle, zoneId)
          this.pond.occupyZone(zoneId)
        }
      }
    }
  }

  // Load a single building
  loadBuilding(type, x, z, rotation, placementId) {
    const building = createBuilding(type, this.gradientMap)
    building.position.set(x, 0, z)
    building.rotation.y = rotation
    building.userData.buildingType = type
    building.userData.placementId = placementId

    this.placedBuildings.add(building)

    // Track for collision detection
    const collisionRadius = BUILDING_COLLISION_RADIUS[type] || 0.5
    this.placedPositions.push({
      x, z,
      radius: collisionRadius,
      buildingType: type,
      placementId
    })

    // Add forbidden zone
    const forbiddenRadius = this.buildingRadius[type] || 0.5
    this.pond.addForbiddenZone(x, z, forbiddenRadius)
  }

  // Check if currently placing
  isPlacing() {
    return this.state === STATE.SELECTING
  }

  // Get the placed buildings group for outline pass
  getPlacedBuildingsGroup() {
    return this.placedBuildings
  }

  // Remove a placed building
  removeBuilding(placementId) {
    const building = this.placedBuildings.children.find(
      b => b.userData.placementId === placementId
    )

    if (building) {
      this.placedBuildings.remove(building)
      building.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose()
          child.material?.dispose()
        }
      })

      // Remove from collision tracking
      this.placedPositions = this.placedPositions.filter(
        p => p.placementId !== placementId
      )

      // Remove from inventory
      inventory.removeBuildingFreeform(placementId)

      return true
    }

    return false
  }

  // Update building animations
  update(delta, elapsed) {
    for (const building of this.placedBuildings.children) {
      // Lighthouse beam rotation
      if (building.userData.buildingType === 'lighthouse') {
        building.traverse((child) => {
          if (child.userData.isLightBeam) {
            child.rotation.y = elapsed * 0.8
          }
        })
      }

      // Reeds swaying
      if (building.userData.buildingType === 'reeds') {
        building.traverse((child) => {
          if (child.userData.isReed) {
            const phase = child.userData.phase
            const baseX = child.userData.baseRotX
            const baseZ = child.userData.baseRotZ
            child.rotation.x = baseX + Math.sin(elapsed * 1.5 + phase) * 0.15
            child.rotation.z = baseZ + Math.cos(elapsed * 1.2 + phase) * 0.1
          }
        })
      }

      // Onion house smoke puffs
      if (building.userData.buildingType === 'onion_house') {
        building.traverse((child) => {
          if (child.userData.isSmokePuff) {
            const phase = child.userData.phase
            const cycleTime = 3.0
            const t = ((elapsed * 0.5 + phase * cycleTime) % cycleTime) / cycleTime

            child.position.y = t * 0.5
            const scale = 1 + t * 1.2
            child.scale.set(scale, scale, scale)

            if (child.material) {
              child.material.opacity = 0.6 * (1 - t * 0.8)
            }

            child.position.x = Math.sin(elapsed * 0.8 + phase * 5) * 0.03
            child.position.z = Math.cos(elapsed * 0.6 + phase * 3) * 0.02
          }
        })
      }

      // Boot house animations
      if (building.userData.buildingType === 'boot_house') {
        building.traverse((child) => {
          // Smoke puffs from chimney
          if (child.userData.isSmokePuff) {
            const phase = child.userData.phase
            const cycleTime = 3.5
            const t = ((elapsed * 0.4 + phase * cycleTime) % cycleTime) / cycleTime

            child.position.y = t * 0.4
            const scale = 1 + t * 1.0
            child.scale.set(scale, scale, scale)

            if (child.material) {
              child.material.opacity = 0.5 * (1 - t * 0.85)
            }

            child.position.x += Math.sin(elapsed * 0.7 + phase * 4) * 0.001
            child.position.z += Math.cos(elapsed * 0.5 + phase * 3) * 0.001
          }

          // Grass blade swaying
          if (child.userData.isGrassBlade) {
            const phase = child.userData.phase
            const baseX = child.userData.baseRotX
            const baseZ = child.userData.baseRotZ
            child.rotation.x = baseX + Math.sin(elapsed * 1.8 + phase) * 0.12
            child.rotation.z = baseZ + Math.cos(elapsed * 1.4 + phase) * 0.08
          }

          // Sprite running around the yard
          if (child.userData.isBootSprite) {
            const orbitRadius = child.userData.orbitRadius
            const orbitSpeed = child.userData.orbitSpeed
            const orbitPhase = child.userData.orbitPhase
            const bobPhase = child.userData.bobPhase
            const centerX = child.userData.orbitCenterX
            const centerZ = child.userData.orbitCenterZ

            // Orbit position
            const angle = elapsed * orbitSpeed + orbitPhase
            child.position.x = centerX + Math.cos(angle) * orbitRadius
            child.position.z = centerZ + Math.sin(angle) * orbitRadius

            // Bobbing up and down while running
            child.position.y = Math.abs(Math.sin(elapsed * 8 + bobPhase)) * 0.02

            // Face direction of movement
            child.rotation.y = angle + Math.PI / 2

            // Animate legs
            child.traverse((part) => {
              if (part.userData.isLeg) {
                const legSwing = Math.sin(elapsed * 12 + bobPhase) * 0.4
                if (part.userData.legSide === 'left') {
                  part.rotation.x = legSwing
                } else {
                  part.rotation.x = -legSwing
                }
              }
            })
          }
        })
      }
    }
  }

  // Dispose of all resources
  dispose() {
    this.cancelPlacement()

    while (this.placedBuildings.children.length > 0) {
      const building = this.placedBuildings.children[0]
      this.placedBuildings.remove(building)
      building.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose()
          child.material?.dispose()
        }
      })
    }

    this.scene.remove(this.placedBuildings)

    if (this.groundPlane) {
      this.scene.remove(this.groundPlane)
      this.groundPlane.geometry?.dispose()
      this.groundPlane.material?.dispose()
    }

    this.placedPositions = []
    this.forbiddenZones = []
  }
}
