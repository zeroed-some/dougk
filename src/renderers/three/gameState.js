// Game state singleton for dougk gamification
// Tracks currency (captured koi) and other persistent state

const STORAGE_KEY = 'dougk-koi'

const gameState = {
  capturedKoi: parseInt(localStorage.getItem(STORAGE_KEY) || '0'),

  addKoi(n = 1) {
    this.capturedKoi += n
    this.save()
    this.notifyListeners()
  },

  spendKoi(n) {
    if (this.capturedKoi >= n) {
      this.capturedKoi -= n
      this.save()
      this.notifyListeners()
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
