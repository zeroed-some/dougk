// Shop UI overlay for dougk
// DOM-based shop interface that appears when Donny or Ollie approach

import gameState from '../gameState.js'
import inventory from './inventory.js'
import { OUTFITS, BUILDINGS, CHARACTERS, getOutfitsForCharacter, getAllBuildings, getItem } from './items.js'
import { playPurchase, playShopOpen, playShopClose } from '../sounds.js'

let shopOverlay = null
let currentTab = 'outfits'
let currentCharacter = CHARACTERS.DOUG
let currentShopkeeper = null
let onCloseCallback = null
let onPurchaseCallback = null

const STYLES = `
  .shop-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    font-family: 'Courier New', monospace;
  }

  .shop-container {
    background: linear-gradient(135deg, #2a1f1a 0%, #3d2e26 100%);
    border: 4px solid #8b6914;
    border-radius: 16px;
    padding: 20px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  .shop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #8b6914;
  }

  .shop-title {
    color: #ffd700;
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }

  .shop-koi-count {
    color: #ffd700;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .shop-close {
    background: #8b0000;
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .shop-close:hover {
    background: #a00000;
  }

  .shop-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .shop-tab {
    flex: 1;
    padding: 10px 16px;
    background: #4a3828;
    border: 2px solid #6b4423;
    border-radius: 8px;
    color: #c9a96e;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .shop-tab:hover {
    background: #5a4838;
  }

  .shop-tab.active {
    background: #8b6914;
    border-color: #ffd700;
    color: #fff;
  }

  .character-selector {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .character-btn {
    flex: 1;
    padding: 8px;
    background: #3a2a1a;
    border: 2px solid #5a4a3a;
    border-radius: 6px;
    color: #a89070;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .character-btn:hover {
    background: #4a3a2a;
  }

  .character-btn.active {
    background: #6b5030;
    border-color: #c9a96e;
    color: #ffd700;
  }

  .item-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .item-card {
    background: #3a2a1a;
    border: 2px solid #5a4a3a;
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    transition: all 0.2s;
  }

  .item-card:hover {
    border-color: #8b6914;
  }

  .item-card.owned {
    background: #2a3a2a;
    border-color: #4a8b4a;
  }

  .item-card.equipped {
    border-color: #ffd700;
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
  }

  .item-card.cant-afford {
    opacity: 0.5;
  }

  .item-name {
    color: #e8d8c8;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .item-price {
    color: #ffd700;
    font-size: 16px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .item-btn {
    width: 100%;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
  }

  .item-btn.buy {
    background: #8b6914;
    color: white;
  }

  .item-btn.buy:hover {
    background: #a07a1a;
  }

  .item-btn.buy:disabled {
    background: #4a4a4a;
    cursor: not-allowed;
  }

  .item-btn.equip {
    background: #4a8b4a;
    color: white;
  }

  .item-btn.equip:hover {
    background: #5a9b5a;
  }

  .item-btn.unequip {
    background: #8b4a4a;
    color: white;
  }

  .item-btn.unequip:hover {
    background: #9b5a5a;
  }

  .empty-message {
    color: #888;
    text-align: center;
    padding: 40px;
    font-style: italic;
  }
`

function injectStyles() {
  if (document.getElementById('shop-styles')) return
  const style = document.createElement('style')
  style.id = 'shop-styles'
  style.textContent = STYLES
  document.head.appendChild(style)
}

function createShopOverlay() {
  injectStyles()

  const overlay = document.createElement('div')
  overlay.className = 'shop-overlay'
  overlay.innerHTML = `
    <div class="shop-container">
      <div class="shop-header">
        <h2 class="shop-title">${getShopTitle()}</h2>
        <div class="shop-koi-count">
          <span style="font-size: 20px;">🐟</span>
          <span id="shop-koi-count">${gameState.getKoi()}</span>
        </div>
        <button class="shop-close">&times;</button>
      </div>

      <div id="shop-content"></div>
    </div>
  `

  // Event listeners
  overlay.querySelector('.shop-close').addEventListener('click', closeShop)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeShop()
  })

  return overlay
}

function getShopTitle() {
  if (currentShopkeeper === 'donny') return "Donny's Fine Structures"
  if (currentShopkeeper === 'ollie') return "Ollie's Outfit Oddities"
  return 'Shop'
}

function updateTabStyles() {
  shopOverlay.querySelectorAll('.shop-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === currentTab)
  })
}

function updateShopContent() {
  const content = shopOverlay.querySelector('#shop-content')

  // Donny sells buildings, Ollie sells outfits
  if (currentShopkeeper === 'donny') {
    content.innerHTML = renderBuildingsTab()
    attachBuildingListeners(content)
  } else if (currentShopkeeper === 'ollie') {
    content.innerHTML = renderOutfitsTab()
    attachOutfitListeners(content)
  }

  // Update koi count
  const koiCount = shopOverlay.querySelector('#shop-koi-count')
  if (koiCount) koiCount.textContent = gameState.getKoi()
}

function renderOutfitsTab() {
  const characterBtns = Object.values(CHARACTERS).map(char => `
    <button class="character-btn ${currentCharacter === char ? 'active' : ''}" data-character="${char}">
      ${char.charAt(0).toUpperCase() + char.slice(1)}
    </button>
  `).join('')

  const outfits = getOutfitsForCharacter(currentCharacter)

  if (outfits.length === 0) {
    return `
      <div class="character-selector">${characterBtns}</div>
      <div class="empty-message">No outfits available for ${currentCharacter}</div>
    `
  }

  const itemCards = outfits.map(outfit => {
    const owned = inventory.owns(outfit.id)
    const equipped = inventory.isEquipped(outfit.character, outfit.id)
    const canAfford = gameState.getKoi() >= outfit.price

    let btnClass, btnText
    if (!owned) {
      btnClass = 'buy'
      btnText = canAfford ? 'Buy' : 'Need more 🐟'
    } else if (equipped) {
      btnClass = 'unequip'
      btnText = 'Unequip'
    } else {
      btnClass = 'equip'
      btnText = 'Equip'
    }

    const cardClasses = ['item-card']
    if (owned) cardClasses.push('owned')
    if (equipped) cardClasses.push('equipped')
    if (!owned && !canAfford) cardClasses.push('cant-afford')

    return `
      <div class="${cardClasses.join(' ')}" data-item-id="${outfit.id}">
        <div class="item-name">${outfit.name}</div>
        ${!owned ? `<div class="item-price">🐟 ${outfit.price}</div>` : ''}
        <button class="item-btn ${btnClass}" ${!owned && !canAfford ? 'disabled' : ''} data-action="${btnClass}" data-item-id="${outfit.id}">
          ${btnText}
        </button>
      </div>
    `
  }).join('')

  return `
    <div class="character-selector">${characterBtns}</div>
    <div class="item-grid">${itemCards}</div>
  `
}

function renderBuildingsTab() {
  const buildings = getAllBuildings()

  const itemCards = buildings.map(building => {
    const owned = inventory.owns(building.id)
    const canAfford = gameState.getKoi() >= building.price

    let btnClass, btnText
    if (owned) {
      btnClass = 'equip'
      btnText = 'Place'
    } else {
      btnClass = 'buy'
      btnText = canAfford ? 'Buy' : 'Need more 🐟'
    }

    const cardClasses = ['item-card']
    if (owned) cardClasses.push('owned')
    if (!owned && !canAfford) cardClasses.push('cant-afford')

    return `
      <div class="${cardClasses.join(' ')}" data-item-id="${building.id}">
        <div class="item-name">${building.name}</div>
        ${!owned ? `<div class="item-price">🐟 ${building.price}</div>` : ''}
        <button class="item-btn ${btnClass}" ${!owned && !canAfford ? 'disabled' : ''} data-action="${btnClass}" data-item-id="${building.id}">
          ${btnText}
        </button>
      </div>
    `
  }).join('')

  return `<div class="item-grid">${itemCards}</div>`
}

function attachOutfitListeners(content) {
  // Character selector
  content.querySelectorAll('.character-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCharacter = btn.dataset.character
      updateShopContent()
    })
  })

  // Item buttons
  content.querySelectorAll('.item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.itemId
      const action = btn.dataset.action
      const item = getItem(itemId)

      if (action === 'buy') {
        if (gameState.spendKoi(item.price)) {
          inventory.purchase(itemId)
          // Auto-equip after buying (this also unequips same-type items)
          const unequippedIds = inventory.equip(item.character, itemId)
          // Notify about unequipped items first
          if (onPurchaseCallback && unequippedIds) {
            for (const oldId of unequippedIds) {
              const oldItem = getItem(oldId)
              if (oldItem) onPurchaseCallback(oldItem, 'unequip')
            }
          }
          if (onPurchaseCallback) onPurchaseCallback(item, 'equip')
          playPurchase()
          updateShopContent()
        }
      } else if (action === 'equip') {
        // Equip returns any auto-unequipped items of the same type
        const unequippedIds = inventory.equip(item.character, itemId)
        // Notify about unequipped items first
        if (onPurchaseCallback && unequippedIds) {
          for (const oldId of unequippedIds) {
            const oldItem = getItem(oldId)
            if (oldItem) onPurchaseCallback(oldItem, 'unequip')
          }
        }
        if (onPurchaseCallback) onPurchaseCallback(item, 'equip')
        updateShopContent()
      } else if (action === 'unequip') {
        inventory.unequip(item.character, itemId)
        if (onPurchaseCallback) onPurchaseCallback(item, 'unequip')
        updateShopContent()
      }
    })
  })
}

function attachBuildingListeners(content) {
  content.querySelectorAll('.item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.itemId
      const action = btn.dataset.action
      const item = getItem(itemId)

      if (action === 'buy') {
        if (gameState.spendKoi(item.price)) {
          inventory.purchase(itemId)
          if (onPurchaseCallback) onPurchaseCallback(item)
          playPurchase()
          updateShopContent()
        }
      } else if (action === 'equip') {
        // Building placement - close shop and enter placement mode
        // Save callback before closeShop clears it
        const callback = onPurchaseCallback
        closeShop()
        if (callback) callback(item, 'place')
      }
    })
  })
}

export function openShop(shopkeeper, container, callbacks = {}) {
  if (shopOverlay) return // Already open

  currentShopkeeper = shopkeeper
  onCloseCallback = callbacks.onClose
  onPurchaseCallback = callbacks.onPurchase

  // Set default tab based on shopkeeper specialty
  // Donny sells buildings, Ollie sells outfits
  currentTab = shopkeeper === 'donny' ? 'buildings' : 'outfits'

  shopOverlay = createShopOverlay()
  container.appendChild(shopOverlay)
  updateShopContent()

  // Listen for koi count changes
  gameState.addListener(updateKoiDisplay)

  playShopOpen()
}

function updateKoiDisplay(count) {
  if (shopOverlay) {
    const koiCount = shopOverlay.querySelector('#shop-koi-count')
    if (koiCount) koiCount.textContent = count
  }
}

export function closeShop() {
  if (!shopOverlay) return

  playShopClose()

  gameState.removeListener(updateKoiDisplay)
  shopOverlay.remove()
  shopOverlay = null

  if (onCloseCallback) {
    onCloseCallback()
    onCloseCallback = null
  }

  currentShopkeeper = null
  onPurchaseCallback = null
}

export function isShopOpen() {
  return shopOverlay !== null
}
