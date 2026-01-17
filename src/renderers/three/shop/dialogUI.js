// Animal Crossing-style dialog system for dougk
// Typewriter text effect with character portraits

import { playDialogBlip } from '../sounds.js'

let dialogOverlay = null
let currentDialog = null
let currentLineIndex = 0
let currentCharIndex = 0
let isTyping = false
let typeInterval = null
let onCompleteCallback = null

const TYPE_SPEED = 35 // ms per character
const FAST_TYPE_SPEED = 10 // when holding/clicking during type

const STYLES = `
  .dialog-overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    padding: 20px;
    z-index: 1500;
    pointer-events: none;
  }

  .dialog-box {
    background: linear-gradient(180deg, #2a2218 0%, #1a1510 100%);
    border: 4px solid #8b6914;
    border-radius: 16px;
    padding: 16px 20px;
    max-width: 600px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    pointer-events: auto;
    cursor: pointer;
    position: relative;
  }

  .dialog-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .dialog-portrait {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    flex-shrink: 0;
  }

  .dialog-portrait.donny {
    background: linear-gradient(135deg, #7a9eb8 0%, #5a7e98 100%);
    border: 3px solid #d4af37;
  }

  .dialog-portrait.ollie {
    background: linear-gradient(135deg, #7b4b94 0%, #5b2b74 100%);
    border: 3px solid #d4af37;
  }

  .dialog-name {
    font-family: 'Courier New', monospace;
    font-size: 18px;
    font-weight: bold;
    color: #ffd700;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }

  .dialog-text {
    font-family: 'Courier New', monospace;
    font-size: 16px;
    color: #e8d8c8;
    line-height: 1.5;
    min-height: 48px;
  }

  .dialog-continue {
    position: absolute;
    bottom: 12px;
    right: 16px;
    color: #ffd700;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s;
    animation: bounce 0.6s ease-in-out infinite;
  }

  .dialog-continue.visible {
    opacity: 1;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  .dialog-box.shake {
    animation: dialogShake 0.1s ease-in-out;
  }

  @keyframes dialogShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
  }
`

const CHARACTER_INFO = {
  donny: {
    name: 'Donny',
    emoji: '🦄',
    portrait: 'donny'
  },
  ollie: {
    name: 'Ollie',
    emoji: '🐙',
    portrait: 'ollie'
  }
}

function injectStyles() {
  if (document.getElementById('dialog-styles')) return
  const style = document.createElement('style')
  style.id = 'dialog-styles'
  style.textContent = STYLES
  document.head.appendChild(style)
}

function createDialogOverlay(character) {
  injectStyles()

  const charInfo = CHARACTER_INFO[character]

  const overlay = document.createElement('div')
  overlay.className = 'dialog-overlay'
  overlay.innerHTML = `
    <div class="dialog-box">
      <div class="dialog-header">
        <div class="dialog-portrait ${charInfo.portrait}">${charInfo.emoji}</div>
        <div class="dialog-name">${charInfo.name}</div>
      </div>
      <div class="dialog-text"></div>
      <div class="dialog-continue">▼</div>
    </div>
  `

  const box = overlay.querySelector('.dialog-box')
  box.addEventListener('click', handleAdvance)

  // Also handle keyboard
  document.addEventListener('keydown', handleKeyDown)

  return overlay
}

function handleKeyDown(e) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    handleAdvance()
  }
}

function handleAdvance() {
  if (!currentDialog) return

  if (isTyping) {
    // Skip to end of current line
    finishCurrentLine()
  } else {
    // Advance to next line
    advanceDialog()
  }
}

function finishCurrentLine() {
  if (typeInterval) {
    clearInterval(typeInterval)
    typeInterval = null
  }

  const textEl = dialogOverlay.querySelector('.dialog-text')
  textEl.textContent = currentDialog.lines[currentLineIndex]
  isTyping = false

  // Show continue indicator
  const continueEl = dialogOverlay.querySelector('.dialog-continue')
  continueEl.classList.add('visible')
}

function advanceDialog() {
  currentLineIndex++

  if (currentLineIndex >= currentDialog.lines.length) {
    // Dialog complete - save callback before closing (closeDialog clears it)
    const callback = onCompleteCallback
    closeDialog()
    if (callback) {
      callback()
    }
    return
  }

  // Hide continue indicator
  const continueEl = dialogOverlay.querySelector('.dialog-continue')
  continueEl.classList.remove('visible')

  // Start typing next line
  startTypingLine()
}

function startTypingLine() {
  const textEl = dialogOverlay.querySelector('.dialog-text')
  const line = currentDialog.lines[currentLineIndex]

  textEl.textContent = ''
  currentCharIndex = 0
  isTyping = true

  typeInterval = setInterval(() => {
    if (currentCharIndex < line.length) {
      const char = line[currentCharIndex]
      textEl.textContent += char
      currentCharIndex++

      // Play blip sound for letters (skip spaces/punctuation, play every 2 chars)
      if (char.match(/[a-zA-Z]/) && currentCharIndex % 2 === 0) {
        playDialogBlip()
      }

      // Add slight shake on punctuation for emphasis
      if (['.', '!', '?', '...'].some(p => line.substring(0, currentCharIndex).endsWith(p))) {
        const box = dialogOverlay.querySelector('.dialog-box')
        box.classList.add('shake')
        setTimeout(() => box.classList.remove('shake'), 100)
      }
    } else {
      // Line complete
      clearInterval(typeInterval)
      typeInterval = null
      isTyping = false

      // Show continue indicator
      const continueEl = dialogOverlay.querySelector('.dialog-continue')
      continueEl.classList.add('visible')
    }
  }, TYPE_SPEED)
}

export function showDialog(character, lines, container, onComplete) {
  if (dialogOverlay) {
    closeDialog()
  }

  currentDialog = { character, lines }
  currentLineIndex = 0
  currentCharIndex = 0
  onCompleteCallback = onComplete

  dialogOverlay = createDialogOverlay(character)
  container.appendChild(dialogOverlay)

  // Start typing first line
  startTypingLine()
}

export function closeDialog() {
  if (typeInterval) {
    clearInterval(typeInterval)
    typeInterval = null
  }

  document.removeEventListener('keydown', handleKeyDown)

  if (dialogOverlay) {
    dialogOverlay.remove()
    dialogOverlay = null
  }

  currentDialog = null
  currentLineIndex = 0
  currentCharIndex = 0
  isTyping = false
  onCompleteCallback = null
}

export function isDialogOpen() {
  return dialogOverlay !== null
}
