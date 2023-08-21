class Bird {
  constructor () {
    this.color = [0, 0, 0]

    this.make()
  }

  make () {
    this.body = new Square(this.color)
    this.leftWing = new Triangle(this.color)
    this.rightWing = new Triangle(this.color)
  }

  translate (translateX, translateY) {
    this.body.translate(translateX, translateY)
    this.leftWing.translate(translateX, translateY)
    this.rightWing.translate(translateX, translateY)
  }

  scale (scale) {
    this.body.scale(scale, scale)
    this.leftWing.scale(scale, scale)
    this.rightWing.scale(scale, scale)
  }

  draw () {
    this.body.translate(0, 0.6)
    this.body.scale(0.015, 0.015)
    this.leftWing.translate(-0.03, 0.62)
    this.leftWing.rotate(-20)
    this.leftWing.scale(0.1, 0.015)
    this.rightWing.translate(0.03, 0.62)
    this.rightWing.rotate(20)
    this.rightWing.scale(0.1, 0.015)

    this.body.draw()
    this.leftWing.draw()
    this.rightWing.draw()
  }
}
