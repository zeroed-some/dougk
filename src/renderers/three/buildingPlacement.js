// Building placement system for dougk
// Handles ghost preview, snap zones, and building instantiation

import * as THREE from 'three'
import { createBuilding, createGhostBuilding } from './buildings.js'
import inventory from './shop/inventory.js'
import { playPlaceBuilding } from './sounds.js'

// Placement states
const STATE = {
  INACTIVE: 'inactive',
  SELECTING: 'selecting'
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
    this.hoveredZone = null
    this.placedBuildings = new THREE.Group()

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    // Invisible ground plane for raycasting (so ghost is always visible)
    this.groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshBasicMaterial({ visible: false })
    )
    this.groundPlane.rotation.x = -Math.PI / 2
    this.groundPlane.position.y = 0
    scene.add(this.groundPlane)

    // Building forbidden radius (for creature emergence)
    this.buildingRadius = {
      dock_wooden: 0.8,
      fishing_hut: 0.9,
      lighthouse: 0.5,
      reeds: 0.4,
      fence: 0.3,
      onion_house: 0.6
    }

    scene.add(this.placedBuildings)

    // Callbacks
    this.onPlacementComplete = null
    this.onPlacementCancel = null
  }

  // Start placement mode for a building type
  startPlacement(buildingType, callbacks = {}) {
    if (this.state !== STATE.INACTIVE) {
      this.cancelPlacement()
    }

    this.currentBuildingType = buildingType
    this.onPlacementComplete = callbacks.onComplete
    this.onPlacementCancel = callbacks.onCancel

    // Create ghost mesh (starts as invalid/red, visible immediately)
    this.ghostMesh = createGhostBuilding(buildingType, this.gradientMap, false)
    this.ghostMesh.visible = true
    this.ghostMesh.position.set(0, 0, 0) // Will be updated on mouse move
    this.scene.add(this.ghostMesh)

    this.state = STATE.SELECTING
    this.hoveredZone = null

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
    this.hoveredZone = null

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

    // Raycast to invisible ground plane (always hits)
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObject(this.groundPlane)

    if (intersects.length > 0) {
      const point = intersects[0].point

      // Find nearest valid zone
      const nearestZone = this.pond.findNearestZone(
        point.x,
        point.z,
        this.currentBuildingType
      )

      if (nearestZone) {
        // Snap to zone - show green
        this.hoveredZone = nearestZone
        this.ghostMesh.position.set(nearestZone.x, 0, nearestZone.z)
        this.ghostMesh.rotation.y = nearestZone.angle
        this.updateGhostColor(true)
      } else {
        // No valid zone - follow cursor, show red
        this.hoveredZone = null
        this.ghostMesh.position.set(point.x, 0, point.z)
        this.ghostMesh.rotation.y = 0
        this.updateGhostColor(false)
      }

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

    if (this.hoveredZone) {
      // Valid zone - confirm placement
      this.confirmPlacement(this.hoveredZone)
      return true
    }

    return false
  }

  // Confirm and place the building
  confirmPlacement(zone) {
    // Create the real building
    const building = createBuilding(this.currentBuildingType, this.gradientMap)
    building.position.set(zone.x, 0, zone.z)
    building.rotation.y = zone.angle
    building.userData.buildingType = this.currentBuildingType
    building.userData.zoneId = zone.id

    this.placedBuildings.add(building)

    // Play placement sound
    playPlaceBuilding()

    // Mark zone as occupied
    this.pond.occupyZone(zone.id)

    // Add forbidden zone for creature emergence
    const forbiddenRadius = this.buildingRadius[this.currentBuildingType] || 0.5
    this.pond.addForbiddenZone(zone.x, zone.z, forbiddenRadius)

    // Save to inventory
    inventory.placeBuilding(this.currentBuildingType, zone.id)

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
    this.hoveredZone = null

    // Callback
    if (this.onPlacementComplete) {
      this.onPlacementComplete(buildingType, zone)
    }

    return building
  }

  // Load saved buildings from inventory
  loadSavedBuildings() {
    const savedBuildings = inventory.getPlacedBuildings()

    for (const { type, zoneId } of savedBuildings) {
      const zone = this.pond.getZone(zoneId)
      if (zone && !zone.occupied) {
        // Create and place building
        const building = createBuilding(type, this.gradientMap)
        building.position.set(zone.x, 0, zone.z)
        building.rotation.y = zone.angle
        building.userData.buildingType = type
        building.userData.zoneId = zone.id

        this.placedBuildings.add(building)

        // Mark zone as occupied
        this.pond.occupyZone(zone.id)

        // Add forbidden zone
        const forbiddenRadius = this.buildingRadius[type] || 0.5
        this.pond.addForbiddenZone(zone.x, zone.z, forbiddenRadius)
      }
    }
  }

  // Check if currently placing
  isPlacing() {
    return this.state === STATE.SELECTING
  }

  // Get the placed buildings group for outline pass
  getPlacedBuildingsGroup() {
    return this.placedBuildings
  }

  // Remove a placed building (for future use)
  removeBuilding(zoneId) {
    const building = this.placedBuildings.children.find(
      b => b.userData.zoneId === zoneId
    )

    if (building) {
      this.placedBuildings.remove(building)
      building.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose()
          child.material?.dispose()
        }
      })

      // Free up the zone
      const zone = this.pond.getZone(zoneId)
      if (zone) {
        zone.occupied = false
      }

      // Remove from inventory
      inventory.removeBuilding(zoneId)

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
            child.rotation.y = elapsed * 0.8 // Slow rotation
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
            // Gentle swaying motion
            child.rotation.x = baseX + Math.sin(elapsed * 1.5 + phase) * 0.15
            child.rotation.z = baseZ + Math.cos(elapsed * 1.2 + phase) * 0.1
          }
        })
      }
    }
  }

  // Dispose of all resources
  dispose() {
    this.cancelPlacement()

    // Clean up placed buildings
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

    // Clean up ground plane
    if (this.groundPlane) {
      this.scene.remove(this.groundPlane)
      this.groundPlane.geometry?.dispose()
      this.groundPlane.material?.dispose()
    }
  }
}
