// Duck module - Doug's behavior and rendering (p5.js version)

export class Duck {
  constructor(p, x, y, pond) {
    this.p = p
    this.x = x
    this.y = y
    this.pond = pond

    this.targetX = x
    this.targetY = y
    this.speed = 0.8
    this.idleSpeed = 0.3

    this.state = 'idle'
    this.waitTimer = 0
    this.waitDuration = 0

    this.wobble = 0
    this.headBob = 0
    this.direction = 1

    this.idleTimer = 0
    this.nextIdleMove = this.randomIdleTime()
  }

  randomIdleTime() {
    return this.p.random(120, 300)
  }

  setTarget(x, y, isFood = false) {
    if (isFood) {
      this.state = 'waiting'
      this.waitTimer = 0
      this.waitDuration = this.p.random(30, 60)
      this.pendingTargetX = x
      this.pendingTargetY = y
    } else {
      this.targetX = x
      this.targetY = y
    }
  }

  pickIdleTarget() {
    const angle = this.p.random(this.p.TWO_PI)
    const radiusX = this.p.random(0.2, 0.8) * (this.pond.width / 2)
    const radiusY = this.p.random(0.2, 0.8) * (this.pond.height / 2)
    this.targetX = this.pond.x + Math.cos(angle) * radiusX
    this.targetY = this.pond.y + Math.sin(angle) * radiusY
  }

  update(breadBits) {
    const p = this.p

    let closestBread = null
    let closestDist = Infinity
    for (const bread of breadBits) {
      if (!bread.eaten) {
        const d = p.dist(this.x, this.y, bread.x, bread.y)
        if (d < closestDist) {
          closestDist = d
          closestBread = bread
        }
      }
    }

    if (closestBread && this.state === 'idle') {
      this.setTarget(closestBread.x, closestBread.y, true)
    }

    if (this.state === 'waiting') {
      this.waitTimer++
      this.headBob = Math.sin(this.waitTimer * 0.3) * 3
      if (this.waitTimer >= this.waitDuration) {
        this.state = 'swimming'
        this.targetX = this.pendingTargetX
        this.targetY = this.pendingTargetY
      }
    }

    const dx = this.targetX - this.x
    const dy = this.targetY - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist > 3) {
      const currentSpeed = this.state === 'swimming' ? this.speed : this.idleSpeed
      const moveX = (dx / dist) * currentSpeed
      const moveY = (dy / dist) * currentSpeed
      this.x += moveX
      this.y += moveY

      if (Math.abs(dx) > 0.1) {
        this.direction = dx > 0 ? 1 : -1
      }

      this.wobble += 0.15
    } else {
      if (this.state === 'swimming') {
        this.state = 'idle'
        for (const bread of breadBits) {
          if (!bread.eaten && p.dist(this.x, this.y, bread.x, bread.y) < 20) {
            bread.eaten = true
          }
        }
      }
    }

    if (this.state === 'idle' && !closestBread) {
      this.idleTimer++
      if (this.idleTimer >= this.nextIdleMove) {
        this.pickIdleTarget()
        this.idleTimer = 0
        this.nextIdleMove = this.randomIdleTime()
      }
    }

    this.headBob = Math.sin(p.frameCount * 0.05) * 2
  }

  draw() {
    const p = this.p

    p.push()
    p.translate(this.x, this.y)
    p.scale(this.direction, 1)

    const wobbleAmount = Math.sin(this.wobble) * 3
    const outlineWeight = 2.5
    const outlineColor = p.color(25, 20, 15)

    // Water ripple
    p.noFill()
    p.stroke(255, 255, 255, 60)
    p.strokeWeight(2)
    p.ellipse(0, 12, 50, 16)

    // Shadow
    p.noStroke()
    p.fill(40, 80, 110, 80)
    p.ellipse(0, 10, 40, 12)

    // Tail
    p.stroke(outlineColor)
    p.strokeWeight(outlineWeight)
    p.fill(255, 200, 60)
    p.push()
    p.translate(-18, wobbleAmount - 2)
    p.rotate(p.radians(-20))
    p.ellipse(0, 0, 14, 8)
    p.pop()

    // Body
    p.stroke(outlineColor)
    p.strokeWeight(outlineWeight)
    p.fill(255, 220, 80)
    p.ellipse(0, wobbleAmount, 38, 30)

    // Body highlight
    p.noStroke()
    p.fill(255, 240, 140)
    p.ellipse(-5, wobbleAmount - 5, 20, 14)

    // Body shadow
    p.fill(230, 180, 50)
    p.ellipse(5, wobbleAmount + 8, 25, 10)

    // Wing
    p.stroke(outlineColor)
    p.strokeWeight(outlineWeight)
    p.fill(245, 200, 65)
    p.ellipse(3, wobbleAmount + 2, 22, 18)

    // Head
    const headY = -14 + this.headBob + wobbleAmount * 0.5
    p.stroke(outlineColor)
    p.strokeWeight(outlineWeight)
    p.fill(255, 220, 80)
    p.ellipse(14, headY, 26, 24)

    // Head highlight
    p.noStroke()
    p.fill(255, 240, 140)
    p.ellipse(10, headY - 5, 14, 10)

    // Beak
    p.stroke(outlineColor)
    p.strokeWeight(outlineWeight)
    p.fill(255, 160, 40)
    p.push()
    p.translate(26, headY + 2)
    p.beginShape()
    p.vertex(0, -5)
    p.vertex(14, 0)
    p.vertex(0, 5)
    p.endShape(p.CLOSE)
    p.pop()

    // Eye
    p.stroke(outlineColor)
    p.strokeWeight(1.5)
    p.fill(255)
    p.ellipse(20, headY - 2, 10, 10)

    // Pupil
    p.noStroke()
    p.fill(25, 20, 15)
    p.ellipse(21, headY - 1, 5, 6)

    // Eye shine
    p.fill(255)
    p.ellipse(22, headY - 3, 3, 3)

    p.pop()
  }
}
