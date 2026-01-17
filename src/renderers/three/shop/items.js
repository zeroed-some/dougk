// Item catalog for dougk shop
// Defines all purchasable outfits and buildings

import * as THREE from 'three'

// Outfit types
export const OUTFIT_TYPES = {
  COLOR_BODY: 'color_body',
  COLOR_ACCENT: 'color_accent',
  ACCESSORY_HEAD: 'accessory_head',
  ACCESSORY_FACE: 'accessory_face',
  ACCESSORY_HELD: 'accessory_held'
}

// Character IDs
export const CHARACTERS = {
  DOUG: 'doug',
  DONNY: 'donny',
  OLLIE: 'ollie'
}

// Outfit definitions
export const OUTFITS = {
  // Doug outfits - starter tier (cheap)
  doug_mint: {
    id: 'doug_mint',
    name: 'Mint Fresh',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.COLOR_BODY,
    price: 5,
    colors: { body: 0x98fb98, highlight: 0xb0ffb0 }
  },
  doug_bubblegum: {
    id: 'doug_bubblegum',
    name: 'Bubblegum',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.COLOR_BODY,
    price: 5,
    colors: { body: 0xffb6c1, highlight: 0xffd1dc }
  },
  // Doug outfits - mid tier
  doug_golden: {
    id: 'doug_golden',
    name: 'Golden Glow',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.COLOR_BODY,
    price: 12,
    colors: { body: 0xffd700, highlight: 0xffec8b }
  },
  doug_sunset: {
    id: 'doug_sunset',
    name: 'Sunset Orange',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.COLOR_BODY,
    price: 12,
    colors: { body: 0xff6b35, highlight: 0xffa07a }
  },
  doug_tophat: {
    id: 'doug_tophat',
    name: 'Top Hat',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.ACCESSORY_HEAD,
    price: 25,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const material = new THREE.MeshToonMaterial({ color: 0x1a1a1a, gradientMap })

      // Hat brim
      const brimGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.03, 12)
      const brim = new THREE.Mesh(brimGeom, material)
      group.add(brim)

      // Hat top
      const topGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.25, 12)
      const top = new THREE.Mesh(topGeom, material)
      top.position.y = 0.14
      group.add(top)

      // Hat band
      const bandMat = new THREE.MeshToonMaterial({ color: 0x8b0000, gradientMap })
      const bandGeom = new THREE.CylinderGeometry(0.155, 0.155, 0.04, 12)
      const band = new THREE.Mesh(bandGeom, bandMat)
      band.position.y = 0.04
      group.add(band)

      return group
    }
  },
  doug_shades: {
    id: 'doug_shades',
    name: 'Cool Shades',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.ACCESSORY_FACE,
    price: 20,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const frameMat = new THREE.MeshToonMaterial({ color: 0x1a1a1a, gradientMap })
      const lensMat = new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.7 })

      // Left lens
      const lensGeom = new THREE.CircleGeometry(0.08, 8)
      const leftLens = new THREE.Mesh(lensGeom, lensMat)
      leftLens.position.set(-0.1, 0, 0.01)
      group.add(leftLens)

      // Right lens
      const rightLens = new THREE.Mesh(lensGeom, lensMat)
      rightLens.position.set(0.1, 0, 0.01)
      group.add(rightLens)

      // Bridge
      const bridgeGeom = new THREE.BoxGeometry(0.06, 0.02, 0.02)
      const bridge = new THREE.Mesh(bridgeGeom, frameMat)
      group.add(bridge)

      // Frames
      const frameGeom = new THREE.TorusGeometry(0.08, 0.01, 4, 12)
      const leftFrame = new THREE.Mesh(frameGeom, frameMat)
      leftFrame.position.set(-0.1, 0, 0)
      group.add(leftFrame)

      const rightFrame = new THREE.Mesh(frameGeom, frameMat)
      rightFrame.position.set(0.1, 0, 0)
      group.add(rightFrame)

      return group
    }
  },

  // Donny outfits - starter tier
  donny_seafoam: {
    id: 'donny_seafoam',
    name: 'Seafoam',
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.COLOR_BODY,
    price: 8,
    colors: { body: 0x5f9ea0, belly: 0x98d8d8 }
  },
  // Donny outfits - mid tier
  donny_royal: {
    id: 'donny_royal',
    name: 'Royal Purple',
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.COLOR_BODY,
    price: 15,
    colors: { body: 0x6b3fa0, belly: 0x9b7bc0 }
  },
  donny_arctic: {
    id: 'donny_arctic',
    name: 'Arctic White',
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.COLOR_BODY,
    price: 18,
    colors: { body: 0xe8e8e8, belly: 0xffffff }
  },
  donny_ruby_monocle: {
    id: 'donny_ruby_monocle',
    name: 'Ruby Monocle',
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.ACCESSORY_FACE,
    price: 25,
    colors: { rim: 0xb22222, glass: 0xff6666 }
  },
  donny_bowler: {
    id: 'donny_bowler',
    name: 'Bowler Hat',
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.ACCESSORY_HEAD,
    price: 25,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const material = new THREE.MeshToonMaterial({ color: 0x2f2f2f, gradientMap })

      // Hat dome
      const domeGeom = new THREE.SphereGeometry(0.15, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2)
      const dome = new THREE.Mesh(domeGeom, material)
      group.add(dome)

      // Hat brim
      const brimGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.025, 12)
      const brim = new THREE.Mesh(brimGeom, material)
      brim.position.y = -0.01
      group.add(brim)

      return group
    }
  },

  // Ollie outfits
  ollie_coral: {
    id: 'ollie_coral',
    name: 'Coral Pink',
    character: CHARACTERS.OLLIE,
    type: OUTFIT_TYPES.COLOR_BODY,
    price: 20,
    colors: { body: 0xff7f7f, belly: 0xffb3b3, suckers: 0xffcccc }
  },
  ollie_deepsea: {
    id: 'ollie_deepsea',
    name: 'Deep Sea Blue',
    character: CHARACTERS.OLLIE,
    type: OUTFIT_TYPES.COLOR_BODY,
    price: 20,
    colors: { body: 0x1e3a5f, belly: 0x4a6fa5, suckers: 0x6b8cae }
  },
  ollie_golden_mag: {
    id: 'ollie_golden_mag',
    name: 'Golden Magnifier',
    character: CHARACTERS.OLLIE,
    type: OUTFIT_TYPES.ACCESSORY_HELD,
    price: 30,
    colors: { rim: 0xffd700, glass: 0xffffcc }
  },
  ollie_detective: {
    id: 'ollie_detective',
    name: 'Detective Cap',
    character: CHARACTERS.OLLIE,
    type: OUTFIT_TYPES.ACCESSORY_HEAD,
    price: 25,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const material = new THREE.MeshToonMaterial({ color: 0x8b4513, gradientMap })

      // Cap body
      const capGeom = new THREE.SphereGeometry(0.18, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2)
      const cap = new THREE.Mesh(capGeom, material)
      cap.scale.y = 0.5
      group.add(cap)

      // Front brim
      const brimGeom = new THREE.CylinderGeometry(0.12, 0.15, 0.02, 8, 1, false, -Math.PI/3, Math.PI * 2/3)
      const brim = new THREE.Mesh(brimGeom, material)
      brim.position.set(0.12, -0.02, 0)
      brim.rotation.z = -0.3
      group.add(brim)

      return group
    }
  }
}

// Building definitions
export const BUILDINGS = {
  dock_wooden: {
    id: 'dock_wooden',
    buildingType: 'dock_wooden',
    name: 'Wooden Dock',
    price: 40,
    zoneType: 'waterEdge',
    forbiddenRadius: 0.8
  },
  fishing_hut: {
    id: 'fishing_hut',
    buildingType: 'fishing_hut',
    name: 'Fishing Hut',
    price: 50,
    zoneType: 'waterEdge',
    forbiddenRadius: 0.9
  },
  lighthouse: {
    id: 'lighthouse',
    buildingType: 'lighthouse',
    name: 'Mini Lighthouse',
    price: 50,
    zoneType: 'shore',
    forbiddenRadius: 0.5
  },
  reeds: {
    id: 'reeds',
    buildingType: 'reeds',
    name: 'Reed Cluster',
    price: 25,
    zoneType: 'water',
    forbiddenRadius: 0.4
  },
  fence: {
    id: 'fence',
    buildingType: 'fence',
    name: 'Fence Segment',
    price: 25,
    zoneType: 'shore',
    forbiddenRadius: 0.3
  },
  onion_house: {
    id: 'onion_house',
    buildingType: 'onion_house',
    name: 'Onion House',
    price: 45,
    zoneType: 'shore',
    forbiddenRadius: 0.6
  }
}

// Get all outfits for a character
export function getOutfitsForCharacter(character) {
  return Object.values(OUTFITS).filter(o => o.character === character)
}

// Get all buildings
export function getAllBuildings() {
  return Object.values(BUILDINGS)
}

// Get item by ID (outfit or building)
export function getItem(itemId) {
  return OUTFITS[itemId] || BUILDINGS[itemId] || null
}
