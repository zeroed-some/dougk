// Item catalog for dougk shop
// Defines all purchasable outfits and buildings

import * as THREE from 'three'

// Outfit types
export const OUTFIT_TYPES = {
  COLOR_BODY: 'color_body',
  COLOR_ACCENT: 'color_accent',
  ACCESSORY_HEAD: 'accessory_head',
  ACCESSORY_FACE: 'accessory_face',
  ACCESSORY_HELD: 'accessory_held',
  CLOTHING_BODY: 'clothing_body'  // Actual rendered clothing meshes
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

  doug_aviator_goggles: {
    id: 'doug_aviator_goggles',
    name: 'Aviator Goggles',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.ACCESSORY_FACE,
    price: 35,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const brassMat = new THREE.MeshToonMaterial({ color: 0xb8860b, gradientMap })
      const leatherMat = new THREE.MeshToonMaterial({ color: 0x5c4033, gradientMap })
      const lensMat = new THREE.MeshBasicMaterial({ color: 0x4a90d9, transparent: true, opacity: 0.6 })

      // Large goggle lenses (round, pilot-style)
      const lensGeom = new THREE.CircleGeometry(0.1, 10)
      const leftLens = new THREE.Mesh(lensGeom, lensMat)
      leftLens.position.set(-0.12, 0, 0.02)
      group.add(leftLens)

      const rightLens = new THREE.Mesh(lensGeom, lensMat)
      rightLens.position.set(0.12, 0, 0.02)
      group.add(rightLens)

      // Brass frames
      const frameGeom = new THREE.TorusGeometry(0.1, 0.015, 6, 16)
      const leftFrame = new THREE.Mesh(frameGeom, brassMat)
      leftFrame.position.set(-0.12, 0, 0)
      group.add(leftFrame)

      const rightFrame = new THREE.Mesh(frameGeom, brassMat)
      rightFrame.position.set(0.12, 0, 0)
      group.add(rightFrame)

      // Brass bridge with rivets
      const bridgeGeom = new THREE.BoxGeometry(0.06, 0.025, 0.025)
      const bridge = new THREE.Mesh(bridgeGeom, brassMat)
      group.add(bridge)

      // Rivets on bridge
      const rivetGeom = new THREE.SphereGeometry(0.008, 4, 4)
      const rivet1 = new THREE.Mesh(rivetGeom, brassMat)
      rivet1.position.set(-0.02, 0, 0.015)
      group.add(rivet1)

      const rivet2 = new THREE.Mesh(rivetGeom, brassMat)
      rivet2.position.set(0.02, 0, 0.015)
      group.add(rivet2)

      // Leather padding around lenses
      const padGeom = new THREE.TorusGeometry(0.11, 0.02, 4, 16)
      const leftPad = new THREE.Mesh(padGeom, leatherMat)
      leftPad.position.set(-0.12, 0, -0.01)
      group.add(leftPad)

      const rightPad = new THREE.Mesh(padGeom, leatherMat)
      rightPad.position.set(0.12, 0, -0.01)
      group.add(rightPad)

      // Leather strap connectors
      const strapGeom = new THREE.BoxGeometry(0.04, 0.03, 0.015)
      const leftStrap = new THREE.Mesh(strapGeom, leatherMat)
      leftStrap.position.set(-0.22, 0, 0)
      group.add(leftStrap)

      const rightStrap = new THREE.Mesh(strapGeom, leatherMat)
      rightStrap.position.set(0.22, 0, 0)
      group.add(rightStrap)

      return group
    }
  },

  doug_propeller_beanie: {
    id: 'doug_propeller_beanie',
    name: 'Propeller Beanie',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.ACCESSORY_HEAD,
    price: 30,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const redMat = new THREE.MeshToonMaterial({ color: 0xdd3333, gradientMap })
      const yellowMat = new THREE.MeshToonMaterial({ color: 0xffdd00, gradientMap })
      const blueMat = new THREE.MeshToonMaterial({ color: 0x3366cc, gradientMap })

      // Beanie cap base
      const capGeom = new THREE.SphereGeometry(0.18, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2)
      const cap = new THREE.Mesh(capGeom, redMat)
      group.add(cap)

      // Striped panels (alternating colors)
      for (let i = 0; i < 6; i++) {
        const panelGeom = new THREE.SphereGeometry(0.182, 2, 8,
          i * Math.PI / 3, Math.PI / 3, 0, Math.PI / 2)
        const material = i % 2 === 0 ? yellowMat : blueMat
        const panel = new THREE.Mesh(panelGeom, material)
        group.add(panel)
      }

      // Brim
      const brimGeom = new THREE.TorusGeometry(0.18, 0.02, 4, 16)
      const brim = new THREE.Mesh(brimGeom, redMat)
      brim.rotation.x = Math.PI / 2
      brim.position.y = 0
      group.add(brim)

      // Button on top
      const buttonGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 8)
      const button = new THREE.Mesh(buttonGeom, yellowMat)
      button.position.y = 0.17
      group.add(button)

      // Propeller mount
      const mountGeom = new THREE.CylinderGeometry(0.015, 0.02, 0.04, 6)
      const mount = new THREE.Mesh(mountGeom, blueMat)
      mount.position.y = 0.19
      group.add(mount)

      // Propeller blades (will spin in animation)
      const propGroup = new THREE.Group()
      propGroup.userData.isPropeller = true
      propGroup.position.y = 0.22

      const bladeGeom = new THREE.BoxGeometry(0.15, 0.01, 0.03)
      const blade1 = new THREE.Mesh(bladeGeom, redMat)
      blade1.rotation.z = 0.1
      propGroup.add(blade1)

      const blade2 = new THREE.Mesh(bladeGeom, yellowMat)
      blade2.rotation.y = Math.PI / 2
      blade2.rotation.z = -0.1
      propGroup.add(blade2)

      // Center hub
      const hubGeom = new THREE.SphereGeometry(0.02, 6, 4)
      const hub = new THREE.Mesh(hubGeom, blueMat)
      propGroup.add(hub)

      group.add(propGroup)

      return group
    }
  },

  // === DOUG CLOTHING - Actual rendered garments ===

  // Simple tier - basic clothing
  doug_tee_red: {
    id: 'doug_tee_red',
    name: 'Red T-Shirt',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 35,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const fabricMat = new THREE.MeshToonMaterial({ color: 0xcc3333, gradientMap })

      // Main shirt body - wraps around duck torso
      const torsoGeom = new THREE.SphereGeometry(0.44, 10, 8)
      torsoGeom.scale(1.35, 0.72, 0.88)
      const torso = new THREE.Mesh(torsoGeom, fabricMat)
      torso.position.set(0, 0.28, 0)
      group.add(torso)

      // Collar (V-neck)
      const collarMat = new THREE.MeshToonMaterial({ color: 0xaa2222, gradientMap })
      const collarGeom = new THREE.TorusGeometry(0.12, 0.025, 4, 8, Math.PI)
      const collar = new THREE.Mesh(collarGeom, collarMat)
      collar.position.set(0.35, 0.42, 0)
      collar.rotation.z = -Math.PI / 2
      collar.rotation.y = Math.PI / 2
      group.add(collar)

      // Short sleeves
      const sleeveGeom = new THREE.CylinderGeometry(0.08, 0.1, 0.12, 6)
      const leftSleeve = new THREE.Mesh(sleeveGeom, fabricMat)
      leftSleeve.position.set(0.05, 0.32, 0.36)
      leftSleeve.rotation.x = Math.PI / 2
      leftSleeve.rotation.z = 0.3
      group.add(leftSleeve)

      const rightSleeve = new THREE.Mesh(sleeveGeom, fabricMat)
      rightSleeve.position.set(0.05, 0.32, -0.36)
      rightSleeve.rotation.x = -Math.PI / 2
      rightSleeve.rotation.z = 0.3
      group.add(rightSleeve)

      return group
    }
  },

  doug_sailor_shirt: {
    id: 'doug_sailor_shirt',
    name: 'Sailor Stripes',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 55,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const whiteMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap })
      const blueMat = new THREE.MeshToonMaterial({ color: 0x1e3a5f, gradientMap })

      // Main shirt body
      const torsoGeom = new THREE.SphereGeometry(0.44, 10, 8)
      torsoGeom.scale(1.35, 0.72, 0.88)
      const torso = new THREE.Mesh(torsoGeom, whiteMat)
      torso.position.set(0, 0.28, 0)
      group.add(torso)

      // Horizontal stripes (rings around body)
      for (let i = 0; i < 4; i++) {
        const stripeGeom = new THREE.TorusGeometry(0.38 - i * 0.02, 0.02, 4, 16)
        const stripe = new THREE.Mesh(stripeGeom, blueMat)
        stripe.position.set(-0.05 + i * 0.12, 0.18 + i * 0.06, 0)
        stripe.rotation.y = Math.PI / 2
        stripe.rotation.z = 0.1
        group.add(stripe)
      }

      // Sailor collar (big square back collar)
      const collarGeom = new THREE.BoxGeometry(0.35, 0.02, 0.4)
      const collar = new THREE.Mesh(collarGeom, blueMat)
      collar.position.set(-0.15, 0.48, 0)
      group.add(collar)

      // Collar flaps hanging down back
      const flapGeom = new THREE.BoxGeometry(0.18, 0.2, 0.02)
      const leftFlap = new THREE.Mesh(flapGeom, blueMat)
      leftFlap.position.set(-0.2, 0.38, 0.18)
      leftFlap.rotation.x = 0.2
      group.add(leftFlap)

      const rightFlap = new THREE.Mesh(flapGeom, blueMat)
      rightFlap.position.set(-0.2, 0.38, -0.18)
      rightFlap.rotation.x = -0.2
      group.add(rightFlap)

      // Red neckerchief
      const tieMat = new THREE.MeshToonMaterial({ color: 0xcc2222, gradientMap })
      const tieGeom = new THREE.ConeGeometry(0.06, 0.15, 4)
      const tie = new THREE.Mesh(tieGeom, tieMat)
      tie.position.set(0.32, 0.32, 0)
      tie.rotation.z = Math.PI
      group.add(tie)

      return group
    }
  },

  doug_cozy_sweater: {
    id: 'doug_cozy_sweater',
    name: 'Cozy Sweater',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 70,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const woolMat = new THREE.MeshToonMaterial({ color: 0x8b4513, gradientMap })
      const trimMat = new THREE.MeshToonMaterial({ color: 0xdaa520, gradientMap })

      // Chunky sweater body
      const torsoGeom = new THREE.SphereGeometry(0.46, 10, 8)
      torsoGeom.scale(1.38, 0.75, 0.92)
      const torso = new THREE.Mesh(torsoGeom, woolMat)
      torso.position.set(0, 0.28, 0)
      group.add(torso)

      // Ribbed collar (turtleneck)
      const collarGeom = new THREE.CylinderGeometry(0.14, 0.16, 0.1, 8)
      const collar = new THREE.Mesh(collarGeom, woolMat)
      collar.position.set(0.38, 0.52, 0)
      collar.rotation.z = -0.1
      group.add(collar)

      // Cable knit pattern (raised lines)
      for (let i = 0; i < 3; i++) {
        const cableGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.5, 4)
        const cable = new THREE.Mesh(cableGeom, trimMat)
        cable.position.set(0.1, 0.28, -0.25 + i * 0.25)
        cable.rotation.x = Math.PI / 2
        cable.rotation.z = 0.2
        group.add(cable)
      }

      // Long sleeves
      const sleeveGeom = new THREE.CylinderGeometry(0.09, 0.11, 0.2, 6)
      const leftSleeve = new THREE.Mesh(sleeveGeom, woolMat)
      leftSleeve.position.set(-0.05, 0.30, 0.38)
      leftSleeve.rotation.x = Math.PI / 2
      leftSleeve.rotation.z = 0.4
      group.add(leftSleeve)

      const rightSleeve = new THREE.Mesh(sleeveGeom, woolMat)
      rightSleeve.position.set(-0.05, 0.30, -0.38)
      rightSleeve.rotation.x = -Math.PI / 2
      rightSleeve.rotation.z = 0.4
      group.add(rightSleeve)

      // Bottom ribbing
      const ribGeom = new THREE.TorusGeometry(0.42, 0.03, 4, 16)
      const rib = new THREE.Mesh(ribGeom, trimMat)
      rib.position.set(-0.1, 0.08, 0)
      rib.rotation.y = Math.PI / 2
      group.add(rib)

      return group
    }
  },

  doug_captain_jacket: {
    id: 'doug_captain_jacket',
    name: "Captain's Jacket",
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 95,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const navyMat = new THREE.MeshToonMaterial({ color: 0x1a1a3a, gradientMap })
      const goldMat = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap })
      const whiteMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap })

      // Jacket body
      const torsoGeom = new THREE.SphereGeometry(0.45, 10, 8)
      torsoGeom.scale(1.4, 0.76, 0.9)
      const torso = new THREE.Mesh(torsoGeom, navyMat)
      torso.position.set(0, 0.28, 0)
      group.add(torso)

      // Jacket front panels (double-breasted)
      const panelGeom = new THREE.BoxGeometry(0.08, 0.35, 0.25)
      const leftPanel = new THREE.Mesh(panelGeom, navyMat)
      leftPanel.position.set(0.38, 0.28, 0.12)
      group.add(leftPanel)

      const rightPanel = new THREE.Mesh(panelGeom, navyMat)
      rightPanel.position.set(0.38, 0.28, -0.12)
      group.add(rightPanel)

      // Gold buttons (double row)
      const buttonGeom = new THREE.SphereGeometry(0.025, 6, 4)
      const buttonPositions = [
        { x: 0.42, y: 0.38, z: 0.08 }, { x: 0.42, y: 0.28, z: 0.08 }, { x: 0.42, y: 0.18, z: 0.08 },
        { x: 0.42, y: 0.38, z: -0.08 }, { x: 0.42, y: 0.28, z: -0.08 }, { x: 0.42, y: 0.18, z: -0.08 }
      ]
      for (const pos of buttonPositions) {
        const button = new THREE.Mesh(buttonGeom, goldMat)
        button.position.set(pos.x, pos.y, pos.z)
        group.add(button)
      }

      // Epaulettes (shoulder boards)
      const epauletteGeom = new THREE.BoxGeometry(0.08, 0.02, 0.12)
      const leftEpaulette = new THREE.Mesh(epauletteGeom, goldMat)
      leftEpaulette.position.set(0.1, 0.45, 0.32)
      group.add(leftEpaulette)

      const rightEpaulette = new THREE.Mesh(epauletteGeom, goldMat)
      rightEpaulette.position.set(0.1, 0.45, -0.32)
      group.add(rightEpaulette)

      // High collar
      const collarGeom = new THREE.CylinderGeometry(0.13, 0.15, 0.08, 8, 1, true)
      const collar = new THREE.Mesh(collarGeom, navyMat)
      collar.position.set(0.36, 0.50, 0)
      collar.rotation.z = -0.1
      group.add(collar)

      // Gold collar trim
      const collarTrimGeom = new THREE.TorusGeometry(0.14, 0.012, 4, 12)
      const collarTrim = new THREE.Mesh(collarTrimGeom, goldMat)
      collarTrim.position.set(0.36, 0.54, 0)
      collarTrim.rotation.x = Math.PI / 2
      collarTrim.rotation.z = -0.1
      group.add(collarTrim)

      // Sleeves with gold cuff trim
      const sleeveGeom = new THREE.CylinderGeometry(0.09, 0.1, 0.18, 6)
      const leftSleeve = new THREE.Mesh(sleeveGeom, navyMat)
      leftSleeve.position.set(-0.02, 0.30, 0.38)
      leftSleeve.rotation.x = Math.PI / 2
      leftSleeve.rotation.z = 0.35
      group.add(leftSleeve)

      const rightSleeve = new THREE.Mesh(sleeveGeom, navyMat)
      rightSleeve.position.set(-0.02, 0.30, -0.38)
      rightSleeve.rotation.x = -Math.PI / 2
      rightSleeve.rotation.z = 0.35
      group.add(rightSleeve)

      // Gold cuff rings
      const cuffGeom = new THREE.TorusGeometry(0.095, 0.015, 4, 8)
      const leftCuff = new THREE.Mesh(cuffGeom, goldMat)
      leftCuff.position.set(-0.08, 0.26, 0.44)
      leftCuff.rotation.y = Math.PI / 2 + 0.35
      group.add(leftCuff)

      const rightCuff = new THREE.Mesh(cuffGeom, goldMat)
      rightCuff.position.set(-0.08, 0.26, -0.44)
      rightCuff.rotation.y = Math.PI / 2 - 0.35
      group.add(rightCuff)

      return group
    }
  },

  doug_pirate_captain: {
    id: 'doug_pirate_captain',
    name: 'Pirate Captain',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 150,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const coatMat = new THREE.MeshToonMaterial({ color: 0x8b0000, gradientMap })
      const blackMat = new THREE.MeshToonMaterial({ color: 0x1a1a1a, gradientMap })
      const goldMat = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap })
      const whiteMat = new THREE.MeshToonMaterial({ color: 0xf5f5dc, gradientMap })
      const beltMat = new THREE.MeshToonMaterial({ color: 0x4a3020, gradientMap })

      // Inner white shirt (ruffle front)
      const shirtGeom = new THREE.SphereGeometry(0.42, 10, 8)
      shirtGeom.scale(1.3, 0.7, 0.85)
      const shirt = new THREE.Mesh(shirtGeom, whiteMat)
      shirt.position.set(0, 0.28, 0)
      group.add(shirt)

      // Ruffle details on shirt front
      for (let i = 0; i < 4; i++) {
        const ruffleGeom = new THREE.TorusGeometry(0.06 - i * 0.008, 0.015, 4, 8, Math.PI)
        const ruffle = new THREE.Mesh(ruffleGeom, whiteMat)
        ruffle.position.set(0.36, 0.35 - i * 0.06, 0)
        ruffle.rotation.y = Math.PI / 2
        ruffle.rotation.z = -Math.PI / 2
        group.add(ruffle)
      }

      // Long pirate coat (open front)
      const coatLeftGeom = new THREE.BoxGeometry(0.1, 0.45, 0.35)
      const coatLeft = new THREE.Mesh(coatLeftGeom, coatMat)
      coatLeft.position.set(0.15, 0.22, 0.25)
      coatLeft.rotation.y = 0.15
      group.add(coatLeft)

      const coatRightGeom = new THREE.BoxGeometry(0.1, 0.45, 0.35)
      const coatRight = new THREE.Mesh(coatRightGeom, coatMat)
      coatRight.position.set(0.15, 0.22, -0.25)
      coatRight.rotation.y = -0.15
      group.add(coatRight)

      // Coat back
      const coatBackGeom = new THREE.BoxGeometry(0.08, 0.5, 0.55)
      const coatBack = new THREE.Mesh(coatBackGeom, coatMat)
      coatBack.position.set(-0.25, 0.25, 0)
      group.add(coatBack)

      // Coat tails (flowing behind)
      const tailGeom = new THREE.BoxGeometry(0.06, 0.25, 0.2)
      const leftTail = new THREE.Mesh(tailGeom, coatMat)
      leftTail.position.set(-0.35, 0.08, 0.15)
      leftTail.rotation.x = 0.2
      leftTail.rotation.z = 0.1
      group.add(leftTail)

      const rightTail = new THREE.Mesh(tailGeom, coatMat)
      rightTail.position.set(-0.35, 0.08, -0.15)
      rightTail.rotation.x = -0.2
      rightTail.rotation.z = 0.1
      group.add(rightTail)

      // Gold trim on coat edges
      const trimGeom = new THREE.BoxGeometry(0.02, 0.4, 0.02)
      const trimPositions = [
        { x: 0.22, y: 0.22, z: 0.42 }, { x: 0.22, y: 0.22, z: -0.42 },
        { x: 0.22, y: 0.22, z: 0.08 }, { x: 0.22, y: 0.22, z: -0.08 }
      ]
      for (const pos of trimPositions) {
        const trim = new THREE.Mesh(trimGeom, goldMat)
        trim.position.set(pos.x, pos.y, pos.z)
        group.add(trim)
      }

      // Wide leather belt
      const beltGeom = new THREE.TorusGeometry(0.4, 0.035, 4, 16)
      const belt = new THREE.Mesh(beltGeom, beltMat)
      belt.position.set(0, 0.15, 0)
      belt.rotation.y = Math.PI / 2
      belt.rotation.z = 0.05
      group.add(belt)

      // Belt buckle (skull shape simplified)
      const buckleGeom = new THREE.BoxGeometry(0.08, 0.08, 0.03)
      const buckle = new THREE.Mesh(buckleGeom, goldMat)
      buckle.position.set(0.38, 0.15, 0)
      group.add(buckle)

      // Skull detail on buckle
      const skullGeom = new THREE.SphereGeometry(0.025, 6, 4)
      const skull = new THREE.Mesh(skullGeom, whiteMat)
      skull.position.set(0.40, 0.15, 0)
      group.add(skull)

      // Diagonal bandolier strap
      const strapGeom = new THREE.BoxGeometry(0.5, 0.04, 0.03)
      const strap = new THREE.Mesh(strapGeom, beltMat)
      strap.position.set(0.05, 0.32, 0)
      strap.rotation.z = 0.6
      group.add(strap)

      // Coat sleeves
      const sleeveGeom = new THREE.CylinderGeometry(0.1, 0.11, 0.22, 6)
      const leftSleeve = new THREE.Mesh(sleeveGeom, coatMat)
      leftSleeve.position.set(-0.05, 0.30, 0.4)
      leftSleeve.rotation.x = Math.PI / 2
      leftSleeve.rotation.z = 0.4
      group.add(leftSleeve)

      const rightSleeve = new THREE.Mesh(sleeveGeom, coatMat)
      rightSleeve.position.set(-0.05, 0.30, -0.4)
      rightSleeve.rotation.x = -Math.PI / 2
      rightSleeve.rotation.z = 0.4
      group.add(rightSleeve)

      // Sleeve cuff ruffles
      const cuffGeom = new THREE.TorusGeometry(0.1, 0.02, 4, 8)
      const leftCuff = new THREE.Mesh(cuffGeom, whiteMat)
      leftCuff.position.set(-0.12, 0.26, 0.48)
      leftCuff.rotation.y = Math.PI / 2 + 0.4
      group.add(leftCuff)

      const rightCuff = new THREE.Mesh(cuffGeom, whiteMat)
      rightCuff.position.set(-0.12, 0.26, -0.48)
      rightCuff.rotation.y = Math.PI / 2 - 0.4
      group.add(rightCuff)

      // Gold buttons on coat
      const buttonGeom = new THREE.SphereGeometry(0.02, 6, 4)
      for (let i = 0; i < 3; i++) {
        const leftBtn = new THREE.Mesh(buttonGeom, goldMat)
        leftBtn.position.set(0.2, 0.35 - i * 0.08, 0.1)
        group.add(leftBtn)

        const rightBtn = new THREE.Mesh(buttonGeom, goldMat)
        rightBtn.position.set(0.2, 0.35 - i * 0.08, -0.1)
        group.add(rightBtn)
      }

      return group
    }
  },

  // Doug outfits - full costumes with accessories
  doug_chef: {
    id: 'doug_chef',
    name: 'Chef Doug',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    conflictsWith: [OUTFIT_TYPES.ACCESSORY_HEAD],
    price: 65,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const whiteMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap })
      const apronMat = new THREE.MeshToonMaterial({ color: 0xf5f5f5, gradientMap })
      const strapMat = new THREE.MeshToonMaterial({ color: 0xe8e8e8, gradientMap })

      // Chef's toque (tall puffy hat)
      const toqueBase = new THREE.CylinderGeometry(0.18, 0.2, 0.08, 12)
      const toqueBaseMesh = new THREE.Mesh(toqueBase, whiteMat)
      toqueBaseMesh.position.set(0.1, 0.75, 0)
      group.add(toqueBaseMesh)

      // Puffy top of toque (multiple spheres for volume)
      const puffGeom = new THREE.SphereGeometry(0.14, 8, 6)
      const puff1 = new THREE.Mesh(puffGeom, whiteMat)
      puff1.position.set(0.1, 0.9, 0)
      group.add(puff1)

      const puff2 = new THREE.Mesh(puffGeom, whiteMat)
      puff2.position.set(0.08, 0.98, 0.05)
      puff2.scale.set(0.9, 0.85, 0.9)
      group.add(puff2)

      const puff3 = new THREE.Mesh(puffGeom, whiteMat)
      puff3.position.set(0.12, 0.95, -0.05)
      puff3.scale.set(0.85, 0.8, 0.85)
      group.add(puff3)

      // Apron body
      const apronBodyGeom = new THREE.BoxGeometry(0.08, 0.4, 0.45)
      const apronBody = new THREE.Mesh(apronBodyGeom, apronMat)
      apronBody.position.set(0.38, 0.2, 0)
      group.add(apronBody)

      // Apron bib (upper part)
      const bibGeom = new THREE.BoxGeometry(0.06, 0.2, 0.3)
      const bib = new THREE.Mesh(bibGeom, apronMat)
      bib.position.set(0.4, 0.45, 0)
      group.add(bib)

      // Neck strap
      const neckStrapGeom = new THREE.TorusGeometry(0.15, 0.015, 4, 12, Math.PI)
      const neckStrap = new THREE.Mesh(neckStrapGeom, strapMat)
      neckStrap.position.set(0.25, 0.55, 0)
      neckStrap.rotation.z = Math.PI
      neckStrap.rotation.y = Math.PI / 2
      group.add(neckStrap)

      // Waist ties (hanging at sides)
      const tieGeom = new THREE.BoxGeometry(0.2, 0.02, 0.03)
      const leftTie = new THREE.Mesh(tieGeom, strapMat)
      leftTie.position.set(0.25, 0.25, 0.25)
      leftTie.rotation.y = 0.3
      group.add(leftTie)

      const rightTie = new THREE.Mesh(tieGeom, strapMat)
      rightTie.position.set(0.25, 0.25, -0.25)
      rightTie.rotation.y = -0.3
      group.add(rightTie)

      // Apron pocket
      const pocketGeom = new THREE.BoxGeometry(0.02, 0.1, 0.15)
      const pocket = new THREE.Mesh(pocketGeom, strapMat)
      pocket.position.set(0.42, 0.18, 0)
      group.add(pocket)

      return group
    }
  },

  doug_superhero: {
    id: 'doug_superhero',
    name: 'Super Duck',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 80,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const capeMat = new THREE.MeshToonMaterial({ color: 0xcc0000, gradientMap, side: THREE.DoubleSide })
      const capeInnerMat = new THREE.MeshToonMaterial({ color: 0xffcc00, gradientMap, side: THREE.DoubleSide })
      const maskMat = new THREE.MeshToonMaterial({ color: 0x1a1a1a, gradientMap })
      const emblemMat = new THREE.MeshToonMaterial({ color: 0xffcc00, gradientMap })

      // Cape - draped from shoulders
      const capeShape = new THREE.Shape()
      capeShape.moveTo(-0.35, 0)
      capeShape.lineTo(-0.4, -0.5)
      capeShape.quadraticCurveTo(0, -0.6, 0.4, -0.5)
      capeShape.lineTo(0.35, 0)
      capeShape.quadraticCurveTo(0, 0.05, -0.35, 0)

      const capeGeom = new THREE.ShapeGeometry(capeShape)
      const cape = new THREE.Mesh(capeGeom, capeMat)
      cape.position.set(-0.2, 0.4, 0)
      cape.rotation.y = Math.PI / 2
      cape.rotation.x = 0.2
      group.add(cape)

      // Cape inner lining (yellow)
      const capeInner = new THREE.Mesh(capeGeom, capeInnerMat)
      capeInner.position.set(-0.22, 0.4, 0)
      capeInner.rotation.y = Math.PI / 2
      capeInner.rotation.x = 0.2
      group.add(capeInner)

      // Cape clasp at neck
      const claspGeom = new THREE.SphereGeometry(0.04, 8, 6)
      const claspL = new THREE.Mesh(claspGeom, emblemMat)
      claspL.position.set(0.15, 0.52, 0.18)
      group.add(claspL)

      const claspR = new THREE.Mesh(claspGeom, emblemMat)
      claspR.position.set(0.15, 0.52, -0.18)
      group.add(claspR)

      // Domino mask
      const maskGeom = new THREE.BoxGeometry(0.06, 0.08, 0.35)
      const mask = new THREE.Mesh(maskGeom, maskMat)
      mask.position.set(0.48, 0.58, 0)
      group.add(mask)

      // Eye holes in mask
      const eyeHoleGeom = new THREE.CircleGeometry(0.04, 8)
      const eyeHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
      const eyeL = new THREE.Mesh(eyeHoleGeom, eyeHoleMat)
      eyeL.position.set(0.52, 0.58, 0.08)
      eyeL.rotation.y = Math.PI / 2
      group.add(eyeL)

      const eyeR = new THREE.Mesh(eyeHoleGeom, eyeHoleMat)
      eyeR.position.set(0.52, 0.58, -0.08)
      eyeR.rotation.y = Math.PI / 2
      group.add(eyeR)

      // Chest emblem - "D" shield
      const shieldGeom = new THREE.CircleGeometry(0.1, 6)
      const shield = new THREE.Mesh(shieldGeom, emblemMat)
      shield.position.set(0.42, 0.38, 0)
      shield.rotation.y = Math.PI / 2
      group.add(shield)

      // D letter on shield
      const dGeom = new THREE.TorusGeometry(0.04, 0.015, 4, 8, Math.PI)
      const dLetter = new THREE.Mesh(dGeom, capeMat)
      dLetter.position.set(0.44, 0.38, 0)
      dLetter.rotation.y = Math.PI / 2
      dLetter.rotation.z = -Math.PI / 2
      group.add(dLetter)

      return group
    }
  },

  doug_hoodie: {
    id: 'doug_hoodie',
    name: 'Cozy Hoodie',
    character: CHARACTERS.DOUG,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    conflictsWith: [OUTFIT_TYPES.ACCESSORY_HEAD],
    price: 55,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const hoodieMat = new THREE.MeshToonMaterial({ color: 0x4a5568, gradientMap })
      const hoodInnerMat = new THREE.MeshToonMaterial({ color: 0x2d3748, gradientMap })
      const stringMat = new THREE.MeshToonMaterial({ color: 0xe2e8f0, gradientMap })

      // Hoodie body
      const bodyGeom = new THREE.SphereGeometry(0.46, 10, 8)
      bodyGeom.scale(1.38, 0.76, 0.92)
      const body = new THREE.Mesh(bodyGeom, hoodieMat)
      body.position.set(0, 0.28, 0)
      group.add(body)

      // Hood (up, around head)
      const hoodGeom = new THREE.SphereGeometry(0.28, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.6)
      const hood = new THREE.Mesh(hoodGeom, hoodieMat)
      hood.position.set(0.15, 0.58, 0)
      hood.rotation.z = -0.3
      hood.rotation.x = 0.1
      group.add(hood)

      // Hood inner lining
      const hoodInnerGeom = new THREE.SphereGeometry(0.26, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.55)
      const hoodInner = new THREE.Mesh(hoodInnerGeom, hoodInnerMat)
      hoodInner.position.set(0.16, 0.58, 0)
      hoodInner.rotation.z = -0.3
      hoodInner.rotation.x = 0.1
      group.add(hoodInner)

      // Hoodie opening for face
      const openingGeom = new THREE.TorusGeometry(0.18, 0.025, 6, 12)
      const opening = new THREE.Mesh(openingGeom, hoodInnerMat)
      opening.position.set(0.38, 0.6, 0)
      opening.rotation.y = Math.PI / 2
      opening.rotation.z = -0.1
      group.add(opening)

      // Drawstrings
      const stringGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.2, 4)
      const stringL = new THREE.Mesh(stringGeom, stringMat)
      stringL.position.set(0.42, 0.42, 0.1)
      stringL.rotation.z = 0.3
      group.add(stringL)

      const stringR = new THREE.Mesh(stringGeom, stringMat)
      stringR.position.set(0.42, 0.42, -0.1)
      stringR.rotation.z = 0.3
      group.add(stringR)

      // String tips (little plastic aglets)
      const agletGeom = new THREE.CylinderGeometry(0.012, 0.008, 0.03, 4)
      const agletL = new THREE.Mesh(agletGeom, stringMat)
      agletL.position.set(0.48, 0.32, 0.1)
      group.add(agletL)

      const agletR = new THREE.Mesh(agletGeom, stringMat)
      agletR.position.set(0.48, 0.32, -0.1)
      group.add(agletR)

      // Front pocket (kangaroo pouch)
      const pocketGeom = new THREE.SphereGeometry(0.2, 8, 6, 0, Math.PI, 0, Math.PI)
      pocketGeom.scale(1.2, 0.5, 0.8)
      const pocket = new THREE.Mesh(pocketGeom, hoodInnerMat)
      pocket.position.set(0.4, 0.15, 0)
      pocket.rotation.y = Math.PI / 2
      pocket.rotation.z = Math.PI
      group.add(pocket)

      // Pocket opening
      const pocketOpenGeom = new THREE.TorusGeometry(0.12, 0.015, 4, 12, Math.PI)
      const pocketOpen = new THREE.Mesh(pocketOpenGeom, hoodieMat)
      pocketOpen.position.set(0.42, 0.18, 0)
      pocketOpen.rotation.y = Math.PI / 2
      pocketOpen.rotation.x = Math.PI / 2
      group.add(pocketOpen)

      // Sleeves
      const sleeveGeom = new THREE.CylinderGeometry(0.09, 0.11, 0.18, 6)
      const leftSleeve = new THREE.Mesh(sleeveGeom, hoodieMat)
      leftSleeve.position.set(0.05, 0.3, 0.38)
      leftSleeve.rotation.x = Math.PI / 2
      leftSleeve.rotation.z = 0.3
      group.add(leftSleeve)

      const rightSleeve = new THREE.Mesh(sleeveGeom, hoodieMat)
      rightSleeve.position.set(0.05, 0.3, -0.38)
      rightSleeve.rotation.x = -Math.PI / 2
      rightSleeve.rotation.z = 0.3
      group.add(rightSleeve)

      // Ribbed cuffs
      const cuffGeom = new THREE.TorusGeometry(0.085, 0.02, 4, 8)
      const leftCuff = new THREE.Mesh(cuffGeom, hoodInnerMat)
      leftCuff.position.set(0.0, 0.28, 0.46)
      leftCuff.rotation.y = Math.PI / 2
      group.add(leftCuff)

      const rightCuff = new THREE.Mesh(cuffGeom, hoodInnerMat)
      rightCuff.position.set(0.0, 0.28, -0.46)
      rightCuff.rotation.y = Math.PI / 2
      group.add(rightCuff)

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

  donny_bicorn: {
    id: 'donny_bicorn',
    name: "Captain's Bicorn",
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.ACCESSORY_HEAD,
    price: 40,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const navyMat = new THREE.MeshToonMaterial({ color: 0x1a1a2e, gradientMap })
      const goldMat = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap })
      const whiteMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap })

      // Main hat body (curved rectangular shape)
      const bodyGeom = new THREE.BoxGeometry(0.35, 0.08, 0.2)
      const body = new THREE.Mesh(bodyGeom, navyMat)
      body.position.y = 0.04
      group.add(body)

      // Bicorn points (turned up sides)
      const pointGeom = new THREE.BoxGeometry(0.08, 0.15, 0.18)
      const leftPoint = new THREE.Mesh(pointGeom, navyMat)
      leftPoint.position.set(-0.15, 0.1, 0)
      leftPoint.rotation.z = 0.3
      group.add(leftPoint)

      const rightPoint = new THREE.Mesh(pointGeom, navyMat)
      rightPoint.position.set(0.15, 0.1, 0)
      rightPoint.rotation.z = -0.3
      group.add(rightPoint)

      // Gold trim along edges
      const trimGeom = new THREE.BoxGeometry(0.36, 0.015, 0.01)
      const frontTrim = new THREE.Mesh(trimGeom, goldMat)
      frontTrim.position.set(0, 0.08, 0.1)
      group.add(frontTrim)

      const backTrim = new THREE.Mesh(trimGeom, goldMat)
      backTrim.position.set(0, 0.08, -0.1)
      group.add(backTrim)

      // Cockade (rosette) decoration
      const cockadeGeom = new THREE.CircleGeometry(0.04, 8)
      const cockade = new THREE.Mesh(cockadeGeom, whiteMat)
      cockade.position.set(0, 0.1, 0.11)
      group.add(cockade)

      // Gold button on cockade
      const buttonGeom = new THREE.SphereGeometry(0.015, 6, 4)
      const button = new THREE.Mesh(buttonGeom, goldMat)
      button.position.set(0, 0.1, 0.12)
      group.add(button)

      // Feather plume
      const featherGeom = new THREE.ConeGeometry(0.02, 0.15, 4)
      const feather = new THREE.Mesh(featherGeom, whiteMat)
      feather.position.set(0.02, 0.18, 0.08)
      feather.rotation.z = -0.3
      feather.rotation.x = 0.2
      group.add(feather)

      return group
    }
  },

  donny_opera_glasses: {
    id: 'donny_opera_glasses',
    name: 'Opera Glasses',
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.ACCESSORY_FACE,
    price: 45,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const goldMat = new THREE.MeshToonMaterial({ color: 0xd4af37, gradientMap })
      const pearlMat = new THREE.MeshToonMaterial({ color: 0xfdf5e6, gradientMap })
      const lensMat = new THREE.MeshBasicMaterial({ color: 0x87ceeb, transparent: true, opacity: 0.4 })

      // Twin barrels (binocular style)
      const barrelGeom = new THREE.CylinderGeometry(0.05, 0.06, 0.12, 8)

      const leftBarrel = new THREE.Mesh(barrelGeom, pearlMat)
      leftBarrel.position.set(-0.07, 0, 0)
      leftBarrel.rotation.x = Math.PI / 2
      group.add(leftBarrel)

      const rightBarrel = new THREE.Mesh(barrelGeom, pearlMat)
      rightBarrel.position.set(0.07, 0, 0)
      rightBarrel.rotation.x = Math.PI / 2
      group.add(rightBarrel)

      // Lenses (front)
      const lensGeom = new THREE.CircleGeometry(0.05, 10)
      const leftLens = new THREE.Mesh(lensGeom, lensMat)
      leftLens.position.set(-0.07, 0, 0.07)
      group.add(leftLens)

      const rightLens = new THREE.Mesh(lensGeom, lensMat)
      rightLens.position.set(0.07, 0, 0.07)
      group.add(rightLens)

      // Gold rims
      const rimGeom = new THREE.TorusGeometry(0.05, 0.008, 4, 12)
      const leftRim = new THREE.Mesh(rimGeom, goldMat)
      leftRim.position.set(-0.07, 0, 0.06)
      group.add(leftRim)

      const rightRim = new THREE.Mesh(rimGeom, goldMat)
      rightRim.position.set(0.07, 0, 0.06)
      group.add(rightRim)

      // Bridge connecting barrels
      const bridgeGeom = new THREE.BoxGeometry(0.04, 0.02, 0.03)
      const bridge = new THREE.Mesh(bridgeGeom, goldMat)
      bridge.position.set(0, 0, 0.02)
      group.add(bridge)

      // Ornate handle
      const handleGeom = new THREE.CylinderGeometry(0.012, 0.015, 0.15, 6)
      const handle = new THREE.Mesh(handleGeom, goldMat)
      handle.position.set(0.12, -0.06, 0)
      handle.rotation.z = Math.PI / 4
      group.add(handle)

      // Handle end knob
      const knobGeom = new THREE.SphereGeometry(0.02, 6, 4)
      const knob = new THREE.Mesh(knobGeom, goldMat)
      knob.position.set(0.18, -0.12, 0)
      group.add(knob)

      // Decorative filigree on barrels
      const filigreeGeom = new THREE.TorusGeometry(0.055, 0.005, 3, 12)
      const leftFiligree = new THREE.Mesh(filigreeGeom, goldMat)
      leftFiligree.position.set(-0.07, 0, 0)
      group.add(leftFiligree)

      const rightFiligree = new THREE.Mesh(filigreeGeom, goldMat)
      rightFiligree.position.set(0.07, 0, 0)
      group.add(rightFiligree)

      return group
    }
  },

  // === DONNY CLOTHING - Narwhal garments ===

  donny_sailor_vest: {
    id: 'donny_sailor_vest',
    name: 'Sailor Vest',
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 45,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const whiteMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap })
      const blueMat = new THREE.MeshToonMaterial({ color: 0x1e3a5f, gradientMap })

      // Vest body - fits narwhal's torpedo shape
      const vestGeom = new THREE.CylinderGeometry(0.38, 0.42, 0.6, 10)
      const vest = new THREE.Mesh(vestGeom, whiteMat)
      vest.position.set(0, 0.15, 0)
      vest.rotation.x = Math.PI / 2
      group.add(vest)

      // Blue stripes on vest
      for (let i = 0; i < 3; i++) {
        const stripeGeom = new THREE.TorusGeometry(0.39 + i * 0.01, 0.02, 4, 16)
        const stripe = new THREE.Mesh(stripeGeom, blueMat)
        stripe.position.set(0, -0.1 + i * 0.15, 0)
        stripe.rotation.x = Math.PI / 2
        group.add(stripe)
      }

      // Collar
      const collarGeom = new THREE.TorusGeometry(0.36, 0.04, 4, 12, Math.PI)
      const collar = new THREE.Mesh(collarGeom, blueMat)
      collar.position.set(0, 0.42, 0.1)
      collar.rotation.x = Math.PI / 2 + 0.3
      group.add(collar)

      return group
    }
  },

  donny_admiral_coat: {
    id: 'donny_admiral_coat',
    name: 'Admiral Coat',
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 100,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const navyMat = new THREE.MeshToonMaterial({ color: 0x1a1a3a, gradientMap })
      const goldMat = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap })
      const whiteMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap })

      // Main coat body
      const coatGeom = new THREE.CylinderGeometry(0.4, 0.45, 0.7, 10)
      const coat = new THREE.Mesh(coatGeom, navyMat)
      coat.position.set(0, 0.12, 0)
      coat.rotation.x = Math.PI / 2
      group.add(coat)

      // High collar
      const collarGeom = new THREE.CylinderGeometry(0.38, 0.35, 0.12, 10, 1, true)
      const collar = new THREE.Mesh(collarGeom, navyMat)
      collar.position.set(0, 0.48, 0)
      collar.rotation.x = Math.PI / 2
      group.add(collar)

      // Gold collar trim
      const collarTrimGeom = new THREE.TorusGeometry(0.36, 0.015, 4, 12)
      const collarTrim = new THREE.Mesh(collarTrimGeom, goldMat)
      collarTrim.position.set(0, 0.54, 0)
      collarTrim.rotation.x = Math.PI / 2
      group.add(collarTrim)

      // Epaulettes
      const epGeom = new THREE.BoxGeometry(0.15, 0.03, 0.1)
      const leftEp = new THREE.Mesh(epGeom, goldMat)
      leftEp.position.set(0.35, 0.35, 0.2)
      leftEp.rotation.z = 0.3
      group.add(leftEp)

      const rightEp = new THREE.Mesh(epGeom, goldMat)
      rightEp.position.set(0.35, 0.35, -0.2)
      rightEp.rotation.z = 0.3
      group.add(rightEp)

      // Gold buttons (row down front)
      const buttonGeom = new THREE.SphereGeometry(0.025, 6, 4)
      for (let i = 0; i < 4; i++) {
        const button = new THREE.Mesh(buttonGeom, goldMat)
        button.position.set(0.1 - i * 0.12, 0.42, 0)
        group.add(button)
      }

      // Medals/decorations
      const medalGeom = new THREE.CircleGeometry(0.04, 6)
      const medal1 = new THREE.Mesh(medalGeom, goldMat)
      medal1.position.set(0.25, 0.38, 0.15)
      medal1.rotation.y = -0.5
      group.add(medal1)

      const medal2 = new THREE.Mesh(medalGeom, goldMat)
      medal2.position.set(0.2, 0.38, 0.12)
      medal2.rotation.y = -0.5
      group.add(medal2)

      return group
    }
  },

  donny_pirate_vest: {
    id: 'donny_pirate_vest',
    name: 'Pirate Vest',
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 130,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const redMat = new THREE.MeshToonMaterial({ color: 0x8b0000, gradientMap })
      const blackMat = new THREE.MeshToonMaterial({ color: 0x1a1a1a, gradientMap })
      const goldMat = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap })
      const beltMat = new THREE.MeshToonMaterial({ color: 0x4a3020, gradientMap })
      const whiteMat = new THREE.MeshToonMaterial({ color: 0xf5f5dc, gradientMap })

      // Inner shirt
      const shirtGeom = new THREE.CylinderGeometry(0.36, 0.4, 0.55, 10)
      const shirt = new THREE.Mesh(shirtGeom, whiteMat)
      shirt.position.set(0, 0.15, 0)
      shirt.rotation.x = Math.PI / 2
      group.add(shirt)

      // Vest panels (open front)
      const panelGeom = new THREE.BoxGeometry(0.4, 0.08, 0.25)
      const leftPanel = new THREE.Mesh(panelGeom, redMat)
      leftPanel.position.set(0.1, 0.3, 0.2)
      leftPanel.rotation.z = 0.2
      group.add(leftPanel)

      const rightPanel = new THREE.Mesh(panelGeom, redMat)
      rightPanel.position.set(0.1, 0.3, -0.2)
      rightPanel.rotation.z = 0.2
      group.add(rightPanel)

      // Vest back
      const backGeom = new THREE.BoxGeometry(0.5, 0.08, 0.35)
      const back = new THREE.Mesh(backGeom, redMat)
      back.position.set(-0.15, 0.2, 0)
      group.add(back)

      // Gold trim on vest
      const trimGeom = new THREE.BoxGeometry(0.35, 0.02, 0.02)
      const leftTrim = new THREE.Mesh(trimGeom, goldMat)
      leftTrim.position.set(0.12, 0.32, 0.32)
      leftTrim.rotation.z = 0.2
      group.add(leftTrim)

      const rightTrim = new THREE.Mesh(trimGeom, goldMat)
      rightTrim.position.set(0.12, 0.32, -0.32)
      rightTrim.rotation.z = 0.2
      group.add(rightTrim)

      // Wide belt with skull buckle
      const beltGeom = new THREE.TorusGeometry(0.4, 0.05, 4, 16)
      const belt = new THREE.Mesh(beltGeom, beltMat)
      belt.position.set(0, -0.1, 0)
      belt.rotation.x = Math.PI / 2
      group.add(belt)

      // Buckle
      const buckleGeom = new THREE.BoxGeometry(0.1, 0.08, 0.04)
      const buckle = new THREE.Mesh(buckleGeom, goldMat)
      buckle.position.set(0.38, -0.1, 0)
      group.add(buckle)

      // Skull on buckle
      const skullGeom = new THREE.SphereGeometry(0.03, 6, 4)
      const skull = new THREE.Mesh(skullGeom, whiteMat)
      skull.position.set(0.40, -0.1, 0)
      group.add(skull)

      // Bandolier strap
      const strapGeom = new THREE.BoxGeometry(0.6, 0.04, 0.03)
      const strap = new THREE.Mesh(strapGeom, beltMat)
      strap.position.set(0, 0.2, 0)
      strap.rotation.z = 0.5
      strap.rotation.y = Math.PI / 2
      group.add(strap)

      return group
    }
  },

  // Donny outfits - full costumes
  donny_tuxedo: {
    id: 'donny_tuxedo',
    name: 'Tuxedo',
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 90,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const blackMat = new THREE.MeshToonMaterial({ color: 0x1a1a1a, gradientMap })
      const whiteMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap })
      const bowMat = new THREE.MeshToonMaterial({ color: 0x1a1a1a, gradientMap })

      // White shirt front
      const shirtGeom = new THREE.CylinderGeometry(0.32, 0.36, 0.5, 10, 1, false, -Math.PI * 0.3, Math.PI * 0.6)
      const shirt = new THREE.Mesh(shirtGeom, whiteMat)
      shirt.position.set(0, 0.2, 0.15)
      shirt.rotation.x = Math.PI / 2
      group.add(shirt)

      // Tuxedo jacket body
      const jacketGeom = new THREE.CylinderGeometry(0.38, 0.44, 0.65, 10)
      const jacket = new THREE.Mesh(jacketGeom, blackMat)
      jacket.position.set(0, 0.15, 0)
      jacket.rotation.x = Math.PI / 2
      group.add(jacket)

      // Jacket lapels (satin)
      const lapelGeom = new THREE.BoxGeometry(0.35, 0.04, 0.12)
      const leftLapel = new THREE.Mesh(lapelGeom, blackMat)
      leftLapel.position.set(0.08, 0.4, 0.2)
      leftLapel.rotation.z = 0.3
      leftLapel.rotation.y = 0.2
      group.add(leftLapel)

      const rightLapel = new THREE.Mesh(lapelGeom, blackMat)
      rightLapel.position.set(0.08, 0.4, -0.2)
      rightLapel.rotation.z = 0.3
      rightLapel.rotation.y = -0.2
      group.add(rightLapel)

      // Bow tie
      const bowWingGeom = new THREE.BoxGeometry(0.08, 0.04, 0.03)
      const bowL = new THREE.Mesh(bowWingGeom, bowMat)
      bowL.position.set(0.05, 0.52, 0.06)
      bowL.rotation.z = 0.2
      group.add(bowL)

      const bowR = new THREE.Mesh(bowWingGeom, bowMat)
      bowR.position.set(0.05, 0.52, -0.06)
      bowR.rotation.z = -0.2
      group.add(bowR)

      const bowKnotGeom = new THREE.SphereGeometry(0.025, 6, 4)
      const bowKnot = new THREE.Mesh(bowKnotGeom, bowMat)
      bowKnot.position.set(0.05, 0.52, 0)
      group.add(bowKnot)

      // Jacket tails (back)
      const tailGeom = new THREE.BoxGeometry(0.3, 0.06, 0.15)
      const leftTail = new THREE.Mesh(tailGeom, blackMat)
      leftTail.position.set(-0.25, -0.05, 0.12)
      leftTail.rotation.x = -0.3
      group.add(leftTail)

      const rightTail = new THREE.Mesh(tailGeom, blackMat)
      rightTail.position.set(-0.25, -0.05, -0.12)
      rightTail.rotation.x = 0.3
      group.add(rightTail)

      // Shirt buttons
      const buttonGeom = new THREE.SphereGeometry(0.015, 6, 4)
      for (let i = 0; i < 3; i++) {
        const btn = new THREE.Mesh(buttonGeom, blackMat)
        btn.position.set(0.08, 0.35 - i * 0.1, 0.28)
        group.add(btn)
      }

      return group
    }
  },

  donny_captain: {
    id: 'donny_captain',
    name: 'Sea Captain',
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    conflictsWith: [OUTFIT_TYPES.ACCESSORY_HEAD],
    price: 110,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const navyMat = new THREE.MeshToonMaterial({ color: 0x1a1a3a, gradientMap })
      const goldMat = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap })
      const whiteMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap })
      const blackMat = new THREE.MeshToonMaterial({ color: 0x1a1a1a, gradientMap })

      // Captain's coat
      const coatGeom = new THREE.CylinderGeometry(0.4, 0.46, 0.7, 10)
      const coat = new THREE.Mesh(coatGeom, navyMat)
      coat.position.set(0, 0.12, 0)
      coat.rotation.x = Math.PI / 2
      group.add(coat)

      // High collar
      const collarGeom = new THREE.CylinderGeometry(0.36, 0.34, 0.1, 10, 1, true)
      const collar = new THREE.Mesh(collarGeom, navyMat)
      collar.position.set(0, 0.5, 0)
      collar.rotation.x = Math.PI / 2
      group.add(collar)

      // Gold collar trim
      const trimGeom = new THREE.TorusGeometry(0.35, 0.015, 4, 12)
      const trim = new THREE.Mesh(trimGeom, goldMat)
      trim.position.set(0, 0.55, 0)
      trim.rotation.x = Math.PI / 2
      group.add(trim)

      // Epaulettes
      const epGeom = new THREE.BoxGeometry(0.12, 0.03, 0.1)
      const epL = new THREE.Mesh(epGeom, goldMat)
      epL.position.set(0, 0.45, 0.38)
      group.add(epL)

      const epR = new THREE.Mesh(epGeom, goldMat)
      epR.position.set(0, 0.45, -0.38)
      group.add(epR)

      // Gold fringe on epaulettes
      for (let i = 0; i < 3; i++) {
        const fringeGeom = new THREE.CylinderGeometry(0.008, 0.005, 0.06, 4)
        const fringeL = new THREE.Mesh(fringeGeom, goldMat)
        fringeL.position.set(-0.02, 0.42, 0.35 + i * 0.03)
        group.add(fringeL)

        const fringeR = new THREE.Mesh(fringeGeom, goldMat)
        fringeR.position.set(-0.02, 0.42, -0.35 - i * 0.03)
        group.add(fringeR)
      }

      // Gold buttons
      const buttonGeom = new THREE.SphereGeometry(0.02, 6, 4)
      for (let i = 0; i < 4; i++) {
        const btn = new THREE.Mesh(buttonGeom, goldMat)
        btn.position.set(0.08, 0.35 - i * 0.1, 0.15)
        group.add(btn)
      }

      // Captain's peaked cap
      const capBrimGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.03, 12)
      const capBrim = new THREE.Mesh(capBrimGeom, blackMat)
      capBrim.position.set(0.2, 0.7, 0)
      capBrim.rotation.z = -0.2
      group.add(capBrim)

      // Cap crown
      const capCrownGeom = new THREE.CylinderGeometry(0.18, 0.2, 0.12, 12)
      const capCrown = new THREE.Mesh(capCrownGeom, navyMat)
      capCrown.position.set(0.18, 0.78, 0)
      capCrown.rotation.z = -0.2
      group.add(capCrown)

      // Cap badge
      const badgeGeom = new THREE.CircleGeometry(0.06, 8)
      const badge = new THREE.Mesh(badgeGeom, goldMat)
      badge.position.set(0.32, 0.78, 0)
      badge.rotation.y = Math.PI / 2
      badge.rotation.z = -0.2
      group.add(badge)

      // Anchor on badge
      const anchorGeom = new THREE.TorusGeometry(0.025, 0.006, 4, 8, Math.PI)
      const anchor = new THREE.Mesh(anchorGeom, whiteMat)
      anchor.position.set(0.34, 0.78, 0)
      anchor.rotation.y = Math.PI / 2
      anchor.rotation.x = Math.PI
      group.add(anchor)

      return group
    }
  },

  donny_magician: {
    id: 'donny_magician',
    name: 'Magician',
    character: CHARACTERS.DONNY,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    conflictsWith: [OUTFIT_TYPES.ACCESSORY_HEAD],
    price: 95,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const capeMat = new THREE.MeshToonMaterial({ color: 0x2d0a4e, gradientMap, side: THREE.DoubleSide })
      const capeInnerMat = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap, side: THREE.DoubleSide })
      const hatMat = new THREE.MeshToonMaterial({ color: 0x1a1a1a, gradientMap })
      const starMat = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap })
      const vestMat = new THREE.MeshToonMaterial({ color: 0x4a0080, gradientMap })

      // Vest underneath
      const vestGeom = new THREE.CylinderGeometry(0.36, 0.4, 0.5, 10)
      const vest = new THREE.Mesh(vestGeom, vestMat)
      vest.position.set(0, 0.18, 0)
      vest.rotation.x = Math.PI / 2
      group.add(vest)

      // Cape (draped around shoulders)
      const capeShape = new THREE.Shape()
      capeShape.moveTo(-0.4, 0)
      capeShape.lineTo(-0.45, -0.55)
      capeShape.quadraticCurveTo(0, -0.65, 0.45, -0.55)
      capeShape.lineTo(0.4, 0)
      capeShape.quadraticCurveTo(0, 0.05, -0.4, 0)

      const capeGeom = new THREE.ShapeGeometry(capeShape)
      const cape = new THREE.Mesh(capeGeom, capeMat)
      cape.position.set(-0.15, 0.35, 0)
      cape.rotation.y = Math.PI / 2
      group.add(cape)

      // Cape inner (gold lining)
      const capeInner = new THREE.Mesh(capeGeom, capeInnerMat)
      capeInner.position.set(-0.17, 0.35, 0)
      capeInner.rotation.y = Math.PI / 2
      group.add(capeInner)

      // Stars on cape
      const starPositions = [
        { x: -0.2, y: 0.25, z: 0.2 },
        { x: -0.25, y: 0.1, z: -0.15 },
        { x: -0.22, y: 0.0, z: 0.25 }
      ]
      for (const pos of starPositions) {
        const starGeom = new THREE.CircleGeometry(0.03, 5)
        const star = new THREE.Mesh(starGeom, starMat)
        star.position.set(pos.x, pos.y, pos.z)
        star.rotation.y = Math.PI / 2
        star.rotation.z = Math.PI / 10
        group.add(star)
      }

      // Cape clasp (gem)
      const claspGeom = new THREE.OctahedronGeometry(0.04)
      const claspMat = new THREE.MeshToonMaterial({ color: 0xff0066, gradientMap })
      const clasp = new THREE.Mesh(claspGeom, claspMat)
      clasp.position.set(0.08, 0.5, 0)
      group.add(clasp)

      // Top hat
      const hatBrimGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.03, 12)
      const hatBrim = new THREE.Mesh(hatBrimGeom, hatMat)
      hatBrim.position.set(0.15, 0.68, 0)
      hatBrim.rotation.z = -0.15
      group.add(hatBrim)

      // Hat crown (tall)
      const hatCrownGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.25, 12)
      const hatCrown = new THREE.Mesh(hatCrownGeom, hatMat)
      hatCrown.position.set(0.13, 0.82, 0)
      hatCrown.rotation.z = -0.15
      group.add(hatCrown)

      // Hat band
      const bandGeom = new THREE.TorusGeometry(0.14, 0.015, 4, 12)
      const band = new THREE.Mesh(bandGeom, starMat)
      band.position.set(0.14, 0.72, 0)
      band.rotation.x = Math.PI / 2
      band.rotation.y = 0.15
      group.add(band)

      // Star on hat
      const hatStarGeom = new THREE.CircleGeometry(0.035, 5)
      const hatStar = new THREE.Mesh(hatStarGeom, starMat)
      hatStar.position.set(0.27, 0.82, 0)
      hatStar.rotation.y = Math.PI / 2
      hatStar.rotation.z = Math.PI / 10
      group.add(hatStar)

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
  },

  ollie_jeweler_loupe: {
    id: 'ollie_jeweler_loupe',
    name: "Jeweler's Loupe",
    character: CHARACTERS.OLLIE,
    type: OUTFIT_TYPES.ACCESSORY_FACE,
    price: 35,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const brassMat = new THREE.MeshToonMaterial({ color: 0xb8860b, gradientMap })
      const blackMat = new THREE.MeshToonMaterial({ color: 0x1a1a1a, gradientMap })
      const lensMat = new THREE.MeshBasicMaterial({ color: 0xaaffaa, transparent: true, opacity: 0.5 })

      // Main loupe barrel
      const barrelGeom = new THREE.CylinderGeometry(0.06, 0.08, 0.1, 10)
      const barrel = new THREE.Mesh(barrelGeom, blackMat)
      barrel.rotation.x = Math.PI / 2
      barrel.position.z = 0.03
      group.add(barrel)

      // Lens (front)
      const lensGeom = new THREE.CircleGeometry(0.06, 12)
      const lens = new THREE.Mesh(lensGeom, lensMat)
      lens.position.z = 0.09
      group.add(lens)

      // Brass rim
      const rimGeom = new THREE.TorusGeometry(0.06, 0.01, 4, 16)
      const rim = new THREE.Mesh(rimGeom, brassMat)
      rim.position.z = 0.08
      group.add(rim)

      // Eyepiece (back)
      const eyepieceGeom = new THREE.CylinderGeometry(0.05, 0.06, 0.03, 10)
      const eyepiece = new THREE.Mesh(eyepieceGeom, brassMat)
      eyepiece.rotation.x = Math.PI / 2
      eyepiece.position.z = -0.03
      group.add(eyepiece)

      // Headband attachment (wraps around head)
      const bandGeom = new THREE.TorusGeometry(0.15, 0.015, 4, 16, Math.PI)
      const band = new THREE.Mesh(bandGeom, blackMat)
      band.position.set(0, 0.05, -0.05)
      band.rotation.x = Math.PI / 2
      band.rotation.z = Math.PI / 2
      group.add(band)

      // Adjustment knob
      const knobGeom = new THREE.CylinderGeometry(0.015, 0.02, 0.03, 6)
      const knob = new THREE.Mesh(knobGeom, brassMat)
      knob.position.set(0.07, 0, 0.02)
      knob.rotation.z = Math.PI / 2
      group.add(knob)

      // Knob ridges
      for (let i = 0; i < 6; i++) {
        const ridgeGeom = new THREE.BoxGeometry(0.002, 0.025, 0.005)
        const ridge = new THREE.Mesh(ridgeGeom, brassMat)
        const angle = (i / 6) * Math.PI * 2
        ridge.position.set(0.085, Math.sin(angle) * 0.015, 0.02 + Math.cos(angle) * 0.015)
        group.add(ridge)
      }

      return group
    }
  },

  ollie_wizard_hat: {
    id: 'ollie_wizard_hat',
    name: 'Wizard Hat',
    character: CHARACTERS.OLLIE,
    type: OUTFIT_TYPES.ACCESSORY_HEAD,
    price: 45,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const purpleMat = new THREE.MeshToonMaterial({ color: 0x4b0082, gradientMap })
      const goldMat = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap })
      const silverMat = new THREE.MeshToonMaterial({ color: 0xc0c0c0, gradientMap })

      // Main cone
      const coneGeom = new THREE.ConeGeometry(0.2, 0.45, 8)
      const cone = new THREE.Mesh(coneGeom, purpleMat)
      cone.position.y = 0.22
      group.add(cone)

      // Bent tip (wizards hats droop!)
      const tipGeom = new THREE.ConeGeometry(0.05, 0.12, 6)
      const tip = new THREE.Mesh(tipGeom, purpleMat)
      tip.position.set(0.08, 0.42, 0.05)
      tip.rotation.z = -0.8
      tip.rotation.x = 0.3
      group.add(tip)

      // Wide brim
      const brimGeom = new THREE.CylinderGeometry(0.28, 0.3, 0.03, 12)
      const brim = new THREE.Mesh(brimGeom, purpleMat)
      brim.position.y = 0
      group.add(brim)

      // Gold band at base
      const bandGeom = new THREE.TorusGeometry(0.2, 0.02, 4, 16)
      const band = new THREE.Mesh(bandGeom, goldMat)
      band.position.y = 0.02
      band.rotation.x = Math.PI / 2
      group.add(band)

      // Stars on hat (scattered)
      const starPositions = [
        { x: 0.12, y: 0.25, z: 0.1, scale: 0.8 },
        { x: -0.08, y: 0.35, z: 0.12, scale: 0.6 },
        { x: 0.05, y: 0.15, z: 0.15, scale: 0.5 },
        { x: -0.1, y: 0.2, z: -0.1, scale: 0.7 },
        { x: 0.08, y: 0.38, z: -0.05, scale: 0.5 }
      ]

      for (const star of starPositions) {
        // Simple 4-point star shape
        const starGroup = new THREE.Group()

        const point1Geom = new THREE.ConeGeometry(0.015, 0.04, 4)
        const point1 = new THREE.Mesh(point1Geom, silverMat)
        starGroup.add(point1)

        const point2 = new THREE.Mesh(point1Geom, silverMat)
        point2.rotation.z = Math.PI
        starGroup.add(point2)

        const point3 = new THREE.Mesh(point1Geom, silverMat)
        point3.rotation.z = Math.PI / 2
        starGroup.add(point3)

        const point4 = new THREE.Mesh(point1Geom, silverMat)
        point4.rotation.z = -Math.PI / 2
        starGroup.add(point4)

        starGroup.position.set(star.x, star.y, star.z)
        starGroup.scale.setScalar(star.scale)
        group.add(starGroup)
      }

      // Moon crescent
      const moonGeom = new THREE.TorusGeometry(0.03, 0.01, 4, 12, Math.PI * 1.5)
      const moon = new THREE.Mesh(moonGeom, goldMat)
      moon.position.set(-0.12, 0.3, 0.08)
      moon.rotation.z = 0.5
      group.add(moon)

      return group
    }
  },

  // === OLLIE CLOTHING - Octopus garments ===

  ollie_bowtie: {
    id: 'ollie_bowtie',
    name: 'Fancy Bow Tie',
    character: CHARACTERS.OLLIE,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 40,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const silkMat = new THREE.MeshToonMaterial({ color: 0x8b0000, gradientMap })
      const knotMat = new THREE.MeshToonMaterial({ color: 0x660000, gradientMap })

      // Bow tie wings
      const wingGeom = new THREE.BoxGeometry(0.12, 0.06, 0.04)
      const leftWing = new THREE.Mesh(wingGeom, silkMat)
      leftWing.position.set(0, 0.65, 0.08)
      leftWing.rotation.z = 0.2
      group.add(leftWing)

      const rightWing = new THREE.Mesh(wingGeom, silkMat)
      rightWing.position.set(0, 0.65, -0.08)
      rightWing.rotation.z = -0.2
      group.add(rightWing)

      // Center knot
      const knotGeom = new THREE.SphereGeometry(0.03, 6, 4)
      const knot = new THREE.Mesh(knotGeom, knotMat)
      knot.position.set(0, 0.65, 0)
      knot.scale.set(1, 1, 1.5)
      group.add(knot)

      // Small dangling ribbon ends
      const ribbonGeom = new THREE.BoxGeometry(0.02, 0.08, 0.03)
      const ribbon1 = new THREE.Mesh(ribbonGeom, silkMat)
      ribbon1.position.set(0, 0.60, 0.02)
      ribbon1.rotation.z = 0.1
      group.add(ribbon1)

      const ribbon2 = new THREE.Mesh(ribbonGeom, silkMat)
      ribbon2.position.set(0, 0.60, -0.02)
      ribbon2.rotation.z = -0.1
      group.add(ribbon2)

      return group
    }
  },

  ollie_dapper_vest: {
    id: 'ollie_dapper_vest',
    name: 'Dapper Vest',
    character: CHARACTERS.OLLIE,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 75,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const vestMat = new THREE.MeshToonMaterial({ color: 0x4a4a4a, gradientMap })
      const goldMat = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap })
      const silkMat = new THREE.MeshToonMaterial({ color: 0x8b0000, gradientMap })

      // Vest body - wraps around octopus mantle
      const vestGeom = new THREE.SphereGeometry(0.42, 10, 8)
      vestGeom.scale(1, 0.8, 1)
      const vest = new THREE.Mesh(vestGeom, vestMat)
      vest.position.set(0, 0.35, 0)
      group.add(vest)

      // Vest front opening (shows body)
      const openingGeom = new THREE.PlaneGeometry(0.15, 0.4)
      const openingMat = new THREE.MeshBasicMaterial({ color: 0xe07850, transparent: true, opacity: 0.3 })
      const opening = new THREE.Mesh(openingGeom, openingMat)
      opening.position.set(0.42, 0.35, 0)
      opening.rotation.y = Math.PI / 2
      group.add(opening)

      // Lapels
      const lapelGeom = new THREE.BoxGeometry(0.08, 0.2, 0.05)
      const leftLapel = new THREE.Mesh(lapelGeom, silkMat)
      leftLapel.position.set(0.4, 0.45, 0.1)
      leftLapel.rotation.z = -0.2
      leftLapel.rotation.y = 0.3
      group.add(leftLapel)

      const rightLapel = new THREE.Mesh(lapelGeom, silkMat)
      rightLapel.position.set(0.4, 0.45, -0.1)
      rightLapel.rotation.z = -0.2
      rightLapel.rotation.y = -0.3
      group.add(rightLapel)

      // Gold buttons
      const buttonGeom = new THREE.SphereGeometry(0.02, 6, 4)
      for (let i = 0; i < 3; i++) {
        const button = new THREE.Mesh(buttonGeom, goldMat)
        button.position.set(0.42, 0.5 - i * 0.1, 0)
        group.add(button)
      }

      // Watch chain
      const chainGeom = new THREE.TorusGeometry(0.08, 0.008, 4, 8, Math.PI)
      const chain = new THREE.Mesh(chainGeom, goldMat)
      chain.position.set(0.35, 0.32, 0)
      chain.rotation.y = Math.PI / 2
      chain.rotation.x = Math.PI / 2
      group.add(chain)

      // Watch fob
      const fobGeom = new THREE.SphereGeometry(0.02, 6, 4)
      const fob = new THREE.Mesh(fobGeom, goldMat)
      fob.position.set(0.35, 0.24, 0)
      group.add(fob)

      return group
    }
  },

  ollie_gentleman_suit: {
    id: 'ollie_gentleman_suit',
    name: "Gentleman's Suit",
    character: CHARACTERS.OLLIE,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    price: 120,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const suitMat = new THREE.MeshToonMaterial({ color: 0x1a1a2e, gradientMap })
      const shirtMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap })
      const tieMat = new THREE.MeshToonMaterial({ color: 0x4a0000, gradientMap })
      const goldMat = new THREE.MeshToonMaterial({ color: 0xffd700, gradientMap })

      // White shirt underneath
      const shirtGeom = new THREE.SphereGeometry(0.38, 10, 8)
      shirtGeom.scale(1, 0.78, 1)
      const shirt = new THREE.Mesh(shirtGeom, shirtMat)
      shirt.position.set(0, 0.35, 0)
      group.add(shirt)

      // Suit jacket
      const jacketGeom = new THREE.SphereGeometry(0.44, 10, 8)
      jacketGeom.scale(1, 0.82, 1)
      const jacket = new THREE.Mesh(jacketGeom, suitMat)
      jacket.position.set(0, 0.35, 0)
      group.add(jacket)

      // Jacket front cutaway (shows shirt and tie)
      const cutawayGeom = new THREE.PlaneGeometry(0.2, 0.45)
      const cutawayMat = new THREE.MeshBasicMaterial({ visible: false })
      const cutaway = new THREE.Mesh(cutawayGeom, cutawayMat)
      cutaway.position.set(0.45, 0.35, 0)
      cutaway.rotation.y = Math.PI / 2
      group.add(cutaway)

      // Lapels
      const lapelGeom = new THREE.BoxGeometry(0.12, 0.25, 0.04)
      const leftLapel = new THREE.Mesh(lapelGeom, suitMat)
      leftLapel.position.set(0.42, 0.48, 0.12)
      leftLapel.rotation.z = -0.25
      leftLapel.rotation.y = 0.4
      group.add(leftLapel)

      const rightLapel = new THREE.Mesh(lapelGeom, suitMat)
      rightLapel.position.set(0.42, 0.48, -0.12)
      rightLapel.rotation.z = -0.25
      rightLapel.rotation.y = -0.4
      group.add(rightLapel)

      // Collar
      const collarGeom = new THREE.BoxGeometry(0.06, 0.08, 0.05)
      const leftCollar = new THREE.Mesh(collarGeom, shirtMat)
      leftCollar.position.set(0.38, 0.62, 0.06)
      leftCollar.rotation.z = -0.4
      group.add(leftCollar)

      const rightCollar = new THREE.Mesh(collarGeom, shirtMat)
      rightCollar.position.set(0.38, 0.62, -0.06)
      rightCollar.rotation.z = -0.4
      group.add(rightCollar)

      // Tie
      const tieKnotGeom = new THREE.BoxGeometry(0.04, 0.04, 0.03)
      const tieKnot = new THREE.Mesh(tieKnotGeom, tieMat)
      tieKnot.position.set(0.40, 0.58, 0)
      group.add(tieKnot)

      const tieBodyGeom = new THREE.BoxGeometry(0.06, 0.25, 0.02)
      const tieBody = new THREE.Mesh(tieBodyGeom, tieMat)
      tieBody.position.set(0.42, 0.42, 0)
      tieBody.rotation.z = -0.05
      group.add(tieBody)

      // Tie point
      const tiePointGeom = new THREE.ConeGeometry(0.035, 0.06, 4)
      const tiePoint = new THREE.Mesh(tiePointGeom, tieMat)
      tiePoint.position.set(0.43, 0.28, 0)
      tiePoint.rotation.z = Math.PI
      group.add(tiePoint)

      // Pocket square
      const squareGeom = new THREE.BoxGeometry(0.04, 0.05, 0.02)
      const squareMat = new THREE.MeshToonMaterial({ color: 0xffffff, gradientMap })
      const square = new THREE.Mesh(squareGeom, squareMat)
      square.position.set(0.4, 0.5, -0.2)
      group.add(square)

      // Buttons
      const buttonGeom = new THREE.SphereGeometry(0.015, 6, 4)
      const button1 = new THREE.Mesh(buttonGeom, goldMat)
      button1.position.set(0.44, 0.35, 0.15)
      group.add(button1)

      const button2 = new THREE.Mesh(buttonGeom, goldMat)
      button2.position.set(0.44, 0.35, -0.15)
      group.add(button2)

      return group
    }
  },

  // Ollie outfits - full costumes
  ollie_scientist: {
    id: 'ollie_scientist',
    name: 'Mad Scientist',
    character: CHARACTERS.OLLIE,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    conflictsWith: [OUTFIT_TYPES.ACCESSORY_FACE],
    price: 85,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const labCoatMat = new THREE.MeshToonMaterial({ color: 0xf5f5f5, gradientMap })
      const goggleMat = new THREE.MeshToonMaterial({ color: 0x8b4513, gradientMap })
      const lensMat = new THREE.MeshBasicMaterial({ color: 0x66ffff, transparent: true, opacity: 0.7 })
      const flaskMat = new THREE.MeshBasicMaterial({ color: 0x88ff88, transparent: true, opacity: 0.6 })
      const glassMat = new THREE.MeshBasicMaterial({ color: 0xccffcc, transparent: true, opacity: 0.4 })

      // Lab coat body
      const coatGeom = new THREE.SphereGeometry(0.46, 10, 8)
      coatGeom.scale(1, 0.85, 1)
      const coat = new THREE.Mesh(coatGeom, labCoatMat)
      coat.position.set(0, 0.35, 0)
      group.add(coat)

      // Coat collar
      const collarGeom = new THREE.TorusGeometry(0.28, 0.04, 4, 12, Math.PI)
      const collar = new THREE.Mesh(collarGeom, labCoatMat)
      collar.position.set(0, 0.62, 0.15)
      collar.rotation.x = Math.PI / 2 + 0.3
      group.add(collar)

      // Coat lapels
      const lapelGeom = new THREE.BoxGeometry(0.08, 0.2, 0.06)
      const lapelL = new THREE.Mesh(lapelGeom, labCoatMat)
      lapelL.position.set(0.38, 0.5, 0.12)
      lapelL.rotation.z = -0.2
      group.add(lapelL)

      const lapelR = new THREE.Mesh(lapelGeom, labCoatMat)
      lapelR.position.set(0.38, 0.5, -0.12)
      lapelR.rotation.z = -0.2
      group.add(lapelR)

      // Pocket with pens
      const pocketGeom = new THREE.BoxGeometry(0.02, 0.1, 0.08)
      const pocket = new THREE.Mesh(pocketGeom, labCoatMat)
      pocket.position.set(0.45, 0.45, 0.15)
      group.add(pocket)

      // Pens in pocket
      const penMat = new THREE.MeshToonMaterial({ color: 0x1a1a1a, gradientMap })
      const penGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 4)
      const pen1 = new THREE.Mesh(penGeom, penMat)
      pen1.position.set(0.46, 0.52, 0.13)
      group.add(pen1)

      const pen2Mat = new THREE.MeshToonMaterial({ color: 0x0000aa, gradientMap })
      const pen2 = new THREE.Mesh(penGeom, pen2Mat)
      pen2.position.set(0.46, 0.51, 0.17)
      pen2.rotation.z = 0.1
      group.add(pen2)

      // Wild goggles (multiple lenses!)
      const goggleStrapGeom = new THREE.TorusGeometry(0.22, 0.025, 6, 16)
      const goggleStrap = new THREE.Mesh(goggleStrapGeom, goggleMat)
      goggleStrap.position.set(0.15, 0.7, 0)
      goggleStrap.rotation.y = Math.PI / 2
      group.add(goggleStrap)

      // Main lens (large center)
      const mainLensGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12)
      const mainLensFrame = new THREE.Mesh(mainLensGeom, goggleMat)
      mainLensFrame.position.set(0.35, 0.7, 0)
      mainLensFrame.rotation.z = Math.PI / 2
      group.add(mainLensFrame)

      const mainLens = new THREE.Mesh(new THREE.CircleGeometry(0.07, 12), lensMat)
      mainLens.position.set(0.38, 0.7, 0)
      mainLens.rotation.y = Math.PI / 2
      group.add(mainLens)

      // Extra lens (smaller, offset)
      const extraLensGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10)
      const extraLensFrame = new THREE.Mesh(extraLensGeom, goggleMat)
      extraLensFrame.position.set(0.38, 0.78, 0.08)
      extraLensFrame.rotation.z = Math.PI / 2
      group.add(extraLensFrame)

      const extraLens = new THREE.Mesh(new THREE.CircleGeometry(0.035, 10), lensMat)
      extraLens.position.set(0.40, 0.78, 0.08)
      extraLens.rotation.y = Math.PI / 2
      group.add(extraLens)

      // Bubbling flask (held by tentacle)
      const flaskGeom = new THREE.CylinderGeometry(0.02, 0.06, 0.15, 8)
      const flask = new THREE.Mesh(flaskGeom, glassMat)
      flask.position.set(0.25, 0.1, 0.35)
      group.add(flask)

      // Flask neck
      const neckGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.05, 6)
      const neck = new THREE.Mesh(neckGeom, glassMat)
      neck.position.set(0.25, 0.2, 0.35)
      group.add(neck)

      // Bubbling liquid
      const liquidGeom = new THREE.SphereGeometry(0.045, 8, 6)
      const liquid = new THREE.Mesh(liquidGeom, flaskMat)
      liquid.position.set(0.25, 0.08, 0.35)
      group.add(liquid)

      // Bubbles
      const bubbleGeom = new THREE.SphereGeometry(0.012, 6, 4)
      const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xaaffaa, transparent: true, opacity: 0.5 })
      for (let i = 0; i < 3; i++) {
        const bubble = new THREE.Mesh(bubbleGeom, bubbleMat)
        bubble.position.set(0.25 + (Math.random() - 0.5) * 0.03, 0.12 + i * 0.03, 0.35)
        group.add(bubble)
      }

      return group
    }
  },

  ollie_explorer: {
    id: 'ollie_explorer',
    name: 'Explorer',
    character: CHARACTERS.OLLIE,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    conflictsWith: [OUTFIT_TYPES.ACCESSORY_HEAD],
    price: 75,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const vestMat = new THREE.MeshToonMaterial({ color: 0xc4a574, gradientMap })
      const pocketMat = new THREE.MeshToonMaterial({ color: 0xa08050, gradientMap })
      const helmetMat = new THREE.MeshToonMaterial({ color: 0xf5f5dc, gradientMap })
      const bandMat = new THREE.MeshToonMaterial({ color: 0x4a3728, gradientMap })
      const buttonMat = new THREE.MeshToonMaterial({ color: 0x8b4513, gradientMap })

      // Safari vest body
      const vestGeom = new THREE.SphereGeometry(0.44, 10, 8)
      vestGeom.scale(1, 0.82, 1)
      const vest = new THREE.Mesh(vestGeom, vestMat)
      vest.position.set(0, 0.35, 0)
      group.add(vest)

      // Multiple pockets (it's a safari vest!)
      const pocketGeom = new THREE.BoxGeometry(0.03, 0.1, 0.1)

      // Front pockets
      const pocket1 = new THREE.Mesh(pocketGeom, pocketMat)
      pocket1.position.set(0.44, 0.3, 0.15)
      group.add(pocket1)

      const pocket2 = new THREE.Mesh(pocketGeom, pocketMat)
      pocket2.position.set(0.44, 0.3, -0.15)
      group.add(pocket2)

      const pocket3 = new THREE.Mesh(pocketGeom, pocketMat)
      pocket3.position.set(0.44, 0.45, 0.1)
      pocket3.scale.set(1, 0.7, 0.8)
      group.add(pocket3)

      // Pocket flaps
      const flapGeom = new THREE.BoxGeometry(0.02, 0.02, 0.1)
      const flap1 = new THREE.Mesh(flapGeom, pocketMat)
      flap1.position.set(0.45, 0.36, 0.15)
      group.add(flap1)

      const flap2 = new THREE.Mesh(flapGeom, pocketMat)
      flap2.position.set(0.45, 0.36, -0.15)
      group.add(flap2)

      // Buttons on pockets
      const buttonGeom = new THREE.SphereGeometry(0.012, 6, 4)
      const btn1 = new THREE.Mesh(buttonGeom, buttonMat)
      btn1.position.set(0.46, 0.36, 0.15)
      group.add(btn1)

      const btn2 = new THREE.Mesh(buttonGeom, buttonMat)
      btn2.position.set(0.46, 0.36, -0.15)
      group.add(btn2)

      // Vest collar
      const collarGeom = new THREE.TorusGeometry(0.2, 0.03, 4, 10, Math.PI)
      const collar = new THREE.Mesh(collarGeom, vestMat)
      collar.position.set(0.1, 0.6, 0.1)
      collar.rotation.x = Math.PI / 2 + 0.3
      collar.rotation.z = 0.2
      group.add(collar)

      // Pith helmet
      const helmetDomeGeom = new THREE.SphereGeometry(0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6)
      const helmetDome = new THREE.Mesh(helmetDomeGeom, helmetMat)
      helmetDome.position.set(0.12, 0.72, 0)
      group.add(helmetDome)

      // Helmet brim
      const brimGeom = new THREE.TorusGeometry(0.2, 0.04, 4, 16)
      const brim = new THREE.Mesh(brimGeom, helmetMat)
      brim.position.set(0.12, 0.68, 0)
      brim.rotation.x = Math.PI / 2
      group.add(brim)

      // Helmet band
      const helmetBandGeom = new THREE.TorusGeometry(0.17, 0.02, 4, 16)
      const helmetBand = new THREE.Mesh(helmetBandGeom, bandMat)
      helmetBand.position.set(0.12, 0.72, 0)
      helmetBand.rotation.x = Math.PI / 2
      group.add(helmetBand)

      // Helmet top button
      const topButtonGeom = new THREE.SphereGeometry(0.025, 6, 4)
      const topButton = new THREE.Mesh(topButtonGeom, bandMat)
      topButton.position.set(0.12, 0.88, 0)
      group.add(topButton)

      return group
    }
  },

  ollie_artist: {
    id: 'ollie_artist',
    name: 'Artist',
    character: CHARACTERS.OLLIE,
    type: OUTFIT_TYPES.CLOTHING_BODY,
    conflictsWith: [OUTFIT_TYPES.ACCESSORY_HEAD],
    price: 70,
    meshFactory: (gradientMap) => {
      const group = new THREE.Group()
      const smockMat = new THREE.MeshToonMaterial({ color: 0x4a4a6a, gradientMap })
      const beretMat = new THREE.MeshToonMaterial({ color: 0x8b0000, gradientMap })
      const paletteMat = new THREE.MeshToonMaterial({ color: 0xdeb887, gradientMap })

      // Paint splatter colors
      const paintColors = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff]

      // Smock body
      const smockGeom = new THREE.SphereGeometry(0.46, 10, 8)
      smockGeom.scale(1, 0.85, 1)
      const smock = new THREE.Mesh(smockGeom, smockMat)
      smock.position.set(0, 0.35, 0)
      group.add(smock)

      // Paint splatters on smock
      const splatPositions = [
        { x: 0.4, y: 0.4, z: 0.2 },
        { x: 0.42, y: 0.25, z: -0.15 },
        { x: 0.38, y: 0.45, z: -0.1 },
        { x: 0.35, y: 0.3, z: 0.25 },
        { x: 0.4, y: 0.2, z: 0.1 }
      ]
      for (let i = 0; i < splatPositions.length; i++) {
        const splatGeom = new THREE.SphereGeometry(0.03 + Math.random() * 0.02, 6, 4)
        splatGeom.scale(1, 0.3, 1)
        const splatMat = new THREE.MeshToonMaterial({ color: paintColors[i], gradientMap })
        const splat = new THREE.Mesh(splatGeom, splatMat)
        splat.position.set(splatPositions[i].x, splatPositions[i].y, splatPositions[i].z)
        splat.rotation.y = Math.random() * Math.PI
        group.add(splat)
      }

      // Smock collar/neckline
      const collarGeom = new THREE.TorusGeometry(0.22, 0.03, 4, 12)
      const collar = new THREE.Mesh(collarGeom, smockMat)
      collar.position.set(0.05, 0.6, 0)
      collar.rotation.x = Math.PI / 2
      collar.rotation.y = 0.2
      group.add(collar)

      // Beret
      const beretGeom = new THREE.SphereGeometry(0.18, 10, 8)
      beretGeom.scale(1.3, 0.5, 1.3)
      const beret = new THREE.Mesh(beretGeom, beretMat)
      beret.position.set(0.15, 0.78, 0.05)
      beret.rotation.z = -0.3
      group.add(beret)

      // Beret stem/tip
      const stemGeom = new THREE.SphereGeometry(0.03, 6, 4)
      const stem = new THREE.Mesh(stemGeom, beretMat)
      stem.position.set(0.15, 0.85, 0.05)
      group.add(stem)

      // Beret band
      const bandGeom = new THREE.TorusGeometry(0.15, 0.015, 4, 12)
      const band = new THREE.Mesh(bandGeom, beretMat)
      band.position.set(0.13, 0.72, 0)
      band.rotation.x = Math.PI / 2
      band.rotation.y = 0.3
      group.add(band)

      // Painter's palette (held by tentacle)
      const paletteShape = new THREE.Shape()
      paletteShape.moveTo(0, 0)
      paletteShape.quadraticCurveTo(0.1, 0.05, 0.12, 0)
      paletteShape.quadraticCurveTo(0.14, -0.06, 0.08, -0.1)
      paletteShape.quadraticCurveTo(0, -0.12, -0.08, -0.1)
      paletteShape.quadraticCurveTo(-0.12, -0.04, -0.1, 0.02)
      paletteShape.quadraticCurveTo(-0.06, 0.06, 0, 0)

      const paletteGeom = new THREE.ExtrudeGeometry(paletteShape, {
        steps: 1, depth: 0.015, bevelEnabled: false
      })
      const palette = new THREE.Mesh(paletteGeom, paletteMat)
      palette.position.set(0.2, 0.15, 0.35)
      palette.rotation.x = -0.5
      palette.rotation.y = 0.3
      group.add(palette)

      // Thumb hole
      const holeGeom = new THREE.TorusGeometry(0.02, 0.008, 4, 8)
      const holeMat = new THREE.MeshToonMaterial({ color: 0x000000, gradientMap })
      const hole = new THREE.Mesh(holeGeom, holeMat)
      hole.position.set(0.12, 0.15, 0.35)
      hole.rotation.x = -0.5 + Math.PI / 2
      hole.rotation.z = 0.3
      group.add(hole)

      // Paint blobs on palette
      const blobPositions = [
        { x: 0.22, y: 0.18, z: 0.32 },
        { x: 0.18, y: 0.17, z: 0.38 },
        { x: 0.25, y: 0.16, z: 0.36 },
        { x: 0.2, y: 0.19, z: 0.34 }
      ]
      for (let i = 0; i < blobPositions.length; i++) {
        const blobGeom = new THREE.SphereGeometry(0.015, 6, 4)
        blobGeom.scale(1, 0.4, 1)
        const blobMat = new THREE.MeshToonMaterial({ color: paintColors[i], gradientMap })
        const blob = new THREE.Mesh(blobGeom, blobMat)
        blob.position.set(blobPositions[i].x, blobPositions[i].y, blobPositions[i].z)
        group.add(blob)
      }

      // Paintbrush (tiny, held)
      const brushHandleGeom = new THREE.CylinderGeometry(0.008, 0.01, 0.12, 4)
      const brushHandleMat = new THREE.MeshToonMaterial({ color: 0x8b4513, gradientMap })
      const brushHandle = new THREE.Mesh(brushHandleGeom, brushHandleMat)
      brushHandle.position.set(0.15, 0.08, 0.4)
      brushHandle.rotation.z = 0.8
      brushHandle.rotation.x = 0.3
      group.add(brushHandle)

      // Brush bristles
      const bristleGeom = new THREE.ConeGeometry(0.015, 0.03, 6)
      const bristleMat = new THREE.MeshToonMaterial({ color: 0x4444ff, gradientMap })
      const bristles = new THREE.Mesh(bristleGeom, bristleMat)
      bristles.position.set(0.1, 0.12, 0.42)
      bristles.rotation.z = 0.8 + Math.PI
      bristles.rotation.x = 0.3
      group.add(bristles)

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
  },
  boot_house: {
    id: 'boot_house',
    buildingType: 'boot_house',
    name: 'Boot House',
    price: 100,
    zoneType: 'shore',
    forbiddenRadius: 1.2
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

// Get all purchasable items (outfits + buildings)
export function getAllItems() {
  return [...Object.values(OUTFITS), ...Object.values(BUILDINGS)]
}
