// p5.js 2D renderer for dougk
import p5 from 'p5'
import { Pond } from './pond.js'
import { Duck } from './duck.js'
import { BreadManager } from './bread.js'

let sketch = null
let p5Instance = null

export function start(container) {
  if (p5Instance) return

  sketch = (p) => {
    let pond
    let doug
    let breadManager

    p.setup = () => {
      const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
      canvas.parent(container)
      canvas.mousePressed(handleClick)
      p.frameRate(60)

      pond = new Pond(p, p.width / 2, p.height / 2, 400, 280)
      doug = new Duck(p, p.width / 2, p.height / 2, pond)
      breadManager = new BreadManager(p)
    }

    p.windowResized = () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight)
      pond.x = p.width / 2
      pond.y = p.height / 2
    }

    p.draw = () => {
      // Vibrant grass background
      p.background(85, 160, 75)

      drawGrassDetails()

      pond.update()
      pond.draw()

      breadManager.update()
      breadManager.draw()

      doug.update(breadManager.bits)
      doug.draw()
    }

    function handleClick() {
      if (pond.contains(p.mouseX, p.mouseY)) {
        breadManager.spawnBread(p.mouseX, p.mouseY)
        pond.addRipple(p.mouseX, p.mouseY)
      }
    }

    function drawGrassDetails() {
      const seed = 12345
      p.randomSeed(seed)

      for (let i = 0; i < 40; i++) {
        const gx = p.random(p.width)
        const gy = p.random(p.height)

        const dx = gx - pond.x
        const dy = gy - pond.y
        if (Math.sqrt(dx * dx + dy * dy) < 250) continue

        p.stroke(25, 20, 15)
        p.strokeWeight(1)
        p.fill(65, 130, 55)
        p.ellipse(gx, gy, 18, 10)

        p.noStroke()
        p.fill(110, 180, 95)
        p.ellipse(gx - 3, gy - 2, 10, 5)
      }

      p.randomSeed(p.millis())
      p.noStroke()
    }
  }

  p5Instance = new p5(sketch)
}

export function stop() {
  if (p5Instance) {
    p5Instance.remove()
    p5Instance = null
    sketch = null
  }
}

export const name = '2D'
