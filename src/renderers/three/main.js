// dougk - a cozy pond simulator featuring Doug the duck
// Three.js version with Wind Waker cel-shading

import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { createDoug } from './duck.js'
import { createPond } from './pond.js'
import { BreadManager } from './bread.js'

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x55a04b) // Vibrant grass green

// Isometric-style orthographic camera
const aspect = window.innerWidth / window.innerHeight
const frustumSize = 12
const camera = new THREE.OrthographicCamera(
  -frustumSize * aspect / 2,
  frustumSize * aspect / 2,
  frustumSize / 2,
  -frustumSize / 2,
  0.1,
  100
)

// Classic isometric angle
camera.position.set(10, 10, 10)
camera.lookAt(0, 0, 0)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

// Cel-shading lighting setup
// Main directional light (sun)
const sunLight = new THREE.DirectionalLight(0xffffee, 1.5)
sunLight.position.set(5, 10, 5)
scene.add(sunLight)

// Hemisphere light for ambient (sky/ground colors like Wind Waker)
const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x55a04b, 0.6)
scene.add(hemiLight)

// Subtle fill light
const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
fillLight.position.set(-5, 5, -5)
scene.add(fillLight)

// Create gradient texture for toon shading
function createToonGradient() {
  const canvas = document.createElement('canvas')
  canvas.width = 4
  canvas.height = 1
  const ctx = canvas.getContext('2d')

  // 3-step gradient for Wind Waker style
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

const toonGradient = createToonGradient()

// Create the pond
const pond = createPond(scene, toonGradient)

// Create Doug the duck
const doug = createDoug(scene, toonGradient)

// Bread manager
const breadManager = new BreadManager(scene, toonGradient)

// Post-processing for outlines
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)

// Outline pass for that bold Wind Waker look
const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera
)
outlinePass.edgeStrength = 3
outlinePass.edgeGlow = 0
outlinePass.edgeThickness = 1.5
outlinePass.visibleEdgeColor.set(0x191410)
outlinePass.hiddenEdgeColor.set(0x191410)
outlinePass.selectedObjects = [doug.group, pond.group, ...breadManager.getMeshes()]
composer.addPass(outlinePass)

const outputPass = new OutputPass()
composer.addPass(outputPass)

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// Handle clicks for bread dropping
renderer.domElement.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(pond.water)

  if (intersects.length > 0) {
    const point = intersects[0].point
    breadManager.spawnBread(point.x, point.z)
    pond.addRipple(point.x, point.z)

    // Update outline objects
    outlinePass.selectedObjects = [doug.group, pond.group, ...breadManager.getMeshes()]
  }
})

// Handle window resize
window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight
  camera.left = -frustumSize * aspect / 2
  camera.right = frustumSize * aspect / 2
  camera.top = frustumSize / 2
  camera.bottom = -frustumSize / 2
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
})

// Animation loop
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()
  const elapsed = clock.getElapsedTime()

  // Update Doug
  doug.update(delta, elapsed, breadManager.getActiveBits(), pond)

  // Update bread
  breadManager.update(delta, elapsed)

  // Update pond (ripples, etc)
  pond.update(delta, elapsed)

  // Render with post-processing
  composer.render()
}

animate()
