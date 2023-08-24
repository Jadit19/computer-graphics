class Car {
  constructor () {
    this.windowColor = [191, 107, 83]
    this.bodyColor = [55, 126, 222]
    this.tyreColor = [19, 51, 31]
    this.wheelColor = [128, 128, 128]

    this.make()
  }

  make () {
    this.window = new Trapezium(this.windowColor)
    this.window.translate(-0.5, -0.73)
    this.window.scale(0.3, 0.1)
    this.window.rotate(180)

    this.body = new Trapezium(this.bodyColor)
    this.body.translate(-0.5, -0.8)
    this.body.scale(0.45, 0.08)
    this.body.rotate(180)

    this.leftTyre = new Circle(this.tyreColor)
    this.leftTyre.translate(-0.6, -0.87)
    this.leftTyre.scale(0.43, 0.43)

    this.rightTyre = new Circle(this.tyreColor)
    this.rightTyre.translate(-0.4, -0.87)
    this.rightTyre.scale(0.43, 0.43)

    this.leftWheel = new Circle(this.wheelColor)
    this.leftWheel.translate(-0.6, -0.87)
    this.leftWheel.scale(0.33, 0.33)

    this.rightWheel = new Circle(this.wheelColor)
    this.rightWheel.translate(-0.4, -0.87)
    this.rightWheel.scale(0.33, 0.33)
  }

  draw () {
    this.leftTyre.draw()
    this.rightTyre.draw()
    this.leftWheel.draw()
    this.rightWheel.draw()
    this.window.draw()
    this.body.draw()
  }
}
