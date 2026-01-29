// Inventory persistence for dougk shop system
// Tracks owned items, equipped outfits, and placed buildings

import { getItem } from './items.js'

const STORAGE_KEYS = {
  OWNED: 'dougk-owned-items',
  EQUIPPED: 'dougk-equipped',
  BUILDINGS: 'dougk-buildings',
  BUILDINGS_FREEFORM: 'dougk-buildings-freeform'
}

function loadJSON(key, defaultValue) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const inventory = {
  // Owned items (array of item IDs)
  ownedItems: loadJSON(STORAGE_KEYS.OWNED, []),

  // Equipped outfits per character
  equipped: loadJSON(STORAGE_KEYS.EQUIPPED, {
    doug: [],
    donny: [],
    ollie: []
  }),

  // Placed buildings (legacy zone-based format)
  buildings: loadJSON(STORAGE_KEYS.BUILDINGS, []),

  // Placed buildings (new freeform format with coordinates)
  buildingsFreeform: loadJSON(STORAGE_KEYS.BUILDINGS_FREEFORM, []),

  // Check if an item is owned
  owns(itemId) {
    return this.ownedItems.includes(itemId)
  },

  // Purchase an item (add to owned)
  purchase(itemId) {
    if (!this.owns(itemId)) {
      this.ownedItems.push(itemId)
      this.save()
      return true
    }
    return false
  },

  // Equip an outfit to a character
  // Automatically unequips any other outfit of the same type
  equip(character, itemId) {
    if (!this.equipped[character]) {
      this.equipped[character] = []
    }

    // Get the type of the item being equipped
    const newItem = getItem(itemId)
    if (!newItem) return

    // Find and unequip any item of the same type
    const sameTypeItems = this.equipped[character].filter(equippedId => {
      const equippedItem = getItem(equippedId)
      return equippedItem && equippedItem.type === newItem.type
    })

    // Remove items of the same type
    for (const oldId of sameTypeItems) {
      this.equipped[character] = this.equipped[character].filter(id => id !== oldId)
    }

    // Now equip the new item
    if (!this.equipped[character].includes(itemId)) {
      this.equipped[character].push(itemId)
    }
    this.save()

    // Return the unequipped items so the caller can update visuals
    return sameTypeItems
  },

  // Unequip an outfit from a character
  unequip(character, itemId) {
    if (this.equipped[character]) {
      this.equipped[character] = this.equipped[character].filter(id => id !== itemId)
      this.save()
    }
  },

  // Check if an outfit is equipped on a character
  isEquipped(character, itemId) {
    return this.equipped[character]?.includes(itemId) || false
  },

  // Get all equipped items for a character
  getEquipped(character) {
    return this.equipped[character] || []
  },

  // Place a building
  placeBuilding(buildingType, zoneId) {
    this.buildings.push({ type: buildingType, zoneId })
    this.save()
  },

  // Check if a zone is occupied
  isZoneOccupied(zoneId) {
    return this.buildings.some(b => b.zoneId === zoneId)
  },

  // Get all placed buildings
  getBuildings() {
    return [...this.buildings]
  },

  // Alias for getBuildings (used by PlacementManager)
  getPlacedBuildings() {
    return this.getBuildings()
  },

  // Remove a placed building by zone ID
  removeBuilding(zoneId) {
    const index = this.buildings.findIndex(b => b.zoneId === zoneId)
    if (index !== -1) {
      this.buildings.splice(index, 1)
      this.save()
      return true
    }
    return false
  },

  // === Freeform placement methods (new system) ===

  // Place a building with freeform coordinates
  placeBuildingFreeform(data) {
    // data: { type, x, z, rotation, placementId }
    this.buildingsFreeform.push(data)
    this.save()
  },

  // Get all freeform placed buildings
  getPlacedBuildingsFreeform() {
    return [...this.buildingsFreeform]
  },

  // Remove a freeform building by placement ID
  removeBuildingFreeform(placementId) {
    const index = this.buildingsFreeform.findIndex(b => b.placementId === placementId)
    if (index !== -1) {
      this.buildingsFreeform.splice(index, 1)
      this.save()
      return true
    }
    return false
  },

  // Save all state
  save() {
    saveJSON(STORAGE_KEYS.OWNED, this.ownedItems)
    saveJSON(STORAGE_KEYS.EQUIPPED, this.equipped)
    saveJSON(STORAGE_KEYS.BUILDINGS, this.buildings)
    saveJSON(STORAGE_KEYS.BUILDINGS_FREEFORM, this.buildingsFreeform)
  },

  // Clear all data (for testing)
  reset() {
    this.ownedItems = []
    this.equipped = { doug: [], donny: [], ollie: [] }
    this.buildings = []
    this.buildingsFreeform = []
    this.save()
  }
}

export default inventory
