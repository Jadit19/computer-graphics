class Boat {
  constructor () {
    this.sailColor = [212, 88, 37]
    this.bodyColor = [204, 205, 204]
    this.mastColor = [33, 28, 20]

    this.count = 300
    this.direction = 1

    this.make()
  }

  make () {
    this.sail = new Triangle(this.sailColor)
    this.sail.rotateDynamically(30)
    this.sail.scaleDynamically(0.25, 0.25)

    this.slantingMast = new Square(this.mastColor)
    this.slantingMast.translate(-0.11, -0.01)
    this.slantingMast.scaleDynamically(0.005, 0.27)
    this.slantingMast.rotateDynamically(-20)

    this.uprightMast = new Square(this.mastColor)
    this.uprightMast.translate(-0.065, 0)
    this.uprightMast.scaleDynamically(0.012, 0.28)

    this.body = new Trapezium(this.bodyColor)
    this.body.translate(-0.06, -0.17)
    this.body.scaleDynamically(0.3, 0.07)
  }

  animate () {
    this.count += 1
    this.sail.translate(0.001 * this.direction, 0)
    this.slantingMast.translate(0.001 * this.direction, 0)
    this.uprightMast.translate(0.001 * this.direction, 0)
    this.body.translate(0.001 * this.direction, 0)

    if (this.count === 600) {
      this.count = 0
      this.direction *= -1
    }
  }

  draw () {
    this.animate()

    this.sail.draw()
    this.slantingMast.draw()
    this.uprightMast.draw()
    this.body.draw()
  }
}
