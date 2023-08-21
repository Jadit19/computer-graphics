class Cloud {
  constructor () {
    this.color = [255, 255, 255]

    this.make()
  }

  make () {
    this.left = new Circle(this.color)
    this.center = new Circle(this.color)
    this.right = new Circle(this.color)

    this.left.translate(-0.8, 0.6)
    this.center.translate(-0.57, 0.55)
    this.right.translate(-0.35, 0.55)
    this.left.scale(2.5, 1.2)
    this.center.scale(2, 1)
    this.right.scale(1.2, 0.6)
  }

  draw () {
    this.left.draw()
    this.center.draw()
    this.right.draw()
  }
}
