// dougk - a cozy pond simulator featuring Doug the duck
// Supports both 2D (p5.js) and 3D (Three.js) rendering modes

import * as p5Renderer from './renderers/p5/index.js'
import * as threeRenderer from './renderers/three/index.js'

const renderers = {
  '2d': p5Renderer,
  '3d': threeRenderer
}

let currentMode = localStorage.getItem('dougk-mode') || '3d'
let container = null

// Create the container
function createContainer() {
  container = document.createElement('div')
  container.id = 'dougk-container'
  container.style.cssText = 'position: fixed; inset: 0; z-index: 0;'
  document.body.appendChild(container)
}

// Create the toggle UI
function createToggleUI() {
  const toggle = document.createElement('div')
  toggle.id = 'mode-toggle'
  toggle.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    gap: 0;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    border: 2px solid #191410;
  `

  const btn2d = createToggleButton('2D', '2d')
  const btn3d = createToggleButton('3D', '3d')

  toggle.appendChild(btn2d)
  toggle.appendChild(btn3d)
  document.body.appendChild(toggle)

  updateToggleUI()
}

function createToggleButton(label, mode) {
  const btn = document.createElement('button')
  btn.textContent = label
  btn.dataset.mode = mode
  btn.style.cssText = `
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 600;
    font-size: 14px;
  `
  btn.addEventListener('click', () => switchMode(mode))
  return btn
}

function updateToggleUI() {
  const buttons = document.querySelectorAll('#mode-toggle button')
  buttons.forEach(btn => {
    const isActive = btn.dataset.mode === currentMode
    btn.style.background = isActive ? '#ffdc50' : '#ffffff'
    btn.style.color = '#191410'
  })
}

function switchMode(newMode) {
  if (newMode === currentMode) return

  // Stop current renderer
  renderers[currentMode].stop()

  // Clear container
  container.innerHTML = ''

  // Switch mode
  currentMode = newMode
  localStorage.setItem('dougk-mode', currentMode)

  // Start new renderer
  renderers[currentMode].start(container)

  updateToggleUI()
}

// Initialize
createContainer()
createToggleUI()
renderers[currentMode].start(container)

// Keyboard shortcut: press 'T' to toggle
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const newMode = currentMode === '2d' ? '3d' : '2d'
    switchMode(newMode)
  }
})
