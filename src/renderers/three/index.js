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
import { unlockAudio } from './sounds.js'

let scene, camera, renderer, composer, outlinePass
let doug, pond, breadManager, donny, koiSchool, ollie
let clock
let animationId = null

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
  outlinePass.selectedObjects = [doug.group, pond.group, donny.group, koiSchool.group, ollie.group]
  composer.addPass(outlinePass)
  composer.addPass(new OutputPass())

  // Raycaster
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  // Unlock audio on first touch (for mobile)
  renderer.domElement.addEventListener('touchstart', unlockAudio, { once: true })

  renderer.domElement.addEventListener('click', (event) => {
    // Unlock audio on first interaction (required for mobile)
    unlockAudio()

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(pond.water)

    if (intersects.length > 0) {
      const point = intersects[0].point
      breadManager.spawnBread(point.x, point.z)
      pond.addRipple(point.x, point.z)
      koiSchool.triggerPanic(point.x, point.z)
      outlinePass.selectedObjects = [doug.group, pond.group, ...breadManager.getMeshes()]
    }
  })

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

  doug.update(delta, elapsed, breadManager.getActiveBits(), pond)
  breadManager.update(delta, elapsed)
  pond.update(delta, elapsed)
  donny.update(delta, elapsed, pond, doug)
  koiSchool.update(delta, elapsed)
  ollie.update(delta, elapsed, pond, doug)

  composer.render()
}

export function stop() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  window.removeEventListener('resize', onResize)

  if (renderer) {
    renderer.domElement.remove()
    renderer.dispose()
  }

  if (composer) {
    composer.dispose()
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
}

export const name = '3D'
