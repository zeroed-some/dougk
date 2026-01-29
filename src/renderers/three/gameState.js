// Game state singleton for dougk gamification
// Tracks currency (captured koi) and other persistent state

const STORAGE_KEY = 'dougk-koi'

const gameState = {
  capturedKoi: parseInt(localStorage.getItem(STORAGE_KEY) || '0'),

  // Shop approach tracking - only approach Doug when there's a reason
  shopApproach: {
    // First emergence this session - creatures should greet player
    firstEmergence: {
      donny: true,
      ollie: true
    },
    // Track which items player could afford before last koi capture
    previousAffordableIds: new Set(),
    // Flag: player can now afford something new
    hasNewAffordableItem: false,
    // Items catalog reference (set by initShopTracking)
    allItems: null,
    // Inventory reference for checking owned items
    inventory: null
  },

  // Initialize shop tracking with items and inventory references
  initShopTracking(allItems, inventory) {
    this.shopApproach.allItems = allItems
    this.shopApproach.inventory = inventory
    // Initialize previous affordable set based on current koi
    this.updateAffordableItems()
  },

  // Get all purchasable (not owned) items player can afford
  getAffordableItemIds() {
    const { allItems, inventory } = this.shopApproach
    if (!allItems || !inventory) return new Set()

    const affordable = new Set()
    for (const item of allItems) {
      // Must not already own it and must be able to afford it
      if (!inventory.owns(item.id) && item.price <= this.capturedKoi) {
        affordable.add(item.id)
      }
    }
    return affordable
  },

  // Update affordable items and check if player unlocked something new
  updateAffordableItems() {
    const currentAffordable = this.getAffordableItemIds()
    const { previousAffordableIds } = this.shopApproach

    // Check if any new items became affordable
    for (const id of currentAffordable) {
      if (!previousAffordableIds.has(id)) {
        this.shopApproach.hasNewAffordableItem = true
        break
      }
    }

    // Update the previous set
    this.shopApproach.previousAffordableIds = currentAffordable
  },

  // Check if a creature should approach Doug
  // Returns true on first emergence or if player can afford something new
  shouldCreatureApproach(creature) {
    const { firstEmergence, hasNewAffordableItem } = this.shopApproach

    // First emergence this session
    if (firstEmergence[creature]) {
      return true
    }

    // Player unlocked a new affordable item
    if (hasNewAffordableItem) {
      return true
    }

    return false
  },

  // Mark that a creature has approached (used after shop interaction starts)
  markApproachComplete(creature) {
    // Clear first emergence flag for this creature
    this.shopApproach.firstEmergence[creature] = false

    // Clear the new affordable flag (both creatures share this trigger)
    this.shopApproach.hasNewAffordableItem = false
  },

  // Called when player purchases an item - recalculate affordable items
  onPurchase() {
    this.updateAffordableItems()
  },

  addKoi(n = 1) {
    this.capturedKoi += n
    this.save()
    this.notifyListeners()
    // Check if new items became affordable
    this.updateAffordableItems()
  },

  spendKoi(n) {
    if (this.capturedKoi >= n) {
      this.capturedKoi -= n
      this.save()
      this.notifyListeners()
      // Recalculate affordable items after spending
      this.updateAffordableItems()
      return true
    }
    return false
  },

  getKoi() {
    return this.capturedKoi
  },

  save() {
    localStorage.setItem(STORAGE_KEY, this.capturedKoi.toString())
  },

  // Listener system for UI updates
  listeners: [],

  addListener(callback) {
    this.listeners.push(callback)
  },

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback)
  },

  notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.capturedKoi)
    }
  }
}

export default gameState
