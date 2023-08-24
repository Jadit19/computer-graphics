class Bush {
  constructor () {
    this.leftBushColor = [80, 176, 51]
    this.centerBushColor = [67, 151, 42]
    this.rightBushColor = [42, 100, 25]
    this.isAdjusted = false

    this.make()
  }

  make () {
    this.leftBush = new Circle(this.leftBushColor)
    this.centerBush = new Circle(this.centerBushColor)
    this.rightBush = new Circle(this.rightBushColor)
  }

  scale (scale) {
    this.leftBush.scale(scale, scale)
    this.centerBush.scale(scale, scale)
    this.rightBush.scale(scale, scale)
  }

  translate (translateX, translateY) {
    this.leftBush.translate(translateX, translateY)
    this.centerBush.translate(translateX, translateY)
    this.rightBush.translate(translateX, translateY)
  }

  draw () {
    if (!this.isAdjusted) {
      this.leftBush.translate(-0.16, -0.01)
      this.leftBush.scale(0.8, 0.8)
      this.centerBush.scale(1.5, 1)
      this.rightBush.translate(0.15, -0.03)
      this.rightBush.scale(0.65, 0.55)
      this.isAdjusted = true
    }

    this.leftBush.draw()
    this.rightBush.draw()
    this.centerBush.draw()
  }
}
