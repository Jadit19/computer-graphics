class Mountain {
  constructor () {
    this.light_color = [145, 121, 87]
    this.dark_color = [123, 94, 70]

    this.make()
  }

  make () {
    this.makeDark()
    this.makeLight()
  }

  makeDark () {
    this.darkTriangle = new Triangle(this.dark_color)
  }

  makeLight () {
    this.lightTriangle = new Triangle(this.light_color)
  }

  translate (translateX, translateY) {
    this.darkTriangle.translate(translateX, translateY)
    this.lightTriangle.translate(translateX, translateY)
  }

  scale (scale) {
    this.darkTriangle.scale(scale, scale)
    this.lightTriangle.scale(scale, scale)
  }

  draw () {
    this.darkTriangle.scale(0.6, 0.3)
    this.darkTriangle.translate(-0.3, -0.02)
    this.lightTriangle.scale(1, 0.3)
    this.lightTriangle.rotate(18)
    this.lightTriangle.translate(-0.022, 0.01)

    this.darkTriangle.draw()
    this.lightTriangle.draw()
  }
}
