class Windmill {
  constructor () {
    this.standColor = [51, 53, 51]
    this.knobColor = [0, 0, 0]
    this.fanColor = [179, 179, 57]
    this.isAdjusted = false

    this.make()
  }

  make () {
    this.makeNonRotating()
    this.makeRotating()
  }

  makeNonRotating () {
    this.stand = new Square(this.standColor)
    this.knob = new Circle(this.knobColor)
  }

  translate (translateX, translateY) {
    this.stand.translate(translateX, translateY)
    this.knob.translate(translateX, translateY)
    this.fan1.translate(translateX, translateY)
    this.fan2.translate(translateX, translateY)
  }

  makeRotating () {
    this.fan1 = new Fan(this.fanColor)
    this.fan2 = new Fan(this.fanColor)
  }

  animate () {
    this.fan1.rotate(-0.5)
    this.fan2.rotate(-0.5)
  }

  draw () {
    if (!this.isAdjusted) {
      this.stand.scale(0.03, 0.55)
      this.knob.translate(0, 0.27)
      this.knob.scale(0.33, 0.33)
      this.fan1.translate(0, 0.27)
      this.fan1.scaleDynamically(0.55, 0.08)
      this.fan2.translate(0, 0.27)
      this.fan2.scaleDynamically(0.55, 0.08)
      this.fan2.rotate(90)
      this.isAdjusted = true
    }

    this.animate()
    this.stand.draw()
    this.fan1.draw()
    this.fan2.draw()
    this.knob.draw()
  }
}
