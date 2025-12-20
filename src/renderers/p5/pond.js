// Pond module - handles the water, shore, and fence rendering (p5.js version)

export class Pond {
  constructor(p, x, y, width, height) {
    this.p = p
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.ripples = []
  }

  contains(px, py) {
    const dx = (px - this.x) / (this.width / 2)
    const dy = (py - this.y) / (this.height / 2)
    return (dx * dx + dy * dy) <= 1
  }

  addRipple(x, y) {
    this.ripples.push({
      x,
      y,
      radius: 5,
      maxRadius: 40,
      alpha: 150
    })
  }

  update() {
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const ripple = this.ripples[i]
      ripple.radius += 0.8
      ripple.alpha -= 3
      if (ripple.alpha <= 0) {
        this.ripples.splice(i, 1)
      }
    }
  }

  draw() {
    const p = this.p
    const outlineColor = p.color(25, 20, 15)
    const outlineWeight = 2.5

    // Grassy shore area
    p.stroke(outlineColor)
    p.strokeWeight(outlineWeight)
    p.fill(120, 180, 90)
    p.ellipse(this.x, this.y, this.width + 70, this.height + 55)

    // Shore highlight
    p.noStroke()
    p.fill(150, 210, 110)
    p.ellipse(this.x - 30, this.y - 20, this.width * 0.4, this.height * 0.25)

    // Sandy edge
    p.stroke(outlineColor)
    p.strokeWeight(outlineWeight)
    p.fill(190, 160, 110)
    p.ellipse(this.x, this.y, this.width + 25, this.height + 18)

    // Pond water
    p.stroke(outlineColor)
    p.strokeWeight(outlineWeight)
    p.fill(70, 160, 190)
    p.ellipse(this.x, this.y, this.width, this.height)

    // Water cel-shaded bands
    p.noStroke()
    p.fill(50, 130, 160)
    p.ellipse(this.x + 20, this.y + 30, this.width * 0.7, this.height * 0.4)

    p.fill(110, 200, 220)
    p.ellipse(this.x - this.width * 0.18, this.y - this.height * 0.18, this.width * 0.45, this.height * 0.28)

    p.fill(160, 230, 245)
    p.ellipse(this.x - this.width * 0.22, this.y - this.height * 0.22, this.width * 0.2, this.height * 0.12)

    // Ripples
    p.noFill()
    for (const ripple of this.ripples) {
      p.stroke(255, 255, 255, ripple.alpha)
      p.strokeWeight(2.5)
      p.ellipse(ripple.x, ripple.y, ripple.radius * 2, ripple.radius * 1.3)
    }
    p.noStroke()

    this.drawFence()
  }

  drawFence() {
    const p = this.p
    const fenceX = this.x + this.width / 2 + 50
    const fenceStartY = this.y - 90
    const postCount = 5
    const postSpacing = 38
    const outlineColor = p.color(25, 20, 15)

    for (let i = 0; i < postCount; i++) {
      const postY = fenceStartY + i * postSpacing
      const wobble = p.sin(i * 1.5) * 5

      p.stroke(outlineColor)
      p.strokeWeight(2)
      p.fill(180, 130, 70)
      p.push()
      p.translate(fenceX + wobble, postY)
      p.rotate(p.radians(wobble * 0.6))
      p.rect(-5, -22, 10, 44, 2)

      p.noStroke()
      p.fill(210, 165, 100)
      p.rect(-3, -20, 4, 40, 1)
      p.pop()
    }

    p.stroke(outlineColor)
    p.strokeWeight(2)
    p.fill(165, 120, 65)
    p.push()
    p.translate(fenceX - 2, fenceStartY - 8)
    p.rotate(p.radians(2))
    p.rect(-6, -4, 12, 8, 2)
    for (let i = 1; i < postCount; i++) {
      p.rect(-6 + i * 2, -4 + i * postSpacing, 12, 8, 2)
    }
    p.pop()

    p.noStroke()
  }
}
