// Bread module - handles bread bit spawning and behavior (p5.js version)

export class BreadBit {
  constructor(p, x, y) {
    this.p = p
    this.x = x
    this.y = y
    this.size = p.random(4, 8)
    this.eaten = false
    this.bobOffset = p.random(1000)
    this.driftX = p.random(-0.1, 0.1)
    this.driftY = p.random(-0.05, 0.05)
    this.fadeAlpha = 255
  }

  update() {
    if (this.eaten) {
      this.fadeAlpha -= 15
      return
    }
    this.x += this.driftX
    this.y += this.driftY
  }

  isDone() {
    return this.eaten && this.fadeAlpha <= 0
  }

  draw() {
    const p = this.p
    const bob = Math.sin((p.frameCount + this.bobOffset) * 0.08) * 2

    p.push()
    p.translate(this.x, this.y + bob)

    const outlineAlpha = Math.min(this.fadeAlpha, 255)

    p.stroke(25, 20, 15, outlineAlpha)
    p.strokeWeight(1.5)
    p.fill(235, 195, 130, this.fadeAlpha)
    p.ellipse(0, 0, this.size + 2, this.size * 0.75)

    p.noStroke()
    p.fill(255, 230, 180, this.fadeAlpha * 0.9)
    p.ellipse(-this.size * 0.15, -this.size * 0.15, this.size * 0.5, this.size * 0.35)

    p.pop()
  }
}

export class BreadManager {
  constructor(p) {
    this.p = p
    this.bits = []
  }

  spawnBread(x, y, count = null) {
    const p = this.p
    const numBits = count || Math.floor(p.random(3, 6))

    for (let i = 0; i < numBits; i++) {
      const offsetX = p.random(-15, 15)
      const offsetY = p.random(-15, 15)
      this.bits.push(new BreadBit(p, x + offsetX, y + offsetY))
    }
  }

  update() {
    for (let i = this.bits.length - 1; i >= 0; i--) {
      this.bits[i].update()
      if (this.bits[i].isDone()) {
        this.bits.splice(i, 1)
      }
    }
  }

  draw() {
    for (const bit of this.bits) {
      bit.draw()
    }
  }

  getActiveBits() {
    return this.bits.filter(b => !b.eaten)
  }
}
