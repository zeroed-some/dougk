// Three.js 3D renderer for dougk
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { createDoug } from './duck.js'
import { createPond } from './pond.js'
import { BreadManager } from './bread.js'
import { createDonny } from './narwhal.js'
import { createKoiSchool } from './koi.js'
import { createOllie } from './octopus.js'
import { PlacementManager } from './buildingPlacement.js'
import { unlockAudio } from './sounds.js'
import gameState from './gameState.js'
import { openShop, closeShop, isShopOpen } from './shop/shopUI.js'
import { showDialog, closeDialog, isDialogOpen } from './shop/dialogUI.js'
import { getDialogForCharacter, getReturnDialog } from './shop/dialogScripts.js'
import inventory from './shop/inventory.js'
import { getItem, CHARACTERS } from './shop/items.js'

let scene, camera, renderer, composer, outlinePass
let doug, pond, breadManager, donny, koiSchool, ollie, placementManager
let clock
let animationId = null
let koiCounterEl = null

// Capture state
let captureState = {
  isHolding: false,
  targetKoi: null,
  clickPos: null  // Where bread would spawn if not capturing
}

// Auto-capture state (when Doug hovers over koi)
let autoCapture = {
  targetKoi: null,
  hoverTime: 0,
  CAPTURE_DELAY: 0.5 // seconds Doug must be over koi to auto-capture
}

// Camera zoom state for dialog focus effect
const cameraZoom = {
  defaultFrustum: 12,
  dialogFrustum: 8, // Zoomed in during dialog
  currentFrustum: 12,
  targetFrustum: 12
}

function createKoiCounter(container) {
  const counter = document.createElement('div')
  counter.id = 'koi-counter'
  counter.style.cssText = `
    position: fixed;
    top: 16px;
    left: 16px;
    background: rgba(0, 0, 0, 0.6);
    color: #ffd700;
    padding: 8px 16px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 18px;
    font-weight: bold;
    z-index: 1000;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 8px;
  `
  counter.innerHTML = `<span style="font-size: 24px;">🐟</span> <span id="koi-count">${gameState.getKoi()}</span>`
  container.appendChild(counter)

  // Listen for game state changes
  gameState.addListener((count) => {
    const countEl = document.getElementById('koi-count')
    if (countEl) countEl.textContent = count
  })

  return counter
}

function createToonGradient() {
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = 1
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#444444'
  ctx.fillRect(0, 0, 1, 1)
  ctx.fillStyle = '#888888'
  ctx.fillRect(1, 0, 1, 1)
  ctx.fillStyle = '#cccccc'
  ctx.fillRect(2, 0, 1, 1)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(3, 0, 1, 1)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  return texture
}

export function start(container) {
  if (animationId) return

  // Unlock audio on any user interaction (document level for mobile)
  const unlockEvents = ['touchstart', 'touchend', 'pointerdown', 'click', 'keydown']
  const unlockHandler = () => {
    unlockAudio()
    // Remove all listeners after first unlock
    unlockEvents.forEach(e => document.removeEventListener(e, unlockHandler))
  }
  unlockEvents.forEach(e => document.addEventListener(e, unlockHandler, { passive: true }))

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x55a04b)

  // Camera
  const aspect = window.innerWidth / window.innerHeight
  const frustumSize = 12
  camera = new THREE.OrthographicCamera(
    -frustumSize * aspect / 2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    100
  )
  camera.position.set(10, 10, 10)
  camera.lookAt(0, 0, 0)

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // Lighting
  const sunLight = new THREE.DirectionalLight(0xffffee, 1.5)
  sunLight.position.set(5, 10, 5)
  scene.add(sunLight)

  const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x55a04b, 0.6)
  scene.add(hemiLight)

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
  fillLight.position.set(-5, 5, -5)
  scene.add(fillLight)

  const toonGradient = createToonGradient()

  // Create objects
  pond = createPond(scene, toonGradient)
  doug = createDoug(scene, toonGradient)
  breadManager = new BreadManager(scene, toonGradient)
  donny = createDonny(scene, toonGradient)
  koiSchool = createKoiSchool(scene, toonGradient, pond.radius)
  ollie = createOllie(scene, toonGradient)
  placementManager = new PlacementManager(scene, pond, camera, toonGradient)
  placementManager.initForbiddenZones(pond.getInitialForbiddenZones())

  // Post-processing
  composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  )
  outlinePass.edgeStrength = 3
  outlinePass.edgeGlow = 0
  outlinePass.edgeThickness = 1.5
  outlinePass.visibleEdgeColor.set(0x191410)
  outlinePass.hiddenEdgeColor.set(0x191410)
  outlinePass.selectedObjects = [doug.group, pond.group, donny.group, koiSchool.group, ollie.group, placementManager.getPlacedBuildingsGroup()]
  composer.addPass(outlinePass)
  composer.addPass(new OutputPass())

  // Raycaster
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  // Unlock audio on first touch (for mobile)
  renderer.domElement.addEventListener('touchstart', unlockAudio, { once: true })

  // Mouse move - handle placement preview
  renderer.domElement.addEventListener('pointermove', (event) => {
    if (placementManager.isPlacing()) {
      placementManager.onMouseMove(event, window.innerWidth, window.innerHeight)
    }
  })

  // Helper to handle tap-to-shop for a creature
  const handleCreatureTap = (creature, characterName) => {
    if (!creature.isTappable()) return false
    if (isDialogOpen() || isShopOpen()) return false

    // Show return dialog, then open shop
    const dialogLines = getReturnDialog(characterName)
    showDialog(characterName, dialogLines, container, () => {
      openShop(characterName, container, {
        onClose: () => {
          creature.dismissShop()
        },
        onPurchase: (item, action) => {
          if (item.character) {
            handleOutfitChange(item, action)
          }
          if (action === 'place' && item.buildingType) {
            placementManager.startPlacement(item.buildingType, {
              onComplete: () => {},
              onCancel: () => {}
            })
          }
        }
      })
    })

    // Transition creature to shop mode if surfaced
    creature.triggerShopFromTap(pond, doug)
    return true
  }

  // Pointer down - handle placement, capture, or bread spawn
  renderer.domElement.addEventListener('pointerdown', (event) => {
    unlockAudio()

    // If placing a building, try to place it
    if (placementManager.isPlacing()) {
      if (placementManager.onClick(event, window.innerWidth, window.innerHeight)) {
        // Building placed successfully
        return
      }
      // Clicked in invalid spot - cancel placement
      placementManager.cancelPlacement()
      return
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    // Check if clicked on Donny or Ollie (tap to reopen shop)
    if (donny.isTappable()) {
      const donnyIntersects = raycaster.intersectObject(donny.group, true)
      if (donnyIntersects.length > 0) {
        if (handleCreatureTap(donny, 'donny')) return
      }
    }
    if (ollie.isTappable()) {
      const ollieIntersects = raycaster.intersectObject(ollie.group, true)
      if (ollieIntersects.length > 0) {
        if (handleCreatureTap(ollie, 'ollie')) return
      }
    }

    const intersects = raycaster.intersectObject(pond.water)

    if (intersects.length > 0) {
      const point = intersects[0].point
      captureState.clickPos = { x: point.x, z: point.z }
      captureState.isHolding = true

      // Check if Doug is over a koi
      const dougPos = doug.getPosition()
      const koiUnderDoug = koiSchool.getKoiUnderPosition(dougPos.x, dougPos.z, 0.4)

      if (koiUnderDoug) {
        // Start capturing
        koiSchool.startCapture(koiUnderDoug)
        captureState.targetKoi = koiUnderDoug
      }
    }
  })

  // Pointer up - complete capture or spawn bread
  renderer.domElement.addEventListener('pointerup', () => {
    if (!captureState.isHolding) return

    if (captureState.targetKoi) {
      // If still capturing (not completed), cancel it
      if (captureState.targetKoi.state.beingCaptured) {
        koiSchool.cancelCapture(captureState.targetKoi)
      }
    } else if (captureState.clickPos) {
      // No capture was started - spawn bread
      breadManager.spawnBread(captureState.clickPos.x, captureState.clickPos.z)
      pond.addRipple(captureState.clickPos.x, captureState.clickPos.z)
      koiSchool.triggerPanic(captureState.clickPos.x, captureState.clickPos.z)
      outlinePass.selectedObjects = [doug.group, pond.group, ...breadManager.getMeshes()]
    }

    // Reset capture state
    captureState.isHolding = false
    captureState.targetKoi = null
    captureState.clickPos = null
  })

  // Create koi counter UI
  koiCounterEl = createKoiCounter(container)

  // Helper to get character object by name
  const getCharacter = (charName) => {
    switch (charName) {
      case 'doug': return doug
      case 'donny': return donny
      case 'ollie': return ollie
      default: return null
    }
  }

  // Handle outfit equip/unequip
  const handleOutfitChange = (item, action) => {
    const character = getCharacter(item.character)
    if (!character) return

    if (action === 'equip') {
      character.applyOutfit(item)
    } else if (action === 'unequip') {
      character.removeOutfit(item)
    }
  }

  // Set up shop callbacks
  const handleShopReady = (shopkeeper) => {
    // Get dialog lines for this character
    const dialogLines = getDialogForCharacter(shopkeeper)

    // Show dialog first, then open shop when complete
    showDialog(shopkeeper, dialogLines, container, () => {
      // Dialog complete - now open the shop
      openShop(shopkeeper, container, {
        onClose: () => {
          // Dismiss the appropriate shopkeeper
          if (shopkeeper === 'donny') {
            donny.dismissShop()
          } else if (shopkeeper === 'ollie') {
            ollie.dismissShop()
          }
        },
        onPurchase: (item, action) => {
          // Handle outfit equip/unequip
          if (item.character) {
            handleOutfitChange(item, action)
          }
          // Handle building placement
          if (action === 'place' && item.buildingType) {
            placementManager.startPlacement(item.buildingType, {
              onComplete: (buildingType, zone) => {
                // Building placed successfully
              },
              onCancel: () => {
                // Placement cancelled
              }
            })
          }
        }
      })
    })
  }

  donny.setShopReadyCallback(handleShopReady)
  ollie.setShopReadyCallback(handleShopReady)

  // Load saved equipped outfits
  const loadEquippedOutfits = () => {
    for (const charName of Object.values(CHARACTERS)) {
      const equipped = inventory.getEquipped(charName)
      const character = getCharacter(charName)
      if (character) {
        for (const itemId of equipped) {
          const item = getItem(itemId)
          if (item) {
            character.applyOutfit(item)
          }
        }
      }
    }
  }
  loadEquippedOutfits()

  // Load saved placed buildings
  placementManager.loadSavedBuildings()

  // Resize handler
  window.addEventListener('resize', onResize)

  clock = new THREE.Clock()
  animate()
}

function onResize() {
  const aspect = window.innerWidth / window.innerHeight
  const frustumSize = 12
  camera.left = -frustumSize * aspect / 2
  camera.right = frustumSize * aspect / 2
  camera.top = frustumSize / 2
  camera.bottom = -frustumSize / 2
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  animationId = requestAnimationFrame(animate)

  const delta = clock.getDelta()
  const elapsed = clock.getElapsedTime()

  // Check if in dialog/shop mode for camera zoom and movement pause
  const inConversation = isDialogOpen() || isShopOpen()

  // Animate camera zoom
  cameraZoom.targetFrustum = inConversation ? cameraZoom.dialogFrustum : cameraZoom.defaultFrustum
  if (Math.abs(cameraZoom.currentFrustum - cameraZoom.targetFrustum) > 0.01) {
    cameraZoom.currentFrustum += (cameraZoom.targetFrustum - cameraZoom.currentFrustum) * delta * 3
    const aspect = window.innerWidth / window.innerHeight
    camera.left = -cameraZoom.currentFrustum * aspect / 2
    camera.right = cameraZoom.currentFrustum * aspect / 2
    camera.top = cameraZoom.currentFrustum / 2
    camera.bottom = -cameraZoom.currentFrustum / 2
    camera.updateProjectionMatrix()
  }

  // Get active bread positions for koi attraction
  const activeBread = breadManager.getActiveBits()
  const breadPositions = activeBread.map(b => ({ x: b.position.x, z: b.position.z }))

  // Update koi attraction to bread
  koiSchool.attractToBread(breadPositions)

  // Handle capture in progress (manual click-hold)
  if (captureState.isHolding && captureState.targetKoi) {
    const completed = koiSchool.updateCapture(captureState.targetKoi, delta)
    if (completed) {
      // Capture completed
      captureState.targetKoi = null
      captureState.isHolding = false
      captureState.clickPos = null
    }
  }

  // Auto-capture: when Doug hovers over a koi for a moment
  if (!captureState.isHolding) {
    const dougPos = doug.getPosition()
    const koiUnderDoug = koiSchool.getKoiUnderPosition(dougPos.x, dougPos.z, 0.5)

    if (koiUnderDoug) {
      if (autoCapture.targetKoi === koiUnderDoug) {
        // Same koi - accumulate hover time
        autoCapture.hoverTime += delta
        if (autoCapture.hoverTime >= autoCapture.CAPTURE_DELAY) {
          // Start and immediately complete capture
          koiSchool.startCapture(koiUnderDoug)
          // Fast-forward capture to completion
          while (!koiSchool.updateCapture(koiUnderDoug, 0.2)) {}
          autoCapture.targetKoi = null
          autoCapture.hoverTime = 0
        }
      } else {
        // New koi - reset timer
        autoCapture.targetKoi = koiUnderDoug
        autoCapture.hoverTime = 0
      }
    } else {
      // No koi under Doug - reset
      autoCapture.targetKoi = null
      autoCapture.hoverTime = 0
    }
  }

  // Determine focus target for Doug during conversation
  let focusTarget = null
  if (inConversation) {
    // Focus on whoever is in shop mode
    if (donny.isInShopMode()) {
      focusTarget = { x: donny.group.position.x, z: donny.group.position.z }
    } else if (ollie.isInShopMode()) {
      focusTarget = { x: ollie.group.position.x, z: ollie.group.position.z }
    }
  }

  doug.update(delta, elapsed, activeBread, pond, {
    paused: inConversation,
    focusTarget: focusTarget
  })
  breadManager.update(delta, elapsed)
  pond.update(delta, elapsed)
  donny.update(delta, elapsed, pond, doug)
  koiSchool.update(delta, elapsed)
  ollie.update(delta, elapsed, pond, doug)
  placementManager.update(delta, elapsed)

  // Try to trigger shop if player has enough koi
  // Only try if no dialog/shop is currently open and no creature is in shop mode
  if (!isDialogOpen() && !isShopOpen() && !donny.isInShopMode() && !ollie.isInShopMode()) {
    const koiCount = gameState.getKoi()
    // Try Donny first (lower threshold), then Ollie
    if (!donny.tryTriggerShop(koiCount, pond, doug)) {
      ollie.tryTriggerShop(koiCount, pond, doug)
    }
  }

  composer.render()
}

export function stop() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  window.removeEventListener('resize', onResize)

  // Close dialog and shop if open
  if (isDialogOpen()) {
    closeDialog()
  }
  if (isShopOpen()) {
    closeShop()
  }

  if (renderer) {
    renderer.domElement.remove()
    renderer.dispose()
  }

  if (composer) {
    composer.dispose()
  }

  if (koiCounterEl) {
    koiCounterEl.remove()
    koiCounterEl = null
  }

  // Reset capture state
  captureState.isHolding = false
  captureState.targetKoi = null
  captureState.clickPos = null

  if (placementManager) {
    placementManager.dispose()
  }

  scene = null
  camera = null
  renderer = null
  composer = null
  doug = null
  pond = null
  donny = null
  koiSchool = null
  ollie = null
  breadManager = null
  placementManager = null
}

export const name = '3D'
