class Background {
  constructor () {
    this.riverColor = [42, 100, 246]
    this.riverHighlightColor = [150, 200, 236]
    this.groundColor = [104, 226, 138]
    this.groundShadowColor = [120, 177, 72]
    this.skyColor = [128, 202, 250]

    this.make()
  }

  make () {
    this.makeRiver()
    this.makeGround()
  }

  makeRiver () {
    this.river = new Square(this.riverColor)
    this.river.translate(0, -0.17)
    this.river.scale(2, 0.25)

    this.riverHighlightLeft = new Square(this.riverHighlightColor)
    this.riverHighlightCenter = new Square(this.riverHighlightColor)
    this.riverHighlightRight = new Square(this.riverHighlightColor)

    this.riverHighlightLeft.translate(-0.65, -0.18)
    this.riverHighlightLeft.scale(0.4, 0.004)
    this.riverHighlightCenter.translate(0, -0.1)
    this.riverHighlightCenter.scale(0.4, 0.004)
    this.riverHighlightRight.translate(0.65, -0.26)
    this.riverHighlightRight.scale(0.4, 0.004)
  }

  makeGround () {
    this.ground = new Square(this.groundColor)
    this.ground.scale(2, 1)
    this.ground.translate(0, -0.5)

    this.groundShadow = new Triangle(this.groundShadowColor)
    this.groundShadow.translate(0.6, -1.05)
    this.groundShadow.rotate(40)
    this.groundShadow.scale(1.6, 2)
    this.groundShadow.scale(1.3, 1.3)
  }

  draw () {
    this.ground.draw()
    this.groundShadow.draw()

    this.river.draw()
    this.riverHighlightLeft.draw()
    this.riverHighlightCenter.draw()
    this.riverHighlightRight.draw()
  }
}
