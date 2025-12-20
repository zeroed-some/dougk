// Bread bits - 3D floating bread with Wind Waker styling
import * as THREE from 'three'

class BreadBit {
  constructor(scene, gradientMap, x, z) {
    this.scene = scene
    this.eaten = false
    this.fadeOut = false
    this.fadeAlpha = 1

    // Random size
    const size = 0.08 + Math.random() * 0.06

    // Bread material - warm tan
    const material = new THREE.MeshToonMaterial({
      color: 0xe8c878,
      gradientMap: gradientMap,
      transparent: true,
      opacity: 1
    })

    // Simple box geometry for bread chunk
    const geometry = new THREE.BoxGeometry(size, size * 0.6, size)

    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.set(
      x + (Math.random() - 0.5) * 0.4,
      0.05,
      z + (Math.random() - 0.5) * 0.4
    )
    this.mesh.rotation.y = Math.random() * Math.PI * 2

    // Movement
    this.bobOffset = Math.random() * Math.PI * 2
    this.driftX = (Math.random() - 0.5) * 0.02
    this.driftZ = (Math.random() - 0.5) * 0.02

    scene.add(this.mesh)
  }

  get position() {
    return this.mesh.position
  }

  update(delta, elapsed) {
    if (this.eaten) {
      this.fadeAlpha -= delta * 3
      this.mesh.material.opacity = Math.max(0, this.fadeAlpha)
      this.mesh.position.y -= delta * 0.2 // Sink slightly
      return this.fadeAlpha <= 0
    }

    // Bob on water
    this.mesh.position.y = 0.05 + Math.sin(elapsed * 2 + this.bobOffset) * 0.02

    // Gentle drift
    this.mesh.position.x += this.driftX * delta
    this.mesh.position.z += this.driftZ * delta

    // Slow rotation
    this.mesh.rotation.y += delta * 0.3

    return false
  }

  dispose() {
    this.scene.remove(this.mesh)
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
  }
}

export class BreadManager {
  constructor(scene, gradientMap) {
    this.scene = scene
    this.gradientMap = gradientMap
    this.bits = []
  }

  spawnBread(x, z, count = null) {
    const numBits = count || Math.floor(3 + Math.random() * 3)

    for (let i = 0; i < numBits; i++) {
      this.bits.push(new BreadBit(this.scene, this.gradientMap, x, z))
    }
  }

  update(delta, elapsed) {
    for (let i = this.bits.length - 1; i >= 0; i--) {
      const done = this.bits[i].update(delta, elapsed)
      if (done) {
        this.bits[i].dispose()
        this.bits.splice(i, 1)
      }
    }
  }

  getActiveBits() {
    return this.bits.filter(b => !b.eaten)
  }

  getMeshes() {
    return this.bits.map(b => b.mesh)
  }
}
