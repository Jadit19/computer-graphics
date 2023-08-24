class House {
  constructor () {
    this.roofColor = [236, 91, 41]
    this.wallColor = [299, 299, 299]
    this.windowColor = [221, 181, 61]

    this.make()
  }

  make () {
    this.roof = new Trapezium(this.roofColor)
    this.roof.translate(-0.57, -0.33)
    this.roof.scale(0.6, 0.18)
    this.roof.rotate(180)

    this.wall = new Square(this.wallColor)
    this.wall.translate(-0.57, -0.5)
    this.wall.scale(0.52, 0.3)

    this.leftWindow = new Square(this.windowColor)
    this.leftWindow.translate(-0.72, -0.5)
    this.leftWindow.scale(0.08, 0.08)

    this.rightWindow = new Square(this.windowColor)
    this.rightWindow.translate(-0.42, -0.5)
    this.rightWindow.scale(0.08, 0.08)

    this.door = new Square(this.windowColor)
    this.door.translate(-0.57, -0.57)
    this.door.scale(0.08, 0.16)
  }

  draw () {
    this.wall.draw()
    this.door.draw()
    this.leftWindow.draw()
    this.rightWindow.draw()
    this.roof.draw()
  }
}
